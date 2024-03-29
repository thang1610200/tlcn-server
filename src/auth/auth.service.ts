import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { PasswordResetToken, User } from '@prisma/client';
import { NewUserDto } from './dtos/new-user.dto';
import { hash, compare } from 'bcrypt';
import { UserResponse } from './dtos/new-user-response.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginSocialDto } from './dtos/login-social.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { randomBytes } from 'crypto';
import { UserResetPassword } from './events/user-reset-password.event';
import { MailingService } from 'src/mailing/mailing.service';
import { UserRegister } from './events/user-register.event';
import { VerifyResetPasswordDto } from './dtos/verify-reset-password.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { LoginAdminDto } from './dtos/login-admin-dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

const EXPIRE_TIME = 15 * 60 * 1000;
const RESET_PASS_TIME = 5 * 60;
const RESET_PASS_SUCCESS_TIME = 24 * 60;

@Injectable()
export class AuthService implements AuthServiceInterface {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly eventEmitter: EventEmitter2,
        private readonly jwtService: JwtService,
        private readonly mailingService: MailingService,
        @InjectRedis() private readonly redis: Redis,
        private readonly configService: ConfigService
    ) {}

    async updatePassword(payload: UpdatePasswordDto): Promise<UserResponse> {
        const user = await this.findbyEmail(payload.email);

        if (!user) {
            throw new UnauthorizedException();
        }

        const forgotPassword =
            await this.prismaService.passwordResetToken.findFirst({
                where: {
                    user_id: user.id,
                    token: payload.token,
                },
                include: {
                    user: true,
                },
            });

        if (
            !forgotPassword ||
            forgotPassword?.isDeleted ||
            (new Date().getTime() -
                new Date(forgotPassword.token_expiry).getTime()) /
                1000 >
                RESET_PASS_TIME
        ) {
            throw new UnauthorizedException();
        }

        if (
            await this.comparePassword(
                payload.password,
                forgotPassword.user.password,
            )
        ) {
            throw new BadRequestException('Password matches current password');
        }

        const hashedPassword = await this.hashPassword(payload.password);
        await this.prismaService.passwordResetToken.update({
            where: {
                user: {
                    email: payload.email,
                },
                token: payload.token,
            },
            data: {
                isDeleted: true,
            },
        });

        const userUpdate = await this.prismaService.user.update({
            where: {
                email: payload.email,
            },
            data: {
                password: hashedPassword,
            },
        });

        return this.buildResponse(userUpdate);
    }

    async resetPassword(dto: ResetPasswordDto): Promise<PasswordResetToken> {
        const user = await this.findbyEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException();
        }

        const userResetPass =
            await this.prismaService.passwordResetToken.findMany({
                where: {
                    user: {
                        email: dto.email,
                    },
                },
                orderBy: {
                    token_expiry: 'desc',
                },
            });

        if (
            userResetPass[0]?.isDeleted &&
            (new Date().getTime() -
                new Date(userResetPass[0]?.token_expiry).getTime()) /
                1000 <=
                RESET_PASS_SUCCESS_TIME
        ) {
            throw new ForbiddenException('Please wait 1 hour!');
        }

        if (
            userResetPass &&
            (new Date().getTime() -
                new Date(userResetPass[0]?.token_expiry).getTime()) /
                1000 <=
                RESET_PASS_TIME
        ) {
            throw new HttpException('To many request', 429);
        }

        const token = this.createUrl();

        const userToken = await this.prismaService.passwordResetToken.create({
            data: {
                token,
                user: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });
        this.eventEmitter.emit(
            'email.reset',
            new UserResetPassword(user.email, token, user.name),
        );

        return userToken;
    }

    createUrl(): string {
        const url = randomBytes(32).toString('hex');

        return url;
    }

    async loginSocial(
        dto: LoginSocialDto,
    ): Promise<{ user: UserResponse; backendTokens: object }> {
        const users = await this.findbyEmail(dto.email);

        if (users) {
            const userResponse = this.buildResponse(users);
            let refreshTokenUser = await this.storeRefreshToken(users.id, userResponse);

            return {
                user: userResponse,
                backendTokens: {
                    accessToken: await this.jwtService.signAsync(userResponse, {
                        expiresIn: '15m',
                        secret: this.configService.get('jwtSecretKey'),
                    }),
                    refreshToken: refreshTokenUser,
                    expiresIn: new Date().setTime(
                        new Date().getTime() + EXPIRE_TIME,
                    ),
                },
            };
        }

        const newUser = await this.prismaService.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                image: dto.image,
            },
        });

        const newUserResponse = this.buildResponse(newUser);

        this.eventEmitter.emit(
            'email.welcome',
            new UserRegister(newUserResponse.email, newUserResponse.name),
        );

        const refreshTokenNewUser = await this.storeRefreshToken(newUser.id, newUserResponse);

        return {
            user: newUserResponse,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(newUserResponse, {
                    expiresIn: '15m',
                    secret: this.configService.get('jwtSecretKey'),
                }),
                refreshToken: refreshTokenNewUser,
                expiresIn: new Date().setTime(
                    new Date().getTime() + EXPIRE_TIME,
                ),
            },
        };
    }

    async refreshToken(user: any): Promise<object> {
        const users = await this.findbyEmail(user.email);
        const payload = this.buildResponse(users);

        let refreshToken = await this.storeRefreshToken(users.id, payload);

        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: '15m',
                secret: this.configService.get('jwtSecretKey'),
            }),
            refreshToken,
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        };
    }

    async comparePassword(
        password: string,
        hashPass: string,
    ): Promise<boolean> {
        return await compare(password, hashPass);
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.findbyEmail(email);
        if (!user?.password) {
            throw new UnauthorizedException();
        }

        if (user && user.role !== "ADMIN" && (await this.comparePassword(password, user.password))) {
            return user;
        }

        throw new UnauthorizedException();
    }

    async login(
        dto: Readonly<LoginUserDto>,
    ): Promise<{ user: UserResponse; backendTokens: object }> {
        const user = await this.validateUser(dto.email, dto.password);
        let userResponse = this.buildResponse(user);

        let refreshToken = await this.storeRefreshToken(user.id, userResponse);

        return {
            user: userResponse,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(userResponse, {
                    expiresIn: '15m',
                    secret: this.configService.get('jwtSecretKey'),
                }),
                refreshToken: refreshToken,
                expiresIn: new Date().setTime(
                    new Date().getTime() + EXPIRE_TIME,
                ),
            },
        };
    }

    async hashPassword(password: string): Promise<string> {
        return await hash(password, 10);
    }

    async findbyEmail(email: string): Promise<User> {
        return await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });
    }

    async register(newUser: Readonly<NewUserDto>): Promise<UserResponse> {
        const existingUser = await this.findbyEmail(newUser.email);

        if (existingUser) {
            throw new ConflictException(
                'An account with that email already exists!',
            );
        }

        const hashedPassword = await this.hashPassword(newUser.password);

        const user = await this.prismaService.user.create({
            data: {
                ...newUser,
                password: hashedPassword,
            },
        });

        this.eventEmitter.emit(
            'email.welcome',
            new UserRegister(newUser.email, newUser.name),
        );

        return this.buildResponse(user);
    }

    @OnEvent('email.welcome')
    async sendEmailWelcome(data: UserRegister): Promise<void> {
        this.mailingService.sendRegisterEmail(data);
    }

    @OnEvent('email.reset')
    async sendEmailResetPassowrd(data: UserResetPassword): Promise<void> {
        this.mailingService.sendResetPasswordEmail(data);
    }

    buildResponse(user: User): UserResponse {
        return {
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
        };
    }

    async verifyTokenResetPassword(
        payload: VerifyResetPasswordDto,
    ): Promise<string> {
        const data = await this.prismaService.passwordResetToken.findFirst({
            where: {
                user: {
                    email: payload.email,
                },
                token: payload.token,
            },
        });

        if (
            !data ||
            data.isDeleted ||
            (new Date().getTime() - new Date(data.token_expiry).getTime()) /
                1000 >
                RESET_PASS_TIME
        ) {
            throw new UnauthorizedException();
        }

        return payload.email;
    }

    async validateAdmin(email: string, password: string): Promise<User>{
        const user = await this.findbyEmail(email);

        if (!user) {
            throw new UnauthorizedException();
        }

        if (user && user.role === "ADMIN" && (await this.comparePassword(password, user.password))) {
            return user;
        }

        throw new UnauthorizedException();
    }

    async loginAdmin(payload: LoginAdminDto): Promise<{ user: UserResponse; backendTokens: object }> {
        try {
            const user = await this.validateAdmin(payload.email, payload.password);

            const refreshToken = await this.storeRefreshToken(user.id, user);

            return {
                user: this.buildResponse(user),
                backendTokens: {
                    accessToken: await this.jwtService.signAsync(user, {
                        expiresIn: '15m',
                        secret: this.configService.get('jwtSecretKey'),
                    }),
                    refreshToken,
                    expiresIn: new Date().setTime(
                        new Date().getTime() + EXPIRE_TIME,
                    ),
                },
            };
        }
        catch(err: any){
            throw new InternalServerErrorException();
        }
    }

    async storeRefreshToken (id: string, user: UserResponse): Promise<string> {
        try {
            await this.redis.select(1);

            const token = await this.redis.get(id);

            if(!token){
                let refreshToken = await this.jwtService.signAsync(user, {
                    expiresIn: '7d',
                    secret: this.configService.get('jwtRefreshToken'),
                });

                await this.redis.set(id, refreshToken,'EX',7 * 24 * 60 * 60);

                return refreshToken;
            }

            return token;
        }
        catch{
            throw new InternalServerErrorException();
        }
    }
}

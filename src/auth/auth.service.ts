import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { User } from '@prisma/client';
import { NewUserDto } from './dtos/new-user.dto';
import { hash, compare } from 'bcrypt';
import { UserResponse } from './dtos/new-user-response.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginSocialDto } from './dtos/login-social.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { randomBytes } from 'crypto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserResetPassword } from './events/user-reset-password.event';
import { MailingService } from 'src/mailing/mailing.service';
import { UserRegister } from './events/user-register.event';

const EXPIRE_TIME = 24 * 60 * 60 * 1000;
const RESET_PASS_TIME = 5 * 50 * 1000;

@Injectable()
export class AuthService implements AuthServiceInterface {
    constructor (private readonly prismaService: PrismaService,
                private readonly jwtService: JwtService,
                private readonly evenEmitter: EventEmitter2,
                private readonly mailingService: MailingService) {}

    async resetPassword(dto: ResetPasswordDto): Promise<void> {
        const user = await this.findbyEmail(dto.email);

        if(!user){
            throw new UnauthorizedException();
        }

        const userResetPass = await this.prismaService.passwordResetToken.findMany({
            where: {
                user: {
                    email: dto.email
                }
            },
            orderBy: {
                token_expiry: 'desc'
            }
        })

        if (userResetPass && ((new Date().getTime() - new Date(userResetPass[0]?.token_expiry).getTime()) / 1000 <= RESET_PASS_TIME)){
            throw new HttpException("To many request",429);
        }

        const token = this.createUrl();

        await this.prismaService.passwordResetToken.create({
            data: {
                token,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        });

        await this.evenEmitter.emitAsync('user.reset-password', new UserResetPassword(user.email, token));
    }

    @OnEvent('user.reset-password')
    async sendEmailResetPassword(payload: UserResetPassword): Promise<void>{
        await this.mailingService.sendResetPasswordEmail(payload);
    }

    createUrl(): string {
        const url = randomBytes(32).toString('hex');

        return url;
    }

    async loginSocial(dto: LoginSocialDto): Promise<{ user: UserResponse; backendTokens: object; }> {
        const users = await this.findbyEmail(dto.email);
        
        if(users){
            const userResponse = this.buildResponse(users);
            return {
                user: userResponse,
                backendTokens: {
                    accessToken: await this.jwtService.signAsync(userResponse, {
                        expiresIn: "20s",
                        secret: process.env.jwtSecretKey
                    }),
                    refreshToken: await this.jwtService.signAsync(userResponse, {
                        expiresIn: "7d",
                        secret: process.env.jwtRefreshToken
                    }),
                    expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
                }
            }
        }

        const newUser = await this.prismaService.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                image: dto.image
            }
        });

        const newUserResponse = this.buildResponse(newUser);

        return {
            user: newUserResponse,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(newUserResponse, {
                    expiresIn: "20s",
                    secret: process.env.jwtSecretKey
                }),
                refreshToken: await this.jwtService.signAsync(newUserResponse, {
                    expiresIn: "7d",
                    secret: process.env.jwtRefreshToken
                }),
                expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
            }
        }
    }

    async refreshToken(user: any): Promise<object> {
        const payload = {
            email: user.email,
            name: user.name,
            image: user.image
        }

        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: "24h",
                secret: process.env.jwtSecretKey
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
                expiresIn: "30d",
                secret: process.env.jwtRefreshToken
            }),
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        };
    }

    async comparePassword(password: string, hashPass: string): Promise<boolean> {
        return await compare(password, hashPass);
    }

    async validateUser(email: string, password: string): Promise<UserResponse> {
        const user = await this.findbyEmail(email);

        if(user && await this.comparePassword(password, user.password)){
            return this.buildResponse(user);
        }

        throw new UnauthorizedException();
    }

    async login(dto: Readonly<LoginUserDto>): Promise<{ user: UserResponse; backendTokens: object; }> {
        const user = await this.validateUser(dto.email, dto.password);

        return {
            user,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(user, {
                    expiresIn: "24h",
                    secret: process.env.jwtSecretKey
                }),
                refreshToken: await this.jwtService.signAsync(user, {
                    expiresIn: "30d",
                    secret: process.env.jwtRefreshToken
                }),
                expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
            }
        }
    }

    async hashPassword(password: string): Promise<string> {
        return await hash(password,10);
    }

    async findbyEmail(email: string): Promise<User> {
        return await this.prismaService.user.findUnique({
            where: {
                email
            }
        })      
    }

    async register(newUser: Readonly<NewUserDto>): Promise<void> {
        const existingUser = await this.findbyEmail(newUser.email);

        if(existingUser){
            throw new ConflictException("An account with that email already exists!");
        }

        const hashedPassword = await this.hashPassword(newUser.password);
        const token = this.createUrl();

        const user = await this.prismaService.user.create({
            data: {
                ...newUser,
                password: hashedPassword,
                activation_code: token
            }
        })

        await this.evenEmitter.emitAsync('user.register', new UserRegister(newUser.email, token));
        //return this.buildResponse(user);
    }

    @OnEvent('user.register')
    async sendEmailRegister(payload: UserRegister): Promise<void>{
        //await this.mailingService.sendResetPasswordEmail(payload);

        
    }

    buildResponse(user: User): UserResponse{
        return {
            email: user.email,
            name: user.name,
            image: user.image
        }
    }
}

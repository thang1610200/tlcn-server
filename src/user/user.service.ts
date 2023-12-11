import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UserServiceInterface } from './interfaces/user.service.interface';
import { Profile } from './dtos/profile-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { ProfileResponse } from './dtos/profile-user-response.dto';
import { UpdateProfile } from './dtos/update-profile.dto';
import { UpdateAvatarDto } from './dtos/update-avatar.dto';
import { UploadService } from 'src/upload/upload.service';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { SetPasswordDto } from './dtos/set-password.dto';
import { compare, hash } from 'bcrypt';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Injectable()
export class UserService implements UserServiceInterface {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uploadService: UploadService,
    ) {}

    async registerInstructor(payload: Profile): Promise<ProfileResponse> {
        const user = await this.findByEmail(payload.email);

        if (!user) {
            throw new UnauthorizedException();
        }

        const userUpdate = await this.prismaService.user.update({
            where: {
                email: payload.email,
            },
            data: {
                role: 'INSTRUCTOR',
            },
        });

        return this.buildResponse(userUpdate);
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        return user;
    }

    async updateProfile(payload: UpdateProfile): Promise<ProfileResponse> {
        try {
            const user = await this.findByEmail(payload.email);

            if (!user) {
                throw new UnauthorizedException();
            }

            const userUpdate = await this.prismaService.user.update({
                where: {
                    email: payload.email,
                },
                data: {
                    name: payload.username,
                    bio: payload.bio,
                    facebook_id: payload.facebook_id,
                    youtube_id: payload.youtube_id,
                    titok_id: payload.tiktok_id,
                },
            });

            return this.buildResponse(userUpdate);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    buildResponse(data: User): ProfileResponse {
        return {
            email: data.email,
            name: data.name,
            image: data.image,
            bio: data.bio,
            role: data.role,
            facebook_id: data.facebook_id,
            youtube_id: data.youtube_id,
            tiktok_id: data.titok_id,
        };
    }

    async getProfileByEmail(payload: Profile): Promise<User> {
        try {
            const user = await this.findByEmail(payload.email);

            if (!user) {
                throw new UnauthorizedException();
            }

            return user;
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    async updateAvatar(payload: UpdateAvatarDto): Promise<ProfileResponse> {
        try {
            //Web3
            //const fileName = await this.uploadService.uploadToWeb3Storage(payload.file);

            //S3
            const fileName = await this.uploadService.uploadAvatarToS3(
                payload.file,
            );
            //update vào database;
            const user = await this.prismaService.user.update({
                where: {
                    email: payload.email,
                },
                data: {
                    image: fileName,
                },
            });

            return this.buildResponse(user);
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    async getAllUser(): Promise<User[]> {
        try {
            return await this.prismaService.user.findMany();
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    async updateRole(payload: UpdateRoleDto): Promise<string> {
        try {
            const user = await this.findByEmail(payload.email);
            return await this.prismaService.$transaction(async (tx) => {
                await tx.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        role: payload.role,
                    },
                });

                const course = await this.prismaService.course.count({
                    where: {
                        owner_id: user.id,
                    },
                });

                if (
                    user.role === 'INSTRUCTOR' &&
                    user.role !== payload.role &&
                    course > 0
                ) {
                    await tx.course.updateMany({
                        where: {
                            owner_id: user.id,
                        },
                        data: {
                            isPublished: false,
                        },
                    });
                }

                return 'SUCCESS';
            });
        } catch (err: any) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async setPassword(payload: SetPasswordDto): Promise<ProfileResponse> {
        try {
            const passwordHash = await this.hashPassword(payload.password);

            const user = await this.prismaService.user.update({
                where: {
                    email: payload.email,
                },
                data: {
                    password: passwordHash,
                },
            });

            return this.buildResponse(user);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async hashPassword(password: string): Promise<string> {
        return await hash(password, 10);
    }

    async compare(email: string, currentPassword: string): Promise<string> {
        const user = await this.findByEmail(email);

        if (await compare(currentPassword, user.password)) {
            return 'SUCCESS';
        }

        throw new NotFoundException("Current password don't match");
    }

    async updatePassword(payload: UpdatePasswordDto): Promise<ProfileResponse> {
        await this.compare(payload.email, payload.currentPassword);

        const passwordHash = await this.hashPassword(payload.password);

        const user = await this.prismaService.user.update({
            where: {
                email: payload.email,
            },
            data: {
                password: passwordHash,
            },
        });

        return this.buildResponse(user);
    }

    async deleteUser(payload: Profile): Promise<string> {
        try {
            const user = await this.findByEmail(payload.email);

            await this.prismaService.user.delete({
                where: {
                    id: user.id,
                },
            });

            return 'SUCCESS';
        } catch (err: any) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }
}

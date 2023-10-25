import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserServiceInterface } from './interfaces/user.service.interface';
import { Profile } from './dtos/profile-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { ProfileResponse } from './dtos/profile-user-response.dto';
import { UpdateProfile } from './dtos/update-profile.dto';
import { UpdateAvatarDto } from './dtos/update-avatar.dto';
import { UploadService } from 'src/upload/upload.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService implements UserServiceInterface {
    constructor (private readonly prismaService: PrismaService,
                private readonly uploadService: UploadService,
                private readonly configService: ConfigService,
                private readonly jwtService: JwtService) {}

    async registerInstructor(payload: Profile): Promise<ProfileResponse> {
        const user = await this.findByEmail(payload.email);

        if(!user){
            throw new UnauthorizedException();
        };

        const userUpdate = await this.prismaService.user.update({
            where: {
                email: payload.email
            },
            data: {
                role: 'INSTRUCTOR'
            }
        });

        return this.buildResponse(userUpdate);
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        return user;
    }

    async updateProfile(payload: UpdateProfile): Promise<ProfileResponse> {
        const user = await this.findByEmail(payload.email);

        if(!user){
            throw new UnauthorizedException();
        };

        const userUpdate = await this.prismaService.user.update({
            where: {
                email: payload.email
            },
            data: {
                name: payload.username,
                bio: payload.bio,
                facebook_id: payload.facebook_id,
                youtube_id: payload.youtube_id,
                titok_id: payload.tiktok_id
            }
        })

        return this.buildResponse(userUpdate);
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
            tiktok_id: data.titok_id
        }
    }

    async getProfileByEmail(payload: Profile): Promise<ProfileResponse> {
        const user = await this.findByEmail(payload.email);

        if(!user){
            throw new UnauthorizedException();
        }

        return this.buildResponse(user);
    }

    async updateAvatar(payload: UpdateAvatarDto): Promise<ProfileResponse> {
        //return await this.uploadService.uploadAvatarToStorage(payload);
        try {
            const fileName = await this.uploadService.uploadToWeb3Storage(payload.file);
            //update vào database;
            const user =  await this.prismaService.user.update({
                where: {
                    email: payload.email
                },
                data: {
                    image: fileName
                }
            });

            return this.buildResponse(user);
        }
        catch(err: any){
            throw new InternalServerErrorException();
        }
    }

    async verifyAccessToken(token: string): Promise<string> {
        if(!token){
            throw new UnauthorizedException();
        } 

        try {
            const payload = await this.jwtService.verifyAsync(token,{
                secret: this.configService.get('jwtSecretKey')
            });
            
            return payload.email;
        }
        catch(err){
            throw new UnauthorizedException();
        }
    }

    
}

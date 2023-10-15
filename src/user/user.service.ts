import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserServiceInterface } from './interfaces/user.service.interface';
import { Profile } from './dtos/profile-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { ProfileResponse } from './dtos/profile-user-response.dto';
import { UpdateProfile } from './dtos/update-profile.dto';

@Injectable()
export class UserService implements UserServiceInterface {
    constructor (private readonly prismaService: PrismaService) {}

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
                url: {
                    set: payload.url
                }
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
            url: data.url
        }
    }

    async getProfileByEmail(payload: Profile): Promise<ProfileResponse> {
        const user = await this.findByEmail(payload.email);

        if(!user){
            throw new UnauthorizedException();
        }

        return this.buildResponse(user);
    }
}

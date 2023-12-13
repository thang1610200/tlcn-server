import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { RegisterInstructorServiceInterface } from './interfaces/register-instructor.service.interface';
import { RegisterInstructorInterface } from './dto/register-instructor.dto';
import { PrismaService } from 'src/prisma.service';
import { RegisterInstructor, User } from '@prisma/client';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class RegisterInstructorService implements RegisterInstructorServiceInterface {
    constructor (private readonly prismaService: PrismaService,
                private readonly uploadService: UploadService){}

    async findUserByEmail(email: string): Promise<User>{
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if(!email){
            throw new UnauthorizedException();
        }

        return user;
    }

    async addRegisterInstructor(payload: RegisterInstructorInterface): Promise<string> {
        const user = await this.findUserByEmail(payload.email);

        const fileName = await this.uploadService.uploadAvatarToS3(payload.file);

        await this.prismaService.registerInstructor.create({
            data: {
                token: new Date().getTime().toString(),
                userId: user.id,
                file: fileName
            }
        });

        return "SUCCESS";
    }

    async findAll(): Promise<RegisterInstructor[]>{
        try {
            const registerInstructor = await this.prismaService.registerInstructor.findMany();

            return registerInstructor;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }
}

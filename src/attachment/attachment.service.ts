import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AttachmentServiceInterface } from './interfaces/attachment.service.interface';
import { UploadFileDto } from './dto/upload-file.dto';
import { Attachment, Lesson, User } from '@prisma/client';
import { UploadService } from 'src/upload/upload.service';
import { DeleteAttachmentDto } from './dto/delete-attachment.dto';

@Injectable()
export class AttachmentService implements AttachmentServiceInterface {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uploadService: UploadService,
    ) {}

    async findLessonByToken(token: string, id: string): Promise<Lesson> {
        const lesson = await this.prismaService.lesson.findUnique({
            where: {
                token,
                content: {
                    chapter: {
                        course: {
                            owner_id: id
                        }
                    },
                }
            },
        });

        if (!token) {
            throw new UnprocessableEntityException();
        }

        return lesson;
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }

    async uploadFile(payload: UploadFileDto): Promise<string> {
        try {
            const user = await this.findUserByEmail(payload.email);

            const lesson = await this.findLessonByToken(payload.lesson_token, user.id);

            const fileName = await this.uploadService.uploadAttachmentToS3(payload.file);

            await this.prismaService.attachment.create({
                data: {
                    name: payload.file.originalname,
                    url: fileName,
                    lessonId: lesson.id
                },
            });

            return 'SUCCESS';
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    async deleteAttachment(payload: DeleteAttachmentDto): Promise<string>{
        try {
            const user = await this.findUserByEmail(payload.email);

            const lesson = await this.findLessonByToken(payload.lesson_token, user.id);

            await this.prismaService.attachment.delete({
                where: {
                    id: payload.attachId,
                    lessonId: lesson.id
                }
            });

            return "SUCCESS";
        }
        catch(err: any){
            throw new InternalServerErrorException();
        }
    }
}

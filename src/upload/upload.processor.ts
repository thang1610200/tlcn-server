import {
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull';
import { UploadService } from './upload.service';
import { Job } from 'bull';
import { InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { QueueUploadVideo } from 'src/lesson/dto/queue-upload-video.dto';
import getVideoDurationInSeconds from 'get-video-duration';
import { TranslateSubtitleQueue } from 'src/lesson/dto/subtitle.dto';
import { ChatgptService } from 'src/chatgpt/chatgpt.service';

@Processor('upload')
export class UploadProcessor {
    constructor(
        private readonly uploadService: UploadService,
        private readonly prismaService: PrismaService,
        private readonly chatgptService: ChatgptService
    ) {}

    @Process('update-video')
    async updateVideo(job: Job<QueueUploadVideo>): Promise<any> {
        try {
            const payload: any = job.data;
            return await this.uploadService.uploadVideoToS3(
                payload.data.file,
                payload.data.fileName,
            );
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    @OnQueueCompleted({
        name: 'update-video'
    })
    async handler(job: Job<QueueUploadVideo>, result: any): Promise<void> {
        try {
            const payload: any = job.data;
            console.log(payload);
            const duration = await getVideoDurationInSeconds(payload.data.link);

            await this.prismaService.lesson.update({
                where: {
                    id: payload.data.lesson_id,
                },
                data: {
                    isCompleteVideo: true,
                    duration,
                },
            });
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    @OnQueueFailed({
        name: 'update-video'
    })
    async handlerFailed(job: Job<QueueUploadVideo>, err: Error) {
        const payload: any = job.data;

        await this.prismaService.lesson.update({
            where: {
                id: payload.data.lesson_id,
            },
            data: {
                videoUrl: '',
            },
        });
    }

    @Process('translate-subtitle')
    async translateSubtitleProcess(job: Job<TranslateSubtitleQueue>): Promise<any> {
        try {
            const payload: any = job.data;
            
            const fileUrl = await this.chatgptService.translateSubtitle(payload.data.subtitleUrl, payload.data.language);

            return await this.prismaService.subtitle.create({
                data: {
                    lessonId: payload.data.lessonId,
                    file: fileUrl,
                    language: payload.data.language,
                    language_code: payload.data.language_code
                }
            });
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }
}

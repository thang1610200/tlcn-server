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
            
            const result = await this.uploadService.moderateVideo(payload.data.file);

            if(result.Hate > 0 || result.SelfHarm > 0 || result.Sexual > 0 || result.Violence > 0) {
                return await this.prismaService.asyncVideo.update({
                    where: {
                        id: payload.data.asyncVideoId
                    },
                    data: {
                        type: 'WARNING',
                        description: `{
                            Hate: ${result.Hate};
                            SelfHarm: ${result.SelfHarm};
                            Sexual: ${result.Sexual};
                            Violence: ${result.Violence}
                        }`
                    }
                });
            }

            const videoUpload =  await this.uploadService.uploadVideoToS3(
                payload.data.file,
                payload.data.fileName,
            );

            return await this.prismaService.lesson.update({
                where: {
                    id: payload.data.lesson_id,
                },
                data: {
                    duration: payload.data.duration,
                    videoUrl: payload.data.link,
                    asyncVideo: {
                        update: {
                            type: 'COMPLETED'
                        }
                    }
                },
            });
            
        } catch (err: any) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    // @OnQueueCompleted({
    //     name: 'update-video'
    // })
    // async handler(job: Job<QueueUploadVideo>, result: any): Promise<void> {
    //     try {
    //         const payload: any = job.data;
    //         console.log(payload);
    //         const duration = await getVideoDurationInSeconds(payload.data.link);

    //         await this.prismaService.lesson.update({
    //             where: {
    //                 id: payload.data.lesson_id,
    //             },
    //             data: {
    //                 isCompleteVideo: true,
    //                 duration,
    //             },
    //         });
    //     } catch (err: any) {
    //         throw new InternalServerErrorException();
    //     }
    // }

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
                asyncVideo: {
                    update: {
                        type: 'ERROR'
                    }
                }
            },
        });
    }

    @Process('translate-subtitle')
    async translateSubtitleProcess(job: Job<TranslateSubtitleQueue>): Promise<any> {
        try {
            const payload: any = job.data;
            
            const fileUrl = await this.chatgptService.translateSubtitle(payload.data.subtitleUrl, payload.data.language_code);

            return await this.prismaService.subtitle.create({
                data: {
                    lessonId: payload.data.lessonId,
                    file: fileUrl,
                    language: payload.data.language,
                    language_code: payload.data.language_code
                }
            });
        } catch (err: any) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }
}

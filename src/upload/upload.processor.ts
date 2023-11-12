import { OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { UploadService } from "./upload.service";
import { Job } from "bull";
import { InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UploadGateway } from "./upload.gateway";
import { QueueUploadVideo } from "src/lesson/dto/queue-upload-video.dto";
import getVideoDurationInSeconds from 'get-video-duration';

@Processor('upload')
export class UploadProcessor {

    constructor (private readonly uploadService: UploadService,
                private readonly prismaService: PrismaService,
                private uploadGateway: UploadGateway) {}

    @Process('update-video')
    async updateVideo(job: Job<QueueUploadVideo>): Promise<any> { 
        try {
            const payload: any = job.data;
            return await this.uploadService.uploadVideoToS3(payload.data.file, payload.data.fileName);
        }
        catch(err: any){
            throw new InternalServerErrorException();
        }
    }

    @OnQueueCompleted()
    async handler(job: Job<QueueUploadVideo>, result: any): Promise<void> {
        try {
            const payload: any = job.data;
            const duration = await getVideoDurationInSeconds(payload.data.link);
    
            await this.prismaService.lesson.update({
                where: {
                    id: payload.data.lesson_id
                },
                data: {
                    isCompleteVideo: true,
                    duration
                }
            });
        }
        catch(err: any){
            throw new InternalServerErrorException();
        }
    }

    @OnQueueFailed()
    async handlerFailed (job: Job<QueueUploadVideo>, err: Error){
        const payload: any = job.data;

        await this.prismaService.lesson.update({
            where: {
                id: payload.data.lesson_id
            },
            data: {
                videoUrl: ""
            }
        });
    }
}
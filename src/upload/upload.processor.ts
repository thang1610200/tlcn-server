import { OnQueueCompleted, Process, Processor } from "@nestjs/bull";
import { UploadService } from "./upload.service";
import { Job } from "bull";
import { InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UploadGateway } from "./upload.gateway";
import { QueueUploadVideo } from "src/lesson/dto/queue-upload-video.dto";

@Processor('upload')
export class UploadProcessor {

    constructor (private readonly uploadService: UploadService,
                private readonly prismaService: PrismaService,
                private uploadGateway: UploadGateway) {}

    @Process('update-video')
    async updateVideo(job: Job<QueueUploadVideo>): Promise<string> { 
        try {
            const payload: any = job.data;
            await this.uploadService.uploadVideoToS3(payload.data.file, payload.data.fileName);

            return "Success";
        }
        catch(err: any){
            throw new InternalServerErrorException();
        }
    }

    @OnQueueCompleted()
    async handler(job: Job<QueueUploadVideo>, result: any): Promise<void> {
        const payload: any = job.data;

        await this.prismaService.lesson.update({
            where: {
                id: payload.data.lesson_id
            },
            data: {
                isCompleteVideo: true
            }
        })
    }
}
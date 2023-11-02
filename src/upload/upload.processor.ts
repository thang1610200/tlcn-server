import { Process, Processor } from "@nestjs/bull";
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
    async updateVideo(job: Job<QueueUploadVideo>): Promise<void> { 
        try {
            const payload: any = job.data;
            await this.uploadService.uploadVideoToS3(payload.data.file, payload.data.fileName);
        }
        catch(err: any){
            throw new InternalServerErrorException();
        }
    }
}
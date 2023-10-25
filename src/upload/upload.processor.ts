import { OnQueueCompleted, Process, Processor } from "@nestjs/bull";
import { UploadService } from "./upload.service";
import { Job } from "bull";
import { UpdateAvatarDto } from "src/user/dtos/update-avatar.dto";
import { InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { User } from "@prisma/client";
import { UploadGateway } from "./upload.gateway";

@Processor('upload')
export class UploadProcessor {

    constructor (private readonly uploadService: UploadService,
                private readonly prismaService: PrismaService,
                private uploadGateway: UploadGateway) {}

    @Process('update-avatar')
    async updateAvatar(job: Job<UpdateAvatarDto>): Promise<User> { 
        try {
            const payload: any = job.data;
            const fileName = await this.uploadService.uploadToWeb3Storage(payload.data.file);
                //update vào database;
            return await this.prismaService.user.update({
                where: {
                    email: payload.data.email,
                },
                data: {
                    image: fileName
                }
            });
        }
        catch(err: any){
            throw new InternalServerErrorException();
        }
    }

    @OnQueueCompleted()
    resultQueue (job: Job, result: any){
        const payload = {
            email: result.email,
            name: result.name,
            image: result.image
        };

        this.uploadGateway.server.to(result.email).emit('upload-avatar', payload);
    }
}
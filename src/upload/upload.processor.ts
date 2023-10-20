import { Process, Processor } from "@nestjs/bull";
import { UploadService } from "./upload.service";
import { Job } from "bull";
import { UpdateAvatarDto } from "src/user/dtos/update-avatar.dto";
import { InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Processor('upload')
export class UploadProcessor {

    constructor (private readonly uploadService: UploadService,
                private readonly prismaService: PrismaService) {}

    @Process('update-avatar')
    async updateAvatar(job: Job<UpdateAvatarDto>): Promise<void> { 
        try {
            const payload: any = job.data;
            const fileName = await this.uploadService.uploadToWeb3Storage(payload.data.file);
            //console.log(payload.data.file);
            //update vào database;
            await this.prismaService.user.update({
                where: {
                    email: payload.data.email,
                },
                data: {
                    image: fileName
                }
            });
        }
        catch(err: any){
            console.log(err);
            throw new InternalServerErrorException();
        }
    }         
}
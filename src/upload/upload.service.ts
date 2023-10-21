import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { Web3Storage, File, CIDString } from 'web3.storage';
import { UploadServiceInterface } from './interfaces/upload.service.interface';
import { UpdateAvatarDto } from 'src/user/dtos/update-avatar.dto';

@Injectable()
export class UploadService implements UploadServiceInterface {
    constructor (@InjectQueue('upload') private readonly uploadQueue: Queue,
                private readonly configService: ConfigService){}

    makeStorageClient(): Web3Storage{
        return new Web3Storage({
            token: this.configService.get('WEB3_STORAGE_API_KEY')
        });
    }

    async fileFromBuffer(file: any, fileName: string): Promise<File[]> {
        const files = [new File([Buffer.from(file.buffer).buffer], fileName)];
        return files;
    }

    async storeFiles(file: any): Promise<CIDString> {
        const client = this.makeStorageClient();
        const cid = await client.put(file);
        return cid;
    }

    async uploadToWeb3Storage(file: any): Promise<string> {
        const fileName = `${new Date().getTime()}_${file.originalname.replaceAll(
          ' ',
          '',
        )}`;
        const fileObj = await this.fileFromBuffer(file, fileName);
        const fileCid = await this.storeFiles(fileObj);
        return `https://${fileCid}.ipfs.w3s.link/${fileName}`;
    }

    async uploadAvatarToStorage(data: UpdateAvatarDto): Promise<object>{
        const job = await this.uploadQueue.add('update-avatar', {data});

        const datas = await job.finished();

        return { jobData: datas };
    }
}

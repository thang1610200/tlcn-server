import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { Web3Storage, File, CIDString } from 'web3.storage';
import { UploadServiceInterface } from './interfaces/upload.service.interface';
import { UpdateAvatarDto } from 'src/user/dtos/update-avatar.dto';
import * as sharp from 'sharp';

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
        // const files = [new File([Buffer.from(file.buffer).buffer], fileName)];
        // return files;
        const data = await sharp(file.buffer)
                                .webp({ effort: 3, quality: 50})
                                .toBuffer();

        const pixelArray = new Uint8ClampedArray(data.buffer);

        const files = [new File([pixelArray], fileName)];
        return files;
    }

    async storeFiles(file: any): Promise<CIDString> {
        const client = this.makeStorageClient();
        const cid = await client.put(file);
        return cid;
        // const onRootCidReady = cid => {
        //     console.log('uploading files with cid:', cid)
        // }
        
        // const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
        // let uploaded = 0
        
        // const onStoredChunk = size => {
        //     uploaded += size
        //     const pct = 100 * (uploaded / totalSize)
        //     console.log(`Uploading... ${pct.toFixed(2)}% complete`)
        // }
        
        // const client = this.makeStorageClient()
        
        // return client.put(files, { onRootCidReady, onStoredChunk });
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

        return { job: job.id };
    }
}

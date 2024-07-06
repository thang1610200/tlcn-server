import { InjectQueue } from '@nestjs/bull';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
//import { Web3Storage, CIDString } from 'web3.storage';
import { UploadServiceInterface } from './interfaces/upload.service.interface';
import * as sharp from 'sharp';
import { JwtService } from '@nestjs/jwt';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { QueueUploadVideo } from 'src/lesson/dto/queue-upload-video.dto';
import { TranslateSubtitleQueue } from 'src/lesson/dto/subtitle.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ModerateVideoInterface } from './dto/moderate-video.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UploadService implements UploadServiceInterface {
    private readonly s3Client = new S3Client({
        region: this.configService.get('AWS_S3_REGION'),
        credentials: {
            accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
            secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
        },
    });

    constructor(
        @InjectQueue('upload') private readonly uploadQueue: Queue,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService,
        private readonly prismaService: PrismaService
    ) {}

    async moderateVideo(video: any): Promise<ModerateVideoInterface> {
        try {
            console.log(Buffer.from(video.buffer));
            const formData = new FormData();
            const file_blob = new Blob([Buffer.from(video.buffer)], { type: video.mimetype });
            formData.append('video', file_blob, video.originalname);
            console.log(formData.get('video'));
            const { data } = await firstValueFrom(
                this.httpService
                    .post(`${this.configService.get('MODERATE_URL')}/analyze`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        timeout: 500000
                    })
            );
            console.log(data);

            const result: ModerateVideoInterface = data.results;

            return result;
        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    // makeStorageClient(): Web3Storage {
    //     return new Web3Storage({
    //         token: this.configService.get('WEB3_STORAGE_API_KEY'),
    //     });
    // }

    async fileFromBuffer(file: any): Promise<Buffer> {
        // const files = [new File([Buffer.from(file.buffer).buffer], fileName)];
        // return files;
        const data = await sharp(file.buffer)
            .webp({ effort: 3, quality: 50 })
            .toBuffer();

        //const pixelArray = new Uint8ClampedArray(data.buffer);

        //const files = [new File([pixelArray], fileName)];
        return data;
    }

    // async storeFiles(file: any): Promise<CIDString> {
    //     const client = this.makeStorageClient();
    //     const cid = await client.put(file);
    //     return cid;
    //     // const onRootCidReady = cid => {
    //     //     console.log('uploading files with cid:', cid)
    //     // }

    //     // const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
    //     // let uploaded = 0

    //     // const onStoredChunk = size => {
    //     //     uploaded += size
    //     //     const pct = 100 * (uploaded / totalSize)
    //     //     console.log(`Uploading... ${pct.toFixed(2)}% complete`)
    //     // }

    //     // const client = this.makeStorageClient()

    //     // return client.put(files, { onRootCidReady, onStoredChunk });
    // }

    // async uploadToWeb3Storage(file: any): Promise<string> {
    //     const fileName = `${new Date().getTime()}_${file.originalname.replaceAll(
    //         ' ',
    //         '',
    //     )}`;
    //     const fileObj = await this.fileFromBuffer(file);
    //     const fileCid = await this.storeFiles(fileObj);
    //     return `https://${fileCid}.ipfs.w3s.link/${fileName}`;
    // }

    async uploadAvatarToS3(file: any): Promise<string> {
        const fileName = `${new Date().getTime()}_${file.originalname.replaceAll(
            ' ',
            '',
        )}`;
        const fileObj = await this.fileFromBuffer(file);
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.get('AWS_BUCKET'),
                Key: fileName,
                Body: fileObj,
                ACL: 'public-read',
            }),
        );
        return `https://${this.configService.get(
            'AWS_BUCKET',
        )}.s3.${this.configService.get(
            'AWS_S3_REGION',
        )}.amazonaws.com/${fileName}`;
    }

    async uploadAttachmentToS3(file: any): Promise<string>{
        const fileName = `${new Date().getTime()}_${file.originalname.replaceAll(
            ' ',
            '',
        )}`;
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.get('AWS_BUCKET'),
                Key: fileName,
                Body: file.buffer,
                ACL: 'public-read',
            }),
        );
        return `https://${this.configService.get(
            'AWS_BUCKET',
        )}.s3.${this.configService.get(
            'AWS_S3_REGION',
        )}.amazonaws.com/${fileName}`;
    }

    async uploadVideoToS3(file: any, fileName: string): Promise<any> {
        return await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.get('AWS_BUCKET'),
                Key: fileName,
                Body: Buffer.from(file.buffer),
                ACL: 'public-read',
            }),
        );
    }

    createFileNameVideo(file: any): any {
        const fileName: string = `${new Date().getTime()}_${file.originalname.replaceAll(
            ' ',
            '',
        )}`;

        const link: string = `https://${this.configService.get(
            'AWS_BUCKET',
        )}.s3.${this.configService.get(
            'AWS_S3_REGION',
        )}.amazonaws.com/${fileName}`;

        return {
            fileName,
            link,
        };
    }

    async uploadVideoToStorage(data: QueueUploadVideo): Promise<object> {
        const job = await this.uploadQueue.add('update-video', { data },{
            removeOnComplete: true,
            timeout: 500000
        });

        return { job: job.id };
    }

    async verifyAccessToken(token: string): Promise<string> {
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('jwtSecretKey'),
            });

            return payload.email;
        } catch (err) {
            throw new UnauthorizedException();
        }
    }

    async translateSubtitleJob(data: TranslateSubtitleQueue): Promise<object> {
        const job = await this.uploadQueue.add('translate-subtitle', { data }, {
            timeout: 500000
        });

        return { job: job.id };
    }
}

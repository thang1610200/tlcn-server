import { QueueUploadVideo } from 'src/lesson/dto/queue-upload-video.dto';
import { CIDString, Web3Storage } from 'web3.storage';

export interface UploadServiceInterface {
    makeStorageClient(): Web3Storage;
    fileFromBuffer(file: any, fileName: string): Promise<Buffer>;
    storeFiles(file: any): Promise<CIDString>;
    uploadToWeb3Storage(file: any): Promise<string>;
    uploadVideoToStorage(data: QueueUploadVideo): Promise<object>;
    uploadAvatarToS3(file:any): Promise<string>;
    uploadVideoToS3(file:any, fileName: string): Promise<void>;
    createFileNameVideo(file: any): any;
}
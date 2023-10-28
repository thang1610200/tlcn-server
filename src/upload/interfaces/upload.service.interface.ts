import { UpdateAvatarDto } from 'src/user/dtos/update-avatar.dto';
import { CIDString, Web3Storage } from 'web3.storage';

export interface UploadServiceInterface {
    makeStorageClient(): Web3Storage;
    fileFromBuffer(file: any, fileName: string): Promise<Buffer>;
    storeFiles(file: any): Promise<CIDString>;
    uploadToWeb3Storage(file: any): Promise<string>;
    uploadAvatarToStorage(data: UpdateAvatarDto): Promise<object>;
    uploadAvatarToS3(file:any): Promise<string>;
}
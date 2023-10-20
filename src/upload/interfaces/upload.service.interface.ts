import { UpdateAvatarDto } from 'src/user/dtos/update-avatar.dto';
import { CIDString, Web3Storage } from 'web3.storage';

export interface UploadServiceInterface {
    makeStorageClient(): Web3Storage;
    fileFromBuffer(file: any, fileName: string): Promise<File[]>;
    storeFiles(file: any): Promise<CIDString>;
    uploadToWeb3Storage(file: any): Promise<string>;
    uploadAvatarToStorage(data: UpdateAvatarDto): Promise<object>;
}
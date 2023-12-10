import { Attachment, Lesson, User } from "@prisma/client";
import { UploadFileDto } from "../dto/upload-file.dto";
import { DeleteAttachmentDto } from "../dto/delete-attachment.dto";

export interface AttachmentServiceInterface {
    findLessonByToken(token: string, id: string): Promise<Lesson>;
    uploadFile(payload: UploadFileDto): Promise<string>;
    findUserByEmail(email: string): Promise<User>;
    deleteAttachment(payload: DeleteAttachmentDto): Promise<string>;
}
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDirectMessageDto {
    @IsString()
    @IsNotEmpty()
    conversationId: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class UploadFileConversationDto {
    @IsString()
    @IsNotEmpty()
    conversationId: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}

export interface UploadFileConversationInterface {
    conversationId: string;
    email: string;
    file: any;
} 

export class PaginationMessageConversationDto {
    @IsString()
    @IsNotEmpty()
    conversationId: string;

    @IsOptional()
    cursor: string;
}

export class EditMessageConversationDto {
    @IsString()
    @IsNotEmpty()
    conversationId: string;

    @IsString()
    @IsNotEmpty()
    directMessageId: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}

export class DeleteMessageConversationDto {
    @IsString()
    @IsNotEmpty()
    conversationId: string;

    @IsString()
    @IsNotEmpty()
    directMessageId: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
import { Channel, Conversation, DirectMessage, Member, Message, Server, User } from "@prisma/client";
import { DeleteMessageChannelDto, EditMessageChannelDto, PaginationMessageDto, UploadFileChannelInterface, createMessageChannelDto } from "../dto/message.dto";
import { CreateDirectMessageDto, DeleteMessageConversationDto, EditMessageConversationDto, PaginationMessageConversationDto, UploadFileConversationInterface } from "../dto/direct-message.dto";

export interface MessageServiceInterface {
    findChannelByToken(channelToken: string, serverToken: string): Promise<Channel>;
    createMessageChannel(payload: createMessageChannelDto): Promise<Message>;
    findMemberByToken(memberToken: string, serverToken: string): Promise<Member>;
    uploadFileChannel(payload: UploadFileChannelInterface): Promise<Message>;
    findUserByEmail(email: string): Promise<User>;
    findServerByToken(serverToken: string, userId: string): Promise<Server>;
    findMessage(messageId: string, channelId: string): Promise<Message>;
    editMessageChannel(payload: EditMessageChannelDto): Promise<Message>;
    paginationMessage(payload: PaginationMessageDto): Promise<{item: Message[]; nextCursor: string}>;
    deleteMessageChannel(payload: DeleteMessageChannelDto): Promise<Message>;
    checkRoleChannel(messageId: string, channelToken: string, serverToken: string, email: string): Promise<{message: Message; isMessageOwner: boolean}>;
    createDirectMessage(payload: CreateDirectMessageDto): Promise<DirectMessage>;
    uploadFileConversation(payload: UploadFileConversationInterface): Promise<DirectMessage>;
    findConversation(conversationId: string, userId: string): Promise<Conversation>;
    paginationMessageConversation(payload: PaginationMessageConversationDto): Promise<{item: DirectMessage[]; nextCursor: string}>;
    editMessageConversation(payload: EditMessageConversationDto): Promise<DirectMessage>;
    findDirectMessage(directMessageId: string, conversationId: string): Promise<DirectMessage>;
    deleteMessageConversation(payload: DeleteMessageConversationDto): Promise<DirectMessage>;
    verifyAccessToken(token: string): Promise<string>;
}
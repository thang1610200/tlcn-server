import { Channel, Member, Message, Server, User } from "@prisma/client";
import { DeleteMessageChannelDto, EditMessageChannelDto, PaginationMessageDto, UploadFileChannelInterface, createMessageChannelDto } from "../dto/message.dto";

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
    verifyAccessToken(token: string): Promise<string>;
}
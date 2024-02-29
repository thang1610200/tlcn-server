import { Channel, Member, Message, User } from "@prisma/client";
import { createMessageChannelDto } from "../dto/message.dto";

export interface MessageServiceInterface {
    findChannelByToken(channelToken: string, serverToken: string): Promise<Channel>;
    createMessageChannel(payload: createMessageChannelDto): Promise<Message>;
    findMemberByToken(memberToken: string, serverToken: string): Promise<Member>;
    findUserByEmail(email: string): Promise<User>;
    verifyAccessToken(token: string): Promise<string>;
}
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
    DeleteMessageChannelDto,
    EditMessageChannelDto,
    PaginationMessageDto,
    UploadFileChannelInterface,
    createMessageChannelDto,
} from './dto/message.dto';
import {
    Channel,
    Conversation,
    DirectMessage,
    Member,
    MemberRole,
    Message,
    Server,
    User,
} from '@prisma/client';
import { MessageServiceInterface } from './interface/message.service.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { UploadService } from 'src/upload/upload.service';
import { CreateDirectMessageDto, DeleteMessageConversationDto, EditMessageConversationDto, PaginationMessageConversationDto, UploadFileConversationInterface } from './dto/direct-message.dto';

const MESSAGES_BATCH = 10;
@Injectable()
export class MessageService implements MessageServiceInterface {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly uploadService: UploadService,
    ) {}
    async deleteMessageConversation(payload: DeleteMessageConversationDto): Promise<DirectMessage> {
        const user = await this.findUserByEmail(payload.email);
        const conversation = await this.findConversation(payload.conversationId, user.id);
        const directMessage = await this.findDirectMessage(payload.directMessageId, conversation.id);

        const member = conversation.memberOwner.userId === user.id ? conversation.memberOwner : conversation.memberGuest;

        const isMessageOwner = directMessage.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;
    
        if (!canModify) {
            throw new UnauthorizedException();
        }

        try {
            const directMessageUpdated = await this.prismaService.directMessage.update({
                where: {
                    id: directMessage.id
                },
                data: {
                    fileUrl: null,
                    content: "This message has been deleted.",
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            return directMessageUpdated;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async findDirectMessage(directMessageId: string, conversationId: string): Promise<DirectMessage> {
        try {
            const directMessage = await this.prismaService.directMessage.findFirst({
                where: {
                    id: directMessageId,
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            if(!directMessage || directMessage.deleted) {
                throw new NotFoundException();
            }

            return directMessage;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async editMessageConversation(payload: EditMessageConversationDto): Promise<DirectMessage> {
        const user = await this.findUserByEmail(payload.email);
        const conversation = await this.findConversation(payload.conversationId, user.id);
        const directMessage = await this.findDirectMessage(payload.directMessageId, conversation.id);

        const member = conversation.memberOwner.userId === user.id ? conversation.memberOwner : conversation.memberGuest;

        const isMessageOwner = directMessage.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;
    
        if (!canModify || !isMessageOwner) {
            throw new UnauthorizedException();
        }

        try {
            const directMessageUpdated = await this.prismaService.directMessage.update({
                where: {
                    id: directMessage.id
                },
                data: {
                    content: payload.content
                },
                include: {
                    member: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            return directMessageUpdated;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async paginationMessageConversation(payload: PaginationMessageConversationDto): Promise<{item: DirectMessage[]; nextCursor: string; }> {
        try {
            let messages: DirectMessage[] = [];

            if (payload.cursor) {
                messages = await this.prismaService.directMessage.findMany({
                    take: MESSAGES_BATCH,
                    skip: 1,
                    cursor: {
                        id: payload.cursor,
                    },
                    where: {
                        conversationId: payload.conversationId
                    },
                    include: {
                        member: {
                            include: {
                                user: true,
                            },
                        },
                    },
                    orderBy: {
                        createAt: 'desc',
                    },
                });
            } else {
                messages = await this.prismaService.directMessage.findMany({
                    take: MESSAGES_BATCH,
                    where: {
                        conversationId: payload.conversationId,
                    },
                    include: {
                        member: {
                            include: {
                                user: true,
                            },
                        },
                    },
                    orderBy: {
                        createAt: 'desc',
                    },
                });
            }

            let nextCursor = null;

            if (messages.length === MESSAGES_BATCH) {
                nextCursor = messages[MESSAGES_BATCH - 1].id;
            }

            return {
                item: messages,
                nextCursor,
            };
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async findConversation(conversationId: string, userId: string): Promise<{ id: string; memberOwnerId: string; memberOwner: Member; memberGuestId: string; memberGuest: Member }> {
        try {
            const conversation = await this.prismaService.conversation.findFirst({
                where: {
                    id: conversationId,
                    OR: [
                        {
                            memberOwner: {
                                userId
                            }
                        },
                        {
                            memberGuest: {
                                userId
                            }
                        }
                    ]
                },
                include: {
                    memberOwner: {
                        include: {
                            user: true
                        }
                    },
                    memberGuest: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            if(!conversation) {
                throw new NotFoundException();
            }

            return conversation;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async uploadFileConversation(payload: UploadFileConversationInterface): Promise<DirectMessage> {
        const user = await this.findUserByEmail(payload.email);
        const conversation = await this.findConversation(payload.conversationId, user.id);

        try {
            const member = conversation.memberOwner.userId === user.id ? conversation.memberOwner : conversation.memberGuest;

            const fileUrl = await this.uploadService.uploadAttachmentToS3(
                payload.file,
            );

            const message = await this.prismaService.directMessage.create({
                data: {
                    content: fileUrl,
                    fileUrl,
                    conversationId: conversation.id,
                    memberId: member.id
                },
                include: {
                    member: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            return message;
        }   
        catch {
            throw new InternalServerErrorException();
        }
    }

    async checkRoleChannel(
        messageId: string,
        channelToken: string,
        serverToken: string,
        email: string,
    ): Promise<{ message: Message; isMessageOwner: boolean }> {
        const user = await this.findUserByEmail(email);
        const server = await this.findServerByToken(serverToken, user.id);
        const channel = await this.findChannelByToken(
            channelToken,
            serverToken,
        );
        const member = server.members.find((data) => {
            return data.userId === user.id;
        });
        const message = await this.findMessage(messageId, channel.id);

        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        if (!canModify) {
            throw new UnauthorizedException();
        }

        return {
            message,
            isMessageOwner,
        };
    }

    async deleteMessageChannel(
        payload: DeleteMessageChannelDto,
    ): Promise<{
        id: string;
        content: string;
        fileUrl: string;
        member: Member & {
            user: User
        };
        memberId: string;
        channel: Channel;
        channelId: string;
        deleted: boolean;
        createAt: Date;
        updateAt: Date;
    }> {
        const { message } = await this.checkRoleChannel(
            payload.messageId,
            payload.channelToken,
            payload.serverToken,
            payload.email,
        );

        try {
            const messageDeleted = await this.prismaService.message.update({
                where: {
                    id: message.id,
                },
                data: {
                    fileUrl: null,
                    content: 'This message has been deleted.',
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            user: true,
                        },
                    },
                    channel: true
                },
            });

            return messageDeleted;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async findMessage(messageId: string, channelId: string): Promise<Message> {
        try {
            const message = await this.prismaService.message.findFirst({
                where: {
                    id: messageId,
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            if (!message || message.deleted) {
                throw new NotFoundException();
            }

            return message;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async findServerByToken(
        serverToken: string,
        userId: string,
    ): Promise<{
        id: string;
        token: string;
        name: string;
        imageUrl: string;
        members: Member[];
        inviteCode: string;
        userId: string;
        createAt: Date;
        updateAt: Date;
    }> {
        try {
            const server = await this.prismaService.server.findFirst({
                where: {
                    token: serverToken,
                    members: {
                        some: {
                            userId,
                        },
                    },
                },
                include: {
                    members: true,
                },
            });

            if (!server) {
                throw new NotFoundException();
            }

            return server;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async uploadFileChannel(payload: UploadFileChannelInterface): Promise<{
        id: string;
        content: string;
        fileUrl: string;
        memberId: string;
        member: Member;
        channelId: string;
        channel: Channel;
        deleted: boolean;
        createAt: Date;
        updateAt: Date;
    }> {
        const channel = await this.findChannelByToken(
            payload.channelToken,
            payload.serverToken,
        );
        const member = await this.findMemberByToken(
            payload.email,
            payload.serverToken,
        );

        try {
            const fileUrl = await this.uploadService.uploadAttachmentToS3(
                payload.file,
            );

            const message = await this.prismaService.message.create({
                data: {
                    content: fileUrl,
                    fileUrl,
                    channelId: channel.id,
                    memberId: member.id,
                },
                include: {
                    member: {
                        include: {
                            user: true,
                        },
                    },
                    channel: true,
                },
            });

            return message;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async createMessageChannel(payload: createMessageChannelDto): Promise<{
        id: string;
        content: string;
        fileUrl: string;
        memberId: string;
        member: Member;
        channelId: string;
        channel: Channel;
        deleted: boolean;
        createAt: Date;
        updateAt: Date;
    }> {
        const channel = await this.findChannelByToken(
            payload.channelToken,
            payload.serverToken,
        );
        const member = await this.findMemberByToken(
            payload.email,
            payload.serverToken,
        );
        try {
            const message = await this.prismaService.message.create({
                data: {
                    content: payload.content,
                    channelId: channel.id,
                    memberId: member.id,
                },
                include: {
                    member: {
                        include: {
                            user: true,
                        },
                    },
                    channel: true,
                },
            });

            return message;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async findChannelByToken(
        channelToken: string,
        serverToken: string,
    ): Promise<Channel> {
        try {
            const channel = await this.prismaService.channel.findUnique({
                where: {
                    token: channelToken,
                    server: {
                        token: serverToken,
                    },
                },
            });

            if (!channel) {
                throw new NotFoundException();
            }

            return channel;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async findMemberByToken(
        email: string,
        serverToken: string,
    ): Promise<Member> {
        const user = await this.findUserByEmail(email);

        try {
            const server = await this.prismaService.server.findFirst({
                where: {
                    token: serverToken,
                    members: {
                        some: {
                            userId: user.id,
                        },
                    },
                },
                include: {
                    members: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            if (!server) {
                throw new NotFoundException();
            }

            const member = server.members.find((member) => {
                return member.userId === user.id;
            });

            return member;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async paginationMessage(
        payload: PaginationMessageDto,
    ): Promise<{ item: Message[]; nextCursor: string }> {
        try {
            let messages: Message[] = [];

            if (payload.cursor) {
                messages = await this.prismaService.message.findMany({
                    take: MESSAGES_BATCH,
                    skip: 1,
                    cursor: {
                        id: payload.cursor,
                    },
                    where: {
                        channel: {
                            token: payload.channelToken,
                        },
                    },
                    include: {
                        member: {
                            include: {
                                user: true,
                            },
                        },
                    },
                    orderBy: {
                        createAt: 'desc',
                    },
                });
            } else {
                messages = await this.prismaService.message.findMany({
                    take: MESSAGES_BATCH,
                    where: {
                        channel: {
                            token: payload.channelToken,
                        },
                    },
                    include: {
                        member: {
                            include: {
                                user: true,
                            },
                        },
                    },
                    orderBy: {
                        createAt: 'desc',
                    },
                });
            }

            let nextCursor = null;

            if (messages.length === MESSAGES_BATCH) {
                nextCursor = messages[MESSAGES_BATCH - 1].id;
            }

            return {
                item: messages,
                nextCursor,
            };
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async editMessageChannel(payload: EditMessageChannelDto): Promise<{
        id: string;
        content: string;
        fileUrl: string;
        memberId: string;
        member: Member & {
            user: User;
        };
        channelId: string;
        channel: Channel;
        deleted: boolean;
        createAt: Date;
        updateAt: Date;
    }> {
        const { message, isMessageOwner } = await this.checkRoleChannel(
            payload.messageId,
            payload.channelToken,
            payload.serverToken,
            payload.email,
        );

        if (!isMessageOwner) {
            throw new UnauthorizedException();
        }

        try {
            const messageUpdated = await this.prismaService.message.update({
                where: {
                    id: message.id,
                },
                data: {
                    content: payload.content,
                },
                include: {
                    member: {
                        include: {
                            user: true,
                        },
                    },
                    channel: true,
                },
            });

            return messageUpdated;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async verifyAccessToken(token: string): Promise<string> {
        if (!token) {
            throw new WsException('Unauthorized');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('jwtSecretKey'),
            });

            return payload.email;
        } catch (err) {
            throw new WsException('Unauthorized');
        }
    }

    async createDirectMessage(payload: CreateDirectMessageDto): Promise<DirectMessage> {
        const user = await this.findUserByEmail(payload.email);
        const conversation = await this.findConversation(payload.conversationId, user.id);

        try {
            const member = conversation.memberOwner.userId === user.id ? conversation.memberOwner : conversation.memberGuest;

            const message = await this.prismaService.directMessage.create({
                data: {
                    content: payload.content,
                    conversationId: conversation.id,
                    memberId: member.id
                },
                include: {
                    member: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            return message;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }
}

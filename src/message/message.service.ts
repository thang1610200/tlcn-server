import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
    PaginationMessageDto,
    UploadFileChannelInterface,
    createMessageChannelDto,
} from './dto/message.dto';
import { Channel, Member, Message, User } from '@prisma/client';
import { MessageServiceInterface } from './interface/message.service.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { UploadService } from 'src/upload/upload.service';

const MESSAGES_BATCH = 10;
@Injectable()
export class MessageService implements MessageServiceInterface {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly uploadService: UploadService,
    ) {}

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

    async paginationMessage(payload: PaginationMessageDto): Promise<{item: Message[]; nextCursor: string}> {
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
                nextCursor
            }
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
}

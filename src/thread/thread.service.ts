import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ThreadServiceInterface } from './interface/thread.service.interface';
import { PrismaService } from 'src/prisma.service';
import { ServerResponse } from './dto/server-response.dto';
import { Channel, Conversation, MemberRole, Server, User } from '@prisma/client';
import { CreateServerInterface } from './dto/create-server-interface.dto';
import { UploadService } from 'src/upload/upload.service';
import * as randomstring from 'randomstring';
import { GetServerDto, LeaveServerDto } from './dto/get-server.dto';
import { GetChannelServerDto } from './dto/get-channel-server';
import { GenerateInviteCodeDto } from './dto/generate-invitecode.dto';
import { CheckInviteCodeDto } from './dto/check-invitecode.dto';
import { UpdateServerInterface } from './dto/update-server-interface.dto';
import { UpdateRoleMemberDto } from './dto/update-role.dto';
import { KickMemberDto } from './dto/kick-member.dto';
import {
    AccessChannelGeneralDto,
    ChannelResponse,
    CreateChannelDto,
    DeleteChannelDto,
    DetailChannelDto,
    EditChannelDto,
} from './dto/channel.dto';
import { CreateConversationDto } from './dto/conversation.dto';

@Injectable()
export class ThreadService implements ThreadServiceInterface {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uploadService: UploadService,
    ) {}

    async getChannelServer(payload: GetChannelServerDto): Promise<Server> {
        const server = await this.prismaService.server.findUnique({
            where: {
                token: payload.serverToken,
                members: {
                    some: {
                        user: {
                            email: payload.email,
                        },
                    },
                },
            },
            include: {
                user: true,
                channels: {
                    orderBy: {
                        createAt: 'asc',
                    },
                },
                members: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        role: 'asc',
                    },
                },
            },
        });

        if (!server) {
            throw new BadRequestException();
        }

        return server;
    }

    async findServerByName(name: string): Promise<Server> {
        const server = await this.prismaService.server.findFirst({
            where: {
                name,
            },
        });

        if (server) {
            throw new ConflictException();
        }

        return server;
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

    async isCodeExist(inviteCode: string): Promise<boolean> {
        const code = await this.prismaService.server.findUnique({
            where: {
                inviteCode,
            },
        });

        return code !== null;
    }

    async createServer(
        payload: CreateServerInterface,
    ): Promise<ServerResponse> {
        const user = await this.findUserByEmail(payload.email);

        await this.findServerByName(payload.name);

        const imgUrl = await this.uploadService.uploadAvatarToS3(payload.image);

        const inviteCode = await this.generateInviteCode();

        const createServer = await this.prismaService.server.create({
            data: {
                name: payload.name,
                imageUrl: imgUrl,
                inviteCode,
                token: new Date().getTime().toString(),
                userId: user.id,
                channels: {
                    create: [
                        {
                            token: new Date().getTime().toString(),
                            name: 'general',
                            userId: user.id,
                        },
                    ],
                },
                members: {
                    create: [
                        {
                            token: new Date().getTime().toString(),
                            userId: user.id,
                            role: MemberRole.ADMIN,
                        },
                    ],
                },
            },
        });

        return this.buildServerResponse(createServer);
    }

    async getServerUser(payload: GetServerDto): Promise<Server[]> {
        const user = await this.findUserByEmail(payload.email);

        const server = await this.prismaService.server.findMany({
            where: {
                members: {
                    some: {
                        userId: user.id,
                    },
                },
            },
        });

        return server;
    }

    async generateInviteCode(): Promise<string> {
        let inviteCode: string;

        do {
            inviteCode = randomstring.generate(8);
        } while (await this.isCodeExist(inviteCode));

        return inviteCode;
    }

    async generateNewInviteCode(
        payload: GenerateInviteCodeDto,
    ): Promise<Server> {
        const user = await this.findUserByEmail(payload.email);

        const inviteCode = await this.generateInviteCode();

        const server = await this.prismaService.server.update({
            where: {
                userId: user.id,
                token: payload.serverToken,
            },
            data: {
                inviteCode,
            },
        });

        return server;
    }

    async checkInviteCode(
        payload: CheckInviteCodeDto,
    ): Promise<ServerResponse> {
        // kiểm tra xem inviteCode đúng không
        const existingInviteCode = await this.prismaService.server.findFirst({
            where: {
                inviteCode: payload.inviteCode,
            },
        });

        if (!existingInviteCode) {
            throw new NotFoundException();
        }

        const user = await this.findUserByEmail(payload.email);

        // kiểm tra người dùng đã trong server này chưa
        const existingSever = await this.prismaService.server.findFirst({
            where: {
                inviteCode: payload.inviteCode,
                members: {
                    some: {
                        userId: user.id,
                    },
                },
            },
        });

        // nếu user chưa join server thì cập nhật vào.
        if (!existingSever) {
            await this.prismaService.server.update({
                where: {
                    inviteCode: payload.inviteCode,
                },
                data: {
                    members: {
                        create: [
                            {
                                token: new Date().getTime().toString(),
                                userId: user.id,
                            },
                        ],
                    },
                },
            });
        }

        return this.buildServerResponse(existingInviteCode);
    }

    async updateServer(
        payload: UpdateServerInterface,
    ): Promise<ServerResponse> {
        const user = await this.findUserByEmail(payload.email);

        const imgUrl = await this.uploadService.uploadAvatarToS3(payload.image);

        try {
            const server = await this.prismaService.server.update({
                where: {
                    token: payload.serverToken,
                },
                data: {
                    name: payload.name,
                    imageUrl: imgUrl,
                },
            });

            return this.buildServerResponse(server);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async checkUserServer(
        payload: GenerateInviteCodeDto,
    ): Promise<ServerResponse> {
        const server = await this.prismaService.server.findFirst({
            where: {
                token: payload.serverToken,
                members: {
                    some: {
                        user: {
                            email: payload.email,
                        },
                    },
                },
            },
        });

        if (!server) {
            throw new NotFoundException();
        }

        return server;
    }

    async updateRoleMember(payload: UpdateRoleMemberDto): Promise<Server> {
        const member = await this.findUserByEmail(payload.emailMember);
        const user = await this.findUserByEmail(payload.email);

        try {
            const server = await this.prismaService.server.findUnique({
                where: {
                    token: payload.serverToken,
                },
            });

            const serverUpdate = await this.prismaService.server.update({
                where: {
                    userId: user.id,
                    token: payload.serverToken,
                },
                data: {
                    members: {
                        update: {
                            where: {
                                serverId_userId: {
                                    userId: member.id,
                                    serverId: server.id,
                                },
                            },
                            data: {
                                role: payload.role,
                            },
                        },
                    },
                },
                include: {
                    user: true,
                    channels: {
                        orderBy: {
                            createAt: 'asc',
                        },
                    },
                    members: {
                        include: {
                            user: true,
                        },
                        orderBy: {
                            role: 'asc',
                        },
                    },
                },
            });

            return serverUpdate;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async kickMember(payload: KickMemberDto): Promise<Server> {
        const member = await this.findUserByEmail(payload.emailMember);
        const user = await this.findUserByEmail(payload.email);

        try {
            const server = await this.prismaService.server.findUnique({
                where: {
                    token: payload.serverToken,
                },
            });

            const serverUpdate = await this.prismaService.server.update({
                where: {
                    userId: user.id,
                    token: payload.serverToken,
                },
                data: {
                    members: {
                        delete: {
                            serverId_userId: {
                                serverId: server.id,
                                userId: member.id,
                            },
                        },
                    },
                },
                include: {
                    user: true,
                    channels: {
                        orderBy: {
                            createAt: 'asc',
                        },
                    },
                    members: {
                        include: {
                            user: true,
                        },
                        orderBy: {
                            role: 'asc',
                        },
                    },
                },
            });

            return serverUpdate;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async createChannel(payload: CreateChannelDto): Promise<ServerResponse> {
        if (payload.name === 'general') {
            throw new BadRequestException("Name cannot be 'general'");
        }

        const user = await this.findUserByEmail(payload.email);

        try {
            const server = await this.prismaService.server.update({
                where: {
                    token: payload.serverToken,
                    members: {
                        some: {
                            userId: user.id,
                            role: {
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                            },
                        },
                    },
                },
                data: {
                    channels: {
                        create: {
                            token: new Date().getTime().toString(),
                            userId: user.id,
                            name: payload.name,
                            type: payload.type,
                        },
                    },
                },
            });

            return this.buildServerResponse(server);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async leaveServer(payload: LeaveServerDto): Promise<ServerResponse> {
        const user = await this.findUserByEmail(payload.email);

        try {
            const server = await this.prismaService.server.update({
                where: {
                    token: payload.serverToken,
                    members: {
                        some: {
                            userId: user.id,
                        },
                    },
                },
                data: {
                    members: {
                        deleteMany: {
                            userId: user.id,
                        },
                    },
                },
            });

            return this.buildServerResponse(server);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async deleteServer(payload: LeaveServerDto): Promise<ServerResponse> {
        const user = await this.findUserByEmail(payload.email);

        try {
            const server = await this.prismaService.server.delete({
                where: {
                    token: payload.serverToken,
                    userId: user.id,
                },
            });

            return this.buildServerResponse(server);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async editChannel(payload: EditChannelDto): Promise<ServerResponse> {
        const user = await this.findUserByEmail(payload.email);

        try {
            const server = await this.prismaService.server.update({
                where: {
                    token: payload.serverToken,
                    members: {
                        some: {
                            userId: user.id,
                            role: {
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                            },
                        },
                    },
                },
                data: {
                    channels: {
                        update: {
                            where: {
                                token: payload.channelToken,
                                NOT: {
                                    name: 'general',
                                },
                            },
                            data: {
                                name: payload.name,
                                type: payload.type,
                            },
                        },
                    },
                },
            });

            return this.buildServerResponse(server);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async deleteChannel(payload: DeleteChannelDto): Promise<ServerResponse> {
        const user = await this.findUserByEmail(payload.email);

        try {
            const server = await this.prismaService.server.update({
                where: {
                    token: payload.serverToken,
                    members: {
                        some: {
                            userId: user.id,
                            role: {
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                            },
                        },
                    },
                },
                data: {
                    channels: {
                        delete: {
                            token: payload.channelToken,
                            NOT: {
                                name: 'general',
                            },
                        },
                    },
                },
            });

            return this.buildServerResponse(server);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async accessChannelGeneral(
        payload: AccessChannelGeneralDto,
    ): Promise<ChannelResponse> {
        try {
            const server = await this.prismaService.server.findUnique({
                where: {
                    token: payload.serverToken,
                    members: {
                        some: {
                            user: {
                                email: payload.email
                            }
                        },
                    },
                },
                include: {
                    channels: {
                        where: {
                            name: 'general',
                        },
                        orderBy: {
                            createAt: 'asc',
                        },
                    },
                },
            });

            const initialChannel = server?.channels[0];

            return this.buildChannelResponse(initialChannel);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async detailChannel(payload: DetailChannelDto): Promise<Channel> {
        try {
            const channel = await this.prismaService.channel.findUnique({
                where: {
                    token: payload.channelToken,
                },
            });

            return channel;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async findConversation(memberOwnerId: string, memberGuestId: string): Promise<Conversation> {
        try {
            return await this.prismaService.conversation.findFirst({
                where: {
                    AND: {
                        memberOwnerId,
                        memberGuestId
                    }
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
        }
        catch(err) {
            throw new InternalServerErrorException();
        }
    }

    async createNewConversation(memberOwnerId: string, memberGuestId: string): Promise<Conversation> {
        try {
            return await this.prismaService.conversation.create({
                data: {
                    memberOwnerId,
                    memberGuestId
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
        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async getOrCreateConversation(payload: CreateConversationDto): Promise<Conversation> {
        const memberOwner = await this.prismaService.member.findFirst({
            where: {
                server: {
                    token: payload.serverToken
                },
                user: {
                    email: payload.emailOwner
                }
            }
        });

        const memberGuest = await this.prismaService.member.findUnique({
            where: {
                token: payload.memberTokenGuest
            }
        });

        const conversation = await this.findConversation(memberOwner.id, memberGuest.id);
        if(!conversation) {
            return await this.createNewConversation(memberOwner.id, memberGuest.id);
        }

        return conversation;
    }

    buildServerResponse(payload: Server): ServerResponse {
        return {
            token: payload.token,
            name: payload.name,
            inviteCode: payload.inviteCode,
            imageUrl: payload.imageUrl,
            createAt: payload.createAt,
            updateAt: payload.updateAt,
        };
    }

    buildChannelResponse(payload: Channel): ChannelResponse {
        return {
            token: payload.token,
            name: payload.name,
            type: payload.type,
        };
    }
}

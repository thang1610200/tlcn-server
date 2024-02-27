import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ThreadServiceInterface } from './interface/thread.service.interface';
import { PrismaService } from 'src/prisma.service';
import { ServerResponse } from './dto/server-response.dto';
import { Channel, MemberRole, Server, User } from '@prisma/client';
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
import { CreateChannelDto } from './dto/channel.dto';

@Injectable()
export class ThreadService implements ThreadServiceInterface {
    constructor(private readonly prismaService: PrismaService,
                private readonly uploadService: UploadService) {}

    async getChannelServer(payload: GetChannelServerDto): Promise<Server> {
        const server = await this.prismaService.server.findUnique({
            where: {
                token: payload.serverToken,
                members: {
                    some: {
                        user: {
                            email: payload.email
                        }
                    }
                }
            },
            include: {
                user: true,
                channels: {
                    orderBy: {
                        createAt: "asc"
                    }
                },
                members: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        if(!server){
            throw new BadRequestException();
        }

        return server;
    }

    async findServerByName(name: string): Promise<Server> {
        const server = await this.prismaService.server.findFirst({
            where: {
                name
            }
        });

        if(server){
            throw new ConflictException();
        }
    
        return server;
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }

    async isCodeExist(inviteCode: string): Promise<boolean> {
        const code = await this.prismaService.server.findUnique({
            where: {
                inviteCode
            }
        });

        return code !== null;
    }

    async createServer(payload: CreateServerInterface): Promise<ServerResponse> {
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
                            name: "general",
                            userId: user.id
                        }
                    ]
                },
                members: {
                    create: [
                        {
                            userId: user.id,
                            role: MemberRole.ADMIN
                        }
                    ]
                }
            }
        });

        return this.buildServerResponse(createServer);

    }

    async getServerUser(payload: GetServerDto): Promise<Server[]> {
        const user = await this.findUserByEmail(payload.email);

        const server = await this.prismaService.server.findMany({
            where: {
                members: {
                    some: {
                        userId: user.id
                    }
                }
            }
        });

        return server;
    }

    async generateInviteCode(): Promise<string> {
        let inviteCode: string;

        do{
            inviteCode = randomstring.generate(8);
        }while(await this.isCodeExist(inviteCode));

        return inviteCode;
    }

    async generateNewInviteCode(payload: GenerateInviteCodeDto): Promise<Server> {
        const user = await this.findUserByEmail(payload.email);

        const inviteCode = await this.generateInviteCode();

        const server = await this.prismaService.server.update({
            where: {
                userId: user.id,
                token: payload.serverToken
            },
            data: {
                inviteCode
            }
        });

        return server;
    }

    async checkInviteCode(payload: CheckInviteCodeDto): Promise<ServerResponse> {
        // kiểm tra xem inviteCode đúng không
        const existingInviteCode = await this.prismaService.server.findFirst({
            where: {
                inviteCode: payload.inviteCode
            }
        });

        if(!existingInviteCode){
            throw new NotFoundException();
        }

        const user = await this.findUserByEmail(payload.email);

        // kiểm tra người dùng đã trong server này chưa
        const existingSever = await this.prismaService.server.findFirst({
            where: {
                inviteCode: payload.inviteCode,
                members: {
                    some: {
                        userId: user.id
                    }
                }
            }
        });

        // nếu user chưa join server thì cập nhật vào.
        if(!existingSever){
            await this.prismaService.server.update({
                where: {
                    inviteCode: payload.inviteCode
                },
                data: {
                    members: {
                        create: [
                            {
                                userId: user.id
                            }
                        ]
                    }
                }
            });
        }

        return this.buildServerResponse(existingInviteCode);
    }

    async updateServer(payload: UpdateServerInterface): Promise<ServerResponse> {
        const user = await this.findUserByEmail(payload.email);

        const imgUrl = await this.uploadService.uploadAvatarToS3(payload.image);

        try {
            const server = await this.prismaService.server.update({
                where: {
                    token: payload.serverToken
                },
                data: {
                    name: payload.name,
                    imageUrl: imgUrl
                }
            });

            return this.buildServerResponse(server);
        }
        catch{
            throw new InternalServerErrorException();
        }
    }

    async checkUserServer(payload: GenerateInviteCodeDto): Promise<ServerResponse> {
        const server = await this.prismaService.server.findFirst({
            where: {
                token: payload.serverToken,
                members: {
                    some: {
                        user: {
                            email: payload.email
                        }
                    }
                }
            }
        });

        if(!server) {
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
                    token: payload.serverToken
                }
            });

            const serverUpdate = await this.prismaService.server.update({
                where: {
                    userId: user.id,
                    token: payload.serverToken
                },
                data: {
                    members: {
                        update: {
                            where: {
                                serverId_userId: {
                                    userId: member.id,
                                    serverId: server.id
                                }
                            },
                            data: {
                                role: payload.role
                            }
                        }
                    }
                },
                include: {
                    user: true,
                    channels: {
                        orderBy: {
                            createAt: "asc"
                        }
                    },
                    members: {
                        include: {
                            user: true
                        },
                        orderBy: {
                            role: "asc"
                        }
                    }
                }
            });

            return serverUpdate;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async kickMember(payload: KickMemberDto): Promise<Server> {
        const member = await this.findUserByEmail(payload.emailMember);
        const user = await this.findUserByEmail(payload.email); 

        try {
            const server = await this.prismaService.server.findUnique({
                where:{
                    token: payload.serverToken
                }
            });

            const serverUpdate = await this.prismaService.server.update({
                where: {
                    userId: user.id,
                    token: payload.serverToken
                },
                data: {
                    members: {
                        delete: {
                            serverId_userId: {
                                serverId: server.id,
                                userId: member.id
                            }
                        }
                    }
                },
                include: {
                    user: true,
                    channels: {
                        orderBy: {
                            createAt: "asc"
                        }
                    },
                    members: {
                        include: {
                            user: true
                        },
                        orderBy: {
                            role: "asc"
                        }
                    }
                }
            });

            return serverUpdate;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async createChannel(payload: CreateChannelDto): Promise<ServerResponse> {
        if(payload.name === 'general') {
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
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                            }
                        }
                    }
                },
                data: {
                    channels: {
                        create: {
                            token: new Date().getTime().toString(),
                            userId: user.id,
                            name: payload.name,
                            type: payload.type
                        }
                    }
                }
            });

            return this.buildServerResponse(server);
        }
        catch{
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
                            userId: user.id
                        }
                    }
                },
                data: {
                    members: {
                        deleteMany: {
                            userId: user.id
                        }
                    }
                }
            });

            return this.buildServerResponse(server);
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async deleteServer(payload: LeaveServerDto): Promise<ServerResponse> {
        const user = await this.findUserByEmail(payload.email);

        try {
            const server = await this.prismaService.server.delete({
                where: {
                    token: payload.serverToken,
                    userId: user.id
                }
            });

            return this.buildServerResponse(server);
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    buildServerResponse(payload: Server): ServerResponse {
        return {
            token: payload.token,
            name: payload.name,
            inviteCode: payload.inviteCode,
            imageUrl: payload.imageUrl,
            createAt: payload.createAt,
            updateAt: payload.updateAt
        }
    }
}

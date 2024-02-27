import { Channel, Server, User } from "@prisma/client";
import { ServerResponse } from "../dto/server-response.dto";
import { CreateServerInterface } from "../dto/create-server-interface.dto";
import { GetServerDto, LeaveServerDto } from "../dto/get-server.dto";
import { GetChannelServerDto } from "../dto/get-channel-server";
import { GenerateInviteCodeDto } from "../dto/generate-invitecode.dto";
import { CheckInviteCodeDto } from "../dto/check-invitecode.dto";
import { UpdateServerInterface } from "../dto/update-server-interface.dto";
import { UpdateRoleMemberDto } from "../dto/update-role.dto";
import { KickMemberDto } from "../dto/kick-member.dto";
import { CreateChannelDto } from "../dto/channel.dto";

export interface ThreadServiceInterface {
    findUserByEmail(email: string): Promise<User>;
    findServerByName(name: string): Promise<Server>;
    isCodeExist(inviteCode: string): Promise<boolean>;
    createServer(payload: CreateServerInterface): Promise<ServerResponse>;
    getServerUser(payload: GetServerDto): Promise<Server[]>;
    getChannelServer(payload: GetChannelServerDto): Promise<Server>;
    generateInviteCode(): Promise<string>;
    generateNewInviteCode(payload: GenerateInviteCodeDto): Promise<Server>;
    checkInviteCode(payload: CheckInviteCodeDto): Promise<ServerResponse>;
    updateServer(payload: UpdateServerInterface): Promise<ServerResponse>;
    checkUserServer(payload: GenerateInviteCodeDto): Promise<ServerResponse>;
    updateRoleMember(payload: UpdateRoleMemberDto): Promise<Server>;
    kickMember(payload: KickMemberDto): Promise<Server>;
    createChannel(payload: CreateChannelDto): Promise<ServerResponse>;
    leaveServer(payload: LeaveServerDto): Promise<ServerResponse>;
    deleteServer(payload: LeaveServerDto): Promise<ServerResponse>;
    buildServerResponse(payload: Server): ServerResponse;
}

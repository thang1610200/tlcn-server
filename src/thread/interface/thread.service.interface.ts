import { Server, User } from "@prisma/client";
import { ServerResponse } from "../dto/server-response.dto";
import { CreateServerInterface } from "../dto/create-server-interface.dto";
import { GetServerDto } from "../dto/get-server.dto";
import { GetChannelServerDto } from "../dto/get-channel-server";
import { GenerateInviteCodeDto } from "../dto/generate-invitecode.dto";
import { CheckInviteCodeDto } from "../dto/check-invitecode.dto";
import { UpdateServerInterface } from "../dto/update-server-interface.dto";

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
    buildServerResponse(payload: Server): ServerResponse;
}

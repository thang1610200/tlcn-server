import { Body, Controller, Delete, FileTypeValidator, Get, HttpException, HttpStatus, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { CreateServerDto } from './dto/create-server.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetServerDto, LeaveServerDto } from './dto/get-server.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetChannelServerDto } from './dto/get-channel-server';
import { GenerateInviteCodeDto } from './dto/generate-invitecode.dto';
import { CheckInviteCodeDto } from './dto/check-invitecode.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { UpdateRoleMemberDto } from './dto/update-role.dto';
import { KickMemberDto } from './dto/kick-member.dto';
import { CreateChannelDto, DeleteChannelDto, EditChannelDto } from './dto/channel.dto';

@UseGuards(JwtGuard)
@Controller('thread')
export class ThreadController {
    constructor(private readonly threadService: ThreadService){}

    @UseInterceptors(FileInterceptor('file'))
    @Post('create-server')
    createServer(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({
                        fileType: '.(png|jpeg|jpg|webp)',
                    }),
                ],
                errorHttpStatusCode: HttpStatus.BAD_REQUEST,
                exceptionFactory(error) {
                    throw new HttpException(
                        error,
                        HttpStatus.UNPROCESSABLE_ENTITY,
                    );
                },
            }),
        )
        file: Express.Multer.File,
        @Body() payload: CreateServerDto) {
        const server = {
            image: file,
            name: payload.name,
            email: payload.email
        };

        return this.threadService.createServer(server);
    }

    @UseInterceptors(FileInterceptor('file'))
    @Patch('update-server')
    updateServer(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({
                        fileType: '.(png|jpeg|jpg|webp)',
                    }),
                ],
                errorHttpStatusCode: HttpStatus.BAD_REQUEST,
                exceptionFactory(error) {
                    throw new HttpException(
                        error,
                        HttpStatus.UNPROCESSABLE_ENTITY,
                    );
                },
            }),
        )
        file: Express.Multer.File,
        @Body() payload: UpdateServerDto) {
        const server = {
            image: file,
            name: payload.name,
            email: payload.email,
            serverToken: payload.serverToken
        };

        return this.threadService.updateServer(server);
    }

    @Get('get-server')
    getServer(@Query() query: GetServerDto){
        return this.threadService.getServerUser(query);
    }

    @Get('detail-server')
    detailServer(@Query() query: GetChannelServerDto){
        return this.threadService.getChannelServer(query);
    }

    @Get('check-user')
    checkUserServer(@Query() query: GenerateInviteCodeDto){
        return this.threadService.checkUserServer(query);
    }

    @Patch('generate-invite')
    generateNewInviteCode(@Body() body: GenerateInviteCodeDto){
        return this.threadService.generateNewInviteCode(body);
    }

    @Patch('join-server')
    joinServer(@Body() body: CheckInviteCodeDto){
        return this.threadService.checkInviteCode(body);
    }

    @Patch('update-role')
    updateRoleMember(@Body() body: UpdateRoleMemberDto){
        return this.threadService.updateRoleMember(body);
    }

    @Delete('kick-member')
    kickMember(@Query() query: KickMemberDto){
        return this.threadService.kickMember(query);
    }

    @Post('create-channel')
    createChannel(@Body() body: CreateChannelDto){
        return this.threadService.createChannel(body);
    }

    @Patch('leave-server')
    leaveServer(@Body() body: LeaveServerDto){
        return this.threadService.leaveServer(body);
    }

    @Delete('delete-server')
    deleteServer(@Query() query: LeaveServerDto) {
        return this.threadService.deleteServer(query);
    }

    @Patch('edit-channel')
    editChannel(@Body() body: EditChannelDto) {
        return this.threadService.editChannel(body);
    }

    @Delete('delete-channel')
    deleteChannel(@Query() query: DeleteChannelDto) {
        return this.threadService.deleteChannel(query);
    }
}

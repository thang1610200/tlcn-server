import { Body, Controller, FileTypeValidator, Get, HttpException, HttpStatus, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { CreateServerDto } from './dto/create-server.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetServerDto } from './dto/get-server.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetChannelServerDto } from './dto/get-channel-server';
import { GenerateInviteCodeDto } from './dto/generate-invitecode.dto';
import { CheckInviteCodeDto } from './dto/check-invitecode.dto';
import { UpdateServerDto } from './dto/update-server.dto';

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

    @Patch('generate-invite')
    generateNewInviteCode(@Body() body: GenerateInviteCodeDto){
        return this.threadService.generateNewInviteCode(body);
    }

    @Post('join-server')
    joinServer(@Body() body: CheckInviteCodeDto){
        return this.threadService.checkInviteCode(body);
    }
}

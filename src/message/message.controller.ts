import { Body, Controller, FileTypeValidator, Get, HttpException, HttpStatus, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { PaginationMessageDto, UploadFileChannelDto, createMessageChannelDto } from './dto/message.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('message')
export class MessageController {
    constructor (private readonly messageGateWay: MessageGateway,
                private messageService: MessageService) {}

    @Post('create-message')
    async createMessageChannel(@Body() body: createMessageChannelDto) {
        const message = await this.messageService.createMessageChannel(body);

        const channelKey = `chat:${message.channel.token}:messages`;

        this.messageGateWay.server.emit(channelKey,message);

        return message;
    }

    @UseInterceptors(FileInterceptor('file'))
    @Post('upload-file-message')
    async uploadFileMessageChannel(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({
                        fileType: '.',
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
        @Body() payload: UploadFileChannelDto) {
        const messagePayload = {
            channelToken: payload.channelToken,
            serverToken: payload.serverToken,
            email: payload.email,
            file
        };

        const message = await this.messageService.uploadFileChannel(messagePayload);

        const channelKey = `chat:${message.channel.token}:messages`;

        this.messageGateWay.server.emit(channelKey,message);

        return message;
    }

    @Get('pagination-message')
    paginationMessage(@Query() query: PaginationMessageDto) {
        return this.messageService.paginationMessage(query);
    }
}

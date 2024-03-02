import { Body, Controller, Delete, FileTypeValidator, Get, HttpException, HttpStatus, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { DeleteMessageChannelDto, EditMessageChannelDto, PaginationMessageDto, UploadFileChannelDto, createMessageChannelDto } from './dto/message.dto';
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

    @Patch('edit-message')
    async editMessageChannel(@Body() body: EditMessageChannelDto) {
        const message = await this.messageService.editMessageChannel(body);

        const updateKey = `chat:${message.channel.token}:messages:update`;

        this.messageGateWay.server.emit(updateKey, message);

        return message;
    }

    @Delete('delete-message')
    async deleteMessageChannel(@Query() query: DeleteMessageChannelDto) {
        const message = await this.messageService.deleteMessageChannel(query);

        const updateKey = `chat:${message.channel.token}:messages:update`;

        this.messageGateWay.server.emit(updateKey, message);

        return message;
    }
}

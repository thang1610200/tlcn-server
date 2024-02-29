import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { createMessageChannelDto } from './dto/message.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

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
}

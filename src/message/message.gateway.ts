import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageService } from './message.service';
import { createMessageChannelDto } from './dto/message.dto';

@WebSocketGateway({
    namespace: 'messages',
})
export class MessageGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Namespace;

    private readonly logger = new Logger(MessageGateway.name);
    constructor(private readonly messageService: MessageService) {}

    afterInit(socket: Socket): any {}

    async handleConnection(client: Socket) {
        const authHeader = client.handshake.auth?.token;
        if (authHeader && (authHeader as string).split(' ')[1]) {
            try {
                client.data.email = await this.messageService.verifyAccessToken(
                    (authHeader as string).split(' ')[1],
                );

                client.join(client.data.email);
            } catch (e) {
                client.disconnect();
            }
        } else {
            client.disconnect();
        }
    }

    handleDisconnect(socket: Socket): any {
        this.logger.log(`Disconnect ${socket.id}`);
    }

    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory(errors) {
            throw new WsException('BadGateWay Exception');
        },
    }))
    @SubscribeMessage('create-message')
    async createMessageChannel(@MessageBody() body: createMessageChannelDto): Promise<void> {
        console.log(body);
        //await this.messageService.
    }
}

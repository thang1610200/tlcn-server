import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UploadService } from './upload.service';

@WebSocketGateway({
    namespace: 'uploads',
})
export class UploadGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Namespace;

    private readonly logger = new Logger(UploadGateway.name);
    constructor(private readonly uploadService: UploadService) {}

    afterInit(socket: Socket): any {}

    async handleConnection(client: Socket) {
        const authHeader = client.handshake.headers.authorization;
        console.log(authHeader);
        if (authHeader && (authHeader as string).split(' ')[1]) {
            try {
                client.data.email = await this.uploadService.verifyAccessToken(
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
}

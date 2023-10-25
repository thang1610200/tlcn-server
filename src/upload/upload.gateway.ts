import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Server, Socket } from "socket.io";
import { UserService } from "../user/user.service";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
    namespace: "uploads"
})
export class UploadGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Namespace;

    private readonly logger = new Logger(UploadGateway.name);
    constructor(private readonly userService: UserService){}

    afterInit(socket: Socket): any {}

    async handleConnection(client: Socket) {
        const authHeader = client.handshake.headers.authorization;
        if(authHeader && (authHeader as string).split(' ')[1]){
            try {
                client.data.email = await this.userService.verifyAccessToken((authHeader as string).split(' ')[1]);
                client.join(client.data.email);
            }
            catch(e){
                client.disconnect();
            }
        }
        else{
            client.disconnect();
        }
    }

    handleDisconnect(socket: Socket): any {
        this.logger.log(`Disconnect ${socket.id}`)
    }
}


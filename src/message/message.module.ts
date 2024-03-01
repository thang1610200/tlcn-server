import { Global, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessageGateway } from './message.gateway';
import { UploadService } from 'src/upload/upload.service';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'upload',
        }),
    ],
    providers: [
        MessageService,
        PrismaService,
        JwtService,
        ConfigService,
        MessageGateway,
        UploadService,
    ],
    controllers: [MessageController],
})
export class MessageModule {}

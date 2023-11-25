import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { UploadService } from 'src/upload/upload.service';
import { JwtService } from '@nestjs/jwt';
import { UploadGateway } from 'src/upload/upload.gateway';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'upload',
        }),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        PrismaService,
        ConfigService,
        UploadService,
        JwtService,
        UploadGateway,
    ],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { UserAdminController, UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { UploadService } from 'src/upload/upload.service';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
//import { UploadGateway } from 'src/upload/upload.gateway';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'upload',
        }),
        HttpModule
    ],
    controllers: [UserController, UserAdminController],
    providers: [
        UserService,
        PrismaService,
        ConfigService,
        UploadService,
        JwtService,
       // UploadGateway,
    ],
})
export class UserModule {}

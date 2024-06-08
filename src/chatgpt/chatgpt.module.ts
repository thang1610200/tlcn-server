import { Module } from '@nestjs/common';
import { ChatgptController } from './chatgpt.controller';
import { ChatgptService } from './chatgpt.service';
import { PrismaService } from 'src/prisma.service';
import { QuizzService } from 'src/quizz/quizz.service';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from 'src/upload/upload.service';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'upload',
        }),
        HttpModule
    ],
    controllers: [ChatgptController],
    providers: [ChatgptService, PrismaService, QuizzService, JwtService, UploadService],
})
export class ChatgptModule {}

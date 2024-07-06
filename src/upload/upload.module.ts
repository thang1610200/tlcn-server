import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { UploadProcessor } from './upload.processor';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ChatgptService } from 'src/chatgpt/chatgpt.service';
import { QuizzService } from 'src/quizz/quizz.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'upload',
        }),
       HttpModule 
    ],
    providers: [
        UploadService,
        ConfigService,
        UploadProcessor,
        PrismaService,
        JwtService,
        ChatgptService,
        QuizzService
    ],
    controllers: [],
})
export class UploadModule {}

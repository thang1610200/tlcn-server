import { Module } from '@nestjs/common';
import { ChatgptController } from './chatgpt.controller';
import { ChatgptService } from './chatgpt.service';
import { PrismaService } from 'src/prisma.service';
import { QuizzService } from 'src/quizz/quizz.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [ChatgptController],
    providers: [ChatgptService, PrismaService, QuizzService, JwtService],
})
export class ChatgptModule {}

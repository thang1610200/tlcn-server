import { Module } from '@nestjs/common';
import { QuizzController } from './quizz.controller';
import { QuizzService } from './quizz.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [QuizzController],
  providers: [QuizzService, PrismaService, JwtService]
})
export class QuizzModule {}

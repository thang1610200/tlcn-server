import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { QuizzService } from 'src/quizz/quizz.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CodeService, QuizzService, PrismaService, JwtService],
  controllers: [CodeController]
})
export class CodeModule {}

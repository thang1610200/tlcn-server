import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController, CodeControllerUser } from './code.controller';
import { QuizzService } from 'src/quizz/quizz.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EvaluateService } from 'src/evaluate/evaluate.service';

@Module({
  providers: [CodeService, QuizzService, PrismaService, JwtService, EvaluateService],
  controllers: [CodeController, CodeControllerUser]
})
export class CodeModule {}

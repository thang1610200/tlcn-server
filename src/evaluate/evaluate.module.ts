import { Module } from '@nestjs/common';
import { EvaluateController, EvaluatesController } from './evaluate.controller';
import { EvaluateService } from './evaluate.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { QuizzService } from 'src/quizz/quizz.service';

@Module({
  providers: [JwtService, EvaluateService, PrismaService, QuizzService],
  controllers: [EvaluateController, EvaluatesController]
})
export class EvaluateModule {}

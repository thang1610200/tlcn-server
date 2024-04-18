import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { QuizzService } from 'src/quizz/quizz.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CodeService, QuizzService, PrismaService, JwtService],
  controllers: [CodeController]
})
export class CodeModule {}

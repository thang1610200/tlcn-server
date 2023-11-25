import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [ChapterController],
    providers: [ChapterService, PrismaService, JwtService],
})
export class ChapterModule {}

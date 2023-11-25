import { Module } from '@nestjs/common';
import { LessonController, LessonControllerUser } from './lesson.controller';
import { LessonService } from './lesson.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from 'src/upload/upload.service';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'upload',
        }),
    ],
    controllers: [LessonController, LessonControllerUser],
    providers: [LessonService, PrismaService, JwtService, UploadService],
})
export class LessonModule {}

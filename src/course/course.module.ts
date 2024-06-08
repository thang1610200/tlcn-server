import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { PrismaService } from 'src/prisma.service';
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
    controllers: [CourseController],
    providers: [CourseService, PrismaService, JwtService, UploadService],
})
export class CourseModule {}

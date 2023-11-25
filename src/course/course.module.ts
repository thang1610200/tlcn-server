import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
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
    controllers: [CourseController],
    providers: [CourseService, PrismaService, JwtService, UploadService],
})
export class CourseModule {}

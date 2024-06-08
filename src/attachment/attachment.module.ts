import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
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
  controllers: [AttachmentController],
  providers: [AttachmentService, PrismaService, JwtService, UploadService]
})
export class AttachmentModule {}

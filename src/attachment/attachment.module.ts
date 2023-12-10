import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
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
  controllers: [AttachmentController],
  providers: [AttachmentService, PrismaService, JwtService, UploadService]
})
export class AttachmentModule {}

import { Module } from '@nestjs/common';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { BullModule } from '@nestjs/bull';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'upload',
    }),
  ],
  controllers: [ThreadController],
  providers: [ThreadService, PrismaService, UploadService, JwtService]
})
export class ThreadModule {}

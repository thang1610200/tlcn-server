import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { UploadProcessor } from './upload.processor';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UploadGateway } from './upload.gateway';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'upload'
    })
  ],
  providers: [UploadService, ConfigService, UploadProcessor, PrismaService, JwtService, UploadGateway],
  controllers: []
})
export class UploadModule {}

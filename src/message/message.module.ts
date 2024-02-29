import { Global, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessageGateway } from './message.gateway';

@Module({
  providers: [MessageService, PrismaService, JwtService, ConfigService, MessageGateway],
  controllers: [MessageController]
})
export class MessageModule {}

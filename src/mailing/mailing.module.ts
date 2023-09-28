import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './mailing.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: "emailSending"
  })],
  providers: [MailingService, ConfigService, EmailProcessor],
  controllers: [MailingController]
})
export class MailingModule {}

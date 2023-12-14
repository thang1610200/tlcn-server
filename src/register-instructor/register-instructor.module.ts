import { Module } from '@nestjs/common';
import { RegisterInstructorAdminController, RegisterInstructorController } from './register-instructor.controller';
import { RegisterInstructorService } from './register-instructor.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from 'src/upload/upload.service';
import { BullModule } from '@nestjs/bull';
import { MailingService } from 'src/mailing/mailing.service';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'upload',
        }),
        BullModule.registerQueue({
            name: 'emailSending',
        })
    ],
    controllers: [RegisterInstructorController, RegisterInstructorAdminController],
    providers: [
        RegisterInstructorService,
        PrismaService,
        JwtService,
        UploadService,
        MailingService
    ],
})
export class RegisterInstructorModule {}

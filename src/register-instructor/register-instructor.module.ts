import { Module } from '@nestjs/common';
import { RegisterInstructorAdminController, RegisterInstructorController } from './register-instructor.controller';
import { RegisterInstructorService } from './register-instructor.service';
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
    controllers: [RegisterInstructorController, RegisterInstructorAdminController],
    providers: [
        RegisterInstructorService,
        PrismaService,
        JwtService,
        UploadService,
    ],
})
export class RegisterInstructorModule {}

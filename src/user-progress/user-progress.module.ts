import { Module } from '@nestjs/common';
import { UserProgressController } from './user-progress.controller';
import { UserProgressService } from './user-progress.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [UserProgressController],
    providers: [UserProgressService, PrismaService, JwtService],
})
export class UserProgressModule {}

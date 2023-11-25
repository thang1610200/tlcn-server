import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [ExerciseController],
    providers: [ExerciseService, PrismaService, JwtService],
})
export class ExerciseModule {}

import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, JwtService]
})
export class ReviewModule {}

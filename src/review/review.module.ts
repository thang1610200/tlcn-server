import { Module } from '@nestjs/common';
import { ReplyController, ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ReviewController, ReplyController],
  providers: [ReviewService, PrismaService, JwtService]
})
export class ReviewModule {}

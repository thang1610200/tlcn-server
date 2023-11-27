import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/course/decorators/roles.decorator';
import { RolesGuard } from 'src/course/guards/role.guard';
import { AddReviewDto } from './dto/add-review.dto';
import { ReviewService } from './review.service';
import { AllReviewCourseDto } from './dto/all-review-course.dto';
import { AddReplyDto } from './dto/add-reply.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { DeleteReplyDto } from './dto/delete-reply.dto';

@Roles('LEARNER')
@UseGuards(JwtGuard, RolesGuard)
@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService){}

    @Post('add-review')
    addReview(@Body() payload: AddReviewDto){
        return this.reviewService.addReview(payload);
    }

    @Get('all-review')
    allReviewCourse(@Query() payload: AllReviewCourseDto){
        return this.reviewService.allReviewCourse(payload);
    }

    @Delete('delete-review')
    deleteReview(@Query() payload: DeleteReviewDto){
        return this.reviewService.deleteReview(payload);
    }
}

@Roles('INSTRUCTOR')
@UseGuards(JwtGuard, RolesGuard)
@Controller('review')
export class ReplyController {
    constructor(private readonly reviewService: ReviewService){}

    @Post('add-reply')
    addReply(@Body() payload: AddReplyDto){
        return this.reviewService.addReply(payload);
    }

    @Delete('delete-reply')
    deleteReply(@Query() payload: DeleteReplyDto){
        return this.reviewService.deleteReply(payload);
    }
}

import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/course/decorators/roles.decorator';
import { RolesGuard } from 'src/course/guards/role.guard';
import { AddReviewDto } from './dto/add-review.dto';
import { ReviewService } from './review.service';
import { AllReviewCourseDto } from './dto/all-review-course.dto';

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
}

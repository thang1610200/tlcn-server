import { Injectable, InternalServerErrorException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { ReviewServiceInterface } from './interfaces/review.service.interface';
import { AddReviewDto } from './dto/add-review.dto';
import { Course, Review, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AllReviewCourseDto } from './dto/all-review-course.dto';

@Injectable()
export class ReviewService implements ReviewServiceInterface {
    constructor (private readonly prismaService: PrismaService){}

    async findUserByEmail(email: string): Promise<User>{
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if(!user){
            throw new UnauthorizedException();
        }
        
        return user;
    }

    async findCourseBySlug(slug: string): Promise<Course>{
        const course = await this.prismaService.course.findUnique({
            where: {
                slug
            }
        });

        if(!course){
            throw new UnprocessableEntityException();
        }

        return course;
    }

    async addReview(payload: AddReviewDto): Promise<Review> {
        try {
            const user = await this.findUserByEmail(payload.email);

            const course = await this.findCourseBySlug(payload.course_slug);

            const review = await this.prismaService.review.create({
                data: {
                    userId: user.id,
                    courseId: course.id,
                    content: payload.content
                }
            });

            return review;
        }
        catch(err: any){
            throw new InternalServerErrorException();
        }
    }

    async allReviewCourse(payload: AllReviewCourseDto): Promise<Review[]> {
        try {
            const course = await this.findCourseBySlug(payload.course_slug);

            const review = await this.prismaService.review.findMany({
                where: {
                    courseId: course.id
                },
                include: {
                    user: true
                }
            });

            return review;
        }
        catch(err: any){
            console.log(err);
            throw new InternalServerErrorException();
        }
    }
}

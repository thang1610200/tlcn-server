import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { ReviewServiceInterface } from './interfaces/review.service.interface';
import { AddReviewDto } from './dto/add-review.dto';
import { Course, Review, ReviewReply, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AllReviewCourseDto } from './dto/all-review-course.dto';
import { AddReplyDto } from './dto/add-reply.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { DeleteReplyDto } from './dto/delete-reply.dto';

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

    async addReply(payload: AddReplyDto): Promise<ReviewReply> {
        try {
            const user = await this.findUserByEmail(payload.email);

            const review = await this.prismaService.review.findUnique({
                where: {
                    id: payload.reviewId
                }
            });
    
            if(!review){
                throw new UnprocessableEntityException();
            }

            return await this.prismaService.reviewReply.create({
                data: {
                    reply: payload.reply,
                    userId: user.id,
                    reviewId: review.id
                }
            });
        }
        catch(err: any){
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async deleteReview(payload: DeleteReviewDto): Promise<string> {
        const user = await this.findUserByEmail(payload.email);

        const review = await this.prismaService.review.findFirst({
            where: {
                userId: user.id,
                id: payload.reviewId
            }
        });

        if(!review){
            throw new NotFoundException();
        }

        await this.prismaService.review.delete({
            where: {
                id: review.id
            }
        });

        return "SUCCESS";
    }

    async deleteReply(payload: DeleteReplyDto): Promise<string> {
        try {
            const user = await this.findUserByEmail(payload.email);

            const reply = await this.prismaService.reviewReply.findFirst({
                where: {
                    id: payload.replyId,
                    userId: user.id,
                    reviewId: payload.reviewId
                }
            });

            if(!reply){
                throw new UnprocessableEntityException();
            }

            await this.prismaService.reviewReply.delete({
                where: {
                    id: reply.id
                }
            });

            return "SUCCESS";

        }catch(err: any){
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
                    user: true,
                    reply: {
                        include: {
                            user: true
                        },
                        orderBy: {
                            create_at: 'desc'
                        }
                    }
                },
                orderBy: {
                    create_at: 'desc'
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

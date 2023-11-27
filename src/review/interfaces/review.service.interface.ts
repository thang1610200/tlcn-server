import { Course, Review, ReviewReply, User } from "@prisma/client";
import { AddReviewDto } from "../dto/add-review.dto";
import { AllReviewCourseDto } from "../dto/all-review-course.dto";
import { AddReplyDto } from "../dto/add-reply.dto";
import { DeleteReviewDto } from "../dto/delete-review.dto";
import { DeleteReplyDto } from "../dto/delete-reply.dto";

export interface ReviewServiceInterface {
    findUserByEmail(email: string): Promise<User>;
    findCourseBySlug(slug: string): Promise<Course>;
    addReview(payload: AddReviewDto): Promise<Review>;
    addReply(payload: AddReplyDto): Promise<ReviewReply>;
    deleteReview(payload: DeleteReviewDto): Promise<string>;
    deleteReply(payload: DeleteReplyDto): Promise<string>;
    allReviewCourse(payload: AllReviewCourseDto): Promise<Review[]>;
}
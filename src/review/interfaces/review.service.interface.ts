import { Course, Review, User } from "@prisma/client";
import { AddReviewDto } from "../dto/add-review.dto";
import { AllReviewCourseDto } from "../dto/all-review-course.dto";

export interface ReviewServiceInterface {
    findUserByEmail(email: string): Promise<User>;
    findCourseBySlug(slug: string): Promise<Course>;
    addReview(payload: AddReviewDto): Promise<Review>;
    allReviewCourse(payload: AllReviewCourseDto): Promise<Review[]>;
}
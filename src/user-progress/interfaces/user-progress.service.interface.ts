import { Content, Course, Lesson, User, UserProgress, UserProgressQuiz } from '@prisma/client';
import { AddUserProgressDto, CompleteLessonDto } from '../dto/user-progress.dto';

export interface UserProgressServiceInterface {
    getUserProgressByCourse(courseId: string, userId: string): Promise<UserProgress[]>;
    // getUserProgress(payload: GetUserProgressDto): Promise<UserProgress>;
    // findLessonByToken(token: string): Promise<Lesson>;
    findContentOfCourse(token: string, courseId: string): Promise<Content>;
    findUserByEmail(email: string): Promise<User>;
    findCourseBySlug(slug: string): Promise<Course>;
    addUserProgress(payload: AddUserProgressDto): Promise<Course>;
    completeLesson(payload: CompleteLessonDto): Promise<UserProgress>;
    // addUserProgressNext(payload: AddUserProgressNextDto): Promise<string>;
    // getUserProgressQuiz(
    //     payload: GetUserProgressQuizDto,
    // ): Promise<UserProgressQuiz[]>;
    // addAnswerProgressQuiz(
    //     payload: AddAnswerUserProgressDto,
    // ): Promise<UserProgressQuiz>;
}

import { Content, Course, Lesson, Quizz, User, UserProgress, UserProgressQuiz } from '@prisma/client';
import { AddAnswerUserProgressDto, AddUserProgressDto, CompleteLessonDto, RetakeQuizDto, UserAccessDto } from '../dto/user-progress.dto';

export interface UserProgressServiceInterface {
    getUserProgressByCourse(courseId: string, userId: string): Promise<UserProgress[]>;
    // getUserProgress(payload: GetUserProgressDto): Promise<UserProgress>;
    // findLessonByToken(token: string): Promise<Lesson>;
    //getUserProgressQuiz(payload: GetUserProgressQuizDto): Promise<UserProgressQuiz[]>;
    retakeQuiz(payload: RetakeQuizDto): Promise<string>;
    completeExercise(user_progress_id: string, number_correct: number): Promise<boolean>;
    findContentOfCourse(token: string, courseId: string): Promise<Content>;
    findUserByEmail(email: string): Promise<User>;
    findCourseBySlug(slug: string): Promise<Course>;
    addUserProgress(payload: AddUserProgressDto): Promise<Course>;
    completeLesson(payload: CompleteLessonDto): Promise<UserProgress>;
    addAnswerProgressQuiz(payload: AddAnswerUserProgressDto): Promise<UserProgressQuiz>;
    findQuizByToken(quiz_token: string): Promise<Quizz>;
    courseOfUser(payload: UserAccessDto): Promise<any[]>;
    countCourseAccess(payload: UserAccessDto): Promise<number>;
    // addUserProgressNext(payload: AddUserProgressNextDto): Promise<string>;
    // getUserProgressQuiz(
    //     payload: GetUserProgressQuizDto,
    // ): Promise<UserProgressQuiz[]>;
}

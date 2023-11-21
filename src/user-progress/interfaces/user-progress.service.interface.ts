import { Lesson, User, UserProgress, UserProgressQuiz } from "@prisma/client";
import { GetUserProgressDto } from "../dto/get-user-progress.dto";
import { AddUserProgressDto } from "../dto/add-user-progress.dto";
import { AddAnswerUserProgressDto } from "../dto/add-answer-progress-quiz.dto";
import { GetUserProgressQuizDto } from "../dto/get-user-progress-quiz.dto";

export interface UserProgressServiceInterface {
    getUserProgress(payload: GetUserProgressDto): Promise<UserProgress>;
    findLessonByToken(token: string): Promise<Lesson>;
    findUserByEmail(email: string): Promise<User>;
    addUserProgress(payload: AddUserProgressDto): Promise<UserProgress>;
    getUserProgressQuiz(payload: GetUserProgressQuizDto): Promise<UserProgressQuiz[]>;
    addAnswerProgressQuiz(payload: AddAnswerUserProgressDto): Promise<UserProgressQuiz>;
}
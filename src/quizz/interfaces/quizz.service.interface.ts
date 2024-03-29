import { Chapter, Course, Exercise, Quizz, User } from '@prisma/client';
import { CreateQuizzDto } from '../dto/create-quizz.dto';
import { QuizzResponse } from '../dto/response-quizz.dto';
import { ReorderQuizzDto } from '../dto/reoder-quizz.dto';
import { DetailQuizzDto } from '../dto/detail-quizz.dto';
import { UpdateQuizzDto } from '../dto/update-quizz.dto';
import { UpdateStatusQuizzDto } from '../dto/update-status-quizz.dto';

export interface QuizzServiceInterface {
    reorderQuizz(payload: ReorderQuizzDto): Promise<string>;
    createQuizz(payload: CreateQuizzDto): Promise<QuizzResponse>;
    findExcersie(chapterId: string, exercise_token: string): Promise<Exercise>;
    getDetailQuizz(payload: DetailQuizzDto): Promise<Quizz>;
    updateValueQuizz(payload: UpdateQuizzDto): Promise<QuizzResponse>;
    updateStatusQuizz(payload: UpdateStatusQuizzDto): Promise<QuizzResponse>;
    deleteQuizz(payload: DetailQuizzDto): Promise<string>;
    findUserByEmail(email: string): Promise<User>;
    findCourseBySlug(courseSlug: string, userId: string): Promise<Course>;
    findChapterByToken(chapterToken: string, courseId: string): Promise<Chapter>;
    updatePositionQuizs(exerciseId: string, position: number): Promise<string>;
    buildQuizzResponse(quizz: Quizz): QuizzResponse;
}

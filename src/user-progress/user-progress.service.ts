import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UserProgressServiceInterface } from './interfaces/user-progress.service.interface';
import { PrismaService } from 'src/prisma.service';
import { GetUserProgressDto } from './dto/get-user-progress.dto';
import { Lesson, User, UserProgress, UserProgressQuiz } from '@prisma/client';
import { AddUserProgressDto } from './dto/add-user-progress.dto';
import { AddAnswerUserProgressDto } from './dto/add-answer-progress-quiz.dto';

@Injectable()
export class UserProgressService implements UserProgressServiceInterface {
    constructor(private readonly prismaService: PrismaService){}

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

    async findLessonByToken(token: string): Promise<Lesson>{
        const lesson = await this.prismaService.lesson.findUnique({
            where: {
                token
            }
        });

        if(!lesson){
            throw new UnprocessableEntityException();
        }

        return lesson;
    }

    async getUserProgress(payload: GetUserProgressDto): Promise<UserProgress> {
        const user = await this.findUserByEmail(payload.email);

        const lesson = await this.findLessonByToken(payload.lesson_token);

        const user_progress = await this.prismaService.userProgress.findFirst({
            where: {
                lessonId: lesson.id,
                userId: user.id
            },
            include: {
                userProgressQuiz: true
            }
        });

        return user_progress;
    }

    async addUserProgress(payload: AddUserProgressDto): Promise<UserProgress> {
        const user = await this.findUserByEmail(payload.email);

        const lesson = await this.findLessonByToken(payload.lesson_token);

        const user_progress = await this.prismaService.userProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId: lesson.id
                }
            },
            create: {
                userId: user.id,
                lessonId: lesson.id,
                isCompleted: payload.isCompleted
            },
            update: {
                isCompleted: payload.isCompleted
            }
        });

        return user_progress;
    }

    async addAnswerProgressQuiz(payload: AddAnswerUserProgressDto): Promise<UserProgressQuiz> {
        const user = await this.findUserByEmail(payload.email);

        const lesson = await this.findLessonByToken(payload.lesson_token);

        const user_progress = await this.prismaService.userProgress.findFirst({
            where: {
                lessonId: lesson.id,
                userId: user.id
            }
        });

        const result = await this.prismaService.userProgressQuiz.create({
            data: {
                quizzId: payload.quizzId,
                userProgressId: user_progress.id,
                answer: payload.answer,
                isCorrect: payload.isCorrect
            }
        });

        return result;
    }
}

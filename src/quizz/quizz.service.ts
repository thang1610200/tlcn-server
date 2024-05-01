import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { QuizzServiceInterface } from './interfaces/quizz.service.interface';
import { Chapter, Course, Exercise, Prisma, Quizz, User } from '@prisma/client';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { QuizzResponse } from './dto/response-quizz.dto';
import { PrismaService } from 'src/prisma.service';
import { ReorderQuizzDto } from './dto/reoder-quizz.dto';
import { DetailQuizzDto } from './dto/detail-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';
import { UpdateStatusQuizzDto } from './dto/update-status-quizz.dto';

@Injectable()
export class QuizzService implements QuizzServiceInterface {
    constructor(private readonly prismaService: PrismaService) {}

    async findChapterByToken(
        chapterToken: string,
        courseId: string,
    ): Promise<Chapter> {
        try {
            const chapter = await this.prismaService.chapter.findFirst({
                where: {
                    courseId,
                    token: chapterToken,
                },
            });

            if (!chapter) {
                throw new UnprocessableEntityException();
            }

            return chapter;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async findCourseBySlug(
        courseSlug: string,
        userId: string,
    ): Promise<Course> {
        try {
            const course = await this.prismaService.course.findFirst({
                where: {
                    owner_id: userId,
                    slug: courseSlug,
                },
            });

            if (!course) {
                throw new UnauthorizedException();
            }

            return course;
        } catch(err) {
            throw new InternalServerErrorException();
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    email,
                },
            });

            if (!user) {
                throw new UnauthorizedException();
            }

            return user;
        } catch{
            throw new InternalServerErrorException();
        }
    }

    async findExcersie(
        chapterId: string,
        exercise_token: string,
    ): Promise<Exercise> {
        try {
            const exercise = await this.prismaService.exercise.findFirst({
                where: {
                    token: exercise_token,
                    content: {
                        chapterId
                    }
                }
            });

            if(!exercise) {
                throw new BadRequestException();
            }

            return exercise;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async createQuizz(payload: CreateQuizzDto): Promise<QuizzResponse> {
        const user = await this.findUserByEmail(payload.email);
        const course = await this.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.findChapterByToken(payload.chapter_token, course.id);
    
        const exercise = await this.findExcersie(chapter.id, payload.exercise_token);

        try {
            const lastQuizz = await this.prismaService.quizz.findFirst({
                where: {
                    exerciseId: exercise.id,
                },
                orderBy: {
                    position: 'desc',
                },
            });
    
            const newPosition = lastQuizz ? lastQuizz.position + 1 : 1;
    
            const quizz = await this.prismaService.quizz.create({
                data: {
                    token: new Date().getTime().toString(),
                    question: payload.question,
                    position: newPosition,
                    exerciseId: exercise.id,
                },
            });
    
            return this.buildQuizzResponse(quizz);
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async reorderQuizz(payload: ReorderQuizzDto): Promise<string> {
        try {
            for (let item of payload.list) {
                await this.prismaService.quizz.update({
                    where: {
                        token: item.token,
                    },
                    data: {
                        position: item.position,
                    },
                });
            }
    
            return 'Success';
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async getDetailQuizz(payload: DetailQuizzDto): Promise<Quizz> {
        const user = await this.findUserByEmail(payload.email);
        const course = await this.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.findChapterByToken(payload.chapter_token, course.id);
        const exercise = await this.findExcersie(chapter.id, payload.exercise_token);

        try {
            const quizz = await this.prismaService.quizz.findFirst({
                where: {
                    token: payload.quiz_token,
                    exerciseId: exercise.id
                }
            });
    
            if (!quizz) {
                throw new NotFoundException();
            }
    
            return quizz;
        }
        catch{
            throw new InternalServerErrorException();
        }
    }

    async updateValueQuizz(payload: UpdateQuizzDto): Promise<QuizzResponse> {
        const user = await this.findUserByEmail(payload.email);
        const course = await this.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.findChapterByToken(payload.chapter_token, course.id);
        const exercise = await this.findExcersie(chapter.id, payload.exercise_token);

        try {
            const quizz = await this.prismaService.quizz.findFirst({
                where: {
                    token: payload.quiz_token,
                    exerciseId: exercise.id,
                },
            });
    
            if (!quizz) {
                throw new NotFoundException();
            }
    
            const updateQuizz = await this.prismaService.quizz.update({
                where: {
                    token: quizz.token,
                    exerciseId: exercise.id,
                },
                data: {
                    ...payload.value
                },
            });
    
            return this.buildQuizzResponse(updateQuizz);
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async updateStatusQuizz(
        payload: UpdateStatusQuizzDto,
    ): Promise<QuizzResponse> {
        const user = await this.findUserByEmail(payload.email);
        const course = await this.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.findChapterByToken(payload.chapter_token, course.id);
        const exercise = await this.findExcersie(chapter.id, payload.exercise_token);

        try {
            const quizz = await this.prismaService.quizz.findFirst({
                where: {
                    token: payload.quiz_token,
                    exerciseId: exercise.id,
                },
            });
    
            if (!quizz) {
                throw new NotFoundException();
            }
    
            const updateQuizz = await this.prismaService.quizz.update({
                where: {
                    token: quizz.token,
                    exerciseId: exercise.id,
                },
                data: {
                    isPublished: !quizz.isPublished,
                },
            });
    
            return this.buildQuizzResponse(updateQuizz);
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async updatePositionQuizs(exerciseId: string, position: number): Promise<string> {
        const quizs = await this.prismaService.quizz.findMany({
            where: {
                exerciseId,
                position: {
                    gt: position,
                },
            },
            orderBy: {
                position: "asc"
            }
        });

        quizs.forEach(async (item) => {
            await this.prismaService.quizz.update({
                where: {
                    id: item.id,
                },
                data: {
                    position: item.position - 1,
                },
            });
        });

        return 'SUCCESS';
    }

    async deleteQuizz(payload: DetailQuizzDto): Promise<string> {
        const user = await this.findUserByEmail(payload.email);
        const course = await this.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.findChapterByToken(payload.chapter_token, course.id);
        const exercise = await this.findExcersie(chapter.id, payload.exercise_token);

        try {
            const quizz = await this.prismaService.quizz.findFirst({
                where: {
                    token: payload.quiz_token,
                    exerciseId: exercise.id,
                },
            });
    
            if (!quizz) {
                throw new NotFoundException();
            }
    
            const quizDeleted = await this.prismaService.quizz.delete({
                where: {
                    token: quizz.token,
                    exerciseId: exercise.id,
                },
            });
    
            return await this.updatePositionQuizs(exercise.id, quizDeleted.position);
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    buildQuizzResponse(quizz: Quizz): QuizzResponse {
        return {
            token: quizz.token,
            question: quizz.question,
            answer: quizz.answer,
            option: quizz.option,
            position: quizz.position,
            isPublished: quizz.isPublished,
            explain: quizz.explain,
        };
    }
}

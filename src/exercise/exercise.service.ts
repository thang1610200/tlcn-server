import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ExerciseServiceInterface } from './interfaces/exercise.service.interface';
import { Chapter, Course, Exercise, User } from '@prisma/client';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseResponse } from './dto/exercise-response.dto';
import { PrismaService } from 'src/prisma.service';
import { GetAllExerciseDto } from './dto/getall-exercise.dto';
import { GetDetailExerciseDto } from './dto/get-detail-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { AddExerciseLessonDto } from './dto/add-exercise-lesson.dto';
import { UpdateStatusExerciseDto } from './dto/update-status-exercise.dto';

@Injectable()
export class ExerciseService implements ExerciseServiceInterface {
    constructor(private readonly prismaService: PrismaService) {}

    async findChapterByToken(chapterToken: string, courseId: string): Promise<Chapter> {
        try {
            const chapter = await this.prismaService.chapter.findFirst({
                where: {
                    courseId: courseId,
                    token: chapterToken,
                },
            });
    
            if (!chapter) {
                throw new UnprocessableEntityException();
            }

            return chapter;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async findCourseBySlug(courseSlug: string, userId: string): Promise<Course> {
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
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async getAllExercise(payload: GetAllExerciseDto): Promise<Exercise[]> {
        throw new Error();
        // const user = await this.findInstructorByEmail(payload.email);

        // const exercise = await this.prismaService.exercise.findMany({
        //     where: {
        //         instructorId: user.id,
        //     },
        //     orderBy: {
        //         create_at: 'desc',
        //     },
        // });

        // return exercise;
    }

    async getAllExerciseOpen(payload: GetAllExerciseDto): Promise<Exercise[]> {
        // const user = await this.findInstructorByEmail(payload.email);

        // const exercise = await this.prismaService.exercise.findMany({
        //     where: {
        //         instructorId: user.id,
        //         isOpen: true,
        //     },
        //     orderBy: {
        //         create_at: 'desc',
        //     },
        // });

        // return exercise;
        throw new Error();
    }

    async getDetailExercise(payload: GetDetailExerciseDto): Promise<Exercise> {
        const user = await this.findInstructorByEmail(payload.email);
        const course = await this.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.findChapterByToken(payload.chapter_token, course.id);

        try {
            const exercise = await this.prismaService.exercise.findFirst({
                where: {
                    content: {
                        chapterId: chapter.id
                    },
                    token: payload.token
                },
                include: {
                    quizz: {
                        orderBy: {
                            position: "asc"
                        }
                    }
                }
            });

            if(!exercise){
                throw new NotFoundException();
            }

            return exercise;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async findInstructorByEmail(email: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async createExercise(
        payload: CreateExerciseDto,
    ): Promise<ExerciseResponse> {
        const user = await this.findInstructorByEmail(payload.email);

        const course = await this.findCourseBySlug(payload.course_slug, user.id);

        const chapter = await this.findChapterByToken(payload.chapter_token, course.id);
        
        try {
            const lastContent = await this.prismaService.content.findFirst({
                where: {
                    chapterId: chapter.id
                },
                orderBy: {
                    position: 'desc',
                },
            });
    
            const newPosition = lastContent ? lastContent.position + 1 : 1;
    
            const content = await this.prismaService.content.create({
                data: {
                    type: payload.typeContent,
                    chapterId: chapter.id,
                    position: newPosition,
                }
            });
    
            const exercise = await this.prismaService.exercise.create({
                data: {
                    title: payload.title,
                    token: new Date().getTime().toString(),
                    contentId: content.id,
                    type: payload.typeExercise
                },
            });
    
            return this.builResponseExercise(exercise);
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async updateExercise(
        payload: UpdateExerciseDto,
    ): Promise<ExerciseResponse> {
        const user = await this.findInstructorByEmail(payload.email);
        const course = await this.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.findChapterByToken(payload.chapter_token, course.id);

        try {
            const exerciseUpdate = await this.prismaService.exercise.update({
                where: {
                    content: {
                        chapterId: chapter.id
                    },
                    token: payload.token
                },
                data: {
                    ...payload.value,
                },
            });

            return this.builResponseExercise(exerciseUpdate);
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async updateStatusExercise(
        payload: UpdateStatusExerciseDto,
    ): Promise<ExerciseResponse> {
        const user = await this.findInstructorByEmail(payload.email);
        const course = await this.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.findChapterByToken(payload.chapter_token, course.id);

        try {
            const exerciseUpdate = await this.prismaService.exercise.update({
                where: {
                    content: {
                        chapterId: chapter.id
                    },
                    token: payload.token
                },
                data: {
                    isOpen: !payload.status
                },
            });

            return this.builResponseExercise(exerciseUpdate);
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async updatePositionExercises(contentId: string): Promise<string> {
        const contentDeleted = await this.prismaService.content.delete({
            where: {
                id: contentId,
            },
        });

        const contents = await this.prismaService.content.findMany({
            where: {
                chapterId: contentDeleted.chapterId,
                position: {
                    gt: contentDeleted.position,
                },
            },
            orderBy: {
                position: "asc"
            }
        });

        contents.forEach(async (item) => {
            await this.prismaService.content.update({
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

    async addExerciseToLesson(payload: AddExerciseLessonDto): Promise<string> {
        throw new Error("ds");
        // const user = await this.prismaService.user.findUnique({
        //     where: {
        //         email: payload.email,
        //     },
        // });

        // const course = await this.prismaService.course.findFirst({
        //     where: {
        //         owner_id: user.id,
        //         slug: payload.course_slug,
        //     },
        // });

        // if (!course) {
        //     throw new UnprocessableEntityException();
        // }

        // const chapter = await this.prismaService.chapter.findFirst({
        //     where: {
        //         courseId: course.id,
        //         token: payload.chapter_token,
        //     },
        // });

        // if (!chapter) {
        //     throw new UnprocessableEntityException();
        // }

        // const lesson = await this.prismaService.lesson.findFirst({
        //     where: {
        //         chapterId: chapter.id,
        //         token: payload.lesson_token,
        //     },
        // });

        // if (!lesson) {
        //     throw new UnprocessableEntityException();
        // }

        // const exercise = await this.prismaService.exercise.findFirst({
        //     where: {
        //         instructorId: user.id,
        //         id: payload.exerciseId,
        //     },
        // });

        // if (!exercise) {
        //     throw new UnprocessableEntityException();
        // }

        // await this.prismaService.lesson.update({
        //     where: {
        //         token: lesson.token,
        //     },
        //     data: {
        //         exerciseId: exercise.id,
        //     },
        // });

        // return 'SUCCESS';
    }

    async deleteExercise(payload: GetDetailExerciseDto): Promise<string> {
        const user = await this.findInstructorByEmail(payload.email);

        const course = await this.findCourseBySlug(
            payload.course_slug,
            user.id,
        );

        const chapter = await this.findChapterByToken(
            payload.chapter_token,
            course.id,
        );

        try {
            const exercise = await this.prismaService.exercise.findFirst({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: payload.token,
                },
            });

            if (!exercise) {
                throw new UnprocessableEntityException();
            }

            const exerciseDeleted = await this.prismaService.exercise.delete({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    id: exercise.id
                },
            });

            return this.updatePositionExercises(exerciseDeleted.contentId);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    builResponseExercise(payload: Exercise): ExerciseResponse {
        return {
            token: payload.token,
            title: payload.title,
            type: payload.type,
            isOpen: payload.isOpen,
            create_at: payload.create_at,
            update_at: payload.update_at,
        };
    }
}

import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { UserProgressServiceInterface } from './interfaces/user-progress.service.interface';
import { PrismaService } from 'src/prisma.service';
import { Content, Course, Lesson, Quizz, User, UserProgress, UserProgressQuiz } from '@prisma/client';
import { AddAnswerUserProgressDto, AddUserProgressDto, CompleteLessonDto, RetakeQuizDto, UserAccessDto } from './dto/user-progress.dto';

type PipelineStage = {
    [key: string]: any;
}

@Injectable()
export class UserProgressService implements UserProgressServiceInterface {
    constructor(private readonly prismaService: PrismaService) {}

    async countCourseAccess(payload: UserAccessDto): Promise<number> {
        try {
            let pipeline: PipelineStage[] = [
                {
                    $lookup: {
                        from: "UserProgress",
                        let: { courseId: "$_id" }, 
                        pipeline: [
                            { $match: { $expr: { $eq: ["$courseId", "$$courseId"] } } },
                            {
                                $lookup: {
                                    from: "User",
                                    localField: "userId",
                                    foreignField: "_id",
                                    as: "user",
                                }
                            },
                            { $unwind: "$user" } 
                        ],
                        as: "userProgress"
                    }
                },
                {
                    $match: {
                        isPublished: true,
                        userProgress: {
                            $elemMatch: {
                                "user.email": payload.email
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "Chapter",
                        let: { courseId: "$_id" }, 
                        pipeline: [
                            { $match: { $expr: { $eq: ["$courseId", "$$courseId"] } } },
                            {
                                $match: {
                                    isPublished: true
                                }
                            },
                            {
                                $lookup: {
                                    from: "Content",
                                    let: { chapterId: "$_id" }, 
                                    pipeline: [
                                        { $match: { $expr: { $eq: ["$chapterId", "$$chapterId"] } } },
                                        {
                                            $lookup: {
                                                from: 'Lesson',
                                                localField: '_id',
                                                foreignField: 'contentId',
                                                as: 'lessons',
                                            },
                                        },
                                        {
                                            $lookup: {
                                                from: 'Exercise',
                                                localField: '_id',
                                                foreignField: 'contentId',
                                                as: 'exercises',
                                            },
                                        },
                                        {
                                            $unwind: {
                                                path: '$lessons',
                                                preserveNullAndEmptyArrays: true,
                                            },
                                        },
                                        {
                                            $unwind: {
                                                path: '$exercises',
                                                preserveNullAndEmptyArrays: true,
                                            },
                                        },
                                        {
                                            $match: {
                                                $or: [
                                                    { 'lessons.isPublished': true },
                                                    { 'exercises.isOpen': true },
                                                ],
                                            },
                                        },
                                    ],
                                    as: "contents"
                                }
                            }
                        ],
                        as: "chapters"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        title: 1,
                        chapters: 1,
                        slug: 1,
                        picture: 1,
                        description: 1,
                        userProgress: {
                            $filter: {
                                input: "$userProgress",
                                as: "userProgressItem",
                                cond: {
                                    $and: [
                                        { $eq: ["$$userProgressItem.user.email", payload.email] },
                                        { $eq: ["$$userProgressItem.isCompleted", true ] }
                                    ]
                                }
                            }
                        },
                    },
                },
            ];

            if (!!payload?.topic_slug) {
                const topicMatch: PipelineStage[] = [
                    {
                        $lookup: {
                            from: 'Topic',
                            localField: 'topic_id',
                            foreignField: '_id',
                            as: 'topic',
                        },
                    },
                    {
                        $unwind: '$topic',
                    },
                    {
                        $match: {
                            'topic.slug': {
                                $in:
                                    typeof payload.topic_slug === 'string'
                                        ? [payload.topic_slug]
                                        : payload.topic_slug,
                            },
                        },
                    },
                ];
    
                pipeline = [...topicMatch, ...pipeline];
            }
    
            if (!!payload?.level_slug) {
                const levelMatch: PipelineStage[] = [
                    {
                        $lookup: {
                            from: 'Level',
                            localField: 'level_id',
                            foreignField: '_id',
                            as: 'level',
                        },
                    },
                    {
                        $unwind: '$level',
                    },
                    {
                        $match: {
                            'level.slug': {
                                $in:
                                    typeof payload.level_slug === 'string'
                                        ? [payload.level_slug]
                                        : payload.level_slug,
                            },
                        },
                    },
                ];
    
                pipeline = [...levelMatch, ...pipeline];
            }

            if (!!payload?.title) {
                const titleMatch: PipelineStage = {
                    $search: {
                        index: 'default',
                        text: {
                            query: payload.title,
                            path: 'title',
                        },
                    },
                };
    
                pipeline.unshift(titleMatch);
            }

            const course: any = await this.prismaService.course.aggregateRaw({
                pipeline
            });
            
            return course.length as number;
        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async courseOfUser(payload: UserAccessDto): Promise<any[]> {
        try {
            let pipeline: PipelineStage[] = [
                {
                    $lookup: {
                        from: "UserProgress",
                        let: { courseId: "$_id" }, 
                        pipeline: [
                            { $match: { $expr: { $eq: ["$courseId", "$$courseId"] } } },
                            {
                                $lookup: {
                                    from: "User",
                                    localField: "userId",
                                    foreignField: "_id",
                                    as: "user",
                                }
                            },
                            { $unwind: "$user" } 
                        ],
                        as: "userProgress"
                    }
                },
                {
                    $match: {
                        isPublished: true,
                        userProgress: {
                            $elemMatch: {
                                "user.email": payload.email
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "Chapter",
                        let: { courseId: "$_id" }, 
                        pipeline: [
                            { $match: { $expr: { $eq: ["$courseId", "$$courseId"] } } },
                            {
                                $match: {
                                    isPublished: true
                                }
                            },
                            {
                                $lookup: {
                                    from: "Content",
                                    let: { chapterId: "$_id" }, 
                                    pipeline: [
                                        { $match: { $expr: { $eq: ["$chapterId", "$$chapterId"] } } },
                                        {
                                            $lookup: {
                                                from: 'Lesson',
                                                localField: '_id',
                                                foreignField: 'contentId',
                                                as: 'lessons',
                                            },
                                        },
                                        {
                                            $lookup: {
                                                from: 'Exercise',
                                                localField: '_id',
                                                foreignField: 'contentId',
                                                as: 'exercises',
                                            },
                                        },
                                        {
                                            $unwind: {
                                                path: '$lessons',
                                                preserveNullAndEmptyArrays: true,
                                            },
                                        },
                                        {
                                            $unwind: {
                                                path: '$exercises',
                                                preserveNullAndEmptyArrays: true,
                                            },
                                        },
                                        {
                                            $match: {
                                                $or: [
                                                    { 'lessons.isPublished': true },
                                                    { 'exercises.isOpen': true },
                                                ],
                                            },
                                        },
                                    ],
                                    as: "contents"
                                }
                            }
                        ],
                        as: "chapters"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        title: 1,
                        chapters: 1,
                        slug: 1,
                        picture: 1,
                        description: 1,
                        userProgress: {
                            $filter: {
                                input: "$userProgress",
                                as: "userProgressItem",
                                cond: {
                                    $and: [
                                        { $eq: ["$$userProgressItem.user.email", payload.email] },
                                        { $eq: ["$$userProgressItem.isCompleted", true ] }
                                    ]
                                }
                            }
                        },
                    },
                },
            ];

            if (!!payload?.topic_slug) {
                const topicMatch: PipelineStage[] = [
                    {
                        $lookup: {
                            from: 'Topic',
                            localField: 'topic_id',
                            foreignField: '_id',
                            as: 'topic',
                        },
                    },
                    {
                        $unwind: '$topic',
                    },
                    {
                        $match: {
                            'topic.slug': {
                                $in:
                                    typeof payload.topic_slug === 'string'
                                        ? [payload.topic_slug]
                                        : payload.topic_slug,
                            },
                        },
                    },
                ];
    
                pipeline = [...topicMatch, ...pipeline];
            }
    
            if (!!payload?.level_slug) {
                const levelMatch: PipelineStage[] = [
                    {
                        $lookup: {
                            from: 'Level',
                            localField: 'level_id',
                            foreignField: '_id',
                            as: 'level',
                        },
                    },
                    {
                        $unwind: '$level',
                    },
                    {
                        $match: {
                            'level.slug': {
                                $in:
                                    typeof payload.level_slug === 'string'
                                        ? [payload.level_slug]
                                        : payload.level_slug,
                            },
                        },
                    },
                ];
    
                pipeline = [...levelMatch, ...pipeline];
            }

            if (!!payload?.title) {
                const titleMatch: PipelineStage = {
                    $search: {
                        index: 'default',
                        text: {
                            query: payload.title,
                            path: 'title',
                        },
                    },
                };
    
                pipeline.unshift(titleMatch);
            }

            if (!!payload?.page) {
                if (Number(payload.page) < 1) {
                    return [];
                }
    
                const pagination: PipelineStage[] = [
                    {
                        $skip: (Number(payload.page) - 1) * 6,
                    },
                    {
                        $limit: 6,
                    },
                ];
    
                pipeline.splice(-2, 2);
                pipeline = [...pipeline, ...pagination];
            }

            const course: any = await this.prismaService.course.aggregateRaw({
                pipeline
            });
    
            const user_progress = course.map((item) => {
                const lesson = item.chapters.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.contents.length;
                }, 0);
    
                return {
                    ...item,
                    percent: Number(item.userProgress.length / lesson),
                }
            });
    
            return user_progress;
        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async retakeQuiz(payload: RetakeQuizDto): Promise<string> {
        const course = await this.findCourseBySlug(payload.course_slug);
        const user = await this.findUserByEmail(payload.email);
        const content_current = await this.findContentOfCourse(payload.content_token, course.id);

        try {
            const userProgress = this.prismaService.userProgress.findFirst({
                where: {
                    id: payload.user_progress_id,
                    userId: user.id,
                    courseId: course.id,
                    contentId: content_current.id
                }
            });

            if(!userProgress) {
                throw new NotFoundException();
            }

            await this.prismaService.userProgressQuiz.deleteMany({
                where: {
                    userProgressId: payload.user_progress_id
                }
            });

            return "SUCCESS";
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async completeExercise(user_progress_id: string,  number_correct: number): Promise<boolean> {
        try {
            const progress_quiz = await this.prismaService.userProgressQuiz.count({
                where: {
                    userProgressId: user_progress_id,
                    isCorrect: true
                }
            });

            if(progress_quiz >= number_correct) return true;
            return false;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async findQuizByToken(quiz_token: string): Promise<Quizz> {
        try {
            const quiz = await this.prismaService.quizz.findUnique({
                where: {
                    token: quiz_token
                }
            });

            if(!quiz) {
                throw new NotFoundException();
            }

            return quiz;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async addAnswerProgressQuiz(payload: AddAnswerUserProgressDto): Promise<UserProgressQuiz> {         
        const user = await this.findUserByEmail(payload.email);
        const quiz = await this.findQuizByToken(payload.quiz_token);

        const isCorrect = quiz.answer === payload.answer;

        try {
            const user_progress_quiz = await this.prismaService.userProgressQuiz.create({
                data: {
                    userProgressId: payload.user_progress_id,
                    isCorrect,
                    quizzId: quiz.id,
                    answer: payload.answer  
                },
                include: {
                    userProgress: true
                }
            });

            if(!user_progress_quiz.userProgress.isCompleted && payload.last_quiz) {
                await this.prismaService.$transaction(async (tx) => {
                        const exercise = await this.prismaService.exercise.findFirst({
                            where: {
                                token: payload.exercise_token
                            }
                        });
            
                        if(!exercise) {
                            throw new NotFoundException();
                        }
    
                        const exerciseComplete = await this.completeExercise(payload.user_progress_id, exercise.number_correct);
    
                        if(exerciseComplete) {
                            const course = await this.findCourseBySlug(payload.course_slug);
            
                            await tx.userProgress.update({
                                where: {
                                    userId_contentId: {
                                        userId: user.id,
                                        contentId: exercise.contentId
                                    },
                                    courseId: course.id
                                },
                                data: {
                                    isCompleted: true
                                }
                            });
            
                            if (payload.next_content_token) {
                                const content_next = await this.findContentOfCourse(payload.next_content_token, course.id);
    
                                await tx.userProgress.create({
                                    data: {
                                        courseId: course.id,
                                        userId: user.id,
                                        contentId: content_next.id
                                    }
                                });
                            }
                    }
                },{
                    maxWait: 5000,
                    timeout: 10000
                });
            }

            return user_progress_quiz;
        }
        catch(err: any) {
            throw new InternalServerErrorException();
        }
    }

    // async getUserProgressQuiz(payload: GetUserProgressQuizDto): Promise<UserProgressQuiz[]> {
    //     const user = await this.findUserByEmail(payload.email);

    //     try {
    //         const user_progress = await this.prismaService.userProgressQuiz.findMany({
    //             where: {
    //                 userProgressId: payload.user_progress_id
    //             }
    //         });

    //         return user_progress;
    //     }
    //     catch {
    //         throw new InternalServerErrorException();
    //     }
    // }

    async findContentOfCourse(token: string, courseId: string): Promise<Content> {
        try {
            const content = await this.prismaService.content.findFirst({
                where: {
                    chapter: {
                        courseId
                    },
                    token
                }
            });

            if(!content) {
                throw new BadRequestException();
            }

            return content;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async completeLesson(payload: CompleteLessonDto): Promise<UserProgress> {
        const course = await this.findCourseBySlug(payload.course_slug);
        const user = await this.findUserByEmail(payload.email);
        const content_current = await this.findContentOfCourse(payload.content_token, course.id);
        try {
            return await this.prismaService.$transaction(async (tx) => {
                const contentUpdated = await tx.userProgress.update({
                    where: {
                        userId_contentId: {
                            userId: user.id,
                            contentId: content_current.id
                        },
                        courseId: course.id
                    },
                    data: {
                        isCompleted: true
                    }
                });

                if(payload.next_content_token) {
                    const content_next = await this.findContentOfCourse(payload.next_content_token, course.id);

                    await tx.userProgress.create({
                        data: {
                            courseId: course.id,
                            userId: user.id,
                            contentId: content_next.id
                        }
                    });
                };

                return contentUpdated;
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async findCourseBySlug(slug: string): Promise<{ id: string; topic_id: string; owner_id: string; level_id: string; chapters: & { contents: Content[] }[]; title: string; description: string; learning_outcome: string[]; requirement: string[]; slug: string; picture: string; isPublished: boolean; create_at: Date; update_at: Date; }> {
        const course = await this.prismaService.course.findUnique({
            where: {
                slug
            },
            include: {
                chapters: {
                    include: {
                        contents: true
                    }
                }
            }
        });

        if(!course) {
            throw new NotFoundException();
        }

        return course;
    }

    async findUserByEmail(email: string): Promise<User> {
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

    async getUserProgressByCourse(courseId: string, userId: string): Promise<UserProgress[]> {
        try {
            const userProgress = await this.prismaService.userProgress.findMany({
                where: {
                    userId,
                    courseId
                }
            })

            return userProgress
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async addUserProgress(payload: AddUserProgressDto): Promise<Course> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.findCourseBySlug(payload.course_slug);

        const course_progress = await this.getUserProgressByCourse(course.id, user.id);

        try { 
            if (course_progress.length > 0 || user.id === course.owner_id) {
                return course;
            }

            await this.prismaService.userProgress.create({
                data: {
                    courseId: course.id,
                    userId: user.id,
                    contentId: course.chapters[0].contents[0].id
                }
            });

            return course;
        }
        catch{
            throw new InternalServerErrorException();
        }
    }

    // async getUserProgressQuiz(
    //     payload: GetUserProgressQuizDto,
    // ): Promise<UserProgressQuiz[]> {
    //     const result = await this.prismaService.userProgressQuiz.findMany({
    //         where: {
    //             userProgressId: payload.id,
    //         },
    //     });

    //     return result;
    // }

    // async deleteAllProgressQuiz(
    //     payload: GetUserProgressQuizDto,
    // ): Promise<string> {
    //     await this.prismaService.userProgressQuiz.deleteMany({
    //         where: {
    //             userProgressId: payload.id,
    //         },
    //     });

    //     return 'SUCCESS';
    // }

    // async addAnswerProgressQuiz(
    //     payload: AddAnswerUserProgressDto,
    // ): Promise<UserProgressQuiz> {
    //     const user = await this.findUserByEmail(payload.email);

    //     const lesson = await this.findLessonByToken(payload.lesson_token);

    //     const user_progress = await this.prismaService.userProgress.findFirst({
    //         where: {
    //             lessonId: lesson.id,
    //             userId: user.id,
    //         },
    //     });

    //     const result = await this.prismaService.userProgressQuiz.create({
    //         data: {
    //             quizzId: payload.quizzId,
    //             userProgressId: user_progress.id,
    //             answer: payload.answer,
    //             isCorrect: payload.isCorrect,
    //         },
    //     });

    //     return result;
    // }

    // async updatePrgressExerciseUser(
    //     payload: UpdateProgressExerciseDto,
    // ): Promise<string> {
    //     try {
    //         const user = await this.findUserByEmail(payload.email);

    //         const lesson_next = await this.findLessonByToken(payload.lesson_next);
    
    //         const lesson = await this.findLessonByToken(payload.lessontoken);

    //         const course = await this.findCourseBySlug(payload.course_slug);

    //         await this.prismaService.$transaction([
    //             this.prismaService.userProgress.update({
    //                 where: {
    //                     userId_lessonId: {
    //                         userId: user.id,
    //                         lessonId: lesson.id,
    //                     },
    //                 },
    //                 data: {
    //                     isPassed: true,
    //                 },
    //             }),
    //             this.prismaService.userProgress.create({
    //                 data: {
    //                     courseId: course.id,
    //                     userId: user.id,
    //                     lessonId: lesson_next.id,
    //                 },
    //             }),
    //         ]);

    //         return 'SUCCESS';
    //     } catch (e: any) {
    //         throw new InternalServerErrorException();
    //     }
    // }

    // async addUserProgressNext(
    //     payload: AddUserProgressNextDto,
    // ): Promise<string> {
    //     try {
    //         const user = await this.findUserByEmail(payload.email);

    //         const lesson_next = await this.findLessonByToken(payload.lesson_next);
    
    //         const lesson = await this.findLessonByToken(payload.lesson_token);

    //         const course = await this.findCourseBySlug(payload.course_slug);

    //         await this.prismaService.$transaction([
    //             this.prismaService.userProgress.update({
    //                 where: {
    //                     userId_lessonId: {
    //                         userId: user.id,
    //                         lessonId: lesson.id,
    //                     },
    //                 },
    //                 data: {
    //                     isCompleted: true,
    //                 },
    //             }),
    //             this.prismaService.userProgress.create({
    //                 data: {
    //                     courseId: course.id,
    //                     userId: user.id,
    //                     lessonId: lesson_next.id,
    //                 },
    //             }),
    //         ]);

    //         return 'SUCCESS';
    //     } catch (e: any) {
    //         throw new InternalServerErrorException();
    //     }
    // }
}

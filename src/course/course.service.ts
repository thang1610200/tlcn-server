import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CourseServiceInterface } from './interfaces/course.service.interface';
import { CreateTopicDto } from './dto/create-topic.dto';
import { Course, Level, Topic, User, UserProgress } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateValueCourse } from './dto/update-course.dto';
import { CourseResponse } from './dto/course-response.dto';
import { GetCourseUserDto } from './dto/get-course-user.dto';
import { GetCourseBySlugDto } from './dto/get-course-slug.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { DeleteCourseDto } from './dto/delete-course.dto';
import { UpdatePictureCourse } from './dto/update-picture.dto';
import { UploadService } from 'src/upload/upload.service';
import { FilterCourseDto } from './dto/filter-course-publish.dto';
import { GetDetailCourseDto } from './dto/get-detail-course.dto';
import { GetProgressCourseDto } from './dto/get-progress-course.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { JsonObject } from '@prisma/client/runtime/library';
import { isUndefined } from 'lodash';

type PipelineStage = {
    [key: string]: any;
};


@Injectable()
export class CourseService implements CourseServiceInterface {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uploadService: UploadService,
    ) {}

    async countCoursePublish(payload: FilterCourseDto): Promise<number> {
        try {
            let pipeline: PipelineStage[] = [
                {
                    $match: {
                        isPublished: true,
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

            const result = await this.prismaService.course.aggregateRaw({
                pipeline,
            });

            return result.length as number;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async getAllLevelCourse(): Promise<Level[]> {
        try {
            return await this.prismaService.level.findMany();
        } catch {
            throw new InternalServerErrorException();
        }
    }

    slugify(name: string, separator: string = '-'): string {
        return name
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, separator)
            .replace(/[^\w\-]+/g, '')
            .replace(/\_/g, separator)
            .replace(/\-\-+/g, separator)
            .replace(/\-$/g, '');
    }

    async createTopic(payload: CreateTopicDto): Promise<Topic> {
        const topic = await this.findByTitleTopic(payload.slug);

        if (topic) {
            throw new UnprocessableEntityException();
        }

        const newTopic = await this.prismaService.topic.create({
            data: {
                title: payload.title,
                slug: this.slugify(payload.title),
            },
        });

        return newTopic;
    }

    async createCourse(payload: CreateCourseDto): Promise<Course> {
        const course = await this.findByNameCourse(payload.title);

        if (course) {
            throw new UnprocessableEntityException();
        }

        const users = await this.findUserByEmail(payload.email);

        return await this.prismaService.course.create({
            data: {
                title: payload.title,
                owner_id: users.id,
                slug: this.slugify(payload.title),
            },
        });
    }

    async findByTitleTopic(payload: string): Promise<Topic> {
        return await this.prismaService.topic.findUnique({
            where: {
                slug: payload,
            },
        });
    }

    async findByNameCourse(payload: string): Promise<Course> {
        return await this.prismaService.course.findUnique({
            where: {
                title: payload,
            },
        });
    }

    async findAllTopic(): Promise<Topic[]> {
        return await this.prismaService.topic.findMany();
    }

    async updateCourse(payload: UpdateValueCourse): Promise<CourseResponse> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.prismaService.course.findFirst({
            where: {
                slug: payload.slug,
                owner_id: user.id,
            },
        });

        if (!course) {
            throw new UnauthorizedException();
        }

        const update = await this.prismaService.course.update({
            where: {
                slug: payload.slug,
            },
            data: {
                ...payload.value,
            },
        });

        return this.buildResponseCourse(update);
    }

    async getAllCourse(payload: GetCourseUserDto): Promise<Course[]> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.prismaService.course.findMany({
            where: {
                owner_id: user.id,
            },
            orderBy: {
                create_at: 'desc',
            },
            include: {
                userProgress: true,
            },
        });

        return course;
    }

    async getCourseBySlug(payload: GetCourseBySlugDto): Promise<Course> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.prismaService.course.findFirst({
            where: {
                owner_id: user.id,
                slug: payload.slug,
            },
            include: {
                chapters: {
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
        });

        if (!course) {
            throw new UnprocessableEntityException();
        }

        return course;
    }

    async updateStatusCourse(
        payload: UpdateStatusDto,
    ): Promise<CourseResponse> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.prismaService.course.findFirst({
            where: {
                slug: payload.slug,
                owner_id: user.id,
            },
        });

        if (!course) {
            throw new UnauthorizedException();
        }

        const update = await this.prismaService.course.update({
            where: {
                slug: payload.slug,
                owner_id: user.id,
            },
            data: {
                isPublished: !payload.status,
            },
        });

        return this.buildResponseCourse(update);
    }

    async deleteCourse(payload: DeleteCourseDto): Promise<string> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.prismaService.course.findFirst({
            where: {
                slug: payload.slug,
                owner_id: user.id,
            },
        });

        if (!course) {
            throw new UnauthorizedException();
        }

        await this.prismaService.course.delete({
            where: {
                slug: payload.slug,
                owner_id: user.id,
            },
        });

        return 'Deleted Success';
    }

    async updatePictureCourse(
        payload: UpdatePictureCourse,
    ): Promise<CourseResponse> {
        try {
            const user = await this.findUserByEmail(payload.email);

            const course = await this.prismaService.course.findFirst({
                where: {
                    slug: payload.slug,
                    owner_id: user.id,
                },
            });

            if (!course) {
                throw new UnauthorizedException();
            }
            //Web3
            //const fileName = await this.uploadService.uploadToWeb3Storage(payload.file);

            //S3
            const fileName = await this.uploadService.uploadAvatarToS3(
                payload.file,
            );
            //update vào database;
            const update = await this.prismaService.course.update({
                where: {
                    slug: payload.slug,
                    owner_id: user.id,
                },
                data: {
                    picture: fileName,
                },
            });

            return this.buildResponseCourse(update);
        } catch (err: any) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async getAllCoursePublish(payload: FilterCourseDto): Promise<any> {
        let pipeline: PipelineStage[] = [
            {
                $match: {
                    isPublished: true,
                },
            },
            {
                $lookup: {
                    from: 'Chapter',
                    localField: '_id',
                    foreignField: 'courseId',
                    as: 'chapters',
                },
            },
            {
                $unwind: '$chapters',
            },
            {
                $match: {
                    'chapters.isPublished': true,
                },
            },
            {
                $lookup: {
                    from: 'Content',
                    localField: 'chapters._id',
                    foreignField: 'chapterId',
                    as: 'chapters.contents',
                },
            },
            {
                $unwind: '$chapters.contents',
            },
            {
                $lookup: {
                    from: 'Lesson',
                    localField: 'chapters.contents._id',
                    foreignField: 'contentId',
                    as: 'chapters.contents.lessons',
                },
            },
            {
                $lookup: {
                    from: 'Exercise',
                    localField: 'chapters.contents._id',
                    foreignField: 'contentId',
                    as: 'chapters.contents.exercises',
                },
            },
            {
                $unwind: {
                    path: '$chapters.contents.lessons',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$chapters.contents.exercises',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    $or: [
                        { 'chapters.contents.lessons.isPublished': true },
                        { 'chapters.contents.exercises.isOpen': true },
                    ],
                },
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    slug: { $first: '$slug' },
                    picture: { $first: '$picture' },
                    isPublished: { $first: '$isPublished' },
                    description: { $first: '$description' },
                    chapters: { $push: '$chapters' },
                    create_at: { $first: '$create_at' },
                    total: { $sum: '$chapters.contents.lessons.duration' }
                },
            },
            {
                $sort: { create_at: 1 },
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    chapters: 1,
                    slug: 1,
                    picture: 1,
                    description: 1,
                    total: 1
                },
            },
            {
                $skip: 0,
            },
            {
                $limit: 6,
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

        if (!!payload?.duration) {
            let durationMatch = [];
            let duration: string[] = typeof payload.duration === 'string' ? [payload.duration] : payload.duration;

            duration.forEach((item) => {
                if(item === 'extraShort') {
                    durationMatch.push({
                        "total": { $gte: 0, $lte: 3600 }
                    });
                }else if (item === 'short') {
                    durationMatch.push({
                        "total": { $gte: 3600, $lte: 10800 }
                    });
                }else if (item === 'medium') {
                    durationMatch.push({
                        "total": { $gte: 10800, $lte: 21600 }
                    });
                }else if (item === 'long') {
                    durationMatch.push({
                        "total": { $gte: 21600, $lte: 61200 }
                    });
                }else if (item === 'extraLong') {
                    durationMatch.push({
                        "total": { $gte: 61200 }
                    });
                }
            });

            if(durationMatch.length === 0) {
                return [];
            }

            const elementPipeline: PipelineStage =                 {
                $match: {
                    $or: durationMatch
                }
            };

            pipeline.splice(pipeline.length - 4, 0, elementPipeline);
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

        return await this.prismaService.course.aggregateRaw({
            pipeline,
        });
    }

    async getDetailCourse(payload: GetDetailCourseDto): Promise<Course> {
        const course = await this.prismaService.course.findUnique({
            where: {
                slug: payload.slug,
                isPublished: true,
            },
            include: {
                topic: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    include: {
                        contents: {
                            include: {
                                lesson: {
                                    where: {
                                        isPublished: true,
                                    },
                                },
                                exercise: {
                                    where: {
                                        isOpen: true,
                                    },
                                },
                            },
                            orderBy: {
                                position: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
                owner: true,
            },
        });

        if (!course) {
            throw new UnprocessableEntityException();
        }

        return course;
    }

    async findUserByEmail(email: string): Promise<User> {
        const users = await this.prismaService.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!users) {
            throw new UnauthorizedException();
        }

        return users;
    }

    // async getUserProgressCourse(
    //     payload: GetProgressCourseDto,
    // ): Promise<Course> {
    //     const user = await this.findUserByEmail(payload.email);

    //     const course = await this.prismaService.course.findUnique({
    //         where: {
    //             slug: payload.course_slug,
    //             isPublished: true,
    //         },
    //         include: {
    //             topic: true,
    //             chapters: {
    //                 where: {
    //                     isPublished: true,
    //                 },
    //                 include: {
    //                     // lessons: {
    //                     //     where: {
    //                     //         isPublished: true,
    //                     //     },
    //                     //     orderBy: {
    //                     //         position: 'asc',
    //                     //     },
    //                     //     include: {
    //                     //         userProgress: {
    //                     //             where: {
    //                     //                 userId: user.id,
    //                     //             },
    //                     //         },
    //                     //     },
    //                     // },
    //                 },
    //                 orderBy: {
    //                     position: 'asc',
    //                 },
    //             },
    //             owner: true,
    //         },
    //     });

    //     if (!course) {
    //         throw new UnprocessableEntityException();
    //     }

    //     return course;
    // }

    async getDetailCourseAuth(payload: GetProgressCourseDto): Promise<Course> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.prismaService.course.findUnique({
            where: {
                slug: payload.course_slug,
                isPublished: true,
            },
            include: {
                topic: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    include: {
                        contents: {
                            include: {
                                lesson: {
                                    where: {
                                        isPublished: true,
                                    },
                                },
                                exercise: {
                                    where: {
                                        isOpen: true,
                                    },
                                },
                                userProgress: {
                                    where: {
                                        userId: user.id,
                                    },
                                },
                            },
                            orderBy: {
                                position: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
                owner: true,
                userProgress: {
                    where: {
                        userId: user.id,
                    },
                },
            },
        });

        if (!course) {
            throw new UnprocessableEntityException();
        }

        return course;
    }

    async getAllUserOfInstructor(
        payload: GetCourseUserDto,
    ): Promise<UserProgress[]> {
        try {
            const owner = await this.findUserByEmail(payload.email);

            const course = await this.prismaService.userProgress.findMany({
                where: {
                    course: {
                        owner_id: owner.id,
                    },
                },
                distinct: ['userId', 'courseId'],
                include: {
                    course: true,
                    user: true,
                },
            });
            return course;
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    async getAllUserOfCourse(
        payload: GetProgressCourseDto,
    ): Promise<UserProgress[]> {
        try {
            const owner = await this.findUserByEmail(payload.email);

            const course = await this.prismaService.userProgress.findMany({
                where: {
                    course: {
                        owner_id: owner.id,
                        slug: payload.course_slug,
                    },
                },
                distinct: ['userId', 'courseId'],
                include: {
                    course: true,
                    user: true,
                },
            });

            return course;
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    async countCourseOfUser(payload: GetCourseUserDto): Promise<number> {
        try {
            const ownder = await this.findUserByEmail(payload.email);

            const count = await this.prismaService.course.count({
                where: {
                    owner_id: ownder.id,
                },
            });

            return count;
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    async countUserOfInstructor(payload: GetCourseUserDto): Promise<number> {
        try {
            const owner = await this.findUserByEmail(payload.email);

            const course = await this.prismaService.userProgress.findMany({
                where: {
                    course: {
                        owner_id: owner.id,
                    },
                },
                distinct: ['userId', 'courseId'],
            });

            return course.length;
        } catch (err: any) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async getAllCourseAdmin(): Promise<Course[]> {
        try {
            return await this.prismaService.course.findMany({
                where: {
                    isPublished: true,
                },
                include: {
                    owner: true,
                    userProgress: true,
                },
                orderBy: {
                    create_at: 'desc',
                },
            });
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    buildResponseCourse(payload: Course): CourseResponse {
        return {
            title: payload.title,
            description: payload.description,
            learning_outcome: payload.learning_outcome,
            requirement: payload.requirement,
            slug: payload.slug,
            picture: payload.picture,
            isPublished: payload.isPublished,
            create_at: payload.create_at,
        };
    }
}

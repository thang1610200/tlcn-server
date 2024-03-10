import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CourseServiceInterface } from './interfaces/course.service.interface';
import { CreateTopicDto } from './dto/create-topic.dto';
import { Course, Topic, User, UserProgress } from '@prisma/client';
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
import { count } from 'console';

@Injectable()
export class CourseService implements CourseServiceInterface {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uploadService: UploadService,
    ) {}

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
                userProgress: true
            }
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
            throw new InternalServerErrorException();
        }
    }

    async getAllCoursePublish(payload: FilterCourseDto): Promise<Course[]> {
        if (payload.topic_slug.trim() === '') {
            return await this.filterCoursePublish(payload);
        }

        const topic = await this.findByTitleTopic(payload.topic_slug);

        return await this.prismaService.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: payload.title,
                },
                topic_id: topic.id,
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
                                        isPublished: true
                                    }
                                },
                                exercise: {
                                    where: {
                                        isOpen: true
                                    }
                                }
                            }
                        },
                    }
                },
                owner: true,
            },
            orderBy: {
                create_at: 'desc',
            },
        });
    }

    async filterCoursePublish(payload: FilterCourseDto): Promise<Course[]> {
        return await this.prismaService.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: payload.title,
                },
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
                                        isPublished: true
                                    }
                                },
                                exercise: {
                                    where: {
                                        isOpen: true
                                    }
                                }
                            }
                        },
                    }
                },
                owner: true,
            },
            orderBy: {
                create_at: 'desc',
            },
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
                                        isPublished: true
                                    }
                                },
                                exercise: {
                                    where: {
                                        isOpen: true
                                    }
                                }
                            },
                            orderBy: {
                                position: "asc"
                            }
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

    async getUserProgressCourse(
        payload: GetProgressCourseDto,
    ): Promise<Course> {
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
                        // lessons: {
                        //     where: {
                        //         isPublished: true,
                        //     },
                        //     orderBy: {
                        //         position: 'asc',
                        //     },
                        //     include: {
                        //         userProgress: {
                        //             where: {
                        //                 userId: user.id,
                        //             },
                        //         },
                        //     },
                        // },
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
                        // lessons: {
                        //     where: {
                        //         isPublished: true,
                        //     },
                        //     orderBy: {
                        //         position: 'asc',
                        //     },
                        //     include: {
                        //         userProgress: {
                        //             where: {
                        //                 userId: user.id,
                        //             },
                        //         },
                        //     },
                        // },
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
                        owner_id: owner.id
                    }
                },
                distinct: ['userId','courseId']
            });

            return course.length;
        }
        catch(err: any){
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async getAllCourseAdmin(): Promise<Course[]>{
        try {
            return await this.prismaService.course.findMany({
                where: {
                    isPublished: true
                },
                include: {
                    owner: true,
                    userProgress: true
                },
                orderBy: {
                    create_at: 'desc'
                }
            });
        }
        catch(err: any){
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

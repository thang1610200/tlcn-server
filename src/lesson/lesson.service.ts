import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { LessonServiceInterface } from './interfaces/lesson.service.interface';
import { PrismaService } from 'src/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonResponse } from './dto/lesson-response.dto';
import { ReorderLessonDto } from './dto/reorder-lesson.dto';
import { GetLessonDto } from './dto/get-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { UpdateVideoLesson } from './dto/update-video.dto';
import { UploadService } from 'src/upload/upload.service';
import { UpdateStatusLessonDto } from './dto/update-status.dto';
import { DeleteLessonDto } from './dto/delete-lesson.dto';
import { Chapter, Content, Course, Lesson, Subtitle, User } from '@prisma/client';
import { UpdateThumbnailVideo } from './dto/update-thumbnail.dto';
import { ContentLessonDto, SummarizationVideoDto } from './dto/content-lesson.dto';
import { AddSubtitleLessonDto, AddSubtitleLessonInterface, DeleteSubtitleLessonDto, TranslateSubtitleDto, TranslateSubtitleQueue } from './dto/subtitle.dto';
import { AssemblyAI, TranscribeParams } from 'assemblyai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LessonService implements LessonServiceInterface {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uploadService: UploadService,
        private readonly configService: ConfigService
    ) {}
    private readonly client = new AssemblyAI({
        apiKey: this.configService.get('ASSEMBLY_API_KEY'),
    });
    
    async summarizationVideo(payload: SummarizationVideoDto): Promise<string> {
        try {
            const lesson = await this.prismaService.lesson.findFirst({
                where: {
                    content: {
                        token: payload.content_token,
                        chapter: {
                            course: {
                                slug: payload.course_slug
                            }
                        },
                        type: 'LESSON'
                    }
                }
            });

            if(!lesson) {
                throw new NotFoundException();
            }

            const params: TranscribeParams = {
                audio: lesson.videoUrl,
                summarization: true,
                summary_model: 'informative',
                summary_type: 'paragraph'
            }

            const transcript = await this.client.transcripts.transcribe(params);

            return transcript.summary;
        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async translateSubtitle(payload: TranslateSubtitleDto): Promise<Subtitle> {
        const lesson = await this.findLessonByToken(payload);

        try {
            const subtitle = await this.prismaService.subtitle.findFirst({
                where: {
                    id: payload.subtitleId,
                    lessonId: lesson.id
                }
            });

            if(!subtitle) {
                throw new NotFoundException();
            }

            const data: TranslateSubtitleQueue = {
                lessonId: lesson.id,
                subtitleUrl: subtitle.file,
                language: payload.language,
                language_code: payload.language_code
            }

            await this.uploadService.translateSubtitleJob(data);

            return subtitle;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async generateSubtitleVideo(payload: AddSubtitleLessonDto): Promise<Subtitle> {
        const lesson = await this.findLessonByToken(payload);

        const fileTranscript = {
            audio_url: lesson.videoUrl,
            language_code: payload.language_code
        }

        const transcript = await this.client.transcripts.transcribe(fileTranscript);

        let vtt = await this.client.transcripts.subtitles(transcript.id, 'vtt');

        const fileAWS = {
            originalname: 'transcript-learning.vtt',
            buffer: Buffer.from(vtt)
        }

        try {
            const file = await this.uploadService.uploadAttachmentToS3(fileAWS);

            return await this.prismaService.subtitle.create({
                data: {
                    lessonId: lesson.id,
                    language: payload.language,
                    language_code: payload.language_code,
                    file
                }
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async deleteSubtitleLesson(payload: DeleteSubtitleLessonDto): Promise<Subtitle> {
        const lesson = await this.findLessonByToken(payload);

        try {
            return await this.prismaService.subtitle.delete({
                where: {
                    lessonId: lesson.id,
                    id: payload.subtitleId
                }
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async addSubtitleLesson(payload: AddSubtitleLessonInterface): Promise<Subtitle> {
        const lesson = await this.findLessonByToken(payload);

        try {
            const file = await this.uploadService.uploadAttachmentToS3(payload.file);

            const subtitle = await this.prismaService.subtitle.create({
                data: {
                    lessonId: lesson.id,
                    language: payload.language,
                    language_code: payload.language_code,
                    file
                }
            });

            return subtitle;
        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async updatePositionLessons(contentId: string): Promise<string> {
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

    async findChapterByToken(
        chapterToken: string,
        courseId: string,
    ): Promise<Chapter> {
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
        } catch {
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
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async createLesson(payload: CreateLessonDto): Promise<Content> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.findCourseBySlug(
            payload.course_slug,
            user.id,
        );

        const chapter = await this.findChapterByToken(
            payload.chapter_token,
            course.id,
        );

        try {
            const lastContent = await this.prismaService.content.findFirst({
                where: {
                    chapterId: chapter.id,
                },
                orderBy: {
                    position: 'desc',
                },
            });

            const newPosition = lastContent ? lastContent.position + 1 : 1;

            const content = await this.prismaService.content.create({
                data: {
                    token: new Date().getTime().toString(),
                    type: payload.type,
                    chapterId: chapter.id,
                    position: newPosition,
                    lesson: {
                        create: {
                            title: payload.title,
                            token: new Date().getTime().toString(),
                        }
                    }
                }
            });

            // const lesson = await this.prismaService.lesson.create({
            //     data: {
            //         title: payload.title,
            //         token: new Date().getTime().toString(),
            //         contentId: content.id,
            //     },
            // });

            return content;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async reorderLesson(payload: ReorderLessonDto): Promise<string> {
        for (let item of payload.list) {
            await this.prismaService.content.update({
                where: {
                    id: item.id,
                },
                data: {
                    position: item.position,
                },
            });
        }

        return 'Success';
    }

    async findLessonByToken(payload: GetLessonDto): Promise<Lesson> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.findCourseBySlug(
            payload.course_slug,
            user.id,
        );

        const chapter = await this.findChapterByToken(
            payload.chapter_token,
            course.id,
        );

        try {
            const lesson = await this.prismaService.lesson.findFirst({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: payload.lesson_token,
                },
                include: {
                    asyncVideo: true,
                    attachment: true,
                    content: {
                        include: {
                            chapter: {
                                include: {
                                    course: true,
                                },
                            },
                        },
                    },
                    subtitles: true
                },
            });

            if (!lesson) {
                throw new UnprocessableEntityException();
            }

            return lesson;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async updateValueLesson(payload: UpdateLessonDto): Promise<LessonResponse> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.findCourseBySlug(
            payload.course_slug,
            user.id,
        );

        const chapter = await this.findChapterByToken(
            payload.chapter_token,
            course.id,
        );

        try {
            const lesson = await this.prismaService.lesson.findFirst({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: payload.lesson_token,
                },
            });

            if (!lesson) {
                throw new UnprocessableEntityException();
            }

            const update = await this.prismaService.lesson.update({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: payload.lesson_token,
                },
                data: {
                    ...payload.value,
                },
            });

            return this.buildLessonResponse(update);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async updateVideoLesson(
        payload: UpdateVideoLesson,
    ): Promise<LessonResponse> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.findCourseBySlug(
            payload.course_slug,
            user.id,
        );

        const chapter = await this.findChapterByToken(
            payload.chapter_token,
            course.id,
        );

        try {
            const lesson = await this.prismaService.lesson.findFirst({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: payload.lesson_token,
                },
            });

            if (!lesson) {
                throw new UnprocessableEntityException();
            }

            const { fileName, link } = this.uploadService.createFileNameVideo(
                payload.file,
            );

            const update = await this.prismaService.lesson.update({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: lesson.token,
                },
                data: {
                    asyncVideo: {
                        upsert: {
                            create: {
                                type: 'PROGRESSING'
                            },
                            update: {
                                type: 'PROGRESSING'
                            }
                        }
                    }
                },
                include: {
                    asyncVideo: true
                }
            });

            const data = {
                fileName,
                file: payload.file,
                lesson_id: lesson.id,
                link,
                asyncVideoId: update.asyncVideo.id,
                duration: payload.duration
            };

            await this.uploadService.uploadVideoToStorage(data);

            return this.buildLessonResponse(update);
        } catch(err) {
            //console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async updateStatusLesson(
        payload: UpdateStatusLessonDto,
    ): Promise<LessonResponse> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.findCourseBySlug(
            payload.course_slug,
            user.id,
        );

        const chapter = await this.findChapterByToken(
            payload.chapter_token,
            course.id,
        );

        try {
            const lesson = await this.prismaService.lesson.findFirst({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: payload.lesson_token,
                },
            });

            if (!lesson) {
                throw new UnprocessableEntityException();
            }

            const update = await this.prismaService.lesson.update({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: lesson.token,
                },
                data: {
                    isPublished: !payload.status,
                },
            });

            return this.buildLessonResponse(update);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async updatePreviewLesson(
        payload: UpdateStatusLessonDto,
    ): Promise<LessonResponse> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.findCourseBySlug(
            payload.course_slug,
            user.id,
        );

        const chapter = await this.findChapterByToken(
            payload.chapter_token,
            course.id,
        );

        try {
            const lesson = await this.prismaService.lesson.findFirst({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: payload.lesson_token,
                },
            });

            if (!lesson) {
                throw new UnprocessableEntityException();
            }

            const update = await this.prismaService.lesson.update({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: lesson.token,
                },
                data: {
                    isPreview: !payload.status,
                },
            });

            return this.buildLessonResponse(update);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async deleteLesson(payload: DeleteLessonDto): Promise<string> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.findCourseBySlug(
            payload.course_slug,
            user.id,
        );

        const chapter = await this.findChapterByToken(
            payload.chapter_token,
            course.id,
        );

        try {
            const lesson = await this.prismaService.lesson.findFirst({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: payload.lesson_token,
                },
            });

            if (!lesson) {
                throw new UnprocessableEntityException();
            }

            const lessonDeleted = await this.prismaService.lesson.delete({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: lesson.token,
                },
            });

            return this.updatePositionLessons(lessonDeleted.contentId);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async updateThumbnail(
        payload: UpdateThumbnailVideo,
    ): Promise<LessonResponse> {
        const user = await this.findUserByEmail(payload.email);

        const course = await this.findCourseBySlug(
            payload.course_slug,
            user.id,
        );

        const chapter = await this.findChapterByToken(
            payload.chapter_token,
            course.id,
        );

        try {
            const lesson = await this.prismaService.lesson.findFirst({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: payload.lesson_token,
                },
            });

            if (!lesson) {
                throw new UnprocessableEntityException();
            }

            const fileName = await this.uploadService.uploadAvatarToS3(
                payload.file,
            );

            const update = await this.prismaService.lesson.update({
                where: {
                    content: {
                        chapterId: chapter.id,
                    },
                    token: lesson.token,
                },
                data: {
                    thumbnail: fileName,
                },
            });

            return this.buildLessonResponse(update);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async contentLesson(payload: ContentLessonDto): Promise<Content> {
        const user = await this.findUserByEmail(payload.email);

        try {
            const content = await this.prismaService.content.findUnique({
                where: {
                    token: payload.content_token,
                    chapter: {
                        course: {
                            slug: payload.course_slug
                        }
                    }
                },
                include: {
                    exercise: {
                        include: {
                            quizz: {
                                where: {
                                    isPublished: true
                                },
                                orderBy: {
                                    position: "asc"
                                }
                            },
                            code: {
                                include: {
                                    file: true,
                                    labCode: true
                                }
                            }
                        }
                    },
                    lesson: {
                        include: {
                            attachment: true,
                            subtitles: true
                        }
                    },
                    userProgress: {
                        where: {
                            userId: user.id
                        },
                        include: {
                            userProgressQuiz: true,
                            userProgressCode: true
                        }
                    }
                }
            });

            if (!content) {
                throw new NotFoundException();
            }

            return content;
        } catch {
            throw new InternalServerErrorException();
        }
    }

    buildLessonResponse(lesson: Lesson): LessonResponse {
        return {
            title: lesson.title,
            token: lesson.token,
            description: lesson.description,
            isPublished: lesson.isPublished,
            videoUrl: lesson.videoUrl,
            //isCompleteVideo: lesson.isCompleteVideo,
            thumbnail: lesson.thumbnail,
            //course_title: lesson.course?.title
        };
    }
}

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CodeServiceInterface } from './interfaces/code.service.interface';
import { $Enums, Code, Course, Exercise, FileCode, FileTest, LabCode, UserProgress } from '@prisma/client';
import { AddQuestionCodeDto, GetDetailCodeDto, UpdateValueCodeDto, GetAllLanguageCodeDto, SubmitCodeDto, DetailCodeInterface } from './dto/code.dto';
import { PrismaService } from 'src/prisma.service';
import { QuizzService } from 'src/quizz/quizz.service';
import { AddFileNameDto, AddFileTestDto, DeleteFileDto, UpdateContentFileDto } from './dto/file.dto';
import { EvaluateService } from 'src/evaluate/evaluate.service';
import { EvaluateCode } from 'src/evaluate/dto/evaluate.dto';

@Injectable()
export class CodeService implements CodeServiceInterface {
    constructor(private readonly prismaService: PrismaService,
                private readonly quizService: QuizzService,
                private readonly evaluateService: EvaluateService
            ){}

    async deleteFile(payload: DeleteFileDto): Promise<FileCode> {
        const code = await this.getDetailCode(payload);

        try {
            return await this.prismaService.fileCode.delete({
                where: {
                    id: payload.fileId,
                    codeId: code.id
                }
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async detailCode(payload: DetailCodeInterface): Promise<Code & {file: FileCode[]; fileTest: FileTest, labCode: LabCode, exercise: Exercise}> {
        try {
            const course = await this.prismaService.course.findFirst({
                where: {
                    slug: payload.course_slug
                }
            });

            if(!course) {
                throw new NotFoundException();
            }

            const content = await this.prismaService.content.findFirst({
                where: {
                    token: payload.content_token
                }
            });

            const exercise = await this.prismaService.exercise.findFirst({
                where: {
                    token: payload.exercise_token,
                    contentId: content.id
                }
            })

            return await this.prismaService.code.findFirst({
                where: {
                    token: payload.code_token,
                    exerciseId: exercise.id
                },
                include: {
                    file: true,
                    fileTest: true,
                    labCode: true,
                    exercise: true
                }
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async submitCode(payload: SubmitCodeDto): Promise<boolean> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        });

        if(!user) {
            throw new UnauthorizedException();
        }

        const code = await this.detailCode(payload);

        const codeFile: {
            codeFile: string;
            codeFileName: string;
            codeId: string;
            fileId: string;
        }[] = code.file.map((item, index) => {
            return {
                codeFileName: `${item.fileName}.${item.mime}`,
                codeFile: payload.codeFile[index],
                codeId: item.codeId,
                fileId: item.id
            }
        });

        const data: EvaluateCode = {
            lang: code.labCode.lab,
            testFile: code.fileTest.content,
            testFileName: (code.labCode.lab === 'Javascript' || code.labCode.lab === 'Typescript' || code.labCode.lab === 'WebDev') ? `${code.fileTest.fileName}.spec.${code.fileTest.mime}`:`${code.fileTest.fileName}.${code.fileTest.mime}`,
            code: codeFile
        }

        try {
            const statusCode = await this.evaluateService.evaluateFunction(data);

            const userProgress = await this.prismaService.userProgress.findFirst({
                where: {
                    userId: user.id,
                    contentId: code.exercise.contentId,
                    course: {
                        slug: payload.course_slug
                    }
                }
            });

            codeFile.forEach(async (item) => {
                await this.prismaService.userProgressCode.upsert({
                    where: {
                        codeId_fileCodeId_userProgressId: {
                            codeId: item.codeId,
                            fileCodeId: item.fileId,
                            userProgressId: userProgress.id
                        }
                    },
                    update: {
                        answer: atob(item.codeFile)
                    },
                    create: {
                        answer: atob(item.codeFile),
                        codeId: item.codeId,
                        fileCodeId: item.fileId,
                        userProgressId: userProgress.id
                    }
                })
            });

            if(!statusCode) {
                return false;
            }

            return await this.prismaService.$transaction(async (tx) => {
                const userProgressUpdate = await tx.userProgress.update({
                    where: {
                        userId_contentId: {
                            userId: user.id,
                            contentId: code.exercise.contentId
                        },
                        course: {
                            slug: payload.course_slug
                        }
                    },
                    data: {
                        isCompleted: true,
                    }
                });

                if (payload.next_content_token ) {
                    const content_next = await tx.content.findFirst({
                        where: {
                            token: payload.next_content_token,
                            chapter: {
                                course: {
                                    slug: payload.course_slug
                                }
                            }
                        }
                    });

                    if(!content_next) {
                        throw new BadRequestException();
                    }

                    const nextUserProgress = await tx.userProgress.findFirst({
                        where: {
                            course: {
                                slug: payload.course_slug
                            },
                            userId: user.id,
                            contentId: content_next.id
                        }
                    });

                    if(!nextUserProgress) {
                        await tx.userProgress.create({
                            data: {
                                userId: user.id,
                                contentId: content_next.id,
                                courseId: userProgressUpdate.courseId
                            }
                        });
                    }
                }

                return true;
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async updateContentTestFile(payload: UpdateContentFileDto): Promise<FileTest> {
        const code = await this.getDetailCode(payload);

        try {
            return await this.prismaService.fileTest.update({
                where: {
                    id: payload.fileId,
                    codeId: code.id
                },
                data: {
                    content: payload.content
                }
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async addFileTest(payload: AddFileTestDto): Promise<FileTest> {
        const code = await this.getDetailCode(payload);
        try {
            let language;
            let mime;

            switch(code.labCode.lab){
                case 'WebDev':
                    language = 'javascript';
                    mime = 'js';
                    break;
                case 'Javascript':
                    language = 'javascript';
                    mime = 'js';
                    break;
                case 'Typescript':
                    language = 'typescript';
                    mime = 'ts';
                    break;
                case 'Python':
                    language = 'python';
                    mime = 'py';
                    break;
                case 'Java':
                    language = 'java';
                    mime = 'java';
                    break;
                case 'Php':
                    language = 'php';
                    mime = 'php'; 
                    break;
                case 'C++':
                    language = 'cpp';
                    mime = 'cpp'; 
                    break;      
            }

            if(code.fileTest) {
                throw new BadRequestException();
            }

            return await this.prismaService.fileTest.create({
                data: {
                    fileName: payload.fileName,
                    language,
                    mime,
                    codeId: code.id
                }
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async findCourse(slug: string): Promise<Course> {
        try {
            const course = await this.prismaService.course.findFirst({
                where: {
                    slug
                }
            });

            if(!course){
                throw new NotFoundException();
            }
            return course;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async updateLabCode(payload: UpdateValueCodeDto): Promise<Code> {
        const code = await this.getDetailCode(payload);

        try {
            return await this.prismaService.$transaction(async (tx) => {
                const codeUpdate = await tx.code.update({
                    where: {
                        id: code.id
                    },
                    data: {
                        ...payload.value
                    },
                    include: {
                        file: true,
                        fileTest: true
                    }
                });

                if(codeUpdate.file.length > 0) {
                    await tx.fileCode.deleteMany({
                        where: {
                            codeId: codeUpdate.id
                        }
                    });
                }

                if(codeUpdate.fileTest) {
                    await tx.fileTest.delete({
                        where: {
                            codeId: codeUpdate.id
                        }
                    })
                }

                return codeUpdate;
            });
        }
        catch{
            throw new InternalServerErrorException();
        }
    }

    async updateContentFile(payload: UpdateContentFileDto): Promise<FileCode> {
        const code = await this.getDetailCode(payload);

        try {
            return await this.prismaService.fileCode.update({
                where: {
                    id: payload.fileId,
                    codeId: code.id
                },
                data: {
                    default_content: payload.content
                }
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async getAllLanguageCode(payload: GetAllLanguageCodeDto): Promise<LabCode[]> {
        await this.quizService.findUserByEmail(payload.email);
        
        try {
            return await this.prismaService.labCode.findMany();
        }
        catch(err) {
            throw new InternalServerErrorException();
        }
    }

    async addFileName(payload: AddFileNameDto): Promise<FileCode> {
        const code = await this.getDetailCode(payload);
        try {
            return await this.prismaService.fileCode.create({
                data: {
                    fileName: payload.fileName,
                    codeId: code.id,
                    language: payload.languageCode,
                    mime: payload.mimeFile
                }
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }
    
    async updateValueCode(payload: UpdateValueCodeDto): Promise<Code> {
        const code = await this.getDetailCode(payload);

        try {
            return await this.prismaService.code.update({
                where: {
                    id: code.id
                },
                data: {
                    ...payload.value
                }
            })
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    //instructor
    async getDetailCode(payload: GetDetailCodeDto): Promise<Code & {file: FileCode[]; fileTest: FileTest, labCode: LabCode, exercise: Exercise}> {
        const user = await this.quizService.findUserByEmail(payload.email);
        const course = await this.quizService.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.quizService.findChapterByToken(payload.chapter_token, course.id);
        const exercise = await this.quizService.findExcersie(chapter.id, payload.exercise_token);

        try {
            const code = await this.prismaService.code.findFirst({
                where: {
                    exerciseId: exercise.id,
                    token: payload.code_token
                },
                include: {
                    labCode: true,
                    file: true,
                    fileTest: true,
                    exercise: true
                }
            });
            
            if(!code) {
                throw new NotFoundException();
            }

            return code;
        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async addQuestionCode(payload: AddQuestionCodeDto): Promise<Code> {
        const user = await this.quizService.findUserByEmail(payload.email);
        const course = await this.quizService.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.quizService.findChapterByToken(payload.chapter_token, course.id);
        const exercise = await this.quizService.findExcersie(chapter.id, payload.exercise_token);

        try {
            return await this.prismaService.code.create({
                data: {
                    token: new Date().getTime().toString(),
                    question: payload.question,
                    exerciseId: exercise.id
                }
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }
}

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CodeServiceInterface } from './interfaces/code.service.interface';
import { $Enums, Code, Course, FileCode, LabCode, TestCase, UserProgress } from '@prisma/client';
import { AddQuestionCodeDto, GetDetailCodeDto, UpdateValueCodeDto, GetAllLanguageCodeDto, SubmitCodeDto, HandleCodeProp, CheckStatusDto } from './dto/code.dto';
import { PrismaService } from 'src/prisma.service';
import { QuizzService } from 'src/quizz/quizz.service';
import { AddFileNameDto, UpdateContentFileDto } from './dto/file.dto';
import { AddTestCaseDto, DeleteTestCaseDto } from './dto/test-case.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CodeService implements CodeServiceInterface {
    constructor(private readonly prismaService: PrismaService,
                private readonly quizService: QuizzService,
                private readonly httpService: HttpService,
                private readonly configService: ConfigService){}

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

    async checkStatusCode(payload: CheckStatusDto): Promise<any> {
        try {
            return new Promise((resolve) => {
                setTimeout(async () => {
                    const options = {
                        method: 'GET',
                        url: this.configService.get('RAPID_API_URL_BATCH_SUBMISSION'),
                        params: { base64_encoded: 'false', fields: '*', tokens: payload.token },
                        headers: {
                            'content-type': 'application/json',
                            'Content-Type': 'application/json',
                            'X-RapidAPI-Host': this.configService.get('RAPID_API_HOST'),
                            'X-RapidAPI-Key': this.configService.get('RAPID_API_KEY'),
                        }
                    };
        
                    const response = await this.httpService.request(options);
        
                    var countTrue = 0;
        
                    await response.forEach((value) => {
                        payload.testcase.map((item, index) => {
                            if(item.output === value.data.submissions[index].stdout.trim()) {
                                countTrue++;
                            }
                        });
                    });
        
                    if(countTrue === payload.testcase.length) {
                        await this.prismaService.$transaction(async (tx) => {
                            await tx.userProgress.update({
                                where: {
                                    userId_contentId: {
                                        userId: payload.userId,
                                        contentId: payload.contentId
                                    },
                                    courseId: payload.courseId
                                },
                                data: {
                                    isCompleted: true,
                                }
                            });
        
                            if (payload.next_content_token) {
                                const content_next = await tx.content.findFirst({
                                    where: {
                                        token: payload.next_content_token,
                                        chapter: {
                                            courseId: payload.courseId
                                        }
                                    }
                                });
        
                                if(!content_next) {
                                    throw new BadRequestException();
                                }
        
                                await tx.userProgress.create({
                                    data: {
                                        courseId: payload.courseId,
                                        userId: payload.userId,
                                        contentId: content_next.id
                                    }
                                });
                            }
                        },{
                            maxWait: 5000,
                            timeout: 10000
                        });
        
                        resolve("SUCCESS");
                    }
        
                    resolve("FAIL");
                },2000);
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async handleCode(payload: HandleCodeProp): Promise<{
        language_id: string,
        source_code: string
    }[]> {
        //try {
            //const getVar = payload.functionName.match(/\((.*?)\)/g)[0];

            //const countVar = getVar.match(/,/g).length + 1;
    
            let codeResult = [];
    
            if(payload.lab === 'Javascript') {
                payload.testcaseInput.map((item) => {
                    codeResult.push({
                        language_id: payload.language_id,
                        source_code: `${payload.code} \nconst a = ${payload.functionName.replace(/\(.*\)/, '').trim()} (${item.input});\n console.log(a);`
                    });
                })
            }
    
            return codeResult;
       // }
       // catch {
        //    throw new InternalServerErrorException();
        //}
    }

    async updateFunctioName(payload: UpdateContentFileDto): Promise<FileCode> {
        const code = await this.getDetailCode(payload);

        try {
            const default_content = code.file[0].default_content + "\n" + payload.content

            return await this.prismaService.fileCode.update({
                where: {
                    id: payload.fileId,
                    codeId: code.id
                },
                data: {
                    functionName: payload.content,
                    default_content
                }
            });

        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async submitCode(payload: SubmitCodeDto): Promise<any> {
        const user = await this.quizService.findUserByEmail(payload.email);
        const course = await this.findCourse(payload.course_slug);
        const content = await this.prismaService.content.findFirst({
            where: {
                token: payload.content_token,
            }
        });

        if(!content) {
            throw new NotFoundException();
        }

        try {
            const exercise = await this.prismaService.exercise.findFirst({
                where: {
                    contentId: content.id,
                    token: payload.exercise_token
                },
                include: {
                    code: {
                        include: {
                            labCode: true,
                            file: true,
                            testcase: true
                        }
                    }
                }
            })
    
            const handleCode: HandleCodeProp = {
                lab: exercise.code.labCode.lab, 
                functionName: exercise.code.file[0].functionName, 
                code: payload.code,
                testcaseInput: exercise.code.testcase,
                language_id: payload.language_id
            };
    
            const submissionBatch = await this.handleCode(handleCode);

            const options = {
                method: 'POST',
                url: this.configService.get('RAPID_API_URL_BATCH_SUBMISSION'),
                params: { base64_encoded: 'false', fields: '*' },
                headers: {
                    'content-type': 'application/json',
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Host': this.configService.get('RAPID_API_HOST'),
                    'X-RapidAPI-Key': this.configService.get('RAPID_API_KEY'),
                },
                data: {
                    submissions:submissionBatch
                }
            };

            const response = await this.httpService.request(options);
            const token = [];
            await response.forEach((value) => {
                value.data.forEach((item) => {
                    token.push(item.token)
                });
            });

            await this.prismaService.userProgress.update({
                where: {
                    userId_contentId: {
                        userId: user.id,
                        contentId: content.id
                    }
                },
                data: {
                    userProgressCode: {
                        create: {
                            codeId: exercise.code.id,
                            fileCodeId: exercise.code.file[0].id,
                            answer: payload.code
                        }
                    }
                }
            })

            const data: CheckStatusDto = {
                    token: token.join(","),
                    testcase: exercise.code.testcase,
                    contentId: content.id,
                    courseId: course.id,
                    userId: user.id,
                    next_content_token: payload.next_content_token
            }

            return await this.checkStatusCode(data);
        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async deleteTestCase(payload: DeleteTestCaseDto): Promise<TestCase> {
        try {
            return await this.prismaService.testCase.delete({
                where: {
                    id: payload.testcaseId,
                    codeId: payload.codeId
                }
            })
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
                        file: true
                    }
                });

                if(codeUpdate.file.length > 0) {
                    await tx.fileCode.deleteMany({
                        where: {
                            codeId: codeUpdate.id
                        }
                    });
                }

                return codeUpdate;
            });
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async addTestCase(payload: AddTestCaseDto): Promise<TestCase> {
        const code = await this.getDetailCode(payload);
        try {
            return await this.prismaService.testCase.create({
                data: {
                    input: payload.input,
                    output: payload.output,
                    codeId: code.id
                }
            })
        }
        catch {
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
            })
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

    async getDetailCode(payload: GetDetailCodeDto): Promise<Code & {file: FileCode[]}> {
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
                    testcase: true
                }
            });
            
            if(!code) {
                throw new NotFoundException();
            }

            return code;
        }
        catch {
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

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CodeServiceInterface } from './interfaces/code.service.interface';
import { $Enums, Code, FileCode, LabCode, TestCase, UserProgress } from '@prisma/client';
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

    async checkStatusCode(payload: CheckStatusDto): Promise<string> {
        try {
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
                // value.data.submissions.map((item) => {
                //     console.log(item.stdout.trim());
                // })
                payload.testcase.map((item, index) => {
                    if(item.output === value.data.submissions[index].stdout.trim()) {
                        countTrue++;
                    }
                });
            });

            console.log(countTrue);

            return "d";
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async handleCode(payload: HandleCodeProp): Promise<{
        language_id: string,
        source_code: string
    }[]> {
        try {
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
        }
        catch {
            throw new InternalServerErrorException();
        }
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

    async submitCode(payload: SubmitCodeDto): Promise<string> {
        const user = await this.quizService.findUserByEmail(payload.email);
        const course = await this.quizService.findCourseBySlug(payload.course_slug, user.id);
        const content = await this.prismaService.content.findFirst({
            where: {
                token: payload.content_token,
            }
        });

        if(!content) {
            throw new NotFoundException();
        }

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

        try {
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

            setTimeout(() => {
                const data: CheckStatusDto = {
                    token: token.join(","),
                    testcase: exercise.code.testcase
                }

                this.checkStatusCode(data)
            },2000);

            //await this.checkStatusCode(token.join(','));
            //console.log(response.forEach)
            //const token = response

            return "s";
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

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CodeServiceInterface } from './interfaces/code.service.interface';
import { $Enums, Code, FileCode, LanguageCode } from '@prisma/client';
import { AddQuestionCodeDto, GetDetailCodeDto, UpdateValueCodeDto, GetAllLanguageCodeDto } from './dto/code.dto';
import { PrismaService } from 'src/prisma.service';
import { QuizzService } from 'src/quizz/quizz.service';
import { AddFileNameDto } from './dto/file.dto';

@Injectable()
export class CodeService implements CodeServiceInterface {
    constructor(private readonly prismaService: PrismaService,
                private readonly quizService: QuizzService){}

    async getAllLanguageCode(payload: GetAllLanguageCodeDto): Promise<LanguageCode[]> {
        await this.quizService.findUserByEmail(payload.email);
        
        try {
            return await this.prismaService.languageCode.findMany();
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async addFileName(payload: AddFileNameDto): Promise<FileCode> {
        const code = await this.getDetailCode(payload);
        
        try {
            return await this.prismaService.fileCode.create({
                data: {
                    fileName: payload.fileName,
                    codeId: code.id
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

    async getDetailCode(payload: GetDetailCodeDto): Promise<Code> {
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

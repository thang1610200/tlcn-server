import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { QuizzServiceInterface } from './interfaces/quizz.service.interface';
import { Exercise, Prisma, Quizz } from '@prisma/client';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { QuizzResponse } from './dto/response-quizz.dto';
import { PrismaService } from 'src/prisma.service';
import { ReorderQuizzDto } from './dto/reoder-quizz.dto';

@Injectable()
export class QuizzService implements QuizzServiceInterface {
    constructor (private readonly prismaService: PrismaService) {}
    
    async findExcersie(email: string, exercise_token: string): Promise<Exercise> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if(!user) {
            throw new UnauthorizedException();
        }

        const exercise = await this.prismaService.exercise.findFirst({
            where: {
                token: exercise_token,
                instructorId: user.id
            }
        });

        if(!exercise){
            throw new NotFoundException();
        }

        return exercise;
    }

    async createQuizz(payload: CreateQuizzDto): Promise<QuizzResponse> {
        const exercise = await this.findExcersie(payload.email, payload.exercise_token);

        const lastQuizz = await this.prismaService.quizz.findFirst({
            where: {
                exerciseId: exercise.id
            },
            orderBy: {
                position: "desc"
            }
        });

        const newPosition = lastQuizz ? lastQuizz.position + 1 : 1;

        const quizz = await this.prismaService.quizz.create({
            data: {
                token: new Date().getTime().toString(),
                question: payload.question,
                position: newPosition,
                exerciseId: exercise.id
            }
        });

        return this.buildQuizzResponse(quizz);
    }

    async reorderQuizz(payload: ReorderQuizzDto): Promise<string> {
        const exercise = await this.findExcersie(payload.email, payload.exercise_token);

        for(let item of payload.list){
            await this.prismaService.quizz.update({
                where: {
                    token: item.token
                },
                data: {
                    position: item.position
                }
            })
        };

        return "Success";
    }

    buildQuizzResponse(quizz: Quizz): QuizzResponse {
        return {
            token: quizz.token,
            question: quizz.token,
            answer: quizz.answer,
            option: quizz.option,
            position: quizz.position,
            isPublished: quizz.isPublished
        }
    }
    
}

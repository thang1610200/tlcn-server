import { Exercise, Quizz } from "@prisma/client";
import { CreateQuizzDto } from "../dto/create-quizz.dto";
import { QuizzResponse } from "../dto/response-quizz.dto";
import { ReorderQuizzDto } from "../dto/reoder-quizz.dto";

export interface QuizzServiceInterface {
    reorderQuizz(payload: ReorderQuizzDto): Promise<string> 
    createQuizz(payload: CreateQuizzDto): Promise<QuizzResponse>;
    findExcersie(email: string, exercise_token: string): Promise<Exercise>;
    buildQuizzResponse(quizz: Quizz): QuizzResponse;
}
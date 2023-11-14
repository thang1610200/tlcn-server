import { Exercise, User } from "@prisma/client";
import { ExerciseResponse } from "../dto/exercise-response.dto";
import { CreateExerciseDto } from "../dto/create-exercise.dto";
import { GetAllExerciseDto } from "../dto/getall-exercise.dto";
import { GetDetailExerciseDto } from "../dto/get-detail-exercise.dto";
import { UpdateExerciseDto } from "../dto/update-exercise.dto";

export interface ExerciseServiceInterface {
    findInstructorByEmail(email: string): Promise<User>;
    findExerciseByToken(token: string, instructorId: string): Promise<Exercise>;
    getAllExercise(payload: GetAllExerciseDto): Promise<Exercise[]>;
    createExercise(payload: CreateExerciseDto): Promise<ExerciseResponse>;
    getDetailExercise(payload: GetDetailExerciseDto): Promise<Exercise>;
    updateExercise(payload: UpdateExerciseDto): Promise<ExerciseResponse>;
    builResponseExercise(payload: Exercise): ExerciseResponse;
}
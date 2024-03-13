import { Chapter, Course, Exercise, User } from '@prisma/client';
import { ExerciseResponse } from '../dto/exercise-response.dto';
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { GetAllExerciseDto } from '../dto/getall-exercise.dto';
import { GetDetailExerciseDto } from '../dto/get-detail-exercise.dto';
import { UpdateExerciseDto } from '../dto/update-exercise.dto';
import { AddExerciseLessonDto } from '../dto/add-exercise-lesson.dto';
import { UpdateStatusExerciseDto } from '../dto/update-status-exercise.dto';

export interface ExerciseServiceInterface {
    findInstructorByEmail(email: string): Promise<User>;
    getAllExercise(payload: GetAllExerciseDto): Promise<Exercise[]>;
    createExercise(payload: CreateExerciseDto): Promise<ExerciseResponse>;
    getDetailExercise(payload: GetDetailExerciseDto): Promise<Exercise>;
    updateExercise(payload: UpdateExerciseDto): Promise<ExerciseResponse>;
    updateStatusExercise(
        payload: UpdateStatusExerciseDto,
    ): Promise<ExerciseResponse>;
    addExerciseToLesson(payload: AddExerciseLessonDto): Promise<string>;
    deleteExercise(payload: GetDetailExerciseDto): Promise<string>;
    getAllExerciseOpen(payload: GetAllExerciseDto): Promise<Exercise[]>;
    builResponseExercise(payload: Exercise): ExerciseResponse;
    findChapterByToken(chapterToken: string, courseId: string): Promise<Chapter>;
    findCourseBySlug(courseSlug: string, userId: string): Promise<Course>;
    updatePositionExercises(contentId: string): Promise<string>;
}

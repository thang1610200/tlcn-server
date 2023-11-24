import { Lesson } from "@prisma/client";
import { LessonResponse } from "../dto/lesson-response.dto";
import { CreateLessonDto } from "../dto/create-lesson.dto";
import { ReorderLessonDto } from "../dto/reorder-lesson.dto";
import { GetLessonDto } from "../dto/get-lesson.dto";
import { UpdateLessonDto } from "../dto/update-lesson.dto";
import { UpdateVideoLesson } from "../dto/update-video.dto";
import { UpdateStatusLessonDto } from "../dto/update-status.dto";
import { DeleteLessonDto } from "../dto/delete-lesson.dto";
import { UpdateThumbnailVideo } from "../dto/update-thumbnail.dto";
import { ContentLessonDto } from "../dto/content-lesson.dto";

export interface LessonServiceInterface {
    buildLessonResponse (lesson: Lesson): LessonResponse;
    createLesson(payload: CreateLessonDto): Promise<LessonResponse>;
    reorderLesson(payload: ReorderLessonDto): Promise<string>;
    findLessonByToken(payload: GetLessonDto): Promise<Lesson>;
    updateValueLesson(payload: UpdateLessonDto): Promise<LessonResponse>;
    updateVideoLesson(payload: UpdateVideoLesson): Promise<LessonResponse>;
    updateStatusLesson(payload: UpdateStatusLessonDto): Promise<LessonResponse>; 
    deleteLesson(payload: DeleteLessonDto): Promise<string>;
    contentLesson(payload: ContentLessonDto): Promise<Lesson>;
    updateThumbnail(payload: UpdateThumbnailVideo): Promise<LessonResponse>;
}
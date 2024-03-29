import { Chapter, Content, Course, Lesson, Subtitle, User } from '@prisma/client';
import { LessonResponse } from '../dto/lesson-response.dto';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { ReorderLessonDto } from '../dto/reorder-lesson.dto';
import { GetLessonDto } from '../dto/get-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';
import { UpdateVideoLesson } from '../dto/update-video.dto';
import { UpdateStatusLessonDto } from '../dto/update-status.dto';
import { DeleteLessonDto } from '../dto/delete-lesson.dto';
import { UpdateThumbnailVideo } from '../dto/update-thumbnail.dto';
import { ContentLessonDto } from '../dto/content-lesson.dto';
import { AddSubtitleLessonDto, AddSubtitleLessonInterface, DeleteSubtitleLessonDto, TranslateSubtitleDto } from '../dto/subtitle.dto';

export interface LessonServiceInterface {
    buildLessonResponse(lesson: Lesson): LessonResponse;
    createLesson(payload: CreateLessonDto): Promise<Content>;
    reorderLesson(payload: ReorderLessonDto): Promise<string>;
    findLessonByToken(payload: GetLessonDto): Promise<Lesson>;
    updateValueLesson(payload: UpdateLessonDto): Promise<LessonResponse>;
    updateVideoLesson(payload: UpdateVideoLesson): Promise<LessonResponse>;
    updateStatusLesson(payload: UpdateStatusLessonDto): Promise<LessonResponse>;
    deleteLesson(payload: DeleteLessonDto): Promise<string>;
    contentLesson(payload: ContentLessonDto): Promise<Content>;
    updateThumbnail(payload: UpdateThumbnailVideo): Promise<LessonResponse>;
    findUserByEmail(email: string): Promise<User>;
    findCourseBySlug(courseSlug: string, userId: string): Promise<Course>;
    findChapterByToken(chapterToken: string, courseId: string): Promise<Chapter>;
    updatePositionLessons(contentId: string): Promise<string>;
    updatePreviewLesson(payload: UpdateStatusLessonDto): Promise<LessonResponse>;
    addSubtitleLesson(payload: AddSubtitleLessonInterface): Promise<Subtitle>;
    deleteSubtitleLesson(payload: DeleteSubtitleLessonDto): Promise<Subtitle>;
    generateSubtitleVideo(payload: AddSubtitleLessonDto): Promise<Subtitle>;
    translateSubtitle(payload: TranslateSubtitleDto):Promise<Subtitle>;
}

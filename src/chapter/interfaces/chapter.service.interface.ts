import { Chapter, Course } from '@prisma/client';
import { CreateChapterDto } from '../dto/create-chapter.dto';
import { ReorderChapterDto } from '../dto/reorder-chapter.dto';
import { FindChapterDto } from '../dto/find-chapter.dto';
import { UpdateValueChapterDto } from '../dto/update-chapter.dto';
import { ChapterResponse } from '../dto/chapter-response.dto';
import { UpdateStatusChapterDto } from '../dto/update-status.dto';
import { DeleteChapterDto } from '../dto/delete-chapter.dto';

export interface ChapterServiceInterface {
    findCourseBySlug(slug: string, email: string): Promise<Course>;
    createChapter(payload: CreateChapterDto): Promise<Chapter>;
    reorderChapter(payload: ReorderChapterDto): Promise<string>;
    findChapterByToken(payload: FindChapterDto): Promise<Chapter>;
    updateValueChapter(
        payload: UpdateValueChapterDto,
    ): Promise<ChapterResponse>;
    buidResponseChapter(chapter: Chapter): ChapterResponse;
    updateStatusChapter(
        payload: UpdateStatusChapterDto,
    ): Promise<ChapterResponse>;
    deleteChapter(payload: DeleteChapterDto): Promise<string>;
    updatePositionChapter(courseId: string, position: number): Promise<string>;
}

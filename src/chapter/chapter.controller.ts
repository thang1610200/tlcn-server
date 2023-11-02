import { Body, Controller, Delete, Get, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/course/decorators/roles.decorator';
import { RolesGuard } from 'src/course/guards/role.guard';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ChapterService } from './chapter.service';
import { ReorderChapterDto } from './dto/reorder-chapter.dto';
import { FindChapterDto } from './dto/find-chapter.dto';
import { UpdateValueChapterDto } from './dto/update-chapter.dto';
import { UpdateStatusChapterDto } from './dto/update-status.dto';
import { DeleteChapterDto } from './dto/delete-chapter.dto';

@Roles('INSTRUCTOR')
@UseGuards(JwtGuard,RolesGuard)
@Controller('chapter')
export class ChapterController {
    constructor (private readonly chapterService: ChapterService) {}

    @Post('create-chapter')
    createChapter (@Body() payload: CreateChapterDto) {
        return this.chapterService.createChapter(payload);
    }

    @Put('reorder-chapter')
    reorderChapter (@Body() payload: ReorderChapterDto) {
        return this.chapterService.reorderChapter(payload);
    }

    @Get('find-chapter')
    findChapter (@Query() payload: FindChapterDto) {
        return this.chapterService.findChapterByToken(payload);
    }

    @Patch('update-chapter')
    updateValueChapter (@Body() payload: UpdateValueChapterDto){
        return this.chapterService.updateValueChapter(payload);
    }

    @Patch('update-status')
    updateStatusChapter (@Body() payload: UpdateStatusChapterDto){
        return this.chapterService.updateStatusChapter(payload);
    }

    @Delete('delete-chapter')
    deleteChapter (@Query() payload: DeleteChapterDto) {
        return this.chapterService.deleteChapter(payload);
    }
}

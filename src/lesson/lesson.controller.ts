import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    HttpException,
    HttpStatus,
    ParseFilePipe,
    Patch,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonService } from './lesson.service';
import { Roles } from 'src/course/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/course/guards/role.guard';
import { ReorderLessonDto } from './dto/reorder-lesson.dto';
import { GetLessonDto } from './dto/get-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStatusLessonDto } from './dto/update-status.dto';
import { DeleteLessonDto } from './dto/delete-lesson.dto';
import { UpdateThumbnailVideo } from './dto/update-thumbnail.dto';
import { ContentLessonDto } from './dto/content-lesson.dto';
import { AddSubtitleLessonDto, DeleteSubtitleLessonDto } from './dto/subtitle.dto';
import { FileTypeValidationPipe } from './pipes/file-type-validation.pipe';

@Roles('INSTRUCTOR')
@UseGuards(JwtGuard, RolesGuard)
@Controller('lesson')
export class LessonController {
    constructor(private readonly lessonService: LessonService) {}

    @Post('create-lesson')
    createLesson(@Body() payload: CreateLessonDto) {
        return this.lessonService.createLesson(payload);
    }

    @Put('reorder-lesson')
    reorderLesson(@Body() payload: ReorderLessonDto) {
        return this.lessonService.reorderLesson(payload);
    }

    @Patch('update-lesson')
    updateValueLesson(@Body() payload: UpdateLessonDto) {
        return this.lessonService.updateValueLesson(payload);
    }

    @Post('generate-subtitle')
    generateSubtitle(@Body() payload: AddSubtitleLessonDto) {
        return this.lessonService.generateSubtitleVideo(payload);
    }

    @Patch('update-status')
    updateStatusLesson(@Body() payload: UpdateStatusLessonDto) {
        return this.lessonService.updateStatusLesson(payload);
    }

    @Patch('update-preview')
    updatePreviewLesson(@Body() payload: UpdateStatusLessonDto) {
        return this.lessonService.updatePreviewLesson(payload);
    }

    @Delete('delete-lesson')
    deleteLesson(@Query() payload: DeleteLessonDto) {
        return this.lessonService.deleteLesson(payload);
    }

    @Delete('delete-subtitle')
    deleteSubtitleLesson(@Query() payload: DeleteSubtitleLessonDto) {
        return this.lessonService.deleteSubtitleLesson(payload);
    }

    @UseInterceptors(FileInterceptor('file'))
    @Patch('update-video')
    async updatePictureCourse(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    // new MaxFileSizeValidator({ maxSize: 5 * 1000 }),
                    new FileTypeValidator({
                        fileType: '.(mp4|webm)', ///\.(webm|mp4|x-msvideo|mpeg|ogg)$/
                    }),
                ],
                errorHttpStatusCode: HttpStatus.BAD_REQUEST,
                exceptionFactory(error) {
                    throw new HttpException(
                        error,
                        HttpStatus.UNPROCESSABLE_ENTITY,
                    );
                },
            }),
        )
        file: Express.Multer.File,
        @Body() body: GetLessonDto,
    ) {
        const payload = {
            file,
            email: body.email,
            course_slug: body.course_slug,
            chapter_token: body.chapter_token,
            lesson_token: body.lesson_token,
        };
        return this.lessonService.updateVideoLesson(payload);
    }

    @UseInterceptors(FileInterceptor('file'))
    @Post('add-subtitle')
    async addSubtitleLesson(
        @UploadedFile(
            new FileTypeValidationPipe()
        )
        file: Express.Multer.File,
        @Body() body: AddSubtitleLessonDto,
    ) {
        const payload = {
            file,
            email: body.email,
            course_slug: body.course_slug,
            chapter_token: body.chapter_token,
            lesson_token: body.lesson_token,
            language: body.language,
            language_code: body.language_code
        };
        return this.lessonService.addSubtitleLesson(payload);
    }

    @UseInterceptors(FileInterceptor('file'))
    @Patch('update-thumbnail')
    async updateThumbnailVideo(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    // new MaxFileSizeValidator({ maxSize: 5 * 1000 }),
                    new FileTypeValidator({
                        fileType: '.(png|jpeg|jpg|webp)', ///\.(webm|mp4|x-msvideo|mpeg|ogg)$/
                    }),
                ],
                errorHttpStatusCode: HttpStatus.BAD_REQUEST,
                exceptionFactory(error) {
                    throw new HttpException(
                        error,
                        HttpStatus.UNPROCESSABLE_ENTITY,
                    );
                },
            }),
        )
        file: Express.Multer.File,
        @Body() body: UpdateThumbnailVideo,
    ) {
        const payload = {
            file,
            email: body.email,
            course_slug: body.course_slug,
            chapter_token: body.chapter_token,
            lesson_token: body.lesson_token,
        };
        return this.lessonService.updateThumbnail(payload);
    }

    @Get('get-lesson')
    getLessonByToken(@Query() payload: GetLessonDto) {
        return this.lessonService.findLessonByToken(payload);
    }
}

@Roles('LEARNER')
@UseGuards(JwtGuard, RolesGuard)
@Controller('lesson')
export class LessonControllerUser {
    constructor(private readonly lessonService: LessonService) {}
    @Get('detail-lesson')
    contentLesson(@Query() payload: ContentLessonDto) {
        return this.lessonService.contentLesson(payload);
    }
}

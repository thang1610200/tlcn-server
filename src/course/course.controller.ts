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
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Roles } from './decorators/roles.decorator';
import { CourseService } from './course.service';
import { RolesGuard } from './guards/role.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateTopicDto } from './dto/create-topic.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateValueCourse } from './dto/update-course.dto';
import { GetCourseUserDto } from './dto/get-course-user.dto';
import { GetCourseBySlugDto } from './dto/get-course-slug.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { DeleteCourseDto } from './dto/delete-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterCourseDto } from './dto/filter-course-publish.dto';
import { GetDetailCourseDto } from './dto/get-detail-course.dto';
import { GetProgressCourseDto } from './dto/get-progress-course.dto';

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Roles('ADMIN')
    @UseGuards(JwtGuard, RolesGuard)
    @Post('create-topic')
    createTopic(@Body() payload: CreateTopicDto) {
        return this.courseService.createTopic(payload);
    }

    @Roles('ADMIN')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('/admin/all-course')
    getAllCourseAdmin(){
        return this.courseService.getAllCourseAdmin();
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Post('create-course')
    createCourse(@Body() payload: CreateCourseDto) {
        return this.courseService.createCourse(payload);
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('findall-topic')
    findAllTopic() {
        return this.courseService.findAllTopic();
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Patch('update-course')
    updateCourse(@Body() payload: UpdateValueCourse) {
        return this.courseService.updateCourse(payload);
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('all-course')
    getAllCourse(@Query() payload: GetCourseUserDto) {
        return this.courseService.getAllCourse(payload);
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('course-slug')
    getCourseBySlug(@Query() payload: GetCourseBySlugDto) {
        return this.courseService.getCourseBySlug(payload);
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Patch('update-status')
    updateStatusCourse(@Body() payload: UpdateStatusDto) {
        return this.courseService.updateStatusCourse(payload);
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Delete('delete-course')
    deleteCourse(@Query() payload: DeleteCourseDto) {
        return this.courseService.deleteCourse(payload);
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('user-instructor')
    getAllUserOfInstructor(@Query() payload: GetCourseUserDto){
        return this.courseService.getAllUserOfInstructor(payload);
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('user-course')
    getAllUserOfCourse(@Query() payload: GetProgressCourseDto){
        return this.courseService.getAllUserOfCourse(payload);
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('count-course')
    countCourseOfUser(@Query() payload: GetCourseUserDto){
        return this.courseService.countCourseOfUser(payload);
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('count-user')
    countUserOfInstructor(@Query() payload: GetCourseUserDto){
        return this.courseService.countUserOfInstructor(payload);
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Patch('update-picture')
    async updatePictureCourse(
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
        @Body() body: DeleteCourseDto,
    ) {
        const payload = {
            file,
            email: body.email,
            slug: body.slug,
        };
        return this.courseService.updatePictureCourse(payload);
    }

    @Get('all-course-publish')
    getAllCoursePublish(@Query() payload: FilterCourseDto) {
        return this.courseService.getAllCoursePublish(payload);
    }

    @Get('all-topic-home')
    getAllTopicHome() {
        return this.courseService.findAllTopic();
    }

    @Get('detail-course')
    getDetailCourse(@Query() payload: GetDetailCourseDto) {
        return this.courseService.getDetailCourse(payload);
    }

    @Roles('LEARNER')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('progress-course')
    getProgressCourse(@Query() payload: GetProgressCourseDto) {
        return this.courseService.getUserProgressCourse(payload);
    }

    @Roles('LEARNER')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('detail-course-auth')
    getProgressCourseAuth(@Query() payload: GetProgressCourseDto) {
        return this.courseService.getDetailCourseAuth(payload);
    }
}

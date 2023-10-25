import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Roles } from './decorators/roles.decorator';
import { CourseService } from './course.service';
import { RolesGuard } from './guards/role.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateTopicDto } from './dto/create-topic.dto';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Roles('ADMIN')
    @UseGuards(JwtGuard,RolesGuard)
    @Post('create-topic')
    createTopic(@Body() payload: CreateTopicDto) {
        return this.courseService.createTopic(payload);
    }

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard,RolesGuard)
    @Post('create-course')
    createCourse (@Body() payload: CreateCourseDto) {
        return this.courseService.createCourse(payload);
    }
}

import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/course/decorators/roles.decorator';
import { RolesGuard } from 'src/course/guards/role.guard';
import { UserProgressService } from './user-progress.service';
import { GetUserProgressDto } from './dto/get-user-progress.dto';
import { AddUserProgressDto } from './dto/add-user-progress.dto';
import { AddAnswerUserProgressDto } from './dto/add-answer-progress-quiz.dto';
import { GetUserProgressQuizDto } from './dto/get-user-progress-quiz.dto';

@Roles('LEARNER')
@UseGuards(JwtGuard,RolesGuard)
@Controller('user-progress')
export class UserProgressController {
    constructor (private readonly userProgressService: UserProgressService) {}

    @Get('get-user-progress')
    getUserProgress(@Query() payload: GetUserProgressDto){
        return this.userProgressService.getUserProgress(payload);
    }

    @Get('get-progress-quiz')
    getUserProgressQuiz(@Query() payload: GetUserProgressQuizDto){
        return this.userProgressService.getUserProgressQuiz(payload);
    }

    @Delete('delete-progress-quiz')
    deleteUserProgressQuiz(@Query() payload: GetUserProgressQuizDto){
        return this.userProgressService.deleteAllProgressQuiz(payload);
    }

    @Put('add-user-progress')
    addUserProgress(@Body() payload: AddUserProgressDto){
        return this.userProgressService.addUserProgress(payload);
    }

    @Post('add-answer-quiz')
    addAnswerQuiz(@Body() payload: AddAnswerUserProgressDto){
        return this.userProgressService.addAnswerProgressQuiz(payload);
    }
}

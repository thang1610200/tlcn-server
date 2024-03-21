import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/course/decorators/roles.decorator';
import { RolesGuard } from 'src/course/guards/role.guard';
import { UserProgressService } from './user-progress.service';
import { AddAnswerUserProgressDto, AddUserProgressDto, CompleteLessonDto, RetakeQuizDto } from './dto/user-progress.dto';

@Roles('LEARNER')
@UseGuards(JwtGuard, RolesGuard)
@Controller('user-progress')
export class UserProgressController {
    constructor(private readonly userProgressService: UserProgressService) {}

    // @Get('get-user-progress-quiz')
    // getUserProgressQuiz(@Query() payload: GetUserProgressQuizDto) {
    //     return this.userProgressService.getUserProgressQuiz(payload);
    // }

    // @Get('get-progress-quiz')
    // getUserProgressQuiz(@Query() payload: GetUserProgressQuizDto) {
    //     return this.userProgressService.getUserProgressQuiz(payload);
    // }

    // @Delete('delete-progress-quiz')
    // deleteUserProgressQuiz(@Query() payload: GetUserProgressQuizDto) {
    //     return this.userProgressService.deleteAllProgressQuiz(payload);
    // }

    @Delete('retake-quiz')
    retakeQuiz(@Query() query: RetakeQuizDto) {
        return this.userProgressService.retakeQuiz(query);
    }

    @Post('add-user-progress')
    addUserProgress(@Body() payload: AddUserProgressDto) {
        return this.userProgressService.addUserProgress(payload);
    }

    @Post('add-answer-quiz')
    addAnswerQuiz(@Body() payload: AddAnswerUserProgressDto) {
        return this.userProgressService.addAnswerProgressQuiz(payload);
    }

    // @Post('add-pass-user')
    // updateProgressExercise(@Body() payload: UpdateProgressExerciseDto) {
    //     return this.userProgressService.updatePrgressExerciseUser(payload);
    // }

    @Patch('complete-lesson')
    addUserProgressNext(@Body() payload: CompleteLessonDto) {
        return this.userProgressService.completeLesson(payload);
    }
}

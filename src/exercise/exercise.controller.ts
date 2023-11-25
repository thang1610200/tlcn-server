import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { Roles } from 'src/course/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/course/guards/role.guard';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { GetAllExerciseDto } from './dto/getall-exercise.dto';
import { GetDetailExerciseDto } from './dto/get-detail-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { AddExerciseLessonDto } from './dto/add-exercise-lesson.dto';
import { UpdateStatusExerciseDto } from './dto/update-status-exercise.dto';

@Roles('INSTRUCTOR')
@UseGuards(JwtGuard, RolesGuard)
@Controller('exercise')
export class ExerciseController {
    constructor(private readonly exerciseSerive: ExerciseService) {}

    @Post('create-exercise')
    createExercise(@Body() payload: CreateExerciseDto) {
        return this.exerciseSerive.createExercise(payload);
    }

    @Get('get-exercise')
    getAllExercise(@Query() payload: GetAllExerciseDto) {
        return this.exerciseSerive.getAllExercise(payload);
    }

    @Get('all-exercise')
    getAllExerciseOpen(@Query() payload: GetAllExerciseDto) {
        return this.exerciseSerive.getAllExerciseOpen(payload);
    }

    @Get('detail-exercise')
    getDetailExercise(@Query() payload: GetDetailExerciseDto) {
        return this.exerciseSerive.getDetailExercise(payload);
    }

    @Patch('update-exercise')
    updateExercise(@Body() payload: UpdateExerciseDto) {
        return this.exerciseSerive.updateExercise(payload);
    }

    @Patch('status-exercise')
    updateStatusExercise(@Body() payload: UpdateStatusExerciseDto) {
        return this.exerciseSerive.updateStatusExercise(payload);
    }

    @Patch('add-lesson')
    addExerciseLesson(@Body() payload: AddExerciseLessonDto) {
        return this.exerciseSerive.addExerciseToLesson(payload);
    }

    @Delete('delete-exercise')
    deleteExercise(@Query() payload: GetDetailExerciseDto) {
        return this.exerciseSerive.deleteExercise(payload);
    }
}

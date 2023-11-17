import { Controller, Post, Body, UseGuards, Put, Get, Query, Patch, Delete } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { Roles } from 'src/course/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/course/guards/role.guard';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { ReorderQuizzDto } from './dto/reoder-quizz.dto';
import { DetailQuizzDto } from './dto/detail-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';
import { UpdateStatusQuizzDto } from './dto/update-status-quizz.dto';

@Roles('INSTRUCTOR')
@UseGuards(JwtGuard,RolesGuard)
@Controller('quizz')
export class QuizzController {
    constructor (private readonly quizzService: QuizzService) {}

    @Post('create-quizz')
    createQuizz(@Body() payload: CreateQuizzDto) {
        return this.quizzService.createQuizz(payload);
    }

    @Put('reorder-quizz')
    reorderChapter (@Body() payload: ReorderQuizzDto) {
        return this.quizzService.reorderQuizz(payload);
    }

    @Get('detail-quizz')
    getDetailQuizz (@Query() payload: DetailQuizzDto){
        return this.quizzService.getDetailQuizz(payload);
    }

    @Patch('update-quizz')
    updateQuizz (@Body() payload: UpdateQuizzDto){
        return this.quizzService.updateValueQuizz(payload);
    }

    @Patch('update-status')
    updateStatusQuizz (@Body() payload: UpdateStatusQuizzDto){
        return this.quizzService.updateStatusQuizz(payload);
    }

    @Delete('delete-quizz')
    deleteQuizz (@Query() payload: DetailQuizzDto){
        return this.quizzService.deleteQuizz(payload);
    }
}

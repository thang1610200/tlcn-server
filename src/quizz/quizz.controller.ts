import { Controller, Post, Body, UseGuards, Put } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { Roles } from 'src/course/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/course/guards/role.guard';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { ReorderQuizzDto } from './dto/reoder-quizz.dto';

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
}

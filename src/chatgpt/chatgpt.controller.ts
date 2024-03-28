import { Controller, Get, Query, Post, Body, UseGuards } from '@nestjs/common';
import { CreateListQuizzDto } from './dto/create-list-quizz.dto';
import { ChatgptService } from './chatgpt.service';
import { Roles } from 'src/course/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/course/guards/role.guard';

@Roles('INSTRUCTOR')
@UseGuards(JwtGuard, RolesGuard)
@Controller('chatgpt')
export class ChatgptController {
    constructor(private readonly chatgptService: ChatgptService) {}

    @Post('quizz-list')
    createQuizzList(@Body() payload: CreateListQuizzDto) {
        return this.chatgptService.createQuizzList(payload);
    }
}

@Controller('test')
export class ChatgptControllers {
    constructor(private readonly chatgptService: ChatgptService) {}

    @Post('tran')
    createQuizzLists(@Body() payload: any) {
        return this.chatgptService.translateSubtitle(payload);
    }
}

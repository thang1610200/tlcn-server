import { Controller, Get, Query, Post, Body, UseGuards } from '@nestjs/common';
import { CreateListQuizzDto } from './dto/create-list-quizz.dto';
import { ChatgptService } from './chatgpt.service';
import { Roles } from 'src/course/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/course/guards/role.guard';
import { ChatbotUserDto, SummaryCourseDto } from './dto/chatbot-user.dto';

@Controller('chatgpt')
export class ChatgptController {
    constructor(private readonly chatgptService: ChatgptService) {}

    @Roles('INSTRUCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Post('quizz-list')
    createQuizzList(@Body() payload: CreateListQuizzDto) {
        return this.chatgptService.createQuizzList(payload);
    }

    @Post('chatbot-user')
    chatbotUser(@Body() payload: ChatbotUserDto) {
        return this.chatgptService.chatbotUser(payload);
    }

    @Get('summary-course')
    summaryCourse(@Query() query: SummaryCourseDto){
        return this.chatgptService.getSummaryCourse(query);
    }
}

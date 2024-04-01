import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CodeService } from './code.service';
import { AddQuestionCodeDto, GetDetailCodeDto, UpdateValueCodeDto, GetAllLanguageCodeDto } from './dto/code.dto';
import { Roles } from 'src/course/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/course/guards/role.guard';
import { AddFileNameDto, UpdateContentFileDto } from './dto/file.dto';

@Roles('INSTRUCTOR')
@UseGuards(JwtGuard, RolesGuard)
@Controller('code')
export class CodeController {
    constructor (private readonly codeSerivce: CodeService) {}

    @Get('language-code')
    getAllLanguageCode(@Query() query: GetAllLanguageCodeDto) {
        return this.codeSerivce.getAllLanguageCode(query);
    }

    @Post('add-question')
    addQuestionCode(@Body() body: AddQuestionCodeDto) {
        return this.codeSerivce.addQuestionCode(body);
    }

    @Post('add-file-code')
    addFileCode(@Body() body: AddFileNameDto) {
        return this.codeSerivce.addFileName(body);
    }

    @Get('detail-code')
    getDetailCode(@Query() query: GetDetailCodeDto) {
        return this.codeSerivce.getDetailCode(query);
    }

    @Patch('update-code')
    updateValueCode(@Body() body: UpdateValueCodeDto) {
        return this.codeSerivce.updateValueCode(body);
    }

    @Patch('update-file-code')
    updateContentFileCode(@Body() body: UpdateContentFileDto) {
        return this.codeSerivce.updateContentFile(body);
    }
}

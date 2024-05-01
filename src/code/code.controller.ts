import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CodeService } from './code.service';
import { AddQuestionCodeDto, GetDetailCodeDto, UpdateValueCodeDto, GetAllLanguageCodeDto, SubmitCodeDto } from './dto/code.dto';
import { Roles } from 'src/course/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/course/guards/role.guard';
import { AddFileNameDto, AddFileTestDto, DeleteFileDto, UpdateContentFileDto } from './dto/file.dto';

@Roles('INSTRUCTOR')
@UseGuards(JwtGuard, RolesGuard)
@Controller('code')
export class CodeController {
    constructor (private readonly codeService: CodeService) {}

    @Get('language-code')
    getAllLanguageCode(@Query() query: GetAllLanguageCodeDto) {
        return this.codeService.getAllLanguageCode(query);
    }

    @Post('add-question')
    addQuestionCode(@Body() body: AddQuestionCodeDto) {
        return this.codeService.addQuestionCode(body);
    }

    @Post('add-file-code')
    addFileCode(@Body() body: AddFileNameDto) {
        return this.codeService.addFileName(body);
    }

    @Post('add-file-test')
    addFileTest(@Body() body: AddFileTestDto) {
        return this.codeService.addFileTest(body);
    }

    @Get('detail-code')
    getDetailCode(@Query() query: GetDetailCodeDto) {
        return this.codeService.getDetailCode(query);
    }

    @Patch('update-code')
    updateValueCode(@Body() body: UpdateValueCodeDto) {
        return this.codeService.updateValueCode(body);
    }

    @Patch('update-lab-code')
    updateLabCode(@Body() body: UpdateValueCodeDto) {
        return this.codeService.updateLabCode(body);
    }

    @Patch('update-file-code')
    updateContentFileCode(@Body() body: UpdateContentFileDto) {
        return this.codeService.updateContentFile(body);
    }

    @Patch('update-file-test')
    updateContentFileTest(@Body() body: UpdateContentFileDto) {
        return this.codeService.updateContentTestFile(body);
    }

    @Delete('delete-file')
    deleteFile(@Query() query: DeleteFileDto) {
        return this.codeService.deleteFile(query);
    }
}

@Roles('LEARNER')
@UseGuards(JwtGuard, RolesGuard)
@Controller('code')
export class CodeControllerUser {
    constructor(private readonly codeService: CodeService) {}
    @Post('submit-code')
    submitCode(@Body() body: SubmitCodeDto) {
        return this.codeService.submitCode(body);
    }
}

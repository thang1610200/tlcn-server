import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CodeService } from './code.service';
import { AddQuestionCodeDto, GetDetailCodeDto, UpdateValueCodeDto, GetAllLanguageCodeDto, SubmitCodeDto } from './dto/code.dto';
import { Roles } from 'src/course/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/course/guards/role.guard';
import { AddFileNameDto, UpdateContentFileDto } from './dto/file.dto';
import { AddTestCaseDto, DeleteTestCaseDto } from './dto/test-case.dto';

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

    @Post('add-test-case')
    addTestCase(@Body() body: AddTestCaseDto) {
        return this.codeService.addTestCase(body);
    }

    @Delete('delete-testcase')
    deleteTestCase(@Query() query: DeleteTestCaseDto) {
        return this.codeService.deleteTestCase(query);
    }

    @Patch('update-function-name')
    updateFunctionName(@Body() body: UpdateContentFileDto) {
        return this.codeService.updateFunctioName(body);
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

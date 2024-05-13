import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EvaluateService } from './evaluate.service';
import { PreviewCodeDto } from './dto/evaluate.dto';
import { Roles } from 'src/course/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/course/guards/role.guard';

@Roles('INSTRUCTOR')
@UseGuards(JwtGuard, RolesGuard)
@Controller('evaluate')
export class EvaluateController {
    constructor (private readonly evaluateService: EvaluateService) {}

    @Post('/preview')
    evaluateCode(@Body() body: PreviewCodeDto) {
        return this.evaluateService.previewCode(body);
    }
}

@Controller('evaluate')
export class EvaluatesController {
    constructor (private readonly evaluateService: EvaluateService) {}

    @Get('/test')
    evaluateCode() {
        return this.evaluateService.test();
    }
}
import {
    Body,
    Controller,
    FileTypeValidator,
    Get,
    HttpException,
    HttpStatus,
    ParseFilePipe,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { RegisterInstructorService } from './register-instructor.service';
import { Roles } from 'src/course/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/course/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddRegisterInstructorDto } from './dto/add-register-instructor.dto';
import { DetailRegisterInstructorDto } from './dto/detail-register-instructor.dto';
import { UpdateStatusRegisterInstructorDto } from './dto/update-status.dto';

@Roles('LEARNER')
@UseGuards(JwtGuard, RolesGuard)
@Controller('register-instructor')
export class RegisterInstructorController {
    constructor(
        private readonly registerInstructorService: RegisterInstructorService,
    ) {}

    @UseInterceptors(FileInterceptor('file'))
    @Post('create')
    createRegisterInstructor(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({
                        fileType: '.(png|jpeg|jpg|webp)',
                    }),
                ],
                errorHttpStatusCode: HttpStatus.BAD_REQUEST,
                exceptionFactory(error) {
                    throw new HttpException(
                        error,
                        HttpStatus.UNPROCESSABLE_ENTITY,
                    );
                },
            }),
        )
        file: Express.Multer.File,
        @Body() body: AddRegisterInstructorDto,
    ) {
        const payload = {
            email: body.email,
            file
        };

        return this.registerInstructorService.addRegisterInstructor(payload);
    }

    @Get('find')
    findRegisterInstructor(@Query() payload: AddRegisterInstructorDto) {
        return this.registerInstructorService.findRegisterInstructor(payload);
    }
}

@Roles('ADMIN')
@UseGuards(JwtGuard, RolesGuard)
@Controller('register-instructor')
export class RegisterInstructorAdminController {
    constructor(
        private readonly registerInstructorService: RegisterInstructorService,
    ) {}
    
    @Get('getall')
    getAll() {
        return this.registerInstructorService.findAll();
    }

    @Get('detail')
    detail(@Query() payload: DetailRegisterInstructorDto) {
        return this.registerInstructorService.detail(payload);
    }

    @Patch('update-status')
    updateStatus(@Body() payload: UpdateStatusRegisterInstructorDto) {
        return this.registerInstructorService.updateStatus(payload);
    }
}

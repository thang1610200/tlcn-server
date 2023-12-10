import {
    Body,
    Controller,
    Delete,
    HttpException,
    HttpStatus,
    ParseFilePipe,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    FileInterceptor,
} from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/course/decorators/roles.decorator';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { AttachmentService } from './attachment.service';
import { DeleteAttachmentDto } from './dto/delete-attachment.dto';

@Roles('INSTRUCTOR')
@UseGuards(JwtGuard)
@Controller('attachment')
export class AttachmentController {
    constructor(private readonly attachmentService: AttachmentService) {}

    @Post('upload-file')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @UploadedFile(
            new ParseFilePipe({
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
        @Body() body: CreateAttachmentDto,
    ) {
        const payload = {
            file,
            email: body.email,
            lesson_token: body.lesson_token,
        };
        return this.attachmentService.uploadFile(payload);
    }

    @Delete('delete-attach')
    deleteAttachment(@Query() payload: DeleteAttachmentDto){
        return this.attachmentService.deleteAttachment(payload);
    }
}

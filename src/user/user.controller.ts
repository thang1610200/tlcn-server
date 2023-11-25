import {
    Controller,
    Get,
    UseGuards,
    Body,
    Request,
    Patch,
    UseInterceptors,
    UploadedFile,
    HttpException,
    HttpStatus,
    ParseFilePipe,
    FileTypeValidator,
} from '@nestjs/common';
import { Profile } from './dtos/profile-user.dto';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateProfile } from './dtos/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAvatarRequestDto } from './dtos/update-avatar-request.dto';
import { Roles } from 'src/course/decorators/roles.decorator';
import { RolesGuard } from 'src/course/guards/role.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtGuard)
    @Get('profile')
    async getProfileUser(@Request() req) {
        const payload: Profile = {
            email: req['user'].email,
        };
        return this.userService.getProfileByEmail(payload);
    }

    @UseGuards(JwtGuard)
    @Patch('profile')
    async updateProfileUser(@Body() payload: UpdateProfile) {
        return this.userService.updateProfile(payload);
    }

    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Patch('update-avatar')
    async updateAvatarUser(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    // new MaxFileSizeValidator({ maxSize: 5 * 1000 }),
                    new FileTypeValidator({
                        fileType: '.(png|jpeg|jpg|webp)', ///\.(webm|mp4|x-msvideo|mpeg|ogg)$/
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
        @Body() body: UpdateAvatarRequestDto,
    ) {
        const payload = {
            file,
            email: body.email,
        };
        return this.userService.updateAvatar(payload);
    }

    @Roles('LEARNER')
    @UseGuards(JwtGuard, RolesGuard)
    @Patch('register-instructer')
    async registerInstructor(@Body() payload: Profile) {
        return this.userService.registerInstructor(payload);
    }
}

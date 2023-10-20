import { Controller, Get, UseGuards, Body, Request, Patch, UseInterceptors, UploadedFile, HttpException, HttpStatus, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { Profile } from './dtos/profile-user.dto';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ProfileResponse } from './dtos/profile-user-response.dto';
import { UpdateProfile } from './dtos/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAvatarDto } from './dtos/update-avatar.dto';
import { UpdateAvatarRequestDto } from './dtos/update-avatar-request.dto';

@Controller('user')
export class UserController {
    constructor (private readonly userService: UserService) {}

    @UseGuards(JwtGuard)
    @Get('profile')
    async getProfileUser(@Request() req){
        const payload: Profile = {
            email: req['user'].email
        }
        return this.userService.getProfileByEmail(payload);
    }

    @UseGuards(JwtGuard)
    @Patch('profile')
    async updateProfileUser(@Body() payload: UpdateProfile){
        return this.userService.updateProfile(payload);
    }

    //@UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Patch('update-avatar')
    async updateAvatarUser(@UploadedFile(
        new ParseFilePipe({
            validators: [
                // new MaxFileSizeValidator({ maxSize: 5 * 1000 }),
                // new FileTypeValidator({
                //     fileType: '.(png|jpeg|jpg)' ///\.(webm|mp4|x-msvideo|mpeg|ogg)$/ 
                // })
            ],
            errorHttpStatusCode: HttpStatus.BAD_REQUEST,
            exceptionFactory(error) {
                throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
            },
        })
    ) file: Express.Multer.File,  @Body() body: UpdateAvatarRequestDto){
        const payload = {
            file,
            email: body.email
        }
        return this.userService.updateAvatar(payload);
    }
}

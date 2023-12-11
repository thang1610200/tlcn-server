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
    Query,
    Post,
    Delete,
    Put,
} from '@nestjs/common';
import { Profile } from './dtos/profile-user.dto';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateProfile } from './dtos/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAvatarRequestDto } from './dtos/update-avatar-request.dto';
import { Roles } from 'src/course/decorators/roles.decorator';
import { RolesGuard } from 'src/course/guards/role.guard';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { SetPasswordDto } from './dtos/set-password.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtGuard)
    @Get('profile')
    getProfileUser(@Request() req) {
        const payload: Profile = {
            email: req['user'].email,
        };
    
        return this.userService.getProfileByEmail(payload);
    }

    @UseGuards(JwtGuard)
    @Patch('profile')
    updateProfileUser(@Body() payload: UpdateProfile) {
        return this.userService.updateProfile(payload);
    }

    @UseGuards(JwtGuard)
    @Patch('set-password')
    setPasswordUser(@Body() payload: SetPasswordDto) {
        return this.userService.setPassword(payload);
    }

    @UseGuards(JwtGuard)
    @Patch('update-password')
    updatePasswordUser(@Body() payload: UpdatePasswordDto) {
        return this.userService.updatePassword(payload);
    }

    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Patch('update-avatar')
    updateAvatarUser(
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
    registerInstructor(@Body() payload: Profile) {
        return this.userService.registerInstructor(payload);
    }
}


@Roles('ADMIN')
@UseGuards(JwtGuard, RolesGuard)
@Controller('user')
export class UserAdminController {
    constructor(private readonly userService: UserService) {}

    @Get('all-user')
    getAllUser() {
        return this.userService.getAllUser();
    }

    @Get('detail-user')
    detailUsesr(@Query() payload: Profile) {
        return this.userService.getProfileByEmail(payload);
    }

    @Put('update-role')
    updateRole(@Body() payload: UpdateRoleDto){
        return this.userService.updateRole(payload);
    }

    @Delete('delete-user')
    deleteUser(@Query() payload: Profile){
        return this.userService.deleteUser(payload);
    }
}

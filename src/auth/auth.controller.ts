import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Req,
    Query,
    Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto } from './dtos/new-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { LoginSocialDto } from './dtos/login-social.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { VerifyResetPasswordDto } from './dtos/verify-reset-password.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { LoginAdminDto } from './dtos/login-admin-dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() newUser: NewUserDto) {
        return this.authService.register(newUser);
    }

    @Post('login')
    login(@Body() dto: LoginUserDto) {
        return this.authService.login(dto);
    }

    @Post('login-admin')
    loginAdmin(@Body() dto: LoginAdminDto){
        return this.authService.loginAdmin(dto);
    }

    @Post('login/social')
    loginSocial(@Body() dto: LoginSocialDto) {
        return this.authService.loginSocial(dto);
    }

    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }

    @Get('reset-password/click')
    verifyTokenResetPassword(@Query() dto: VerifyResetPasswordDto) {
        return this.authService.verifyTokenResetPassword(dto);
    }

    @Patch('update-password')
    updatePassword(@Body() dto: UpdatePasswordDto) {
        return this.authService.updatePassword(dto);
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    refresh(@Req() req: any) {
        return this.authService.refreshToken(req.user);
    }
}

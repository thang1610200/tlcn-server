import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto } from './dtos/new-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { UserResponse } from './dtos/new-user-response.dto';
import { LoginSocialDto } from './dtos/login-social.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    async register(@Body() newUser: NewUserDto){
        return this.authService.register(newUser);
    }

    @Post('login')
    async login(@Body() dto: LoginUserDto){
        return this.authService.login(dto);
    }

    @Post('login/social')
    async loginSocial(@Body() dto: LoginSocialDto){
        return this.authService.loginSocial(dto);
    }

    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto){
        return this.authService.resetPassword(dto);
    }

    @UseGuards(JwtGuard)
    @Get()
    async test(){
        return "cc";
    }

    @UseGuards(RefreshJwtGuard)
    @Post("refresh")
    async refresh(@Req() req){
        return this.authService.refreshToken(req.user);
    }

}

import { Controller, Get, UseGuards, Body, Request, Patch } from '@nestjs/common';
import { Profile } from './dtos/profile-user.dto';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ProfileResponse } from './dtos/profile-user-response.dto';
import { UpdateProfile } from './dtos/update-profile.dto';

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
}

import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './response/profile-response.interface';
import { CurrentUser } from 'src/auth/decerators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) { }

    //GET BY USERNAME
    @Get("/:username")
    async getByUsername(@Param("username") username: string): Promise<ProfileResponseInterface[]> {
        return await this.profileService.getByUsername(username);
    }


    //FOLLOW PROFILE
    @Post("/:username/follow")
    @UseGuards(AuthGuard("jwt"))
    async followProfile(
        @Param("username") username: string,
        @CurrentUser() currentUser: User
    ): Promise<ProfileResponseInterface> {
        return await this.profileService.followProfile(username, currentUser);
    }
}

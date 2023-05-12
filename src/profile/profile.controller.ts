import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
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
    @UseGuards(AuthGuard("jwt"))
    async getByUsername(
        @Param("username") username: string,
        @CurrentUser() currentUser: User
    ): Promise<ProfileResponseInterface> {
        return await this.profileService.getByUsername(username, currentUser);
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

    //UNFOLLOW PROFILE
    @Delete("/:username/follow")
    @UseGuards(AuthGuard("jwt"))
    async unFollowProfile(
        @Param("username") username: string,
        @CurrentUser() currentUser: User
    ): Promise<ProfileResponseInterface> {
        return await this.profileService.unFollowProfile(username, currentUser);
    }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './response/profile-response.interface';

@Controller('profile')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) { }

    @Get("/:username")
    async getByUsername(@Param("username") username: string): Promise<ProfileResponseInterface[]> {
        return await this.profileService.getByUsername(username);
    }
}

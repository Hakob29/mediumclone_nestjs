import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './response/user-response';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    //CREATE USER
    @Post("/create")
    async createUser(
        @Body() dto: CreateUserDto
    ): Promise<UserResponse> {
        return this.userService.createUser(dto);
    }


    //GET ALL USERS
    @Get("/all")
    async getUsers(): Promise<UserResponse[]> {
        return await this.userService.getUsers();
    }

}

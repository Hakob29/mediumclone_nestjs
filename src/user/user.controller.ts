import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './response/user-response.interface';
import { SignInDto } from './dto/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtTokenResponseInterface } from './response/jwt-response.interface';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    //CREATE USER
    @Post("/create")
    async createUser(
        @Body() dto: CreateUserDto
    ): Promise<UserResponseInterface> {
        return this.userService.createUser(dto);
    }


    //SIGNIN
    @HttpCode(200)
    @Post("/signin")
    async signIn(
        @Body() dto: SignInDto
    ): Promise<JwtTokenResponseInterface> {
        return await this.authService.signIn(dto);
    }

    //GET ALL USERS
    @Get("/all")
    async getUsers(): Promise<UserResponseInterface[]> {
        return await this.userService.getUsers();
    }

}

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './response/user-response.interface';
import { SignInDto } from './dto/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtTokenResponseInterface } from './response/jwt-response.interface';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { BackendValidationPipe } from 'src/shared/backend-validation.pipe';

@Controller('user')
@UsePipes(new BackendValidationPipe())
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
    @UsePipes(new BackendValidationPipe())
    async signIn(
        @Body() dto: SignInDto
    ): Promise<JwtTokenResponseInterface> {
        return await this.authService.signIn(dto);
    }

    //GET ALL USERS
    @UseGuards(AuthGuard("jwt"))
    @Get("/all")
    async getUsers(): Promise<UserResponseInterface[]> {
        return await this.userService.getUsers();
    }


    //UPDATE USER
    @UseGuards(AuthGuard("jwt"))
    @Put("/update/:id")
    async updateUser(
        @Param("id") id: number,
        @Body() dto: UpdateUserDto
    ): Promise<UserResponseInterface> {
        return await this.userService.updateUser(id, dto);
    }

    //DELETE USER
    @UseGuards(AuthGuard("jwt"))
    @Delete("/delete/:id")
    async deleteUser(@Param("id") id: number): Promise<string> {
        return await this.userService.deleteUser(id);
    }

}

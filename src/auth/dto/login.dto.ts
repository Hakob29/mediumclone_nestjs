
import { IsEmail, IsString, Length } from "class-validator"


export class SignInDto {
    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @Length(4, 12)
    password: string
}
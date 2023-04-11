import { IsEmail, IsOptional, IsString, Length, Max, Min, ValidateIf } from "class-validator"

export class UpdateUserDto {
    @IsString()
    readonly username: string

    @IsString()
    @IsEmail()
    readonly email: string
    @IsString()
    @Length(4, 12)
    readonly password: string

    @IsOptional()
    @IsString()
    readonly bio: string

    @IsOptional()
    @IsString()
    readonly image: string
}
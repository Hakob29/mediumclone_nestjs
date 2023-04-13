import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator"


export class UpdateArticleDto {
    @IsString()
    title: string

    @IsString()
    description: string

    @IsString()
    body: string

    @IsArray()
    tagList: string[]

    @IsBoolean()
    favorited: boolean

    @IsNumber()
    favoritesCount: number
}
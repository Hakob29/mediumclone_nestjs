import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { CurrentUser } from 'src/auth/decerators/current-user.decorator';
import { ArticleResponseInterface } from './response/article-response.interface';
import { Article } from './article.entity';



@Controller('article')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService
    ) { }

    //CREATE NEW ARTICLE
    @UseGuards(AuthGuard("jwt"))
    @Post("/create")
    async create(
        @Body() dto: CreateArticleDto,
        @CurrentUser() user: User
    ): Promise<ArticleResponseInterface> {
        return await this.articleService.create(dto, user)
    }

    //GET ALL ARTICLES
    @UseGuards(AuthGuard("jwt"))
    @Get("/all")
    async getAll(): Promise<Article[]> {
        return await this.articleService.getAll();
    }
}

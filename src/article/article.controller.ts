import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { CurrentUser } from 'src/auth/decerators/current-user.decorator';
import { ArticleResponseInterface } from './response/article-response.interface';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesResponseInterface } from './response/articles-response.interface';
import { Article } from './article.entity';
import { query } from 'express';
import { BackendValidationPipe } from 'src/shared/backend-validation.pipe';



@Controller('article')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService
    ) { }

    //CREATE NEW ARTICLE
    @UseGuards(AuthGuard("jwt"))
    @UsePipes(new BackendValidationPipe())
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
    async getAll(
        @CurrentUser() user: User | null,
        @Query() query: any
    ): Promise<ArticlesResponseInterface> {
        return await this.articleService.getAll(user, query);
    }


    //GET ARTIICLES FEED
    @UseGuards(AuthGuard("jwt"))
    @Get("/feed")
    async getArticlesFeed(
        @CurrentUser() currentUser: User,
        @Query() query: any
    ): Promise<ArticlesResponseInterface> {
        return await this.articleService.getArticlesFeed(currentUser, query);
    }

    //GET ARTICLE BY SLUG
    @UseGuards(AuthGuard("jwt"))
    @Get("/:slug")
    async getArticle(
        @Param("slug") slug: string
    ): Promise<ArticleResponseInterface> {
        return await this.articleService.getArticle(slug);
    }



    //UPDATE ARTICLE
    @UseGuards(AuthGuard("jwt"))
    @UsePipes(new BackendValidationPipe())
    @Put("/update/:slug")
    async updateArticle(
        @Param("slug") slug: string,
        @Body() dto: UpdateArticleDto,
        @CurrentUser() user: User
    ): Promise<ArticleResponseInterface> {
        return await this.articleService.updateArticle(slug, dto, user);
    }


    //DELETE ARTICE BY SLUG
    @UseGuards(AuthGuard("jwt"))
    @Delete("/:slug")
    async deleteArticle(
        @Param("slug") slug: string,
        @CurrentUser() user: User
    ): Promise<String> {
        return await this.articleService.deleteArticle(slug, user);
    }

    //ADD ARTICLE TO FAVORITES
    @UseGuards(AuthGuard("jwt"))
    @Post("/:slug/favorite")
    async addArticleToFavorites(
        @Param("slug") slug: string,
        @CurrentUser() currentUser: User
    ): Promise<Article> {
        return await this.articleService.addArticleToFavorites(slug, currentUser)
    }

    //DISLIKE ARTICLE TO FAVORITES
    @UseGuards(AuthGuard("jwt"))
    @Delete("/:slug/favorite")
    async deleteArticleFromFavorites(
        @Param("slug") slug: string,
        @CurrentUser() currentUser: User
    ): Promise<Article> {
        return await this.articleService.deleteArticleFromFavorites(slug, currentUser)
    }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { ArticleResponseInterface } from './response/article-response.interface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepo: Repository<Article>
    ) { }


    //CREATE NEW ARTICLE
    async create(dto: CreateArticleDto, user: User): Promise<ArticleResponseInterface> {
        try {
            const article = await this.articleRepo.create({
                ...dto,
                slug: slugify(dto.title, { lower: true }) + "-" + (Math.random() * Math.pow(36, 6) | 0).toString(36),
                author: user["sub"]
            })
            await this.articleRepo.save(article);
            return {
                article: {
                    slug: article.slug,
                    title: article.title,
                    description: article.description,
                    body: article.body,
                    tagList: article.tagList,
                    favorited: article.favorited,
                    favoritesCount: article.favoritesCount
                }
            }
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    //GET ALL ARTICLES
    async getAll(): Promise<Article[]> {
        try {
            return await this.articleRepo.find({ relations: ["author"] })
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { ArticleResponseInterface } from './response/article-response.interface';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/update-article.dto';

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



    //GET ARTICLE BY SLUG
    async getArticle(slug: string): Promise<ArticleResponseInterface> {
        try {

            const article = await this.articleRepo.findOne({ where: { slug: slug } });
            if (!article) throw new HttpException("Article Not Found!!!", HttpStatus.NOT_FOUND);
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

    //UPDATE ARTICLE 
    async updateArticle(slug: string, dto: UpdateArticleDto, user: User): Promise<ArticleResponseInterface> {
        try {
            const article = await this.articleRepo.findOne({ where: { slug: slug }, relations: ["author"] });
            if (!article) throw new HttpException("Article with this slug Not Found!!!", HttpStatus.NOT_FOUND);
            if (!(user["sub"] === article.author["id"])) throw new HttpException("YOU CAN'T UPDATE THIS ARTICLE!!!", HttpStatus.BAD_REQUEST);
            await this.articleRepo.update(article.id, {
                ...dto,
                slug: slugify(dto.title, { lower: true }) + "-" + (Math.random() * Math.pow(36, 6) | 0).toString(36),
            });
            const newArticle = await this.articleRepo.findOne({ where: { id: article.id } });
            return {
                article: {
                    slug: newArticle.slug,
                    title: newArticle.title,
                    description: newArticle.description,
                    body: newArticle.body,
                    tagList: newArticle.tagList,
                    favorited: newArticle.favorited,
                    favoritesCount: newArticle.favoritesCount
                }
            }
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }



    //DELETE ARTICE BY SLUG
    async deleteArticle(slug: string, user: User): Promise<String> {
        try {
            const article = await this.articleRepo.findOne({ where: { slug: slug }, relations: ["author"] });
            if (!(user["sub"] === article.author["id"])) throw new HttpException("YOU CAN'T DELETE THIS ARTICLE!!!", HttpStatus.BAD_REQUEST);
            if (!article) throw new HttpException("ARTICLE NOT FOUND!!!", HttpStatus.NOT_FOUND);
            await this.articleRepo.delete(article.id);
            return `Article with slug ${slug} has been deleted!!!`;
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { ArticleResponseInterface } from './response/article-response.interface';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesResponseInterface } from './response/articles-response.interface';
import { Follow } from 'src/profile/follow.entity';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepo: Repository<Article>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Follow)
        private readonly followRepo: Repository<Follow>
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
    async getAll(user: User | null, query: any): Promise<ArticlesResponseInterface> {
        try {
            const queryBuilder = await this.articleRepo
                .createQueryBuilder("articles")
                .leftJoinAndSelect("articles.author", "author");
            queryBuilder.orderBy("articles", "DESC")
            const count = await queryBuilder.getCount();

            if (query.tag) {
                queryBuilder.andWhere('articles.tagList ILIKE :tag', {
                    tag: `%${query.tag}%`
                })
            }

            if (query.author) {
                const author = await this.userRepo.findOne({
                    where: {
                        username: query.author
                    }
                })
                queryBuilder.andWhere("articles.authorId = :id", {
                    id: author.id
                })
            }

            if (query.favorited) {
                const author = await this.userRepo.findOne({ where: { username: query.favorited }, relations: ["favorites"] })
                const ids = author.favorites.map((el) => el.id);
                if (ids.length > 0) {
                    queryBuilder.andWhere('articles.id IN (:...ids)', { ids: ids })
                } else {
                    queryBuilder.andWhere("1=0")
                }
            }

            if (query.limit) {
                queryBuilder.limit(query.limit)
            }
            if (query.offset) {
                queryBuilder.offset(query.offset)
            }

            const currentUser = await this.userRepo.findOne({ where: { id: user["sub"] }, relations: ["favorites"] });
            let favoritedId: number[] = [];
            if (currentUser.favorites.length > 0) {
                favoritedId = currentUser.favorites.map((el) => el.id);
            }
            const articles = await queryBuilder.getMany();
            const favoritedWithFavorites: Article[] = articles.map((article) => {
                const favorited = favoritedId.includes(article.id);
                return { ...article, favorited };
            })
            return {
                articles: favoritedWithFavorites,
                articleCount: count
            }
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }


    //GET ARTIICLES FEED
    async getArticlesFeed(currentUser: User, query: any): Promise<ArticlesResponseInterface> {

        try {
            const follows = await this.followRepo.find({
                where: { followerId: currentUser["sub"] }
            })
            if (follows.length === 0) {
                return { articles: [], articleCount: 0 }
            }

            const followsUserId = follows.map((follow) => follow.following);
            const queryBuilder = await this.articleRepo
                .createQueryBuilder("articles")
                .leftJoinAndSelect("articles.author", "author")
                .where("articles.authorId IN (:...ids)", { ids: followsUserId })

            queryBuilder.orderBy("articles.createdAt", "DESC");
            const articleCount = await queryBuilder.getCount();
            if (query.limit) {
                queryBuilder.limit(query.limit)
            }
            if (query.offset) {
                queryBuilder.offset(query.offset)
            }

            const articles = await queryBuilder.getMany();

            return { articleCount: articleCount, articles }

        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
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

    //ADD ARTICLE TO FAVORITES
    async addArticleToFavorites(slug: string, currentUser: User): Promise<Article> {
        try {
            const article = await this.articleRepo.findOne({ where: { slug: slug } });
            if (!article) throw new HttpException("ARTICLE NOT FOUND!", HttpStatus.NOT_FOUND);
            const user = await this.userRepo.findOne({ where: { id: currentUser["sub"] }, relations: ["favorites"] })
            if (!user) throw new HttpException("USER NOT FOUND!", HttpStatus.NOT_FOUND);
            const isNotFavorited = user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id) === -1;

            if (isNotFavorited) {
                user.favorites.push(article);
                article.favoritesCount++;
                await this.userRepo.save(user);
                await this.articleRepo.save(article);
            }
            return article;
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    //DISLIKE ARTICLE TO FAVORITES
    async deleteArticleFromFavorites(slug: string, currentUser: User): Promise<Article> {
        try {
            const article = await this.articleRepo.findOne({ where: { slug: slug } });
            if (!article) throw new HttpException("ARTICLE NOT FOUND!", HttpStatus.NOT_FOUND);
            const user = await this.userRepo.findOne({ where: { id: currentUser["sub"] }, relations: ["favorites"] });
            if (!user) throw new HttpException("USER NOT FOUND!", HttpStatus.NOT_FOUND);

            const articleIndex = user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id);

            if (articleIndex >= 0) {
                user.favorites.splice(articleIndex, 1);
                article.favoritesCount--;
                await this.userRepo.save(user);
                await this.articleRepo.save(article);
            }
            return article;

        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }
}

import { Article } from "../article.entity";

export interface ArticlesResponseInterface {
    articles: Article[];
    articleCount: number;
}
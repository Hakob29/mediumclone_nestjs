import { Article } from "src/article/article.entity"

export interface UserResponseInterface {

    user: {
        readonly username: string

        readonly email: string

        readonly image: string

        readonly bio: string

        readonly article: Article[]
    }

}
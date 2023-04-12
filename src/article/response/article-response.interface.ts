export interface ArticleResponseInterface {
    article: {
        readonly slug: string
        readonly title: string
        readonly description: string
        readonly body: string
        readonly tagList: string[]
        readonly favorited: Boolean
        readonly favoritesCount: number
    }
}
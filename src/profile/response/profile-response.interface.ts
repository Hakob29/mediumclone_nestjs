export interface ProfileResponseInterface {

    profile: {
        readonly id: number

        readonly username: string

        readonly image: string

        readonly bio: string

        readonly following: boolean
    }

}
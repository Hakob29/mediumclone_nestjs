import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("Article")
export class Article {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column({ type: String })
    slug: string

    @Column({ type: String })
    title: string

    @Column({ type: String })
    description: string

    @Column({ type: String })
    body: string

    @Column({ type: String, array: true, })
    tagList: string[]

    @Column({ type: Boolean, default: false })
    favorited: Boolean

    @Column({ type: Number })
    favoritesCount: number

    @ManyToOne(() => User, (author) => author.article, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    author: User


    @CreateDateColumn({ type: Date })
    createdAt: Date

    @UpdateDateColumn({ type: Date })
    updatedAt: Date

    @DeleteDateColumn({ type: Date })
    deletedAt: Date
}
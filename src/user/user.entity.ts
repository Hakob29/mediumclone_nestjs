import { Article } from "src/article/article.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("User")
export class User {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number

    @Column({ type: String, nullable: false })
    username: string

    @Column({ type: String, nullable: false, unique: true })
    email: string

    @Column({ type: String, nullable: false })
    password: string

    @Column({ type: String, nullable: true })
    image: string

    @Column({ type: String, nullable: true })
    bio: string

    @OneToMany(() => Article, (Article) => Article.author, { cascade: true })
    article: Article[]

    @ManyToMany(() => Article)
    @JoinTable()
    favorites: Article[]

    @CreateDateColumn({ type: Date })
    createdAt: Date

    @UpdateDateColumn({ type: Date })
    updatedAt: Date

    @DeleteDateColumn({ type: Date })
    deletedAt?: Date
}
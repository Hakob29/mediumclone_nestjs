import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "follows" })
export class Follow {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number

    @Column()
    followerId: number


    @Column()
    following: number
}
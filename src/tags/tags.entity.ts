import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("TagsEntity")
export class TagsEntity {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column({ type: String })
    name: string

    @CreateDateColumn({ type: Date })
    createdAt: Date

    @UpdateDateColumn({ type: Date })
    updatedAt: Date

    @DeleteDateColumn({ type: Date })
    deletedAt: Date

}
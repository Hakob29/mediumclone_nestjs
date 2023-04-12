import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleCascade1681289295214 implements MigrationInterface {
    name = 'ArticleCascade1681289295214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Article" ALTER COLUMN "favorited" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Article" ALTER COLUMN "favorited" DROP DEFAULT`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascade1681288989625 implements MigrationInterface {
    name = 'AddCascade1681288989625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Article" ALTER COLUMN "favorited" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Article" ALTER COLUMN "favorited" DROP DEFAULT`);
    }

}

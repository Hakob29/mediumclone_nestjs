import { MigrationInterface, QueryRunner } from "typeorm";

export class UserCascadeTrue1681289514117 implements MigrationInterface {
    name = 'UserCascadeTrue1681289514117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Article" DROP CONSTRAINT "FK_08e438dd8a3266e724b326129a0"`);
        await queryRunner.query(`ALTER TABLE "Article" ADD CONSTRAINT "FK_08e438dd8a3266e724b326129a0" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Article" DROP CONSTRAINT "FK_08e438dd8a3266e724b326129a0"`);
        await queryRunner.query(`ALTER TABLE "Article" ADD CONSTRAINT "FK_08e438dd8a3266e724b326129a0" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

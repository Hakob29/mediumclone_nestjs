import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1683196095319 implements MigrationInterface {
    name = 'NewMigration1683196095319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "TagsEntity" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_9a0544cceaf57b7adc89bed79aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" BIGSERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "image" character varying, "bio" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Article" ("id" BIGSERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "body" character varying NOT NULL, "tagList" text NOT NULL, "favorited" boolean NOT NULL DEFAULT false, "favoritesCount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "authorId" bigint, CONSTRAINT "PK_88f529840cddf90d750f91dee86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_favorites_article" ("userId" bigint NOT NULL, "articleId" bigint NOT NULL, CONSTRAINT "PK_eb153a9f549f934488deb1c6025" PRIMARY KEY ("userId", "articleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3b80ae56288924ab30cc9e7043" ON "user_favorites_article" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9ea0140751b603ea826c19e1a3" ON "user_favorites_article" ("articleId") `);
        await queryRunner.query(`ALTER TABLE "Article" ADD CONSTRAINT "FK_08e438dd8a3266e724b326129a0" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" ADD CONSTRAINT "FK_3b80ae56288924ab30cc9e70435" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" ADD CONSTRAINT "FK_9ea0140751b603ea826c19e1a33" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorites_article" DROP CONSTRAINT "FK_9ea0140751b603ea826c19e1a33"`);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" DROP CONSTRAINT "FK_3b80ae56288924ab30cc9e70435"`);
        await queryRunner.query(`ALTER TABLE "Article" DROP CONSTRAINT "FK_08e438dd8a3266e724b326129a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9ea0140751b603ea826c19e1a3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b80ae56288924ab30cc9e7043"`);
        await queryRunner.query(`DROP TABLE "user_favorites_article"`);
        await queryRunner.query(`DROP TABLE "Article"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "TagsEntity"`);
    }

}

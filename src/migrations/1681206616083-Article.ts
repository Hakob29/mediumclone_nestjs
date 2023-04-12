import { MigrationInterface, QueryRunner } from "typeorm";

export class Article1681206616083 implements MigrationInterface {
    name = 'Article1681206616083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" BIGSERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "image" character varying, "bio" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Article" ("id" BIGSERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "body" character varying NOT NULL, "tagList" character varying array NOT NULL, "favorited" boolean NOT NULL, "favoritesCount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "authorId" bigint, CONSTRAINT "PK_88f529840cddf90d750f91dee86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "TagsEntity" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_9a0544cceaf57b7adc89bed79aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Article" ADD CONSTRAINT "FK_08e438dd8a3266e724b326129a0" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Article" DROP CONSTRAINT "FK_08e438dd8a3266e724b326129a0"`);
        await queryRunner.query(`DROP TABLE "TagsEntity"`);
        await queryRunner.query(`DROP TABLE "Article"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}

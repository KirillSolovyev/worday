import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDB1751304072103 implements MigrationInterface {
    name = 'CreateDB1751304072103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "baseLanguage" character varying NOT NULL DEFAULT 'en', "targetLanguage" character varying NOT NULL DEFAULT 'en', "languageLevel" character varying NOT NULL DEFAULT 'B1', "topics" character varying(100) NOT NULL DEFAULT 'general', "userId" uuid, CONSTRAINT "REL_986a2b6d3c05eb4091bb8066f7" UNIQUE ("userId"), CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "currentState" character varying NOT NULL DEFAULT 'INIT', "userId" uuid, CONSTRAINT "REL_b35c67d61943214aff1e7c94ab" UNIQUE ("userId"), CONSTRAINT "PK_f5e224bbe5ee7f6dcb2a8e49418" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
        await queryRunner.query(`CREATE TABLE "word" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "word" character varying NOT NULL, "definition" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_ad026d65e30f80b7056ca31f666" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aada86add50a09bb4fb74bf617" ON "word" ("createdAt") `);
        await queryRunner.query(`CREATE TABLE "word_examples" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL, "wordId" uuid, CONSTRAINT "PK_10909f90f94d6d41e4f230f11fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_986a2b6d3c05eb4091bb8066f78" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_state" ADD CONSTRAINT "FK_b35c67d61943214aff1e7c94abd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "word" ADD CONSTRAINT "FK_4d9fb2abff81f0e34ae02be3178" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "word_examples" ADD CONSTRAINT "FK_a86be9a24b3eff073fddccbdb21" FOREIGN KEY ("wordId") REFERENCES "word"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "word_examples" DROP CONSTRAINT "FK_a86be9a24b3eff073fddccbdb21"`);
        await queryRunner.query(`ALTER TABLE "word" DROP CONSTRAINT "FK_4d9fb2abff81f0e34ae02be3178"`);
        await queryRunner.query(`ALTER TABLE "user_state" DROP CONSTRAINT "FK_b35c67d61943214aff1e7c94abd"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_986a2b6d3c05eb4091bb8066f78"`);
        await queryRunner.query(`DROP TABLE "word_examples"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aada86add50a09bb4fb74bf617"`);
        await queryRunner.query(`DROP TABLE "word"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_state"`);
        await queryRunner.query(`DROP TABLE "user_settings"`);
    }

}

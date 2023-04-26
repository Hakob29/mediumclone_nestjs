import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.TYPEORM_HOST,
    port: +process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/**/migrations/*.js"],
    synchronize: false,
    logging: true,
    migrationsRun: false,
    migrationsTableName: "migrations",
}) 
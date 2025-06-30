import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DataSource, type DataSourceOptions } from 'typeorm';

config();
const configService = new ConfigService();

export const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.getOrThrow<string>('DB_HOST'),
  port: configService.getOrThrow<number>('DB_PORT'),
  username: configService.getOrThrow<string>('DB_USERNAME'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),
  database: configService.getOrThrow<string>('DB_DATABASE'),
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/db/migrations/*.{ts,js}'],
  migrationsRun: false,
  synchronize: false,
  logging: false,
};

const dataSource = new DataSource(dataSourceConfig);

export default dataSource;

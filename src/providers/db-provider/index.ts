import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceConfig } from './data-source';

export const DBProvider = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    ...dataSourceConfig,
    autoLoadEntities: configService.get('ENV') === 'development',
    synchronize: configService.get('ENV') === 'development',
    logging: configService.get('ENV') === 'development',
  }),
});

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TagsModule } from './tags/tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmConfig } from 'orm-config';
import { TagsService } from './tags/tags.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(OrmConfig.options),
    ConfigModule.forRoot(),
    TagsModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

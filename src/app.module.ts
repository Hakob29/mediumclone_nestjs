import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TagsModule } from './tags/tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmConfig } from 'orm-config';
import { TagsService } from './tags/tags.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(OrmConfig.options),
    ConfigModule.forRoot(),
    TagsModule,
    UserModule,
    AuthModule,
    ArticleModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

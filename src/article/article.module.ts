import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { User } from 'src/user/user.entity';
import { Follow } from 'src/profile/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Follow])],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule { }

import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../database/post.entity';
import { Files } from '../database/file.entity';

@Module( {
  imports: [ TypeOrmModule.forFeature( [ Post, Files ] ) ],
  controllers: [ PostController ],
  providers: [ PostService ],
} )
export class PostModule { }

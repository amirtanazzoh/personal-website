import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../database/post.entity';
import { Files } from '../database/file.entity';
import { FileModule } from '../file/file.module';

@Module( {
  imports: [ FileModule, TypeOrmModule.forFeature( [ Post, Files ] ) ],
  controllers: [ PostController ],
  providers: [ PostService ],
} )
export class PostModule { }

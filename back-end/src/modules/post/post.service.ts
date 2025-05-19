import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { Post } from '../database/post.entity';
import { CreatePostDto, UpdatePostDto } from '../../common/dto/post.dto';
import { QueryParamsDto } from 'src/common/dto/query-params.dto';
import { Files } from '../database/file.entity';

@Injectable()
export class PostService
{
  constructor (
    @InjectRepository( Post ) private readonly repo: Repository<Post>,
    @InjectRepository( Files ) private readonly fileRepo: Repository<Files>
  ) { }

  private async existsById ( id: number )
  {
    const exists = await this.repo.existsBy( { id } );

    if ( !exists )
      throw new NotFoundException( `post with id: ${ id } is not found` );

    return exists;
  }

  private async getFileById ( id: number | undefined )
  {
    if ( !id ) return null;

    const file = await this.fileRepo.findOneBy( { id } );
    if ( !file ) throw new NotFoundException( 'file not found' );

    return file;
  }

  async getAll ( query: QueryParamsDto )
  {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      order = 'DESC',
      search,
    } = query;

    const skip = ( page - 1 ) * limit;

    const where = search
      ? [
        { title: Like( `%${ search }%` ) },
        { content: Like( `%${ search }%` ) },
        { digest: Like( `%${ search }%` ) },
      ]
      : undefined;

    const [ data, total ] = await this.repo.findAndCount( {
      where,
      order: sortBy
        ? { [ sortBy ]: order.toUpperCase() as 'ASC' | 'DESC' }
        : undefined,
      skip,
      take: limit,
      relations: [ 'feature_image' ]
    } );

    return {
      posts: data,
      total,
      page,
      lastPage: Math.ceil( total / limit ),
    };
  }

  async getById ( id: number )
  {
    const post = await this.repo.findOne( { where: { id }, relations: [ 'feature_image' ] } );

    if ( !post ) throw new NotFoundException( `post with id: ${ id } is not found` );

    return post;
  }

  async create ( post: CreatePostDto )
  {
    const newPost = this.repo.create( { ...post, feature_image: await this.getFileById( post.feature_image_id ) } );

    return this.repo.save( newPost );
  }

  async update ( id: number, updatedPost: UpdatePostDto )
  {
    await this.existsById( id );

    await this.repo.update( id, { ...updatedPost, feature_image: await this.getFileById( updatedPost.feature_image_id ) } );
  }

  async getTrash ()
  {
    return this.repo.find( {
      where: {
        deleted_at: Not( IsNull() ),
      },
      withDeleted: true,
    } );
  }

  async trash ( id: number )
  {
    await this.existsById( id );

    await this.repo.softDelete( id );
  }

  async restore ( id: number )
  {
    const deletedPost = await this.repo.findOne( { where: { id }, withDeleted: true, } );

    if ( !deletedPost?.deleted_at ) throw new NotFoundException( `post with id: ${ id } is not found in trash` );

    await this.repo.restore( id );
  }
}

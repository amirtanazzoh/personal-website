import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { Post } from "../database/post.entity";
import { CreatePostDto, UpdatePostDto } from "./post.dto";

@Injectable()
export class PostService
{

    constructor (
        @InjectRepository( Post )
        private readonly repo: Repository<Post>
    ) { }

    private async existsById ( id: number )
    {
        const exists = await this.repo.existsBy( { id } );

        if ( !exists ) throw new NotFoundException( `post with id: ${ id } is not found` );

        return exists;
    }

    async getAll ()
    {
        return this.repo.find();
    }

    async getById ( id: number )
    {
        const post = await this.repo.findOne( { where: { id } } );

        if ( !post )
        {
            throw new NotFoundException( `post with id: ${ id } is not found` );
        }

        return post;
    }

    async create ( post: CreatePostDto )
    {
        const newPost = this.repo.create( post );

        return this.repo.save( newPost );
    }

    async update ( id: number, updatedPost: UpdatePostDto )
    {

        await this.existsById( id );

        await this.repo.update( id, updatedPost );

    }

    //trash

    async getTrash ()
    {
        return this.repo.find( {
            where: {
                deleted_at: Not( IsNull() )
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
        const deletedPost = await this.repo.findOne( {
            where: { id },
            withDeleted: true
        } );

        if ( !deletedPost || !deletedPost.deleted_at ) throw new NotFoundException( `post with id: ${ id } is not found in trash` );

        await this.repo.restore( id );
    }
}
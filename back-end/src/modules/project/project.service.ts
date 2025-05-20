import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IsNull, Like, Not, Repository } from "typeorm";
import { Project } from "../database/project.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryParamsDto } from "src/common/dto/query-params.dto";
import { CreateProjectDto, UpdateProjectDto } from "src/common/dto/project.dto";
import { FileService } from "../file/file.service";

@Injectable()
export class ProjectService
{
    constructor (
        @InjectRepository( Project ) private readonly repo: Repository<Project>,
        @Inject( FileService ) private readonly fileService: FileService
    ) { }

    private async checkExists ( id: number )
    {
        if ( !( await this.repo.existsBy( { id } ) ) )
            throw new NotFoundException( `project with id: ${ id } is not found` );
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
                { name: Like( `%${ search }%` ) },
                { description: Like( `%${ search }%` ) },
                { content: Like( `%${ search }%` ) },
            ]
            : undefined;

        const [ data, total ] = await this.repo.findAndCount( {
            where,
            order: sortBy ? { [ sortBy ]: order.toUpperCase() as 'ASC' | 'DESC' } : undefined,
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
        const project = await this.repo.findOne( { where: { id }, relations: [ 'feature_image' ] } );

        if ( !project ) throw new NotFoundException( `project with id: ${ id } is not found` );

        return project;
    }

    async create ( { attachments: attachmentsFrom, ...project }: CreateProjectDto )
    {

        const attachments = ( attachmentsFrom && attachmentsFrom?.length > 0 ) ?
            await this.fileService.getGroupById( attachmentsFrom ) : [];

        const newPost = this.repo.create( { ...project, attachments } );

        return this.repo.save( newPost );
    }

    async update ( id: number, { attachments: attachmentsFrom, ...updatedPost }: UpdateProjectDto )
    {
        await this.checkExists( id );

        const attachments = ( attachmentsFrom && attachmentsFrom?.length > 0 ) ?
            await this.fileService.getGroupById( attachmentsFrom ) : [];

        await this.repo.update( id, { ...updatedPost, attachments } );
    }

    async getTrash () { return this.repo.find( { where: { deleted_at: Not( IsNull() ) }, withDeleted: true } ); }

    async trash ( id: number ) { await this.checkExists( id ); await this.repo.softDelete( id ); }

    async restore ( id: number )
    {
        const deletedPost = await this.repo.findOne( { where: { id }, withDeleted: true, } );

        if ( !deletedPost?.deleted_at ) throw new NotFoundException( `post with id: ${ id } is not found in trash` );

        await this.repo.restore( id );
    }
}
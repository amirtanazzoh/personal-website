import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Files } from "../database/file.entity";
import { Like, Repository } from "typeorm";
import { MinioUploaded } from "src/types/files";
import { QueryParamsDto } from "src/common/dto/query-params.dto";

@Injectable()
export class FileService
{

    constructor (
        @InjectRepository( Files ) private readonly fileRepo: Repository<Files>
    ) { }

    async exists ( fileName: string )
    {
        return this.fileRepo.findOneBy( { name: fileName } ).then( res => !!res );
    }


    async create ( file: MinioUploaded )
    {
        const createdFile = this.fileRepo.create( file );

        return this.fileRepo.save( createdFile );
    }

    async getById ( id: number )
    {
        return this.fileRepo.findOneBy( { id } ).then( file =>
        {
            if ( !file ) throw new NotFoundException( 'file not found' );
            return file;
        } );
    }

    async delete ( id: number )
    {
        return this.fileRepo.softDelete( id );
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
                { type: Like( `%${ search }%` ) },
            ]
            : undefined;

        const [ data, total ] = await this.fileRepo.findAndCount( {
            where,
            order: sortBy
                ? { [ sortBy ]: order.toUpperCase() as 'ASC' | 'DESC' }
                : undefined,
            skip,
            take: limit,
        } );

        return {
            files: data,
            total,
            page,
            lastPage: Math.ceil( total / limit ),
        };
    }
}
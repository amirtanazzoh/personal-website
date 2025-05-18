import
{
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    ParseIntPipe,
    Post,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CompressService } from "./compress.service";
import { MinioService } from "./minio.service";
import { FileService } from "./file.service";
import { QueryParamsDto } from "src/common/dto/query-params.dto";
import { ParseRequired } from "src/common/pipes/requierd.pipe";
import { Response } from "express";

@Controller( 'files' )
export class FileController
{

    constructor (
        private readonly compressService: CompressService,
        private readonly minioService: MinioService,
        private readonly fileService: FileService
    ) { }

    @Post( 'upload' )
    @UseInterceptors( FileInterceptor( 'file' ) )
    async fileUpload ( @UploadedFile() file: Express.Multer.File )
    {

        if ( !file ) throw new BadRequestException( 'file is required!' );

        await this.fileService.exists( file.originalname )
            .then( isExist => { if ( isExist ) { throw new BadRequestException( 'file name is already exists' ); } } );

        const uploadedFile = await this.minioService.upload( {
            ...file,
            buffer: await this.compressService.compressFile( file ),
        } );

        return this.fileService.create( uploadedFile );
    }

    @Delete( 'delete' )
    async deleteFile ( @Body( 'file_id', ParseRequired, ParseIntPipe ) file_id: number )
    {

        const file = await this.fileService.getById( file_id );

        await this.minioService.delete( file.url.replace( '/public', '' ) );
        await this.fileService.delete( file.id );
    }

    @Get( 'download' )
    async downloadFile ( @Query( 'file_id', ParseIntPipe ) file_id: number, @Res() res: Response )
    {
        const file = await this.fileService.getById( file_id );
        const fileBuffer = await this.minioService.download( file.url.replace( '/public', '' ) );

        res.set( {
            'Content-Disposition': `attachment; filename="${ file.name }"`,
            'Content-Type': file.type,
            'Content-Length': fileBuffer.length,
        } );

        res.send( fileBuffer );
    }

    @Get()
    async getFiles ( @Query() params: QueryParamsDto ) { return this.fileService.getAll( params ); }
}
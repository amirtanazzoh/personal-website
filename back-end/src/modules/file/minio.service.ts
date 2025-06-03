import { Inject, Injectable, Logger } from "@nestjs/common";
import * as Minio from 'minio';


@Injectable()
export class MinioService
{
    private readonly logger = new Logger( MinioService.name );
    private readonly bucketName = 'public';
    private readonly policy = {
        Version: '2012-10-17',
        Statement: [
            {
                Effect: 'Allow',
                Principal: '*',
                Action: [ 's3:GetObject' ],
                Resource: [ `arn:aws:s3:::${ this.bucketName }/*` ],
            },
        ],
    };

    constructor ( @Inject( 'MINIO_CLIENT' ) private readonly minioClient: Minio.Client ) { }

    async onModuleInit () { this.initializeBucket(); }

    private async initializeBucket ()
    {
        try
        {
            const exists = await this.minioClient.bucketExists( this.bucketName );

            if ( exists ) return;

            await this.minioClient.makeBucket( this.bucketName, '', {} );
            await this.minioClient.setBucketPolicy( this.bucketName, JSON.stringify( this.policy ) );
        } catch ( err )
        {
            this.logger.error( 'could not initialize bucket', err );
        }
    }

    private createFileUrl ( filePath: string ): string { return `/${ this.bucketName }/${ filePath }`; }

    private createFileName ( file: any )
    {
        const now = new Date();

        return `${ now.getFullYear() }/${ ( now.getMonth() + 1 ).toString().padStart( 2, '0' ) }/${ file.originalname }`;
    }

    private createFileData ( file: any )
    {
        const fileName = this.createFileName( file );

        const metaData = {
            'Content-Type': file.mimetype,
            path: fileName,
        };

        return { fileName, buffer: file.buffer, metaData, preview: file.preview };
    }

    private async uploadMainFile ( file: Express.Multer.File )
    {
        const { fileName, buffer, metaData } = this.createFileData( file );

        return this.minioClient
            .putObject( this.bucketName, fileName, buffer, undefined, metaData )
            .then( res => res )
            .catch( err => { this.logger.error( err ); throw err; } );
    }

    async upload ( file: any )
    {
        this.logger.verbose( 'uploading image' );

        await this.uploadMainFile( file );

        const { fileName } = this.createFileData( file );

        return {
            url: this.createFileUrl( fileName ),
            size: file.buffer.length,
            name: file.originalname,
            type: file.mimetype,
        };
    }

    async download ( fileName: string ): Promise<Buffer>
    {
        return new Promise( ( resolve, reject ) =>
        {
            this.minioClient
                .getObject( this.bucketName, fileName )
                .then( ( dataStream ) =>
                {
                    const chunks: any[] = [];
                    dataStream.on( 'data', ( chunk ) => chunks.push( chunk ) );
                    dataStream.on( 'end', () => resolve( Buffer.concat( chunks ) ) );
                    dataStream.on( 'error', ( err ) => reject( err ) );
                } )
                .catch( reject );
        } );
    }

    async delete ( fileName: string )
    {
        this.logger.log( fileName );
        return this.minioClient
            .removeObject( this.bucketName, fileName )
            .catch( err =>
            {
                this.logger.error( 'could not delete file: ', err );
                throw err;
            } );
    }

}
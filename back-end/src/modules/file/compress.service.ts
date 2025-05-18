import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentStrategy } from './strategies/document';
import { ImageStrategy } from './strategies/image';
import { VideoStrategy } from './strategies/video';


export interface FileStrategy { compress ( file: Express.Multer.File ): Promise<Buffer>; }

@Injectable()
export class CompressService
{
    constructor (
        private readonly imageStrategy: ImageStrategy,
        private readonly videoStrategy: VideoStrategy,
        private readonly documentStrategy: DocumentStrategy,
    ) { }

    private handleMimeType ( mimetype: string )
    {
        const mimeTypeHandlers = {
            image: this.imageStrategy,
            video: this.videoStrategy,
            application: this.documentStrategy, //just for pdf
        };

        const typeCategory = mimetype.split( '/' )[ 0 ];
        const handler =
            mimeTypeHandlers[ typeCategory as keyof typeof mimeTypeHandlers ];

        if ( !handler ) { throw new BadRequestException( 'Unsupported file type' ); }

        return handler;
    }

    async compressFile ( file: Express.Multer.File ): Promise<Buffer>
    {
        const handler = this.handleMimeType( file.mimetype );
        return await handler.compress( file );
    }
}

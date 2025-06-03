import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';

import { FileStrategy } from '../compress.service';
import { getCorrectBuffer } from 'src/utils/buffer';

@Injectable()
export class ImageStrategy implements FileStrategy
{
    private readonly logger = new Logger( ImageStrategy.name );

    async compress ( file: Express.Multer.File ): Promise<Buffer>
    {
        this.logger.verbose( `Processing image: ${ file.originalname }` );

        return sharp( getCorrectBuffer( file ) ).resize( 1440 ).webp( { quality: 80 } ).toBuffer()
            .then( res => res )
            .catch( err => { this.logger.error( 'Error compressing image:', err ); throw err; } );
    }
}

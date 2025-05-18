import { Injectable, Logger } from '@nestjs/common';

import { FileStrategy } from '../compress.service';
import { getCorrectBuffer } from 'src/utils/buffer';
import { loggers } from 'winston';

@Injectable()
export class DocumentStrategy implements FileStrategy
{
    private readonly logger = new Logger( DocumentStrategy.name );

    constructor () { loggers.add( DocumentStrategy.name ); }

    async compress ( file: Express.Multer.File ): Promise<Buffer>
    {
        this.logger.debug( `Processing document: ${ file.originalname }` );

        return getCorrectBuffer( file );
    }
}

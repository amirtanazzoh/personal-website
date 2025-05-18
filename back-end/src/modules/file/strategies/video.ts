import { Injectable, Logger } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import { FileStrategy } from '../compress.service';
import { getCorrectBuffer } from 'src/utils/buffer';

@Injectable()
export class VideoStrategy implements FileStrategy
{
    private readonly logger = new Logger( VideoStrategy.name );

    async compress ( file: Express.Multer.File ): Promise<Buffer>
    {
        this.logger.verbose( `Processing video: ${ file.originalname }` );

        try
        {
            const inputBuffer = getCorrectBuffer( file );
            const outputBuffer: Buffer = await new Promise( ( resolve, reject ) =>
            {
                const chunks: Buffer[] = [];
                const command = ffmpeg()
                    .input( inputBuffer )
                    .outputOptions( '-c:v libx264', '-crf 28' )
                    .format( 'mp4' )
                    .on( 'end', () =>
                    {
                        resolve( Buffer.concat( chunks ) );
                    } )
                    .on( 'error', ( err ) =>
                    {
                        this.logger.error( 'Error compressing video:', err );
                        reject( new Error( err ) );
                    } )
                    .pipe();

                command.on( 'data', ( chunk ) =>
                {
                    chunks.push( chunk );
                } );
            } );

            return outputBuffer;
        } catch ( error )
        {
            this.logger.error( 'Error processing video:', error );
            throw error;
        }
    }
}

import { Module } from '@nestjs/common';
import { CompressService } from './compress.service';
import { DocumentStrategy } from './strategies/document';
import { ImageStrategy } from './strategies/image';
import { VideoStrategy } from './strategies/video';

@Module( {
    providers: [ CompressService, ImageStrategy, VideoStrategy, DocumentStrategy ],
    exports: [ CompressService ],
} )
export class CompressModule { }

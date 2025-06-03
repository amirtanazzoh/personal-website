import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Global()
@Module( {
    imports: [ ConfigModule ],
    providers: [
        {
            provide: 'MINIO_CLIENT',
            useFactory: ( configService: ConfigService ) =>
            {
                return new Client( {
                    endPoint: configService.get<string>( 'MINIO_ENDPOINT' ) ?? '',
                    port: parseInt( configService.get<string>( 'MINIO_PORT' ) ?? '', 10 ),
                    useSSL: configService.get<string>( 'MINIO_USE_SSL' ) === 'true',
                    accessKey: configService.get<string>( 'MINIO_ACCESS_KEY' ),
                    secretKey: configService.get<string>( 'MINIO_SECRET_KEY' ),
                } );
            },
            inject: [ ConfigService ],
        },
    ],
    exports: [ 'MINIO_CLIENT' ],
} )
export class MinioModule { }

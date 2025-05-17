import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module( {
    imports: [
        TypeOrmModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: ( config: ConfigService ) => ( {
                type: 'postgres',
                host: config.get( 'POSTGRES_HOST' ),
                port: config.get<number>( 'POSTGRES_PORT' ),
                username: config.get( 'POSTGRES_USER' ),
                password: config.get( 'POSTGRES_PASSWORD' ),
                database: config.get( 'POSTGRES_DB' ),
                autoLoadEntities: true,
                synchronize: true,
            } )
        } )
    ]
} )
export class DatabaseModule { }
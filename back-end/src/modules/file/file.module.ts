import { Module } from "@nestjs/common";
import { FileController } from "./file.controller";
import { CompressModule } from "./compress.module";
import { MinioService } from "./minio.service";
import { MinioModule } from "../minio.module";
import { FileService } from "./file.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Files } from "../database/file.entity";

@Module( {
    imports: [ CompressModule, MinioModule, TypeOrmModule.forFeature( [ Files ] ) ],
    controllers: [ FileController ],
    providers: [ MinioService, FileService ]
} )
export class FileModule { }
import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "../database/project.entity";
import { FileModule } from "../file/file.module";

@Module( {
    imports: [ FileModule, TypeOrmModule.forFeature( [ Project ] ) ],
    providers: [ ProjectService ],
    controllers: [ ProjectController ]
} )
export class ProjectModule { }
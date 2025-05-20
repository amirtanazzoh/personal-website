import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, } from '@nestjs/common';
import { ProjectService } from "./project.service";
import { QueryParamsDto } from 'src/common/dto/query-params.dto';
import { CreateProjectDto, UpdateProjectDto } from 'src/common/dto/project.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EUserRole } from 'src/types/enums';

@Controller()
export class ProjectController
{
    constructor ( private readonly service: ProjectService ) { }

    @Get()
    async getAll ( @Query() query: QueryParamsDto ) { return this.service.getAll( query ); }

    @Get( '/trash' )
    @Roles( EUserRole.Admin )
    async getTrash () { return this.service.getTrash(); }

    @Post()
    @Roles( EUserRole.Admin )
    async create ( @Body() body: CreateProjectDto ) { return this.service.create( body ); }

    @Get( ':id' )
    async getById ( @Param( 'id', ParseIntPipe ) id: number ) { return this.service.getById( id ); }

    @Put( ':id' )
    @Roles( EUserRole.Admin )
    async update ( @Body() body: UpdateProjectDto, @Param( 'id', ParseIntPipe ) id: number, )
    { return this.service.update( id, body ); }

    @Delete( ':id' )
    @Roles( EUserRole.Admin )
    async delete ( @Param( 'id', ParseIntPipe ) id: number ) { return this.service.trash( id ); }

    @Patch( ':id/restore' )
    @Roles( EUserRole.Admin )
    async restore ( @Param( 'id', ParseIntPipe ) id: number ) { return this.service.restore( id ); }
}

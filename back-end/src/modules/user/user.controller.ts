import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { QueryParamsDto } from "src/common/dto/query-params.dto";
import { CreateUserDto, UpdateUserDto } from "src/common/dto/user.dto";

@Controller( '/users' )
export class UserController
{
    constructor ( private readonly service: UserService ) { }


    @Get()
    async getAll ( @Query() query: QueryParamsDto ) { return this.service.getAll( query ); }

    @Get( '/trash' )
    async getTrash () { return this.service.getTrash(); }

    @Post()
    async create ( @Body() body: CreateUserDto ) { return this.service.create( body ); }

    @Get( ':id' )
    async getById ( @Param( 'id', ParseUUIDPipe ) id: string ) { return this.service.getById( id ); }

    @Put( ':id' )
    async update ( @Body() body: UpdateUserDto, @Param( 'id', ParseUUIDPipe ) id: string ) { return this.service.update( id, body ); }

    @Delete( ':id' )
    async delete ( @Param( 'id', ParseUUIDPipe ) id: string ) { return this.service.trash( id ); }

    @Patch( ':id/restore' )
    async restore ( @Param( 'id', ParseUUIDPipe ) id: string ) { return this.service.restore( id ); }
}
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateProjectDto 
{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type( () => Number )
    attachments?: number[];
}

export class UpdateProjectDto extends PartialType( CreateProjectDto ) { }
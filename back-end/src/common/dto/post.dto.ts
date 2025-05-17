import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  digest?: string;

  @IsNumber()
  @IsOptional()
  feature_image?: number;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}

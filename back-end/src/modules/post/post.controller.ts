import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from '../../common/dto/post.dto';
import { QueryParamsDto } from 'src/common/dto/query-params.dto';

@Controller('/posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Get()
  async getAll(@Query() query: QueryParamsDto) {
    return this.service.getAll(query);
  }

  @Get('/trash')
  async getTrash() {
    return this.service.getTrash();
  }

  @Post()
  async create(@Body() body: CreatePostDto) {
    return this.service.create(body);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Put(':id')
  async update(
    @Body() body: UpdatePostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.trash(id);
  }

  @Patch(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}

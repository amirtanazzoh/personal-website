import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { QueryParamsDto } from 'src/common/dto/query-params.dto';
import { CreateUserDto, UpdateUserDto } from 'src/common/dto/user.dto';
import { hashBcrypt } from 'src/utils/bcrypt.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  private async existsById(id: string) {
    const exists = await this.repo.existsBy({ id });

    if (!exists)
      throw new NotFoundException(`user with id: ${id} is not found`);

    return exists;
  }

  async getAll(query: QueryParamsDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      order = 'DESC',
      search,
    } = query;

    const skip = (page - 1) * limit;

    const where = search
      ? [
          { first_name: Like(`%${search}%`) },
          { last_name: Like(`%${search}%`) },
          { username: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
        ]
      : undefined;

    const [data, total] = await this.repo.findAndCount({
      where,
      order: sortBy
        ? { [sortBy]: order.toUpperCase() as 'ASC' | 'DESC' }
        : undefined,
      skip,
      take: limit,
    });

    return {
      posts: data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getById(id: string) {
    const post = await this.repo.findOne({ where: { id } });

    if (!post) throw new NotFoundException(`user with id: ${id} is not found`);

    return post;
  }

  async create(user: CreateUserDto) {
    const newUser = this.repo.create(user);
    newUser.password = await hashBcrypt(user.password);

    return this.repo.save(newUser);
  }

  async update(id: string, updatedUser: UpdateUserDto) {
    await this.existsById(id);

    if (updatedUser.password) {
      updatedUser.password = await hashBcrypt(updatedUser.password);
    }

    await this.repo.update(id, updatedUser);
  }

  async getTrash() {
    return this.repo.find({
      where: {
        deleted_at: Not(IsNull()),
      },
      withDeleted: true,
    });
  }

  async trash(id: string) {
    await this.existsById(id);

    await this.repo.softDelete(id);
  }

  async restore(id: string) {
    const deletedPost = await this.repo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!deletedPost?.deleted_at)
      throw new NotFoundException(`post with id: ${id} is not found in trash`);

    await this.repo.restore(id);
  }
}

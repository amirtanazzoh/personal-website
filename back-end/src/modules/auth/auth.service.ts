import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { Repository } from 'typeorm';
import { LoginDto, SignInDto } from 'src/common/dto/auth.dto';
import { hashBcrypt, verifyBcrypt } from 'src/utils/bcrypt.util';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'src/types/login';

@Injectable()
export class AuthService
{
  constructor (
    @InjectRepository( User ) private userRepo: Repository<User>,
    @Inject( JwtService ) private readonly jwtService: JwtService,
  ) { }

  async checkAvailable ( input: string, return_user: boolean = false ): Promise<{ user_exists: boolean; } | User>
  {
    const user = await this.userRepo.findOne(
      { where: [ { username: input }, { email: input }, { phone_number: input } ], } );

    if ( !user ) return { user_exists: false };

    if ( return_user ) return user;

    return { user_exists: !!user };

  }

  async signIn ( body: SignInDto ): Promise<Tokens>
  {
    const user = this.userRepo.create( body );
    user.password = await hashBcrypt( body.password );

    await this.userRepo.save( user ).catch( ( err ) => { throw new BadRequestException( err.detail ); } );

    return {
      access_token: this.jwtService.sign( { sub: user.id } )
    };
  }

  async login ( { input, password }: LoginDto ): Promise<Tokens>
  {
    const user = await this.userRepo.findOne(
      { where: [ { username: input }, { email: input }, { phone_number: input } ], } );

    if ( !user ) throw new NotFoundException( 'user not found!' );

    const isPasswordValid = await verifyBcrypt( password, user.password );

    if ( !isPasswordValid ) throw new BadRequestException( 'invalid credentials!' );


    return {
      access_token: this.jwtService.sign( { sub: user.id } )
    };

  }

  async generateForgetPasswordToken ( email: string ): Promise<string>
  {
    return this.jwtService.sign( { email }, { expiresIn: '15m' } );
  }

  async validateForgetPasswordToken ( token: string ): Promise<{ email: string; }>
  {

    const { emailFromToken } = await this.jwtService.verify( token );

    return {
      email: emailFromToken,
    };
  }
}

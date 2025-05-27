import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { Repository } from 'typeorm';
import { LoginDto, SignInDto } from 'src/common/dto/auth.dto';
import { hashBcrypt, verifyBcrypt } from 'src/utils/bcrypt.util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '../database/refresh-token.entity';
import { Tokens } from 'src/types/login';

@Injectable()
export class AuthService
{
  constructor (
    @InjectRepository( User ) private userRepo: Repository<User>,
    @InjectRepository( RefreshToken )
    private refreshTokenRepo: Repository<RefreshToken>,
    @Inject( JwtService ) private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  private async generateResponseTokens ( user: User )
  {
    return {
      access_token: this.generateAccessToken( user.id ),
    };
  }

  private generateAccessToken ( id: string ) { return this.jwtService.sign( { sub: id } ); }


  async checkAvailable ( input: string ): Promise<{ user_exists: boolean; }>
  {
    const user = await this.userRepo.findOne(
      { where: [ { username: input }, { email: input }, { phone_number: input } ], } );

    return { user_exists: !!user };
  }

  async signIn ( body: SignInDto ): Promise<Tokens>
  {
    const user = this.userRepo.create( body );
    user.password = await hashBcrypt( body.password );

    await this.userRepo.save( user ).catch( ( err ) => { throw new BadRequestException( err.detail ); } );

    return this.generateResponseTokens( user );
  }

  async login ( { input, password }: LoginDto ): Promise<Tokens>
  {
    const user = await this.userRepo.findOne(
      { where: [ { username: input }, { email: input }, { phone_number: input } ], } );

    if ( !user ) throw new NotFoundException( 'user not found!' );

    const isPasswordValid = await verifyBcrypt( password, user.password );

    if ( !isPasswordValid ) throw new BadRequestException( 'invalid credentials!' );

    return this.generateResponseTokens( user );

  }

}

import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { Repository } from 'typeorm';
import { LoginDto, SignInDto } from 'src/common/dto/auth.dto';
import { verifyArgon } from 'src/utils/hashing.util';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'src/types/login';
import { RefreshToken } from '../database/refresh-token.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService
{
  constructor (
    @InjectRepository( RefreshToken ) private refreshTokenRepo: Repository<RefreshToken>,
    @Inject( UserService ) private readonly userService: UserService,
    @Inject( JwtService ) private readonly jwtService: JwtService,
  ) { }

  private generateAccessToken ( user: User ): string { return this.jwtService.sign( { sub: user.id }, { expiresIn: '15m' } ); }

  public generateForgetPasswordToken ( email: string ): string { return this.jwtService.sign( { email }, { expiresIn: '15m' } ); }

  private async generateRefreshToken ( user: User ): Promise<string> 
  {
    const expiresAt = new Date();
    expiresAt.setDate( expiresAt.getDate() + 7 ); // 7 days expiration

    const refreshToken = await this.refreshTokenRepo.save( {
      token: this.jwtService.sign( {}, { expiresIn: '7d' } ),
      expires_at: expiresAt,
      user,
    } );

    return refreshToken.token;
  }

  async checkAvailable ( input: string, return_user: boolean = false ): Promise<{ user_exists: boolean; } | User>
  {
    const user = await this.userService.getByInput( input );

    if ( !user ) return { user_exists: false };

    if ( return_user ) return user;

    return { user_exists: !!user };

  }

  async signIn ( body: SignInDto ): Promise<Tokens>
  {

    const user = await this.userService.create( body );

    return {
      access_token: this.generateAccessToken( user ),
      refresh_token: await this.generateRefreshToken( user ),
    };
  }

  async login ( { input, password }: LoginDto ): Promise<Tokens>
  {
    const user = await this.userService.getByInput( input );

    if ( !user ) throw new NotFoundException( 'user not found!' );

    const isPasswordValid = await verifyArgon( password, user.password );

    if ( !isPasswordValid ) throw new BadRequestException( 'invalid credentials!' );


    return {
      access_token: this.generateAccessToken( user ),
      refresh_token: await this.generateRefreshToken( user ),
    };

  }

  async refreshToken ( token: string ): Promise<Tokens>
  {

    const refreshToken = await this.refreshTokenRepo.findOne( { where: { token }, relations: [ 'user' ] } );

    if ( !refreshToken ) throw new NotFoundException( 'refresh token not found!' );

    if ( refreshToken.expires_at < new Date() ) throw new BadRequestException( 'refresh token expired!' );

    return {
      access_token: this.generateAccessToken( refreshToken.user ),
      refresh_token: await this.generateRefreshToken( refreshToken.user ),
    };

  }

  async validateForgetPasswordToken ( token: string ): Promise<{ email: string; }>
  {

    const { emailFromToken } = await this.jwtService.verify( token );

    return {
      email: emailFromToken,
    };
  }
}

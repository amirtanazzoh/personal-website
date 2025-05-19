import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { Repository } from 'typeorm';
import { LoginDto, SignInDto } from 'src/common/dto/auth.dto';
import { hashBcrypt, verifyBcrypt } from 'src/utils/bcrypt.util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '../database/refresh-token.entity';
import { Tokens } from 'src/types/login';
import { TIME_BASE_MIL, TIME_BASE_SEC } from 'src/utils/constants.util';
import { hashCrypto } from 'src/utils/api-key.util';

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
      refresh_token: await this.generateRefreshToken( user ),
    };
  }

  private generateAccessToken ( id: string ) { return this.jwtService.sign( { sub: id } ); }

  private async generateRefreshToken ( user: User ): Promise<string>
  {
    const payload = {};

    const refreshTokenValue = this.jwtService.sign( payload, {
      secret: this.configService.get( 'JWT_REFRESH_SECRET' ),
      expiresIn: TIME_BASE_SEC.WEEK,
    } );

    const hashedToken = hashCrypto( refreshTokenValue );

    const refreshToken = this.refreshTokenRepo.create( {
      token: hashedToken,
      user: user,
      expires_at: new Date( Date.now() + TIME_BASE_MIL.WEEK ),
    } );

    await this.refreshTokenRepo.save( refreshToken );

    return refreshTokenValue;
  }

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

  async refreshToken ( refreshTokenValue: string ): Promise<Tokens>
  {
    const hashedToken = hashCrypto( refreshTokenValue );

    const existingToken = await this.refreshTokenRepo.findOne(
      { where: { token: hashedToken, revoked: false }, relations: [ 'user' ], } );

    if ( !existingToken ) { throw new UnauthorizedException( 'Invalid refresh token' ); }

    if ( existingToken.expires_at < new Date() ) { throw new UnauthorizedException( 'Refresh token expired' ); }

    const user = existingToken.user;

    existingToken.revoked = true;
    await this.refreshTokenRepo.save( existingToken );

    return this.generateResponseTokens( user );
  }
}

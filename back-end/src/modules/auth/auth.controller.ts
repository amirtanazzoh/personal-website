import { Body, Controller, Get, Post, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ParseRequired } from 'src/common/pipes/requierd.pipe';
import { LoginDto, SignInDto } from 'src/common/dto/auth.dto';
import { Request, Response } from 'express';
import { TIME_BASE_MIL } from 'src/utils/constants.util';

@Controller( '/auth' )
export class AuthController
{
  constructor ( private service: AuthService ) { }

  private setRefreshToken ( res: Response, refresh_token: string )
  {
    res.cookie( 'refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: TIME_BASE_MIL.WEEK
    } );
  }

  @Get( 'exist' )
  async existUser ( @Query( 'input', ParseRequired ) input: string )
  { return this.service.checkAvailable( input ); }

  @Post( 'sign-in' )
  async signIn ( @Body() body: SignInDto, @Res( { passthrough: true } ) res: Response )
  {
    const { refresh_token, access_token } = await this.service.signIn( body );

    this.setRefreshToken( res, refresh_token );

    return { access_token };
  }

  @Post( 'login' )
  async login ( @Body() body: LoginDto, @Res( { passthrough: true } ) res: Response )
  {
    const { refresh_token, access_token } = await this.service.login( body );

    this.setRefreshToken( res, refresh_token );

    return { access_token };
  }

  @Post( 'refresh' )
  async refresh ( @Res( { passthrough: true } ) res: Response, @Req() req: Request )
  {

    const token = req.cookies[ 'refresh_token' ];

    if ( !token ) throw new UnauthorizedException( 'request is invalid' );

    const { refresh_token, access_token } = await this.service.refreshToken( token );

    this.setRefreshToken( res, refresh_token );

    return { access_token };
  }

  @Post( 'logout' )
  logout ( @Res( { passthrough: true } ) res: Response )
  {
    res.clearCookie( 'refreshToken', {
      path: '/auth/refresh',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: TIME_BASE_MIL.WEEK
    } );
    return { message: 'Logged out' };
  }
}

import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ParseRequired } from 'src/common/pipes/requierd.pipe';
import { LoginDto, SignInDto } from 'src/common/dto/auth.dto';
import { Response } from 'express';
import { TIME_BASE_MIL } from 'src/utils/constants.util';

@Controller( '/auth' )
export class AuthController
{
  constructor ( private service: AuthService ) { }


  private setAccessToken ( res: Response, access_token: string )
  {
    res.cookie( 'access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: TIME_BASE_MIL.WEEK
    } );
  }

  @Get( 'exist' )
  async existUser ( @Query( 'input', ParseRequired ) input: string )
  { return this.service.checkAvailable( input ); }

  @Post( 'sign-in' )
  async signIn ( @Body() body: SignInDto, @Res( { passthrough: true } ) res: Response )
  {
    const { access_token } = await this.service.signIn( body );

    this.setAccessToken( res, access_token );
  }

  @Post( 'login' )
  async login ( @Body() body: LoginDto, @Res( { passthrough: true } ) res: Response )
  {
    const { access_token } = await this.service.login( body );

    this.setAccessToken( res, access_token );
  }


  @Post( 'logout' )
  logout ( @Res( { passthrough: true } ) res: Response )
  {

    res.clearCookie( 'access_token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TIME_BASE_MIL.WEEK
    } );

    return { message: 'Logged out' };
  }
}

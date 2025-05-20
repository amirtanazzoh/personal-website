import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ParseRequired } from 'src/common/pipes/requierd.pipe';
import { LoginDto, SignInDto } from 'src/common/dto/auth.dto';

@Controller( '/auth' )
export class AuthController
{
  constructor ( private service: AuthService ) { }

  @Get( 'exist' )
  async existUser ( @Query( 'input', ParseRequired ) input: string )
  { return this.service.checkAvailable( input ); }

  @Post( 'sign-in' )
  async signIn ( @Body() body: SignInDto ) { return this.service.signIn( body ); }

  @Post( 'login' )
  async login ( @Body() body: LoginDto ) { return this.service.login( body ); }

  @Post( 'refresh' )
  async refresh ( @Body( 'refresh_token' ) token: string ) { return this.service.refreshToken( token ); }
}

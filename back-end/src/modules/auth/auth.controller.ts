import { BadRequestException, Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ParseRequired } from 'src/common/pipes/requierd.pipe';
import { ForgetPasswordDto, LoginDto, ResetPasswordDto, SignInDto } from 'src/common/dto/auth.dto';
import { Response } from 'express';
import { TIME_BASE_MIL } from 'src/utils/constants.util';
import { MailService, MailTitles } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller( '/auth' )
export class AuthController
{
  constructor (
    private service: AuthService,
    private mailService: MailService,
    private userService: UserService,
    private jwtService: JwtService,
  ) { }


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

    this.mailService.sendEmail( body.email, MailTitles.Welcome, 'welcome', { name: body.first_name, email: body.email } );
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

  @Post( 'forget-password' )
  async forgetPassword ( @Body() { input }: ForgetPasswordDto )
  {
    const user = await this.service.checkAvailable( input, true );

    if ( 'user_exists' in user ) throw new BadRequestException( `User with input: ${ input } not found!` );

    const resetLink = process.env.FRONTEND_URL + `/reset-password?token=${ await this.service.generateForgetPasswordToken( user.email ) }`;

    await this.mailService.sendEmail(
      user.email,
      MailTitles.ForgetPassword,
      'forget-password',
      {
        title: MailTitles.ForgetPassword,
        name: user.first_name,
        resetLink: resetLink,
      }
    );
  }

  @Post( 'reset-password' )
  async resetPassword ( @Body() { password, token }: ResetPasswordDto )
  {
    const { email } = await this.service.validateForgetPasswordToken( token );

    const user = await this.service.checkAvailable( email, true );

    if ( 'user_exists' in user ) throw new BadRequestException( `User with input: ${ email } not found!` );

    await this.userService.update( user.id, { password } );

  }
}

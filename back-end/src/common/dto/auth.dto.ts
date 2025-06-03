import { IsEmail, IsString } from 'class-validator';
import { IsValidPassword } from '../validators/password';
import { IsValidUsername } from '../validators/username';
import { IsValidIRPhone } from '../validators/iran-phone';

export class SignInDto
{
  @IsValidUsername()
  username: string;

  @IsValidPassword()
  password: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsValidIRPhone()
  phone_number: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}

export class LoginDto
{
  @IsString()
  input: string;

  @IsValidPassword()
  password: string;
}


export class ForgetPasswordDto
{
  @IsString()
  input: string;
}
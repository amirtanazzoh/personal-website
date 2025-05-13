import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsString } from "class-validator";
import { IsValidUsername } from "../validators/username";
import { IsValidPassword } from "../validators/password";
import { IsValidIRPhone } from "../validators/iran-phone";

export class CreateUserDto
{
    @IsValidUsername()
    username: string;

    @IsValidPassword()
    password: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsValidIRPhone()
    phone_number: string;
}

export class UpdateUserDto extends PartialType( CreateUserDto ) { }
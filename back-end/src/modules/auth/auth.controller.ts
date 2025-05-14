import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ParseRequired } from "src/common/pipes/requierd.pipe";
import { SignInDto } from "src/common/dto/auth.dto";

@Controller( '/auth' )
export class AuthController
{

    constructor ( private service: AuthService )
    {
    }

    @Get( '/exist' )
    async existUser ( @Query( 'input', ParseRequired ) input: string )
    {
        return this.service.checkAvailable( input );
    }

    @Post( '/sign-in' )
    async signIn ( @Body() body: SignInDto )
    {
        return this.service.signIn( body );
    }
}
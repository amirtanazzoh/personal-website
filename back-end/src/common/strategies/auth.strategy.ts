import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';


@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
    constructor (
        @Inject( UserService ) private readonly userService: UserService,
    )
    {
        super( {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        } );
    }

    async validate ( payload: { sub: string; } )
    {
        return this.userService.getById( payload.sub );
    }
}

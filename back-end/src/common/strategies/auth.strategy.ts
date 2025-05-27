import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';

const cookieExtractor = ( req: Request ): string | null => { return req?.cookies?.access_token || null; };

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
  constructor ( @Inject( UserService ) private readonly userService: UserService )
  {
    //@ts-ignore
    super( {
      jwtFromRequest: ExtractJwt.fromExtractors( [ cookieExtractor ] ),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    } );
  }

  async validate ( payload: { sub: string; } ) { return this.userService.getById( payload.sub ); }
}

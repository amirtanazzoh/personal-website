import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../database/user.entity";
import { Repository } from "typeorm";
import { SignInDto } from "src/common/dto/auth.dto";
import { hashPassword } from "src/utils/password.util";

@Injectable()
export class AuthService
{
    constructor ( @InjectRepository( User ) private userRepo: Repository<User> ) { }

    async checkAvailable ( input: string ): Promise<{ user_exists: boolean; }>
    {
        const user = await this.userRepo.findOne( {
            where: [
                { username: input },
                { email: input },
                { phone_number: input },
            ],
        } );

        return ( {
            user_exists: !!user
        } );
    }

    async signIn ( body: SignInDto ): Promise<{ success: boolean; }>
    {
        const user = this.userRepo.create( body );
        user.password = await hashPassword( body.password );

        return this.userRepo.save( user )
            .catch( ( err ) => { throw new BadRequestException( err.detail ); } )
            .then( ( res ) => { return { success: !!res }; } );
    }


}
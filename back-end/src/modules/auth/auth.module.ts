import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../database/user.entity";
import { ApiKey } from "../database/api-keys.entity";
import { ApiKeyService } from "./api-key.service";

@Module( {
    imports: [ TypeOrmModule.forFeature( [ User, ApiKey ] ) ],
    controllers: [ AuthController ],
    providers: [ AuthService, ApiKeyService ],
} )
export class AuthModule { }
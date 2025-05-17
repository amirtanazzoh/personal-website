import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ApiKeyService } from "src/modules/auth/api-key.service";

@Injectable()
export class ApiKeyGuard implements CanActivate
{
    constructor ( private readonly apiKeyService: ApiKeyService ) { }

    async canActivate ( context: ExecutionContext ): Promise<boolean>
    {
        const request = context.switchToHttp().getRequest();
        const ip = request.ip;

        const apiKey = request.headers[ 'x-sec-app' ];
        if ( !apiKey ) throw new UnauthorizedException( 'Missing API key' );

        const apiOwner = request.headers[ 'x-owner' ];
        const apiClient = await this.apiKeyService.validateApiKey( apiKey );
        if (
            !apiClient ||
            !apiClient.isActive ||
            !apiOwner ||
            apiClient.owner !== apiOwner
        )
        {
            throw new UnauthorizedException( 'Invalid API key' );
        }

        request.apiClient = apiClient;
        return true;
    }
}
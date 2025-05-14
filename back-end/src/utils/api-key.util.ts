import * as crypto from 'crypto';

export function hashApiKey ( apiKey: string, secret: string ): string
{
    return crypto.createHmac( 'sha256', secret ).update( apiKey ).digest( 'hex' );
}

export function generateApiKey (): string
{
    return crypto.randomBytes( 32 ).toString( 'hex' );
}
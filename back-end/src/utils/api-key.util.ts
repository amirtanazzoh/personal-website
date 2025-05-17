import * as crypto from 'crypto';

export function hashCrypto ( apiKey: string, secret: string = '' ): string
{
    if ( secret == '' ) secret = process.env.API_KEY_SECRET ?? '';

    return crypto.createHmac( 'sha256', secret ).update( apiKey ).digest( 'hex' );
}

export function generateApiKey (): string
{
    return crypto.randomBytes( 32 ).toString( 'hex' );
}
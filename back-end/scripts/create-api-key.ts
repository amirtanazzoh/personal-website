import 'dotenv/config';
import { generateApiKey, hashCrypto } from '../src/utils/api-key.util';
import { ApiKey } from '../src/modules/database/api-keys.entity';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource( {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number( process.env.POSTGRES_PORT ),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [ ApiKey ],
    synchronize: true,
} );

async function main ()
{
    const rawKey = generateApiKey();
    const secret = process.env.API_KEY_SECRET;

    if ( !secret ) { console.error( '❌ Missing API_KEY_SECRET in .env' ); process.exit( 1 ); }

    const keyHash = hashCrypto( rawKey, secret );

    await AppDataSource.initialize();
    const apiKeyRepo = AppDataSource.getRepository( ApiKey );

    const ownerArg = process.argv[ 2 ];
    const owner = ownerArg || 'frontend';

    const apiKey = apiKeyRepo.create( { keyHash, owner } );

    await apiKeyRepo.save( apiKey );

    console.log( '✅ API Key created successfully!' );
    console.log( 'Provide this API Key to the client (store safely):\n' );
    console.log( rawKey );

    await AppDataSource.destroy();
}

main().catch( ( err ) => { console.error( err ); AppDataSource.destroy(); } );

import 'dotenv/config';
import { User } from '../src/modules/database/user.entity';
import { EUserRole } from '../src/types/enums';
import { DataSource } from 'typeorm';
import { hashArgon } from '../src/utils/hashing.util';
import { faker } from '@faker-js/faker';
import { RefreshToken } from 'src/modules/database/refresh-token.entity';

const AppDataSource = new DataSource( {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number( process.env.POSTGRES_PORT ),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [ User, RefreshToken ],
    synchronize: true,
} );

async function main ()
{
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository( User );

    const existingAdmin = await userRepository.findOneBy( { role: EUserRole.Admin, } );
    if ( existingAdmin ) { throw new Error( 'admin user is already exists' ); }

    if ( !process.env.ADMIN_PASSWORD || !process.env.ADMIN_USERNAME )
        throw new Error( '❌ Missing ADMIN_USERNAME or ADMIN_PASSWORD in .env' );

    const hashedPassword = await hashArgon( process.env.ADMIN_PASSWORD );

    const adminUser = userRepository.create( {
        username: process.env.ADMIN_USERNAME,
        email: faker.internet.email(),
        password: hashedPassword,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone_number: faker.phone.number( { style: 'international' } ),
        role: EUserRole.Admin,
    } );

    await userRepository.save( adminUser );

    console.log( '✅ Admin user created via Environment Variable!' );

    await AppDataSource.destroy();
}

main().catch( ( err ) => { console.error( err ); AppDataSource.destroy(); } );

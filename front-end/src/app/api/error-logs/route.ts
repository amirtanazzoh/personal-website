import fs from 'fs';
import path from 'path';

export async function POST ( request: Request )
{
    const { message } = await request.json();
    const now = new Date();
    const timestamp = now.toLocaleString( 'fa-IR-u-nu-latn', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour12: false,
    } );
    const date = timestamp.toString().split( ',' )[ 0 ].replaceAll( '/', '-' );
    const logMessage = `[${ timestamp }] ${ message }\n`;

    const logDir = path.join( process.cwd(), 'logs' );
    const logFile = path.join( logDir, `error-${ date }.log` );

    fs.mkdirSync( logDir, { recursive: true } );
    fs.appendFileSync( logFile, logMessage, 'utf8' );

    return Response.json( { status: 'logged' } );
}

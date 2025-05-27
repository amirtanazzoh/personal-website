import axios from "axios";


const logToServer = async ( msg: string ) =>
{
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if ( !baseUrl ) throw new Error( 'Base URL not defined' );

    try { await axios.post( baseUrl + '/api/error-logs', { message: msg } ); }
    catch ( e ) { console.warn( 'Failed to send log to server:', e ); }
};

export const requestWrapper = async <T = any> ( request: Promise<any> ): Promise<T | {
    success: false;
    statusCode: number;
    message: string;
}> =>
{
    try { const response = await request; return response.data; }
    catch ( error: any )
    {
        const method = error?.config?.method?.toUpperCase() || 'UNKNOWN';

        const url = error?.config?.baseURL + '/' + error?.config?.url || 'UNKNOWN';

        let msg = error.response?.data.message;
        if ( Array.isArray( msg ) ) { msg = msg.join( ', \n' ); }

        const status = error.response?.data.statusCode;

        const message = `Request failed: ${ method } ${ url }:${ status } - ${ msg }`;

        await logToServer( message );

        return {
            success: false,
            statusCode: status,
            message: msg,
        };
    }
};
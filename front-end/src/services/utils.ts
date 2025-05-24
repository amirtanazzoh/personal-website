import axios from "axios";


const logToServer = async ( msg: string ) =>
{
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if ( !baseUrl ) throw new Error( 'Base URL not defined' );

    try { await axios.post( baseUrl + '/api/error-logs', { message: msg } ); }
    catch ( e ) { console.warn( 'Failed to send log to server:', e ); }
};

export const requestWrapper = async <T = any> ( request: Promise<any> ): Promise<T | null | undefined> =>
{
    try { const response = await request; return response.data; }
    catch ( error: any )
    {
        const method = error?.config?.method?.toUpperCase() || 'UNKNOWN';
        const url = error?.config?.baseURL + '/' + error?.config?.url || 'UNKNOWN';
        const msg = error.response?.data.message;
        const message = `Request failed: ${ method } ${ url } - ${ msg }`;
        await logToServer( message );
        return null;
    }
};
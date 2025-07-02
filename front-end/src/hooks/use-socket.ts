import { CLIENT_API_BASE_URL } from '@/constants';
import { refreshToken } from '@/services/auth';
import { io } from 'socket.io-client';
import useRefreshToken from './use-refresh-token';

/**
 * Custom hook to create a socket.io client instance.
 * @param url - The base URL for the socket connection, defaults to CLIENT_API_BASE_URL.
 * @param path - The path for the socket connection, defaults to '/api/ws'.
 * @returns Socket - The socket.io client instance.
 */
export default function useSocket ( url: string = CLIENT_API_BASE_URL ?? '', path = '/api/ws' )
{
    const { getToken } = useRefreshToken();

    const socket = io( url, {
        path,
        withCredentials: true,
        transports: [ 'websocket' ],
    } );

    socket.on( 'auth_err', async ( err ) =>
    {
        const token = getToken();

        if ( token )
        {
            await refreshToken( token );
            socket.disconnect();
            socket.connect();
        } else
        {
            socket.disconnect();
        }
    } );


    return socket;
}
import { CLIENT_API_BASE_URL } from '@/constants';
import { io } from 'socket.io-client';

/**
 * 
 * @param url 
 * @param path 
 * @returns 
 */
export default function useSocket ( url: string = CLIENT_API_BASE_URL ?? '', path = '/api/ws' )
{
    const socket = io( url, { path, transports: [ 'websocket' ], query: { userId: 'user_123' } } );

    return socket;
}

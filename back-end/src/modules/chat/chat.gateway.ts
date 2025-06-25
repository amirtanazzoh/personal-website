import
{
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway( 8000, { cors: { origin: process.env.APP_DOMAIN }, path: '/api/ws', } )
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    private logger: Logger = new Logger( 'WebSocketGateway' );

    // This will map userId to their connected Socket
    private connectedClients: Map<string, Socket> = new Map();

    @WebSocketServer() ws: Server;

    constructor (
        private chatService: ChatService,
        private jwtService: JwtService
    ) { }

    /**
     * Extract userId from socket handshake (query param or auth token)
     */
    private getUserIdFromSocket ( client: Socket ): string
    {

        const cookie = client.handshake.headers.cookie ?? '';

        const accessToken = cookie
            .split( '; ' )
            .find( cookie => cookie.startsWith( 'access_token=' ) )
            ?.split( '=' )[ 1 ] ?? '';

        try
        {
            return this.jwtService.verify( accessToken ).sub;

        } catch ( err )
        {
            client.emit( 'auth_err', {
                message: 'Invalid or expired token!',
            } );
            return '';
        }
    }


    afterInit ( server: Server ) { this.logger.log( 'WebSocket initialized' ); }

    /**
     * Handle client disconnection
     * @param client - The disconnected socket
     */
    handleDisconnect ( client: Socket )
    {
        const userId = this.getUserIdFromSocket( client );
        this.connectedClients.delete( userId );
        this.logger.log( `Client disconnected: ${ client.id } (User ID: ${ userId })` );
    }

    /**
     * Handle new client connection
     * @param client - The connected socket
     * @param args - Additional arguments (not used here)
     */
    async handleConnection ( client: Socket, ...args: any[] )
    {
        const userId = this.getUserIdFromSocket( client );

        if ( !userId )
        {
            this.logger.warn( `Unauthorized client attempted to connect: ${ client.id }` );
            client.disconnect();
            return;
        }

        this.connectedClients.set( userId, client );
        this.logger.log( `Client connected: ${ client.id } (User ID: ${ userId })` );
    }


}

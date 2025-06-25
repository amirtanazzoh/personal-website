import
{
    WebSocketGateway,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from 'src/common/dto/message.dto';

@WebSocketGateway( 8000, { cors: { origin: '*' }, path: '/api/ws', } )
export class ChatGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    private logger: Logger = new Logger( 'WebSocketGateway' );

    // This will map userId to their connected Socket
    private connectedClients: Map<string, Socket> = new Map();

    @WebSocketServer() ws: Server;

    constructor ( private chatService: ChatService ) { }

    afterInit ( server: Server ) { this.logger.log( 'WebSocket initialized' ); }

    handleDisconnect ( client: Socket )
    {
        const userId = this.getUserIdFromSocket( client );
        this.connectedClients.delete( userId );
        this.logger.log( `Client disconnected: ${ client.id } (${ userId })` );
    }

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
        this.logger.log( `Client connected: ${ client.id } as ${ userId }` );

        // Optional: emit confirmation
        client.emit( 'connected', { userId } );
    }

    @SubscribeMessage( 'sendMessage' )
    async handleSendMessage (
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: SendMessageDto,
    ): Promise<void>
    {
        const userId = this.getUserIdFromSocket( client );
        const { chatId, message } = payload;

        // Validate payload
        if ( !chatId || !message )
        {
            client.emit( 'error', { message: 'chatId and message are required' } );
            return;
        }

        // Check if user is part of the chat
        const isParticipant = await this.chatService.isUserInChat( chatId, userId );
        if ( !isParticipant )
        {
            client.emit( 'error', { message: 'You are not allowed in this chat' } );
            return;
        }

        // Save message
        const saved = await this.chatService.saveMessage( chatId, userId, message );

        // Broadcast to all participants
        const participants = await this.chatService.getParticipants( chatId );

        for ( const participantId of participants )
        {
            const socket = this.connectedClients.get( participantId );
            if ( socket )
            {
                socket.emit( 'newMessage', {
                    chatId,
                    from: userId,
                    content: saved.content,
                    timestamp: saved.timestamp,
                } );
            }
        }
    }

    /**
     * Extract userId from socket handshake (query param or auth token)
     */
    private getUserIdFromSocket ( client: Socket ): string
    {
        // Option 1: from token -> parse & verify (recommended for prod)
        // const token = client.handshake.auth?.token;

        // Option 2: for testing, use a query param
        return client.handshake.query.userId as string;
    }
}

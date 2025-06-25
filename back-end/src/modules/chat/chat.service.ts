import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../database/chat.entity';
import { ChatParticipant } from '../database/chat-participant.entity';
import { Message } from '../database/message.entity';

@Injectable()
export class ChatService
{
    constructor (
        @InjectRepository( Chat )
        private chatRepo: Repository<Chat>,

        @InjectRepository( ChatParticipant )
        private participantRepo: Repository<ChatParticipant>,

        @InjectRepository( Message )
        private messageRepo: Repository<Message>
    ) { }

    async createChat ( participantIds: string[] ): Promise<Chat>
    {
        const chat = this.chatRepo.create();
        await this.chatRepo.save( chat );

        for ( const userId of participantIds )
        {
            const participant = this.participantRepo.create( { userId, chat } );
            await this.participantRepo.save( participant );
        }

        return chat;
    }

    async getParticipants ( chatId: string ): Promise<string[]>
    {
        const participants = await this.participantRepo.find( {
            where: { chat: { id: chatId } },
            relations: [ 'chat' ],
        } );
        return participants.map( p => p.userId );
    }

    async isUserInChat ( chatId: string, userId: string ): Promise<boolean>
    {
        const participant = await this.participantRepo.findOne( {
            where: {
                userId,
                chat: { id: chatId },
            },
            relations: [ 'chat' ],
        } );

        return !!participant;
    }

    async saveMessage ( chatId: string, fromId: string, content: string ): Promise<Message>
    {
        const chat = await this.chatRepo.findOneBy( { id: chatId } );
        if ( !chat ) throw new Error( 'Chat not found' );

        const message = this.messageRepo.create( {
            chat,
            fromId,
            content,
        } );

        return this.messageRepo.save( message );
    }

    async getMessages ( chatId: string ): Promise<Message[]>
    {
        return this.messageRepo.find( {
            where: { chat: { id: chatId } },
            order: { timestamp: 'ASC' },
            relations: [ 'chat' ],
        } );
    }
}

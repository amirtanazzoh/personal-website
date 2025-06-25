import { Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Message } from './message.entity';
import { ChatParticipant } from './chat-participant.entity';

@Entity()
export class Chat
{
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany( () => Message, message => message.chat )
    messages: Message[];

    @OneToMany( () => ChatParticipant, participant => participant.chat )
    participants: ChatParticipant[];
}

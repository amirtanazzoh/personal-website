import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
@Unique( [ 'userId', 'chat' ] )
export class ChatParticipant
{
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column()
    userId: string; // Use admin/user ID

    @ManyToOne( () => Chat, chat => chat.participants, { onDelete: 'CASCADE' } )
    chat: Chat;
}

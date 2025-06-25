import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class Message
{
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column()
    fromId: string;

    @Column()
    content: string;

    @CreateDateColumn()
    timestamp: Date;

    @ManyToOne( () => Chat, chat => chat.messages, { onDelete: 'CASCADE' } )
    chat: Chat;
}

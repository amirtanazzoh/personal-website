import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "../database/chat.entity";
import { ChatParticipant } from "../database/chat-participant.entity";
import { Message } from "../database/message.entity";

@Module( {
    imports: [ TypeOrmModule.forFeature( [ Chat, ChatParticipant, Message ] ) ],
    controllers: [],
    providers: [ ChatGateway, ChatService ],
} )
export default class ChatModule { }
import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "../database/chat.entity";
import { ChatParticipant } from "../database/chat-participant.entity";
import { Message } from "../database/message.entity";
import { JWTConfigModule } from "../jwt.module";

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ Chat, ChatParticipant, Message ] ),
        JWTConfigModule,
    ],
    controllers: [],
    providers: [ ChatGateway, ChatService ],
} )
export default class ChatModule { }
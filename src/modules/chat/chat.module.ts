import { Module } from '@nestjs/common';

import { RoomModule } from '../room/room.module';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { APP_CONFIG } from 'src/app.config';


@Module({
  imports: [
    JwtModule.register({
      secret: APP_CONFIG.jwtSecret,
    }),  
    RoomModule
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
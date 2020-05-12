import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
  } from '@nestjs/websockets';
import { User } from '../user/models/user';
import { JwtService } from '@nestjs/jwt';
import { RoomService } from '../room/room.service';
import { UseGuards } from '@nestjs/common';
import { JwtWsStrategy } from '../auth/jwt-ws.strategy';

@WebSocketGateway()
@UseGuards(JwtWsStrategy)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;
    connectedUsers: string[] = [];

    constructor(
        private readonly jwtService: JwtService,
        private readonly roomService: RoomService
    ){}
  
    handleConnection(socket) {
        const user: User = this.jwtService.verify(socket.handshake.query.token);

        this.connectedUsers = [...this.connectedUsers, String(user._id)];

        // send list of connected users
        this.server.emit('users', this.connectedUsers);
    }

    handleDisconnect(socket) {
        const user: User = this.jwtService.verify(socket.handshake.query.token)

        const userPos = this.connectedUsers.indexOf(String(user._id));

        if(userPos !== -1) {
            this.connectedUsers = [
                ...this.connectedUsers.slice(0, userPos),
                ...this.connectedUsers.slice(userPos + 1)
            ];
        }
        
        // send lilst of connected users
        this.server.emit('users', this.connectedUsers);
    }

    @SubscribeMessage('message')
    async onMessage(client, data: any) {
        await this.roomService.addMessage(data, 'room');
        client.broadcast.to('room').emir('message', data);
    }

    @SubscribeMessage('join')
    async onRoomJoin(client, id:string) {
        client.join(id);
        
        const messages = await this.roomService.findWithLimit(id, 25);

        // send latest 25 messages to the connected user
        client.emit('message', messages);
    }

    @SubscribeMessage('leave')
    onRoomLeave(client, id: string): void {
        client.leave(id);
    }

}
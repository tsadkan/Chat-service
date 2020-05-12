import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './models/room';
import { Message } from './models/message';
import { RoomDto } from './models/room-dto';


@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room') private readonly roomModel: Model<Room>
  ) {}

  async create(room: RoomDto): Promise<Room> {
    const createdRoom = new this.roomModel(room);
    return await createdRoom.save();
  }

//   TODO
  async addMessage(message: Message, id: string) {
    const room = await this.findById(id);

    // TODO recieve user from decoded token
    room.messages.push(message);

    return await room.save();
  }

//   TODO
  async findMessages(id: string, limit: number) {
    let room = await this.findWithLimit(id, limit);

    // Create the user room, if isn't already exist
    if (!room) {
      const userRoom = new this.roomModel({ _id: id, name: id});
      room = await this.create(userRoom);
    }

    return room.messages;
  }

  async findAll(options?: any): Promise<Room[]> {
    return await this.roomModel.find(options).exec();
  }

  async findWithLimit(id: string, limit: number): Promise<Room | null> {
    return await this.roomModel
      .findById(id)
      .slice('messages', limit)
      .exec();
  }

  async findById(id: string): Promise<Room | null> {
    return await this.roomModel.findById(id).exec();
  }

  async findOne(options?: any, fields?: any): Promise<Room | null> {
    return await this.roomModel.findOne(options, fields).exec();
  }

  async update(id: string, newValue: RoomDto): Promise<Room | null> {
    return await this.roomModel.findByIdAndUpdate(id, newValue).exec();
  }

  async delete(id: string): Promise<Room | null> {
    return await this.roomModel.findByIdAndRemove(id).exec();
  }
}
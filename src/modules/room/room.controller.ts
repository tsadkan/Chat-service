import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Put,
    Param,
    BadRequestException,
  } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './models/room';
import { RoomDto } from './models/room-dto';
  
  
  @Controller('rooms')
  export class RoomController {
    constructor(private readonly roomsService: RoomService) {}
  
    @Get()
    async list(): Promise<Room[]> {
      return await this.roomsService.findAll();
    }
  
    @Get(':id')
    async show(@Param('id') id: string): Promise<Room> {
      if (!id) throw new BadRequestException('ID parameter is missing');
  
      const room = await this.roomsService.findById(id);
      if (!room) throw new BadRequestException(`No user found with id : ${id}`);

      return room;
    }
  
    @Post()
    async create(@Body() body: RoomDto): Promise<Room> {
      const room = await this.roomsService.create(body);
  
      return room;
    }
  
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: RoomDto) {
      if (!id) throw new BadRequestException('ID parameter is missing');
  
      await this.roomsService.update(id, body);
    }
  
    @Delete(':id')
    public async delete(@Param('id') id: string) {
      if (!id) throw new BadRequestException('ID parameter is missing');

      await this.roomsService.delete(id);
    }
  }
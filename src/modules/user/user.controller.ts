import { Controller, Get, Param, Post, BadRequestException, Body, Put, Delete, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user';
import { UserDto } from './models/user-dto';
import { MongoExceptionFilter } from 'src/filters/mongo.filter';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async list(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async show(@Param('id') id: string): Promise<User | null> {
        if(!id) throw new BadRequestException('ID parameter is missing');

        const user = await this.userService.findById(id)
        
        if(!user) throw new BadRequestException(`A user with id : ${id} not found`);

        return user;
    }

    @Post()
    @UseFilters(MongoExceptionFilter)
    async create(@Body() user: UserDto): Promise<any | null> {
        return await this.userService.create(user);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() user:UserDto): Promise<User | null>{
        if(!id) throw new BadRequestException('ID parameter is missing');

        const u = await this.userService.findById(id)
        
        if(!u) throw new BadRequestException(`A user with id : ${id} not found`);

        return await this.userService.update(id, user);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<User | null> {
        if(!id) throw new BadRequestException('ID parameter is missing');

        const user = await this.userService.findById(id)
        
        if(!user) throw new BadRequestException(`A user with id : ${id} not found`);

        return await this.userService.delete(id);
    }
    
}

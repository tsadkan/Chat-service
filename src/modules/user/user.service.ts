import { Injectable } from '@nestjs/common';
import { User } from './models/user';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './models/user-dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly UserModel: Model<User>
    ) {}

    async create(user: UserDto): Promise<User> {
        const createdUser = new this.UserModel(user);

        return await createdUser.save()
    }

    async findAll(options?: any): Promise<User[]> {
        const users = await this.UserModel.find(options).exec();

        const serializedUsers = users.map(user => user.schema.methods.serialize(user));

        return serializedUsers;
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.UserModel.findById(id).exec();

        if(user) return user.schema.methods.serialize(user);

        return user
    }

    async findOne(options?: any, fields?: any, isSerialized?: boolean): Promise<User | null> {
        const user = await this.UserModel.findOne(options, fields).exec()

        if(user && isSerialized) return user.schema.methods.serialize(user);

        return user;
    }

    async update(id: string, newValue: UserDto): Promise<User | null> {
        return await this.UserModel.findByIdAndUpdate(id, newValue).exec();
    }

    async delete(id: string): Promise<User | null> {
        return await this.UserModel.findByIdAndRemove(id).exec();
    }
}
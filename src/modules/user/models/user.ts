
import * as mongoose from 'mongoose';

export class User extends mongoose.Document {
    readonly _id: string;
    readonly name?: string;
    readonly email: string;
    password: string;
    readonly username?: string;
    readonly admin?: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
}
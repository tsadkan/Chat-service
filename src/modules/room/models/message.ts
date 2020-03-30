import { Document } from 'mongoose';
import { User } from 'src/modules/user/models/user';

export interface Message extends Document {
  readonly message: string;
  user ?: User;
  fromUser ?: User;
  toUser ?: User;
  readonly created_at: Date;
  readonly updated_at: Date;
}
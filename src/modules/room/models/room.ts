import { Document } from 'mongoose';
import { User } from 'src/modules/user/models/user';
import { Message } from './message';

export interface Room extends Document {
  readonly name: string;
  readonly description?: string;
  readonly is_private: boolean;
  readonly users?: User[];
  readonly messages?: Message[];
  readonly created_at: Date;
  readonly updated_at: Date;
}
import { Schema } from 'mongoose';
import { UserSchema } from 'src/modules/user/schemas/user.schema';
import { MessageSchema } from './message.schema';

const room = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  // eslint-disable-next-line @typescript-eslint/camelcase
  is_private: { type: Boolean, default: false },
  users: [UserSchema],
  messages: [MessageSchema],
}, { timestamps: true });

export const RoomSchema = room;
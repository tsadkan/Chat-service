import { User } from 'src/modules/user/models/user';
import { Message } from './message';
import { IsString, IsNotEmpty, IsBoolean, IsArray } from 'class-validator';

export class RoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description?: string;
  
  @IsBoolean()
  @IsNotEmpty()
  is_private: boolean;

  @IsArray()
  @IsNotEmpty()
  users?: User[];

  @IsArray()
  @IsNotEmpty()
  messages?: Message[];
}
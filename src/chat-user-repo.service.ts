import { ModelType } from '@hasezoey/typegoose';
import { BaseService } from '@leocloud/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ChatUserEntity } from './chat-user-entity';
import { ChatUserDTO } from './dtos/chat-user.dto';

@Injectable()
export class ChatUserRepoService extends BaseService<ChatUserEntity> {
  protected readonly logger = new Logger(`${ChatUserRepoService.name}`, true);
  constructor(@InjectModel(ChatUserEntity.modelName) _entityModel: ModelType<ChatUserEntity>) {
    super();
    this._model = _entityModel;
  }

  async createChatUser(user: ChatUserDTO): Promise<ChatUserDTO> {
    return await this._mo(user);
  }

  async updateChatUser(id: string, user: Partial<ChatUserDTO>): Promise<ChatUserDTO> {
    return await this.update(id, user);
  }

  async removeChatUser(id: string): Promise<ChatUserDTO | null> {
    return await this.delete(id);
  }

  async getContactList(id: string): Promise<ChatUserDTO[] | []> {
    const user = await this.getSingleUser({ id });
    const { teamIds } = user;

    const result = await Promise.all(
      teamIds.map(teamId => {
        return this.getUsers({ teamIds: teamId });
      }),
    );

    const users = [].concat(...result);
    return users;
  }

  async getUsers(filter?: {}): Promise<ChatUserDTO[] | []> {
    return await this.findAll(filter);
  }

  async getSingleUserById(id: string): Promise<ChatUserDTO | null> {
    return await this.findById(id);
  }

  async getSingleUser(user: Partial<ChatUserDTO>): Promise<ChatUserDTO | null> {
    return await this.findOne(user);
  }

  async blockUser(id: string, userId: string, until: Date): Promise<any> {
    // TODO
  }
}

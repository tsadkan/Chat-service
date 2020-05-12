import { Injectable, Logger } from '@nestjs/common';
import * as serializeError from 'serialize-error';

import { ChatUserRepoService } from './chat-user-repo.service';
import { ChatUserDTO } from './dtos/chat-user.dto';
import { connections } from 'mongoose';
@Injectable()
export class ChatUserService {
  protected readonly logger = new Logger(`${ChatUserService.name}`, true);
  constructor(private readonly repoService: ChatUserRepoService) {}

  async createUser(user: ChatUserDTO) {
    try {
      return await this.repoService.createChatUser(user);
    } catch (err) {
      this.logger.error(`createUser error, ${JSON.stringify(serializeError(err))}`);
    }
  }

  async updateUser(id: string, user: Partial<ChatUserDTO>) {
    try {
      return await this.repoService.updateChatUser(id, user);
    } catch (err) {
      this.logger.error(`updateUser error, ${JSON.stringify(serializeError(err))}`);
    }
  }

  async removeUser(id: string) {
    try {
      return await this.repoService.removeChatUser(id);
    } catch (err) {
      this.logger.error(`removeUser error, ${JSON.stringify(serializeError(err))}`);
    }
  }

  async getContactList(id: string) {
    try {
      return await this.repoService.getContactList(id);
    } catch (err) {
      this.logger.error(`getContactList error, ${JSON.stringify(serializeError(err))}`);
    }
  }

  async getUsers(filter?: {}) {
    try {
      return await this.repoService.getUsers(filter);
    } catch (err) {
      this.logger.error(`getUsers error, ${JSON.stringify(serializeError(err))}`);
    }
  }

  async getSingleUser(user: Partial<ChatUserDTO>) {
    try {
      return await this.repoService.getSingleUser(user);
    } catch (err) {
      this.logger.error(`getSigleUser error, ${JSON.stringify(serializeError(err))}`);
    }
  }

  async setStatus(id: string, status: string) {
    try {
      return await this.repoService.updateChatUser(id, { status });
    } catch (err) {
      this.logger.error(`setStatus error, ${JSON.stringify(serializeError(err))}`);
    }
  }

  async blockUser(id: string, userId: string, until?: Date) {
    try {
      return await this.repoService.blockUser(id, userId, until);
    } catch (err) {
      this.logger.error(`blockUser error, ${JSON.stringify(serializeError(err))}`);
    }
  }

  async addTeamToUser(userId: string, teamId: string, teamIds: Array<string>): Promise<ChatUserDTO | null> {
    if (!teamIds.includes(teamId)) {
      teamIds.push(teamId);
      return this.updateUser(userId, { teamIds });
    }

    return Promise.resolve(null);
  }

  async removeTeamFromUser(userId: string, teamId: string, teamIds: Array<string>): Promise<ChatUserDTO | null> {
    const index = teamIds.indexOf(teamId);
    if (index !== -1) {
      teamIds.splice(index, 1);
      return this.updateUser(userId, { teamIds });
    }

    return Promise.resolve(null);
  }
}

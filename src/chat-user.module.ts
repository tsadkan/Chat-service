import { Module } from '@nestjs/common';

import { ChatUserController } from './chat-user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatUserEntity } from './chat-user-entity';
import { ChatUserMicroserviceController } from './chat-user-microservice.controller';
import { ChatUserService } from './chat-user.service';
import { ChatUserRepoService } from './chat-user-repo.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ChatUserEntity.modelName, schema: ChatUserEntity.model.schema, collection: 'chat-user' }])],
  providers: [ChatUserRepoService, ChatUserService],
  controllers: [ChatUserController, ChatUserMicroserviceController],
})
export class ChatUserModule {}

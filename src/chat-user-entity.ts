import { InstanceType, ModelType, prop } from '@hasezoey/typegoose';
import { BaseModel } from '@leocloud/shared';
import { schemaOptions } from '@leocloud/shared/dist/helpers/typegoose/base-model';
import { ChatUserDTO } from './dtos/chat-user.dto';
import { UserStatuses } from './enums/userstatuses.enum';

export class ChatUserEntity extends BaseModel<ChatUserEntity> {
  static get model(): ModelType<ChatUserEntity> {
    return new ChatUserEntity().getModelForClass(ChatUserEntity, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }

  static create(user: ChatUserDTO): InstanceType<ChatUserEntity> {
    const entity = new ChatUserEntity() as InstanceType<ChatUserEntity>;
    entity.userId = user.userId;
    entity.companyId = user.companyId;
    entity.teamIds = user.teamIds;
    entity.status = user.status;

    return entity;
  }

  @prop({ unique: true, required: true })
  userId?: string;

  @prop({ unique: true })
  profileId?: string;

  @prop({ unique: true })
  email?: string;

  @prop()
  firstname?: string;

  @prop()
  lastname?: string;

  @prop({ required: true })
  companyId?: string;

  @prop({ default: [] })
  teamIds?: Array<string>;

  @prop({ default: UserStatuses.NOT_AVAILABLE })
  status?: string;
}

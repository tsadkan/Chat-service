import { Test, TestingModule } from '@nestjs/testing';
import { ChatUserMicroserviceController } from './chat-user-microservice.controller';
import { ChatUserService } from './chat-user.service';
import { ChatUserRepoService } from './chat-user-repo.service';
import { getModelToken } from '@nestjs/mongoose';
import { ChatUserEntity } from './chat-user-entity';

jest.mock('@leocloud/shared/dist/packages/microservice/provider/microservice.provider');
describe('ChatUser Microservice Controller', () => {
  let controller: ChatUserMicroserviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatUserMicroserviceController],
      providers: [
        ChatUserService,
        ChatUserRepoService,
        {
          provide: getModelToken(ChatUserEntity.modelName),
          useValue: new ChatUserEntity().getModelForClass(ChatUserEntity),
        },
      ],
    }).compile();

    controller = module.get<ChatUserMicroserviceController>(ChatUserMicroserviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

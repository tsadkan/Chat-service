import { Test, TestingModule } from '@nestjs/testing';

import { ChatUserService } from './chat-user.service';
import { ChatUserRepoService } from './chat-user-repo.service';
import { getModelToken } from '@nestjs/mongoose';
import { ChatUserEntity } from './chat-user-entity';

describe('ChatUserService', () => {
  let service: ChatUserService;
  let repoService: ChatUserRepoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatUserRepoService,
        ChatUserService,
        {
          provide: getModelToken(ChatUserEntity.modelName),
          useValue: new ChatUserEntity().getModelForClass(ChatUserEntity),
        },
      ],
    }).compile();

    service = module.get<ChatUserService>(ChatUserService);
    repoService = module.get<ChatUserRepoService>(ChatUserRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

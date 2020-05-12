import { Test, TestingModule } from '@nestjs/testing';
import { MongoError } from 'mongodb';

import { ChatUserRepoService } from './chat-user-repo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatUserEntity } from './chat-user-entity';
import { MockCreate } from '../../../test/create.helper';
import { MockChatUser } from '../../../test/mocks';
import { ChatUserDTO } from './dtos/chat-user.dto';
import { DatabaseModule } from '../database/database.module';
import { connections } from 'mongoose';
import { UserStatuses } from './enums/userstatuses.enum';

describe('ChatRepoService', () => {
  let service: ChatUserRepoService;
  let app: TestingModule;

  beforeAll(async () => {
    jest.setTimeout(20000);
    app = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        MongooseModule.forFeature([{ name: ChatUserEntity.modelName, schema: ChatUserEntity.model.schema, collection: 'chat-user' }]),
      ],
      providers: [
        ChatUserRepoService,
        {
          provide: new ChatUserEntity().getModelForClass(ChatUserEntity),
          useValue: new ChatUserEntity().getModelForClass(ChatUserEntity),
        },
      ],
    }).compile();

    service = app.get<ChatUserRepoService>(ChatUserRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create & save chat-user successfully', async () => {
    const chatUser: ChatUserDTO = MockCreate<ChatUserDTO>(ChatUserDTO, MockChatUser);
    const savedChatUser: any = await service.createChatUser(chatUser);

    expect(savedChatUser._id).toBeDefined();
    expect(savedChatUser.userId).toEqual(chatUser.userId);
    expect(savedChatUser.firstname).toEqual(savedChatUser.firstname);
    expect(savedChatUser.lastname).toEqual(savedChatUser.lastname);
    expect(savedChatUser.email).toEqual(savedChatUser.email);
    expect(savedChatUser.profileId).toEqual(savedChatUser.profileId);
    expect(savedChatUser.companyId).toEqual(savedChatUser.companyId);
    expect(savedChatUser.status).toEqual(savedChatUser.status || UserStatuses.NOT_AVAILABLE);
    expect(savedChatUser.teamIds).toEqual(savedChatUser.teamIds || []);
  });

  it('should fail creating chat-user with duplicate data', async () => {
    const chatUser: ChatUserDTO = MockCreate<ChatUserDTO>(ChatUserDTO, MockChatUser);

    let err;
    try {
      const savedChatUser = await service.createChatUser(chatUser);
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(MongoError);
    expect(err.code).toEqual(11000);
  });

  it('should insert create and save chat-user successfully, but the field does not defined in schema should be undefined', async () => {
    MockChatUser.nickName = 'xyz';
    MockChatUser.userId = '5ae0662b0df93c001ae5ee0e';
    MockChatUser.profileId = '5ae0662b0df93c001ae5ee0e';
    MockChatUser.email = 'info1@leogistics.com';

    const chatUser: ChatUserDTO = MockCreate<ChatUserDTO>(ChatUserDTO, MockChatUser);
    const savedChatUser: any = await service.createChatUser(chatUser);

    expect(savedChatUser._id).toBeDefined();
    expect(savedChatUser.nickName).toBeUndefined();
  });

  it('should fail creating chat-user without required fields', async () => {
    delete MockChatUser.userId;
    delete MockChatUser.companyId;
    const chatUser: ChatUserDTO = MockCreate<ChatUserDTO>(ChatUserDTO, MockChatUser);

    let err;
    try {
      const savedChatUser = await service.createChatUser(chatUser);
    } catch (error) {
      err = error;
    }

    //   // expect(err).toBeInstanceOf(MongooseError)
    expect(err.errors.companyId).toBeDefined();
    expect(err.errors.userId).toBeDefined();
  });

  it('should update chat-user', async () => {
    // const chatUser = await service.getSingleUser({ userId: MockChatUser.userId });

    const updatedData = { profileId: '5ae0662b0df93c001ae5ee0a' };
    const updateChatUser: ChatUserDTO = MockCreate<ChatUserDTO>(ChatUserDTO, updatedData);

    const updatedChatUser = await service.updateChatUser('5e8a5f7ced3a563271e43f9c', updateChatUser);

    expect(updateChatUser.profileId).toEqual(updatedData.profileId);
  });

  it('should not update a chat-user with id not found', async () => {
    const mockId = '5e8a5f7ced3a563271e43f9c';

    const updatedData = { profileId: '5ae0662b0df93c001ae5ee0a' };
    const updateChatUser: ChatUserDTO = MockCreate<ChatUserDTO>(ChatUserDTO, updatedData);

    const updatedChatUser = await service.updateChatUser(mockId, updateChatUser);

    expect(updatedChatUser).toBeNull();
  });

  it('should remove chat-user', async () => {
    const spy1 = jest.spyOn(service, 'delete').mockResolvedValue(MockChatUser);

    const mockId = '5e8a684e232c0f3bd68af56c';
    await service.removeChatUser(mockId);

    expect(spy1).toBeCalledWith(mockId);
  });

  it('should return single chat-user', async () => {
    const mockId = '5e8a67bbb245fe3b3fffe61f';
    const spy1 = jest.spyOn(service, 'findById').mockResolvedValue(mockId);

    await service.getSingleUserById(mockId);

    expect(spy1).toBeCalledWith(mockId);
  });

  it('should return list of chat-users', async () => {
    // TODO
  });

  it('should return list of contact lists', async () => {
    // TODO
  });

  it('should return list of contact lists', async () => {
    // TODO
  });

  afterAll(async done => {
    connections[1].close(() => {
      done();
    });
    await app.close();
  });
});

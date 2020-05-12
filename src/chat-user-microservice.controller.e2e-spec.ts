import { INestApplication } from '@nestjs/common';
import { NatsOptions, Transport, ClientsModule, ClientProxy } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { setTimeout } from 'timers';

import { AppModule } from '../src/app.module';
import { UserCreatedInterface } from '../src/modules/chat-user/interfaces';
import { MockUserCreated, MockChatUser } from './mocks';
import { ChatUserServiceCommands } from '../src/modules/chat-user/enums/chatdata-service-commands.enum';
import { ChatUserService } from '../src/modules/chat-user/chat-user.service';
import { ChatUserRepoService } from '../src/modules/chat-user/chat-user-repo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatUserEntity } from '../src/modules/chat-user/chat-user-entity';
import { DatabaseModule } from '../src/modules/database/database.module';

import { connections } from 'mongoose';
import { ResponseProfileInterface } from '@leocloud/shared';
import { MockMasterController } from './nestjs/mocks';

const delay = (ms: number) => {
  return new Promise(res => {
    setTimeout(() => res(), ms);
  });
};

describe('ChatUserMicroserviceController (e2e)', () => {
  let app: INestApplication;
  let client: ClientProxy;
  let chatUserService: ChatUserService;

  const CHAT_USER_SERVICE = 'CHAT_USER_SERVICE';

  beforeAll(async () => {
    jest.setTimeout(20000);
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([{ name: CHAT_USER_SERVICE, transport: Transport.NATS }]),
        DatabaseModule,
        MongooseModule.forFeature([{ name: ChatUserEntity.modelName, schema: ChatUserEntity.model.schema, collection: 'chat-user' }]),
      ],
      providers: [
        ChatUserRepoService,
        ChatUserService,
        {
          provide: new ChatUserEntity().getModelForClass(ChatUserEntity),
          useValue: new ChatUserEntity().getModelForClass(ChatUserEntity),
        },
      ],
    }).compile();

    chatUserService = moduleFixture.get<ChatUserService>(ChatUserService);

    app = await moduleFixture.createNestApplication();
    const configService = await app.get('ConfigService');

    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        url: configService.get('NATS_SERVICE_URL'),
        queue: configService.get('NATS_QUEUE_NAME'),
        maxReconnectAttempts: parseInt(configService.get('NATS_RETRY_ATTEMPTS'), 10),
        reconnect: true,
        reconnectTimeWait: parseInt(configService.get('NATS_RETRY_DELAY'), 10),
      },
    } as NatsOptions);

    await app.startAllMicroservicesAsync();
    await app.init();

    client = app.get(CHAT_USER_SERVICE);
    await client.connect();
  });

  it('should add new user on "USER_CREATED" event', async () => {
    const payload: UserCreatedInterface = MockUserCreated;
    const profile: ResponseProfileInterface = await new MockMasterController(payload.id).getProfile();
    const spy1 = jest.spyOn(chatUserService, 'createUser').mockResolvedValue(MockChatUser);

    await client.emit(ChatUserServiceCommands.USER_CREATED, payload).toPromise();

    await new Promise(res =>
      setTimeout(() => {
        expect(true).toBe(true);
        expect(spy1).toBeCalled();
        expect(spy1).toBeCalledWith({
          userId: payload.id,
          companyId: profile.companyId,
          profileId: profile.id,
          email: profile.email,
          firstname: profile.firstname,
          lastname: profile.lastname,
          blocked: profile.blocked,
        });
        res();
      }, 15000),
    );
  });

  afterAll(async () => {
    await delay(30000);
    connections[1].close(() => {});
    await app.close();
    await client.close();
  });
});

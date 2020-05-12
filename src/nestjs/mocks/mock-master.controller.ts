import { Client, ClientProxy, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { UnprocessableEntityException } from '@nestjs/common';
import { ResponseProfileInterface, RequestByIdInterface, MasterdataServiceCommands, RedisConstants } from '@leocloud/shared';
import { MockProfile } from '../../mocks';

export class MockMasterController {
  @Client()
  private client: ClientProxy;
  private readonly userId: string;

  constructor(userId: string) {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        retryAttempts: RedisConstants.REDIS_RETRY_ATTEMPTS,
        retryDelay: RedisConstants.REDIS_RETRY_DELAY,
        url: 'mock-url',
      },
    });
    this.userId = userId;
  }

  async getProfile(): Promise<ResponseProfileInterface> {
    let profile: ResponseProfileInterface = null;
    try {
      // await this.client.connect();
      const pattern = { cmd: MasterdataServiceCommands.GET_PROFILE_BY_USERID };
      const payload: RequestByIdInterface = {
        id: this.userId,
      };
      // profile = await this.client.send<RequestByIdInterface>(pattern, payload);
      profile = MockProfile;
    } catch (e) {
      throw new UnprocessableEntityException();
    }
    return profile;
  }
}

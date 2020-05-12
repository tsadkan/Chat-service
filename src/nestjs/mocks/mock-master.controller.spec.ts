import { MockMasterController } from '.';
import { MockProfile } from '../../mocks';

it('should return a Profile', async () => {
  const profile = await new MockMasterController('5ae0662b0df93c001ae5ee0f').getProfile();
  expect(profile).toEqual(MockProfile);
});

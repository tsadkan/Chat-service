export interface TeamCreatedInterface {
  name: string;
  id: string;
  externalRef?: string;
  userIds: string[];
  context: 'application' | 'company';
}

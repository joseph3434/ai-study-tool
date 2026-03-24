import type { ConversationTree } from './conversation';

export interface Session {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  tree: ConversationTree;
}

import { GroupedReactionsSchemaType } from '@/schemas/message';
import { Message } from './generated/prisma/client';

export type MessageListItem = Message & {
  repliesCount: number;
  reactions: GroupedReactionsSchemaType[];
};

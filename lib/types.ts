import { GroupedReactionsSchemaType } from '@/schemas/message';
import { Message } from './generated/prisma/client';

export type MessageListItem = Message & {
  replyCount: number;
  reactions: GroupedReactionsSchemaType[];
};

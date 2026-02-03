import { createWorkspace, listWorkspaces } from './workspace';
import { createChannel, getChannel, listChannels } from './channel';
import {
  createMessageChannel,
  listMessages,
  listThreadReplies,
  toggleReaction,
  updateMessage,
} from './message';
import { inviteMember, listMembers } from './member';
import { generateThreadSummary } from './ai';

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspace,
    member: {
      list: listMembers,
      invite: inviteMember,
    },
  },

  channel: {
    create: createChannel,
    list: listChannels,
    get: getChannel,
  },

  message: {
    create: createMessageChannel,
    list: listMessages,
    update: updateMessage,
    reaction: {
      toggle: toggleReaction,
    },
    thread: {
      list: listThreadReplies,
    },
  },

  ai: {
    // compose: {
    //   generate:
    // },
    thread: {
      summary: {
        generate: generateThreadSummary,
      },
    },
  },
};

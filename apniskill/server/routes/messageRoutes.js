import { listConversations, sendMessage } from '../controllers/messageController.js';

export const messageRoutes = [
  {
    method: 'GET',
    path: '/api/messages',
    handler: listConversations,
  },
  {
    method: 'POST',
    path: '/api/messages',
    handler: sendMessage,
  },
];

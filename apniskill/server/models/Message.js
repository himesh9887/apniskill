import { randomUUID } from 'node:crypto';

export function buildMessage({ senderId, text }) {
  return {
    id: `message-${randomUUID()}`,
    senderId,
    text: String(text || '').trim(),
    createdAt: new Date().toISOString(),
  };
}

export function buildConversation(currentUserId, recipientId, firstMessage) {
  return {
    id: `chat-${randomUUID()}`,
    participantIds: [currentUserId, recipientId],
    messages: [firstMessage],
  };
}

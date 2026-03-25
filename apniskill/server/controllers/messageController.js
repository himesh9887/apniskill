import { readDatabase, writeDatabase } from '../config/db.js';
import { requireAuthenticatedUser } from '../middleware/authMiddleware.js';
import { sendError, sendJson } from '../middleware/errorMiddleware.js';
import { buildConversation, buildMessage } from '../models/Message.js';
import { sanitizeUser } from '../models/User.js';

function sameParticipants(participantIds, userA, userB) {
  return participantIds.includes(userA) && participantIds.includes(userB);
}

function decorateConversation(conversation, currentUserId, users) {
  const participantId = conversation.participantIds.find((id) => id !== currentUserId);
  const participant = sanitizeUser(users.find((user) => user.id === participantId));

  return {
    ...conversation,
    participantId,
    participant,
    lastMessage: conversation.messages[conversation.messages.length - 1]?.text || '',
  };
}

export async function listConversations({ request, response }) {
  const data = await readDatabase();
  const currentUser = requireAuthenticatedUser(request, response, data);

  if (!currentUser) {
    return;
  }

  const conversations = data.conversations
    .filter((conversation) => conversation.participantIds.includes(currentUser.id))
    .map((conversation) => decorateConversation(conversation, currentUser.id, data.users));

  sendJson(response, 200, { conversations });
}

export async function sendMessage({ request, response, body }) {
  const data = await readDatabase();
  const currentUser = requireAuthenticatedUser(request, response, data);

  if (!currentUser) {
    return;
  }

  const recipientId = String(body.recipientId || '').trim();
  const text = String(body.text || '').trim();
  const recipient = data.users.find((user) => user.id === recipientId);

  if (!recipient || recipient.id === currentUser.id) {
    sendError(response, 400, 'Choose a valid recipient.');
    return;
  }

  if (!text) {
    sendError(response, 400, 'Message text is required.');
    return;
  }

  const message = buildMessage({
    senderId: currentUser.id,
    text,
  });

  const existingConversation = data.conversations.find((conversation) =>
    sameParticipants(conversation.participantIds, currentUser.id, recipientId),
  );

  if (existingConversation) {
    existingConversation.messages.push(message);
  } else {
    data.conversations.unshift(buildConversation(currentUser.id, recipientId, message));
  }

  await writeDatabase(data);

  const conversations = data.conversations
    .filter((conversation) => conversation.participantIds.includes(currentUser.id))
    .map((conversation) => decorateConversation(conversation, currentUser.id, data.users));

  sendJson(response, 200, { conversations });
}

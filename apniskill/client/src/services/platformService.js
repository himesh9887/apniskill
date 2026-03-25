import api, { getApiErrorMessage } from './api.js';
import {
  defaultCurrentUser,
  demoConversations,
  demoMatches,
  demoUsers,
} from '../data/demoData.js';

const USERS_KEY = 'apniskill_users';
const MATCHES_KEY = 'apniskill_matches';
const CONVERSATIONS_KEY = 'apniskill_conversations';
const CURRENT_USER_ID_KEY = 'apniskill_current_user_id';
export const APP_DATA_SYNC_EVENT = 'apniskill:data-sync';

function readJson(key, fallbackValue) {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.error(`Unable to parse localStorage key "${key}":`, error);
    return fallbackValue;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function emitAppDataSync() {
  window.dispatchEvent(new CustomEvent(APP_DATA_SYNC_EVENT));
}

function normalizeSkills(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function makeToken() {
  return `demo-token-${crypto.randomUUID()}`;
}

function getUsers() {
  seedLocalDatabase();
  return readJson(USERS_KEY, []);
}

function setUsers(users) {
  writeJson(USERS_KEY, users);
}

function getCurrentUserId() {
  seedLocalDatabase();
  return localStorage.getItem(CURRENT_USER_ID_KEY) || defaultCurrentUser.id;
}

function sortByNewest(items, key) {
  return [...items].sort((left, right) => {
    const leftValue = left?.[key] ? new Date(left[key]).getTime() : 0;
    const rightValue = right?.[key] ? new Date(right[key]).getTime() : 0;
    return rightValue - leftValue;
  });
}

function normalizeMatchRecord(match, currentUserId, users) {
  const requesterId = match.requesterId || currentUserId;
  const targetUserId = match.targetUserId || match.userId;
  const direction = match.direction || (requesterId === currentUserId ? 'outgoing' : 'incoming');
  const counterpartId = direction === 'incoming' ? requesterId : targetUserId;

  return {
    ...match,
    requesterId,
    targetUserId,
    direction,
    userId: counterpartId,
    user: match.user || users.find((user) => user.id === counterpartId),
    createdAt: match.createdAt || match.updatedAt || '',
  };
}

function normalizeConversationRecord(conversation, currentUserId, users) {
  const participantId =
    conversation.participantId ||
    conversation.participantIds?.find((id) => id !== currentUserId) ||
    '';
  const messages = conversation.messages || [];
  const latestMessage = messages[messages.length - 1] || null;

  return {
    ...conversation,
    participantId,
    participant: conversation.participant || users.find((user) => user.id === participantId),
    lastMessage: latestMessage?.text || 'Start the conversation',
    lastMessageAt: latestMessage?.createdAt || '',
    hasUnread: Boolean(latestMessage && latestMessage.senderId !== currentUserId),
    unreadCount: latestMessage && latestMessage.senderId !== currentUserId ? 1 : 0,
  };
}

export function seedLocalDatabase() {
  if (!localStorage.getItem(USERS_KEY)) {
    writeJson(USERS_KEY, [defaultCurrentUser, ...demoUsers]);
  }

  if (!localStorage.getItem(MATCHES_KEY)) {
    writeJson(MATCHES_KEY, demoMatches);
  }

  if (!localStorage.getItem(CONVERSATIONS_KEY)) {
    writeJson(CONVERSATIONS_KEY, demoConversations);
  }

  if (!localStorage.getItem(CURRENT_USER_ID_KEY)) {
    localStorage.setItem(CURRENT_USER_ID_KEY, defaultCurrentUser.id);
  }

  const existingUsers = readJson(USERS_KEY, []);
  const mergedUsers = [defaultCurrentUser, ...demoUsers].reduce((collection, demoUser) => {
    if (collection.some((user) => user.id === demoUser.id)) {
      return collection;
    }

    collection.push(demoUser);
    return collection;
  }, [...existingUsers]);

  if (mergedUsers.length !== existingUsers.length) {
    writeJson(USERS_KEY, mergedUsers);
  }

  const existingMatches = readJson(MATCHES_KEY, []);
  const mergedMatches = demoMatches.reduce((collection, demoMatch) => {
    const existingMatchIndex = collection.findIndex((match) => match.id === demoMatch.id);

    if (existingMatchIndex >= 0) {
      collection[existingMatchIndex] = {
        ...demoMatch,
        ...collection[existingMatchIndex],
      };
      return collection;
    }

    collection.push(demoMatch);
    return collection;
  }, [...existingMatches]);

  if (JSON.stringify(mergedMatches) !== JSON.stringify(existingMatches)) {
    writeJson(MATCHES_KEY, mergedMatches);
  }

  const existingConversations = readJson(CONVERSATIONS_KEY, []);
  const normalizedConversations = existingConversations.map((conversation) => ({
    ...conversation,
    participantIds:
      conversation.participantIds ||
      [defaultCurrentUser.id, conversation.participantId].filter(Boolean),
  }));

  if (JSON.stringify(normalizedConversations) !== JSON.stringify(existingConversations)) {
    writeJson(CONVERSATIONS_KEY, normalizedConversations);
  }
}

export function getLocalProfile(userId) {
  const users = getUsers();
  const resolvedId = userId || getCurrentUserId();
  return users.find((user) => user.id === resolvedId) || users[0];
}

export function createLocalSession(email, password, newUserData) {
  const users = getUsers();

  if (newUserData) {
    const existingUser = users.find(
      (user) => user.email.toLowerCase() === newUserData.email.toLowerCase(),
    );

    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const createdUser = {
      ...defaultCurrentUser,
      ...newUserData,
      id: `user-${crypto.randomUUID()}`,
      rating: 5,
      completedSwaps: 0,
      availability: newUserData.availability || 'Flexible',
      skillsOffered: normalizeSkills(newUserData.skillsOffered),
      skillsWanted: normalizeSkills(newUserData.skillsWanted),
      headline: newUserData.headline || 'Ready to learn and share.',
    };

    const nextUsers = [...users, createdUser];
    setUsers(nextUsers);
    localStorage.setItem(CURRENT_USER_ID_KEY, createdUser.id);

    return {
      user: createdUser,
      token: makeToken(),
    };
  }

  const user = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password. Try `demo@apniskill.demo` / `demo12345`.');
  }

  localStorage.setItem(CURRENT_USER_ID_KEY, user.id);

  return {
    user,
    token: makeToken(),
  };
}

export function updateLocalProfile(userId, payload) {
  const users = getUsers();
  const nextUsers = users.map((user) => {
    if (user.id !== userId) {
      return user;
    }

    return {
      ...user,
      ...payload,
      skillsOffered: normalizeSkills(payload.skillsOffered ?? user.skillsOffered),
      skillsWanted: normalizeSkills(payload.skillsWanted ?? user.skillsWanted),
    };
  });

  setUsers(nextUsers);
  return nextUsers.find((user) => user.id === userId);
}

export async function getDiscoverUsers(currentUserId) {
  try {
    const response = await api.get('/users/discover');
    return response.data.users ?? response.data;
  } catch (error) {
    if (!error.response) {
      return getUsers().filter((user) => user.id !== currentUserId);
    }

    throw new Error(getApiErrorMessage(error, 'Unable to load suggested people.'));
  }
}

export async function getMatches(currentUserId) {
  const resolvedCurrentUserId = currentUserId || getCurrentUserId();
  const users = getUsers();

  try {
    const response = await api.get('/matches');
    const matches = response.data.matches ?? response.data;
    return sortByNewest(
      matches.map((match) => normalizeMatchRecord(match, resolvedCurrentUserId, users)),
      'createdAt',
    );
  } catch (error) {
    if (!error.response) {
      const matches = readJson(MATCHES_KEY, []);
      return sortByNewest(
        matches.map((match) => normalizeMatchRecord(match, resolvedCurrentUserId, users)),
        'createdAt',
      );
    }

    throw new Error(getApiErrorMessage(error, 'Unable to load matches.'));
  }
}

export async function requestSwap(targetUser, note = '', currentUserId) {
  const resolvedCurrentUserId = currentUserId || getCurrentUserId();
  const users = getUsers();

  try {
    const response = await api.post('/matches/request', {
      targetUserId: targetUser.id,
      note,
    });
    emitAppDataSync();
    return normalizeMatchRecord(
      response.data.match ?? response.data,
      resolvedCurrentUserId,
      users,
    );
  } catch (error) {
    if (!error.response) {
      const matches = readJson(MATCHES_KEY, []);
      const nextMatch = {
        id: `match-${crypto.randomUUID()}`,
        requesterId: resolvedCurrentUserId,
        targetUserId: targetUser.id,
        status: 'requested',
        compatibility: 80 + Math.floor(Math.random() * 18),
        note: note || `You sent a swap request to ${targetUser.name}.`,
        createdAt: new Date().toISOString(),
      };

      writeJson(MATCHES_KEY, [nextMatch, ...matches]);
      emitAppDataSync();
      return normalizeMatchRecord(nextMatch, resolvedCurrentUserId, users);
    }

    throw new Error(getApiErrorMessage(error, 'Unable to send swap request.'));
  }
}

export async function updateMatchStatus(matchId, status, currentUserId) {
  const resolvedCurrentUserId = currentUserId || getCurrentUserId();
  const users = getUsers();

  try {
    const response = await api.post('/matches/status', {
      matchId,
      status,
    });
    emitAppDataSync();
    return normalizeMatchRecord(
      response.data.match ?? response.data,
      resolvedCurrentUserId,
      users,
    );
  } catch (error) {
    if (!error.response) {
      const matches = readJson(MATCHES_KEY, []);
      let updatedMatch = null;

      const nextMatches = matches.map((match) => {
        const normalizedMatch = normalizeMatchRecord(match, resolvedCurrentUserId, users);

        if (
          normalizedMatch.id !== matchId ||
          normalizedMatch.direction !== 'incoming' ||
          normalizedMatch.targetUserId !== resolvedCurrentUserId
        ) {
          return match;
        }

        updatedMatch = {
          ...normalizedMatch,
          status,
        };

        return {
          ...match,
          status,
        };
      });

      if (!updatedMatch) {
        throw new Error('Unable to find this request.');
      }

      writeJson(MATCHES_KEY, nextMatches);
      emitAppDataSync();
      return normalizeMatchRecord(updatedMatch, resolvedCurrentUserId, users);
    }

    throw new Error(getApiErrorMessage(error, 'Unable to update request status.'));
  }
}

export async function getConversations(currentUserId) {
  const resolvedCurrentUserId = currentUserId || getCurrentUserId();
  const users = getUsers();

  try {
    const response = await api.get('/messages');
    const conversations = response.data.conversations ?? response.data;
    return sortByNewest(
      conversations.map((conversation) =>
        normalizeConversationRecord(conversation, resolvedCurrentUserId, users),
      ),
      'lastMessageAt',
    );
  } catch (error) {
    if (!error.response) {
      const conversations = readJson(CONVERSATIONS_KEY, []);
      return sortByNewest(
        conversations.map((conversation) =>
          normalizeConversationRecord(conversation, resolvedCurrentUserId, users),
        ),
        'lastMessageAt',
      );
    }

    throw new Error(getApiErrorMessage(error, 'Unable to load conversations.'));
  }
}

export async function sendMessage(recipientId, text, currentUserId) {
  const resolvedCurrentUserId = currentUserId || getCurrentUserId();

  try {
    await api.post('/messages', {
      recipientId,
      text,
    });
    emitAppDataSync();
    return getConversations(resolvedCurrentUserId);
  } catch (error) {
    if (!error.response) {
      const conversations = readJson(CONVERSATIONS_KEY, []);
      const existingConversation = conversations.find((conversation) => {
        const normalizedParticipantId =
          conversation.participantId ||
          conversation.participantIds?.find((id) => id !== resolvedCurrentUserId);

        return normalizedParticipantId === recipientId;
      });

      const newMessage = {
        id: `message-${crypto.randomUUID()}`,
        senderId: resolvedCurrentUserId,
        text,
        createdAt: new Date().toISOString(),
      };

      let nextConversations;

      if (existingConversation) {
        nextConversations = conversations.map((conversation) => {
          const normalizedParticipantId =
            conversation.participantId ||
            conversation.participantIds?.find((id) => id !== resolvedCurrentUserId);

          return normalizedParticipantId === recipientId
            ? {
                ...conversation,
                messages: [...conversation.messages, newMessage],
              }
            : conversation;
        });
      } else {
        nextConversations = [
          {
            id: `chat-${crypto.randomUUID()}`,
            participantId: recipientId,
            participantIds: [resolvedCurrentUserId, recipientId],
            messages: [newMessage],
          },
          ...conversations,
        ];
      }

      writeJson(CONVERSATIONS_KEY, nextConversations);
      emitAppDataSync();
      return getConversations(resolvedCurrentUserId);
    }

    throw new Error(getApiErrorMessage(error, 'Unable to send message.'));
  }
}

export async function getNotificationSummary(currentUserId) {
  const resolvedCurrentUserId = currentUserId || getCurrentUserId();
  const [matches, conversations] = await Promise.all([
    getMatches(resolvedCurrentUserId),
    getConversations(resolvedCurrentUserId),
  ]);

  const incomingRequests = matches.filter(
    (match) => match.direction === 'incoming' && match.status === 'requested',
  );
  const unreadMessages = conversations.filter((conversation) => conversation.hasUnread);

  const items = sortByNewest(
    [
      ...incomingRequests.map((match) => ({
        id: `request-${match.id}`,
        type: 'request',
        title: `${match.user?.name || 'Someone'} sent you a skill swap request`,
        description: match.note || 'Open dashboard to review the request.',
        to: '/requests',
        createdAt: match.createdAt,
      })),
      ...unreadMessages.map((conversation) => ({
        id: `message-${conversation.id}`,
        type: 'message',
        title: `New message from ${conversation.participant?.name || 'a learner'}`,
        description: conversation.lastMessage,
        to: '/chat',
        createdAt: conversation.lastMessageAt,
      })),
    ],
    'createdAt',
  );

  return {
    totalCount: incomingRequests.length + unreadMessages.length,
    incomingRequests,
    unreadMessages,
    items,
  };
}

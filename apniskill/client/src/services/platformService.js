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

export async function getMatches() {
  try {
    const response = await api.get('/matches');
    return response.data.matches ?? response.data;
  } catch (error) {
    if (!error.response) {
      const matches = readJson(MATCHES_KEY, []);
      return matches.map((match) => ({
        ...match,
        user: getUsers().find((user) => user.id === match.userId),
      }));
    }

    throw new Error(getApiErrorMessage(error, 'Unable to load matches.'));
  }
}

export async function requestSwap(targetUser, note = '') {
  try {
    const response = await api.post('/matches/request', {
      targetUserId: targetUser.id,
      note,
    });
    return response.data.match ?? response.data;
  } catch (error) {
    if (!error.response) {
      const matches = readJson(MATCHES_KEY, []);
      const nextMatch = {
        id: `match-${crypto.randomUUID()}`,
        userId: targetUser.id,
        status: 'requested',
        compatibility: 80 + Math.floor(Math.random() * 18),
        note: note || `You sent a swap request to ${targetUser.name}.`,
      };

      writeJson(MATCHES_KEY, [nextMatch, ...matches]);
      return {
        ...nextMatch,
        user: targetUser,
      };
    }

    throw new Error(getApiErrorMessage(error, 'Unable to send swap request.'));
  }
}

export async function getConversations() {
  try {
    const response = await api.get('/messages');
    return response.data.conversations ?? response.data;
  } catch (error) {
    if (!error.response) {
      const conversations = readJson(CONVERSATIONS_KEY, []);
      const users = getUsers();
      return conversations.map((conversation) => ({
        ...conversation,
        participant: users.find((user) => user.id === conversation.participantId),
        lastMessage:
          conversation.messages[conversation.messages.length - 1]?.text || 'Start the conversation',
      }));
    }

    throw new Error(getApiErrorMessage(error, 'Unable to load conversations.'));
  }
}

export async function sendMessage(recipientId, text, currentUserId) {
  try {
    const response = await api.post('/messages', {
      recipientId,
      text,
    });
    return response.data.conversation ?? response.data;
  } catch (error) {
    if (!error.response) {
      const conversations = readJson(CONVERSATIONS_KEY, []);
      const existingConversation = conversations.find(
        (conversation) => conversation.participantId === recipientId,
      );

      const newMessage = {
        id: `message-${crypto.randomUUID()}`,
        senderId: currentUserId,
        text,
        createdAt: new Date().toISOString(),
      };

      let nextConversations;

      if (existingConversation) {
        nextConversations = conversations.map((conversation) =>
          conversation.participantId === recipientId
            ? {
                ...conversation,
                messages: [...conversation.messages, newMessage],
              }
            : conversation,
        );
      } else {
        nextConversations = [
          {
            id: `chat-${crypto.randomUUID()}`,
            participantId: recipientId,
            messages: [newMessage],
          },
          ...conversations,
        ];
      }

      writeJson(CONVERSATIONS_KEY, nextConversations);
      return getConversations();
    }

    throw new Error(getApiErrorMessage(error, 'Unable to send message.'));
  }
}

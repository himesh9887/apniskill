import { sendError } from './errorMiddleware.js';

export function getBearerToken(request) {
  const header = request.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return '';
  }

  return header.slice('Bearer '.length).trim();
}

export function getAuthenticatedUser(request, data) {
  const token = getBearerToken(request);

  if (!token) {
    return null;
  }

  const session = data.sessions.find((entry) => entry.token === token);

  if (!session) {
    return null;
  }

  return data.users.find((user) => user.id === session.userId) || null;
}

export function requireAuthenticatedUser(request, response, data) {
  const user = getAuthenticatedUser(request, data);

  if (!user) {
    sendError(response, 401, 'Authentication required.');
    return null;
  }

  return user;
}

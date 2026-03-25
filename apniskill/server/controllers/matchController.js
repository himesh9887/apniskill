import { readDatabase, writeDatabase } from '../config/db.js';
import { requireAuthenticatedUser } from '../middleware/authMiddleware.js';
import { sendError, sendJson } from '../middleware/errorMiddleware.js';
import { buildMatch } from '../models/Match.js';
import { sanitizeUser } from '../models/User.js';

function decorateMatch(match, users, currentUserId) {
  const direction = match.requesterId === currentUserId ? 'outgoing' : 'incoming';
  const counterpartId = direction === 'incoming' ? match.requesterId : match.targetUserId;

  return {
    ...match,
    direction,
    user: sanitizeUser(users.find((user) => user.id === counterpartId)),
  };
}

export async function listMatches({ request, response }) {
  const data = await readDatabase();
  const currentUser = requireAuthenticatedUser(request, response, data);

  if (!currentUser) {
    return;
  }

  const matches = data.matches
    .filter(
      (match) => match.requesterId === currentUser.id || match.targetUserId === currentUser.id,
    )
    .map((match) => decorateMatch(match, data.users, currentUser.id));

  sendJson(response, 200, { matches });
}

export async function requestMatch({ request, response, body }) {
  const data = await readDatabase();
  const currentUser = requireAuthenticatedUser(request, response, data);

  if (!currentUser) {
    return;
  }

  const targetUserId = String(body.targetUserId || '').trim();
  const targetUser = data.users.find((user) => user.id === targetUserId);

  if (!targetUser || targetUser.id === currentUser.id) {
    sendError(response, 400, 'Choose a valid target user.');
    return;
  }

  const existingMatch = data.matches.find(
    (match) => match.requesterId === currentUser.id && match.targetUserId === targetUser.id,
  );

  if (existingMatch) {
    sendJson(response, 200, { match: decorateMatch(existingMatch, data.users, currentUser.id) });
    return;
  }

  const match = buildMatch({
    requesterId: currentUser.id,
    targetUserId,
    note: body.note,
  });

  data.matches.unshift(match);
  await writeDatabase(data);

  sendJson(response, 201, { match: decorateMatch(match, data.users, currentUser.id) });
}

export async function updateMatchStatus({ request, response, body }) {
  const data = await readDatabase();
  const currentUser = requireAuthenticatedUser(request, response, data);

  if (!currentUser) {
    return;
  }

  const matchId = String(body.matchId || '').trim();
  const status = String(body.status || '').trim().toLowerCase();

  if (!['active', 'pending'].includes(status)) {
    sendError(response, 400, 'Choose a valid match status.');
    return;
  }

  const match = data.matches.find((entry) => entry.id === matchId);

  if (!match || match.targetUserId !== currentUser.id) {
    sendError(response, 404, 'Incoming request not found.');
    return;
  }

  match.status = status;
  await writeDatabase(data);

  sendJson(response, 200, { match: decorateMatch(match, data.users, currentUser.id) });
}

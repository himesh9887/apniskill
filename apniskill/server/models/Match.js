import { randomUUID } from 'node:crypto';

export function buildMatch({ requesterId, targetUserId, note }) {
  return {
    id: `match-${randomUUID()}`,
    requesterId,
    targetUserId,
    status: 'requested',
    compatibility: 80 + Math.floor(Math.random() * 18),
    note: note || 'New skill swap request sent.',
    createdAt: new Date().toISOString(),
  };
}

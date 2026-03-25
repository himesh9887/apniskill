import { listMatches, requestMatch, updateMatchStatus } from '../controllers/matchController.js';

export const matchRoutes = [
  {
    method: 'GET',
    path: '/api/matches',
    handler: listMatches,
  },
  {
    method: 'POST',
    path: '/api/matches/request',
    handler: requestMatch,
  },
  {
    method: 'POST',
    path: '/api/matches/status',
    handler: updateMatchStatus,
  },
];

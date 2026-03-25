import { discoverUsers, getProfile, updateProfile } from '../controllers/userController.js';

export const userRoutes = [
  {
    method: 'GET',
    path: '/api/users/profile',
    handler: getProfile,
  },
  {
    method: 'PUT',
    path: '/api/users/profile',
    handler: updateProfile,
  },
  {
    method: 'GET',
    path: '/api/users/discover',
    handler: discoverUsers,
  },
];

import { login, register } from '../controllers/authController.js';

export const authRoutes = [
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: login,
  },
  {
    method: 'POST',
    path: '/api/auth/register',
    handler: register,
  },
];

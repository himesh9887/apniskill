import { readDatabase, writeDatabase } from '../config/db.js';
import { getAuthenticatedUser, requireAuthenticatedUser } from '../middleware/authMiddleware.js';
import { sendJson } from '../middleware/errorMiddleware.js';
import { sanitizeUser, updateUserRecord } from '../models/User.js';

export async function getProfile({ request, response }) {
  const data = await readDatabase();
  const user = requireAuthenticatedUser(request, response, data);

  if (!user) {
    return;
  }

  sendJson(response, 200, { user: sanitizeUser(user) });
}

export async function updateProfile({ request, response, body }) {
  const data = await readDatabase();
  const user = requireAuthenticatedUser(request, response, data);

  if (!user) {
    return;
  }

  const updatedUser = updateUserRecord(user, body);
  data.users = data.users.map((entry) => (entry.id === user.id ? updatedUser : entry));

  await writeDatabase(data);
  sendJson(response, 200, { user: sanitizeUser(updatedUser) });
}

export async function discoverUsers({ request, response }) {
  const data = await readDatabase();
  const currentUser = getAuthenticatedUser(request, data);
  const users = data.users
    .filter((user) => user.id !== currentUser?.id)
    .map((user) => sanitizeUser(user));

  sendJson(response, 200, { users });
}

import { readDatabase, writeDatabase } from '../config/db.js';
import { sendError, sendJson } from '../middleware/errorMiddleware.js';
import { buildUser, sanitizeUser } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export async function register({ body, response }) {
  const data = await readDatabase();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '').trim();
  const name = String(body.name || '').trim();

  if (!name || !email || !password) {
    sendError(response, 400, 'Name, email, and password are required.');
    return;
  }

  const existingUser = data.users.find((user) => user.email === email);

  if (existingUser) {
    sendError(response, 409, 'An account with this email already exists.');
    return;
  }

  const user = buildUser(body);
  const token = generateToken();

  data.users.push(user);
  data.sessions = data.sessions.filter((session) => session.userId !== user.id);
  data.sessions.push({
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
  });

  await writeDatabase(data);

  sendJson(response, 201, {
    token,
    user: sanitizeUser(user),
  });
}

export async function login({ body, response }) {
  const data = await readDatabase();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '').trim();
  const user = data.users.find((entry) => entry.email === email);

  if (!user || user.password !== password) {
    sendError(response, 401, 'Invalid email or password.');
    return;
  }

  const token = generateToken();

  data.sessions = data.sessions.filter((session) => session.userId !== user.id);
  data.sessions.push({
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
  });

  await writeDatabase(data);

  sendJson(response, 200, {
    token,
    user: sanitizeUser(user),
  });
}

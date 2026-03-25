import { randomUUID } from 'node:crypto';

export function normalizeSkills(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

export function buildUser(payload) {
  return {
    id: `user-${randomUUID()}`,
    name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim().toLowerCase(),
    password: String(payload.password || ''),
    location: String(payload.location || '').trim(),
    headline: String(payload.headline || 'Ready to learn and share.').trim(),
    bio: String(payload.bio || '').trim(),
    availability: String(payload.availability || 'Flexible').trim(),
    rating: 5,
    completedSwaps: 0,
    skillsOffered: normalizeSkills(payload.skillsOffered),
    skillsWanted: normalizeSkills(payload.skillsWanted),
  };
}

export function updateUserRecord(existingUser, payload) {
  return {
    ...existingUser,
    name: String(payload.name ?? existingUser.name).trim(),
    location: String(payload.location ?? existingUser.location).trim(),
    headline: String(payload.headline ?? existingUser.headline).trim(),
    bio: String(payload.bio ?? existingUser.bio).trim(),
    availability: String(payload.availability ?? existingUser.availability).trim(),
    skillsOffered: normalizeSkills(payload.skillsOffered ?? existingUser.skillsOffered),
    skillsWanted: normalizeSkills(payload.skillsWanted ?? existingUser.skillsWanted),
  };
}

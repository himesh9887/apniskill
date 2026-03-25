import api, { getApiErrorMessage } from './api.js';
import {
  createLocalSession,
  getLocalProfile,
  seedLocalDatabase,
  updateLocalProfile,
} from './platformService.js';

seedLocalDatabase();

export async function loginUser(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return createLocalSession(email, password);
    }

    throw new Error(getApiErrorMessage(error, 'Unable to login.'));
  }
}

export async function registerUser(userData) {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    if (!error.response) {
      return createLocalSession(userData.email, userData.password, userData);
    }

    throw new Error(getApiErrorMessage(error, 'Unable to create account.'));
  }
}

export async function getProfile(token, fallbackUser) {
  try {
    const response = await api.get('/users/profile', {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
    return response.data.user ?? response.data;
  } catch (error) {
    if (!error.response) {
      return getLocalProfile(fallbackUser?.id);
    }

    throw new Error(getApiErrorMessage(error, 'Unable to load your profile.'));
  }
}

export async function updateProfile(profileData, token, currentUser) {
  try {
    const response = await api.put('/users/profile', profileData, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
    return response.data.user ?? response.data;
  } catch (error) {
    if (!error.response) {
      return updateLocalProfile(currentUser?.id, profileData);
    }

    throw new Error(getApiErrorMessage(error, 'Unable to update profile.'));
  }
}

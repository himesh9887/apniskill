import { useEffect, useReducer } from 'react';
import {
  getProfile,
  loginUser,
  registerUser,
  updateProfile as persistProfile,
} from '../services/authService.js';
import { AuthContext } from './auth-context.js';
import { toast } from '../utils/notifications.js';

const SESSION_KEY = 'apniskill_session';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'PROFILE_UPDATED':
      return {
        ...state,
        user: action.payload,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'AUTH_RESET':
      return {
        ...initialState,
        loading: false,
      };
    default:
      return state;
  }
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const rawSession = localStorage.getItem(SESSION_KEY);

      if (!rawSession) {
        dispatch({ type: 'AUTH_RESET' });
        return;
      }

      dispatch({ type: 'AUTH_START' });

      try {
        const session = JSON.parse(rawSession);
        const profile = await getProfile(session.token, session.user);

        if (!isMounted) {
          return;
        }

        const nextSession = { token: session.token, user: profile };
        saveSession(nextSession);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: nextSession,
        });
      } catch (error) {
        clearSession();

        if (!isMounted) {
          return;
        }

        dispatch({ type: 'AUTH_ERROR', payload: error.message || 'Session restore failed.' });
        dispatch({ type: 'AUTH_RESET' });
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const session = await loginUser(email, password);
      saveSession(session);
      dispatch({ type: 'AUTH_SUCCESS', payload: session });
      toast.success(`Welcome back, ${session.user.name.split(' ')[0]}!`);
      return { ok: true };
    } catch (error) {
      const message = error.message || 'Unable to sign in right now.';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      toast.error(message);
      return { ok: false, message };
    }
  };

  const signup = async (payload) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const session = await registerUser(payload);
      saveSession(session);
      dispatch({ type: 'AUTH_SUCCESS', payload: session });
      toast.success(`Account created for ${session.user.name}.`);
      return { ok: true };
    } catch (error) {
      const message = error.message || 'Unable to create your account.';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      toast.error(message);
      return { ok: false, message };
    }
  };

  const updateUserProfile = async (payload) => {
    if (!state.token) {
      const message = 'Please sign in again to update your profile.';
      toast.error(message);
      return { ok: false, message };
    }

    dispatch({ type: 'AUTH_START' });

    try {
      const updatedUser = await persistProfile(payload, state.token, state.user);
      const nextSession = { token: state.token, user: updatedUser };
      saveSession(nextSession);
      dispatch({ type: 'AUTH_SUCCESS', payload: nextSession });
      toast.success('Profile updated successfully.');
      return { ok: true, user: updatedUser };
    } catch (error) {
      const message = error.message || 'Unable to save profile changes.';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      toast.error(message);
      return { ok: false, message };
    }
  };

  const logout = () => {
    clearSession();
    dispatch({ type: 'AUTH_RESET' });
    toast.success('You have been logged out.');
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

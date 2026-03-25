import { useEffect, useState } from 'react';
import { APP_DATA_SYNC_EVENT, getNotificationSummary } from '../services/platformService.js';
import { useAuth } from './useAuth.js';

const emptySummary = {
  totalCount: 0,
  incomingRequests: [],
  unreadMessages: [],
  items: [],
};

export function useNotifications() {
  const { isAuthenticated, user } = useAuth();
  const [summary, setSummary] = useState(emptySummary);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return undefined;
    }

    let isMounted = true;

    async function loadNotifications() {
      try {
        const nextSummary = await getNotificationSummary(user.id);

        if (isMounted) {
          setSummary(nextSummary);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Unable to load notifications:', error);
        }
      }
    }

    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 15000);
    window.addEventListener(APP_DATA_SYNC_EVENT, loadNotifications);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      window.removeEventListener(APP_DATA_SYNC_EVENT, loadNotifications);
    };
  }, [isAuthenticated, user?.id]);

  return isAuthenticated && user?.id ? summary : emptySummary;
}

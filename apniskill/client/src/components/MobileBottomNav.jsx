import { createElement } from 'react';
import {
  ArrowRightLeft,
  Home,
  LayoutDashboard,
  MessageCircleMore,
  UserCog,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useNotifications } from '../hooks/useNotifications.js';

function DockItem({ to, label, icon, badgeCount = 0 }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[20px] px-3 py-2 text-[11px] font-medium transition ${
          isActive ? 'bg-white/10 text-white' : 'text-slate-400'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`relative flex h-10 w-10 items-center justify-center rounded-2xl border transition ${
              isActive
                ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100'
                : 'border-white/8 bg-white/[0.04] text-slate-200'
            }`}
          >
            {createElement(icon, { className: 'h-4 w-4' })}
            {badgeCount ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-amber-200 px-1 text-[10px] font-bold text-slate-950">
                {badgeCount > 9 ? '9+' : badgeCount}
              </span>
            ) : null}
          </span>
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function MobileBottomNav() {
  const { isAuthenticated } = useAuth();
  const { unreadMessages, incomingRequests } = useNotifications();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden">
      <div className="pointer-events-auto mx-auto max-w-xl rounded-[28px] border border-white/10 bg-slate-950/85 p-2 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl">
        <div className="flex items-center gap-1">
          <DockItem to="/" label="Home" icon={Home} />
          <DockItem to="/dashboard" label="Dashboard" icon={LayoutDashboard} />
          <DockItem
            to="/requests"
            label="Requests"
            icon={ArrowRightLeft}
            badgeCount={incomingRequests.length}
          />
          <DockItem
            to="/chat"
            label="Chat"
            icon={MessageCircleMore}
            badgeCount={unreadMessages.length}
          />
          <DockItem to="/profile" label="Profile" icon={UserCog} />
        </div>
      </div>
    </div>
  );
}

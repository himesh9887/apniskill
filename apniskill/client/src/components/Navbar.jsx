import { createElement, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowRightLeft,
  BadgeCheck,
  CircleUserRound,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  UserCog,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { useNotifications } from '../hooks/useNotifications.js';

function NavItem({ to, label, icon: Icon, onClick, badgeCount = 0 }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition ${
          isActive ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-200 hover:bg-white/10 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex items-center gap-2">
            {createElement(Icon, { className: 'h-4 w-4' })}
            <span>{label}</span>
          </span>
          {badgeCount ? (
            <span
              className={`inline-flex min-h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                isActive ? 'bg-slate-950 text-white' : 'bg-amber-300 text-slate-950'
              }`}
            >
              {badgeCount > 9 ? '9+' : badgeCount}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const MotionDiv = motion.div;
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadMessages, incomingRequests } = useNotifications();
  const navigate = useNavigate();

  const visibleLinks = useMemo(() => {
    const links = [{ to: '/', label: 'Home', icon: Home, badgeCount: 0 }];

    if (isAuthenticated) {
      links.push(
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badgeCount: 0 },
        { to: '/profile', label: 'Profile', icon: UserCog, badgeCount: 0 },
        { to: '/requests', label: 'Requests', icon: ArrowRightLeft, badgeCount: incomingRequests.length },
        { to: '/chat', label: 'Chat', icon: MessageCircle, badgeCount: unreadMessages.length },
      );
    }

    return links;
  }, [incomingRequests.length, isAuthenticated, unreadMessages.length]);

  function handleLogout() {
    logout();
    navigate('/');
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5 md:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-300 to-amber-200 text-slate-950 shadow-[0_14px_36px_rgba(34,211,238,0.22)] sm:h-11 sm:w-11">
            <span className="text-base font-black sm:text-lg">AS</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-wide text-white sm:text-lg">ApniSkill</p>
            <p className="hidden text-xs text-slate-400 sm:block">Skill exchange, redesigned for every screen</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1 lg:flex">
          {visibleLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <div className="panel-card flex items-center gap-3 rounded-full px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300/12 text-cyan-200">
                  <CircleUserRound className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">
                    {incomingRequests.length} requests, {unreadMessages.length} unread
                  </p>
                </div>
              </div>
              <button type="button" className="btn-secondary" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {isAuthenticated ? (
            <div className="info-chip hidden sm:inline-flex">
              <BadgeCheck className="h-4 w-4 text-cyan-200" />
              <span>{user?.name?.split(' ')[0]}</span>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex shrink-0 rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="space-y-4 px-4 py-4 sm:px-5">
              {isAuthenticated ? (
                <div className="panel-card flex items-start gap-3 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/12 text-cyan-200">
                    <CircleUserRound className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{user?.headline}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="info-chip">{incomingRequests.length} open requests</span>
                      <span className="info-chip">{unreadMessages.length} unread chats</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="panel-card p-4">
                  <p className="section-kicker">Start here</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Explore the platform, create your profile, and manage the full skill-swap flow
                    from one responsive workspace.
                  </p>
                </div>
              )}

              {visibleLinks.map((link) => (
                <NavItem key={link.to} {...link} onClick={() => setIsOpen(false)} />
              ))}

              {isAuthenticated ? (
                <button type="button" className="btn-secondary w-full justify-center" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="grid gap-3">
                  <Link to="/login" className="btn-secondary justify-center" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary justify-center" onClick={() => setIsOpen(false)}>
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  );
}

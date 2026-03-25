import { createElement, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowRightLeft,
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
        `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
          isActive
            ? 'bg-white text-slate-950 shadow-lg'
            : 'text-slate-200 hover:bg-white/10 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {createElement(Icon, { className: 'h-4 w-4' })}
          <span>{label}</span>
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

function QuickIconLink({ to, label, icon, badgeCount = 0 }) {
  return (
    <NavLink
      to={to}
      aria-label={label}
      className={({ isActive }) =>
        `relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
          isActive
            ? 'border-sky-300/30 bg-sky-300/12 text-sky-100'
            : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
        }`
      }
    >
      {createElement(icon, { className: 'h-5 w-5' })}
      {badgeCount ? (
        <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-amber-300 px-1.5 text-[11px] font-bold text-slate-950">
          {badgeCount > 9 ? '9+' : badgeCount}
        </span>
      ) : null}
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
    const links = [{ to: '/', label: 'Home', icon: Home, public: true, badgeCount: 0 }];

    if (isAuthenticated) {
      links.push(
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, public: false, badgeCount: 0 },
        { to: '/profile', label: 'Profile', icon: UserCog, public: false, badgeCount: 0 },
        {
          to: '/chat',
          label: 'Chat',
          icon: MessageCircle,
          public: false,
          badgeCount: unreadMessages.length,
        },
      );
    }

    return links;
  }, [isAuthenticated, unreadMessages.length]);

  function handleLogout() {
    logout();
    navigate('/');
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-amber-300 text-slate-950 shadow-[0_14px_36px_rgba(56,189,248,0.25)] sm:h-11 sm:w-11">
            <span className="text-base font-black sm:text-lg">AS</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-wide text-white sm:text-lg">ApniSkill</p>
            <p className="hidden text-xs text-slate-400 sm:block">Swap skills, not invoices</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {visibleLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <QuickIconLink
              to="/requests"
              label="Open requests"
              icon={ArrowRightLeft}
              badgeCount={incomingRequests.length}
            />
          ) : null}

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15 text-sky-300">
                  <CircleUserRound className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.location}</p>
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

        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated ? (
            <>
              <QuickIconLink
                to="/chat"
                label="Open chat"
                icon={MessageCircle}
                badgeCount={unreadMessages.length}
              />
              <QuickIconLink
                to="/requests"
                label="Open requests"
                icon={ArrowRightLeft}
                badgeCount={incomingRequests.length}
              />
            </>
          ) : null}

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex shrink-0 rounded-2xl border border-white/10 bg-white/5 p-3 text-white"
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
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <div className="space-y-3 px-4 py-4">
              {visibleLinks.map((link) => (
                <NavItem key={link.to} {...link} onClick={() => setIsOpen(false)} />
              ))}

              {isAuthenticated ? (
                <NavItem
                  to="/requests"
                  label="Requests"
                  icon={ArrowRightLeft}
                  badgeCount={incomingRequests.length}
                  onClick={() => setIsOpen(false)}
                />
              ) : null}

              {isAuthenticated ? (
                <button
                  type="button"
                  className="btn-secondary w-full justify-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="grid gap-3">
                  <Link
                    to="/login"
                    className="btn-secondary justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary justify-center"
                    onClick={() => setIsOpen(false)}
                  >
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

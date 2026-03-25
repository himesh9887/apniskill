import { createElement, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
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

const navLinks = [
  { to: '/', label: 'Home', icon: Home, public: true },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, public: false },
  { to: '/profile', label: 'Profile', icon: UserCog, public: false },
  { to: '/chat', label: 'Chat', icon: MessageCircle, public: false },
];

function NavItem({ to, label, icon: Icon, onClick }) {
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
      {createElement(Icon, { className: 'h-4 w-4' })}
      <span>{label}</span>
    </NavLink>
  );
}

export default function Navbar() {
  const MotionDiv = motion.div;
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleLinks = navLinks.filter((link) => link.public || isAuthenticated);

  function handleLogout() {
    logout();
    navigate('/');
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-amber-300 text-slate-950 shadow-[0_14px_36px_rgba(56,189,248,0.25)]">
            <span className="text-lg font-black">AS</span>
          </div>
          <div>
            <p className="text-lg font-semibold tracking-wide text-white">ApniSkill</p>
            <p className="text-xs text-slate-400">Swap skills, not invoices</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {visibleLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
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

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 text-white md:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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

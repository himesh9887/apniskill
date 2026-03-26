import { ArrowRight, BadgeCheck, MessageCircleMore, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/requests', label: 'Requests' },
  { to: '/chat', label: 'Messages' },
];

const popularTracks = ['Frontend + Backend', 'Design + Research', 'SEO + Analytics', 'Writing + Branding'];

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="border-t border-white/10 bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12 md:px-6 lg:px-8">
        <div className="glass-card grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-300 to-amber-200 text-slate-950 shadow-[0_18px_34px_rgba(34,211,238,0.22)]">
              <span className="font-display text-lg font-bold">AS</span>
            </div>

            <div className="space-y-3">
              <p className="section-kicker">ApniSkill</p>
              <h2 className="section-title max-w-md text-left">
                Responsive skill exchange built to feel polished on every screen.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Discover people, send requests, and continue the conversation without the layout
                breaking on phone, tablet, or laptop.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="btn-primary">
                <Sparkles className="h-4 w-4" />
                <span>{isAuthenticated ? 'Open workspace' : 'Create your profile'}</span>
              </Link>
              <Link to="/chat" className="btn-secondary">
                <MessageCircleMore className="h-4 w-4" />
                <span>Open messages</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">Platform</p>
            <div className="grid gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="panel-card flex items-center justify-between px-4 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4 text-cyan-200" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">Popular Tracks</p>
            <div className="panel-card p-4">
              <div className="flex flex-wrap gap-2">
                {popularTracks.map((track) => (
                  <span key={track} className="info-chip">
                    {track}
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-[22px] border border-emerald-300/15 bg-emerald-300/10 p-4">
                <div className="flex items-center gap-2 text-emerald-200">
                  <BadgeCheck className="h-4 w-4" />
                  <p className="text-sm font-medium">Demo-ready experience</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  Local fallback data keeps the flows usable even when the backend is unavailable.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>ApniSkill demo UI refreshed for professional multi-device usage.</p>
          <p>Optimized for phone, tablet, and laptop layouts.</p>
        </div>
      </div>
    </footer>
  );
}

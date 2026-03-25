import { createElement } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import SkillCard from '../components/SkillCard.jsx';
import { demoUsers } from '../data/demoData.js';
import { requestSwap } from '../services/platformService.js';
import { toast } from '../utils/notifications.js';

const spotlightUsers = demoUsers.slice(0, 3);

const highlights = [
  {
    title: 'Real exchange flow',
    description: 'Offer the skills you already know and request the ones you want to grow next.',
    icon: Users,
  },
  {
    title: 'Guided learning',
    description: 'Profiles, goals, and session notes help each swap feel structured instead of random.',
    icon: GraduationCap,
  },
  {
    title: 'Built-in conversations',
    description: 'Chat before the session so timing, expectations, and outcomes stay clear.',
    icon: MessageCircle,
  },
  {
    title: 'Trust-first network',
    description: 'Ratings, completed swaps, and visible availability make discovery less risky.',
    icon: ShieldCheck,
  },
];

export default function Home() {
  const MotionDiv = motion.div;
  const { isAuthenticated } = useAuth();

  async function handleSwapRequest(user) {
    if (!isAuthenticated) {
      toast.info('Login first to send a skill swap request.');
      return;
    }

    try {
      await requestSwap(user, `Interested in a swap focused on ${user.skillsOffered?.[0]}.`);
      toast.success(`Swap request sent to ${user.name}.`);
    } catch (error) {
      toast.error(error.message || 'Unable to send swap request.');
    }
  }

  return (
    <div className="space-y-16 pb-12 sm:space-y-20 sm:pb-16 lg:space-y-24">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.16),transparent_38%),linear-gradient(145deg,rgba(15,23,42,0.98),rgba(2,6,23,0.9))] px-4 py-12 sm:rounded-[36px] sm:px-6 sm:py-16 md:px-10 lg:px-16 lg:py-24">
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent sm:inset-x-10" />
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-2 text-xs text-sky-200 sm:px-4 sm:text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="truncate">Skill-sharing that actually feels usable</span>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                Learn faster by trading your strengths for someone else&apos;s.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8 md:text-xl">
                ApniSkill helps people connect around practical knowledge: design for development, coding for content,
                marketing for analytics, and more. No payment wall. Just useful skill exchange.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="btn-primary">
                <span>{isAuthenticated ? 'Open dashboard' : 'Create free account'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-secondary">
                <BadgeCheck className="h-4 w-4" />
                <span>Use demo login</span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="stat-card">
                <p className="stat-number">120+</p>
                <p className="stat-label">local profiles ready to connect</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">84%</p>
                <p className="stat-label">requests turn into first chat</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">2 hrs</p>
                <p className="stat-label">average time to first response</p>
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card relative overflow-hidden p-4 sm:p-6 md:p-8"
          >
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-amber-300/15 blur-3xl" />
            <div className="space-y-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 sm:text-sm sm:tracking-[0.24em]">Featured match</p>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Online now
                </span>
              </div>
              <SkillCard user={demoUsers[0]} onSwapRequest={handleSwapRequest} ctaLabel="Connect now" />
            </div>
          </MotionDiv>
        </div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-col gap-3 text-center">
          <p className="section-kicker">Why it works</p>
          <h2 className="section-title">A cleaner flow for finding the right learning partner</h2>
          <p className="section-copy">
            The app is structured around three simple steps: discover, request, and continue the exchange in chat.
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map(({ title, description, icon: Icon }) => (
            <article key={title} className="glass-card p-5 sm:p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                {createElement(Icon, { className: 'h-6 w-6' })}
              </div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Spotlight users</p>
            <h2 className="section-title text-left">People you can start learning from today</h2>
          </div>
          <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="btn-secondary sm:w-auto">
            <span>See full community</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
          {spotlightUsers.map((user) => (
            <SkillCard key={user.id} user={user} onSwapRequest={handleSwapRequest} />
          ))}
        </div>
      </section>
    </div>
  );
}

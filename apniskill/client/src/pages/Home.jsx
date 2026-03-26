import { createElement } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Globe2,
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
const featuredMember = demoUsers[0];

const heroStats = [
  { value: '120+', label: 'people already discoverable' },
  { value: '84%', label: 'requests turn into first chat' },
  { value: '2 hrs', label: 'average first response time' },
  { value: '4.9/5', label: 'community trust score' },
];

const highlights = [
  {
    title: 'Designed for real exchange',
    description: 'Offer what you already know, request what you need next, and make the value clear immediately.',
    icon: Users,
  },
  {
    title: 'Conversation comes built in',
    description: 'The path from discovery to request to message is continuous, so users do not need to jump tools.',
    icon: MessageCircle,
  },
  {
    title: 'Trust stays visible',
    description: 'Ratings, completed swaps, availability, and profile quality help people decide faster.',
    icon: ShieldCheck,
  },
  {
    title: 'Works across devices',
    description: 'The refreshed layout is tuned for phone, tablet, and desktop instead of only one screen size.',
    icon: Globe2,
  },
];

const workflow = [
  {
    step: '01',
    title: 'Build a useful profile',
    description: 'Add headline, location, availability, offered skills, and wanted skills so matching feels obvious.',
  },
  {
    step: '02',
    title: 'Send a targeted request',
    description: 'Reach out to people whose goals overlap with your strongest skill instead of sending generic messages.',
  },
  {
    step: '03',
    title: 'Keep the exchange moving',
    description: 'Requests flow into chat, making it easy to confirm timing, expectations, and next steps.',
  },
];

const focusAreas = [
  {
    title: 'Career acceleration',
    description: 'Frontend for backend, design for development, content for analytics, and dozens of practical pairings.',
  },
  {
    title: 'Structured mentorship feel',
    description: 'The UI is shaped to feel calm and guided, even when someone is new to networking or skill swaps.',
  },
  {
    title: 'Fast demo-ready workflow',
    description: 'Local fallback data keeps discovery, requests, profile updates, and messaging usable even offline.',
  },
];

const testimonials = [
  {
    quote: 'I could understand who to message in under a minute. The structure makes the platform feel trustworthy.',
    name: 'Priya Sharma',
    role: 'Frontend Engineer',
  },
  {
    quote: 'The request and chat flow feels much more professional now, especially on mobile where most people first open it.',
    name: 'Rahul Patel',
    role: 'Backend Mentor',
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
    <div className="space-y-16 pb-4 sm:space-y-20 lg:space-y-24">
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(140deg,rgba(7,16,29,0.96),rgba(8,15,27,0.78))] px-5 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-12 lg:py-16 xl:px-16">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute right-[-5rem] top-[-4rem] h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute bottom-[-5rem] left-[-4rem] h-40 w-40 rounded-full bg-amber-200/10 blur-3xl sm:h-64 sm:w-64" />

        <div className="relative grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 xl:gap-14">
          <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs text-cyan-100 sm:text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="truncate">A cleaner, more professional skill-sharing experience</span>
            </div>

            <div className="space-y-5">
              <h1 className="font-display max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.4rem]">
                Trade real skills in a workspace that feels polished on every device.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg md:text-xl">
                ApniSkill helps people discover useful partners, send structured swap requests, and
                keep the conversation moving without the UI falling apart on phone, tablet, or laptop.
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

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {heroStats.map((item) => (
                <div key={item.label} className="stat-card">
                  <p className="stat-number">{item.value}</p>
                  <p className="stat-label">{item.label}</p>
                </div>
              ))}
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card relative overflow-hidden p-5 sm:p-6 md:p-7"
          >
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-amber-200/10 blur-3xl" />
            <div className="relative space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="section-kicker">Live exchange board</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-white">Featured member</h2>
                </div>
                <span className="info-chip">
                  <Clock3 className="h-4 w-4 text-cyan-200" />
                  Replying within 2 hours
                </span>
              </div>

              <div className="panel-card p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-cyan-300/20 to-amber-200/20 text-base font-semibold text-white">
                    {featuredMember.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-xl font-semibold text-white">{featuredMember.name}</p>
                      <span className="info-chip">{featuredMember.location}</span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{featuredMember.headline}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Offers</p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {featuredMember.skillsOffered.slice(0, 3).join(', ')}
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Wants</p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {featuredMember.skillsWanted.slice(0, 3).join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="panel-card p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Compatibility</p>
                  <p className="mt-2 font-display text-2xl font-bold text-white">92%</p>
                </div>
                <div className="panel-card p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Completed swaps</p>
                  <p className="mt-2 font-display text-2xl font-bold text-white">{featuredMember.completedSwaps}</p>
                </div>
                <div className="panel-card p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Rating</p>
                  <p className="mt-2 font-display text-2xl font-bold text-white">{featuredMember.rating}</p>
                </div>
              </div>

              <button type="button" className="btn-primary" onClick={() => handleSwapRequest(featuredMember)}>
                <span>Request a swap with {featuredMember.name.split(' ')[0]}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </MotionDiv>
        </div>
      </section>

      <section className="space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="section-kicker">Why this feels better</p>
          <h2 className="section-title text-left">A landing experience that looks trustworthy before users even log in</h2>
          <p className="section-copy mx-0 text-left">
            The redesign focuses on clarity, spacing, responsive structure, and cues that make the
            product feel credible instead of cramped.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map(({ title, description, icon }) => (
            <article key={title} className="glass-card p-5 sm:p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
                {createElement(icon, { className: 'h-6 w-6' })}
              </div>
              <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div className="glass-card p-6 sm:p-8">
          <p className="section-kicker">How it works</p>
          <h2 className="mt-3 section-title text-left">The flow stays simple, even when the platform grows.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
            Users should understand the journey quickly: profile, request, chat, repeat. The page
            now explains that flow without overwhelming them.
          </p>

          <div className="mt-8 space-y-4">
            {workflow.map((item) => (
              <div key={item.step} className="panel-card flex gap-4 p-4 sm:p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-sm font-semibold text-cyan-100">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          {focusAreas.map((area, index) => (
            <article key={area.title} className="glass-card p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="info-chip">Focus 0{index + 1}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-200/10 text-amber-200">
                  {index === 0 ? (
                    <Users className="h-5 w-5" />
                  ) : index === 1 ? (
                    <GraduationCap className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </div>
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-white">{area.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{area.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Spotlight community</p>
            <h2 className="section-title text-left">People you can learn from right away</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              These profiles are visible, readable, and action-oriented so a user can make a decision
              quickly without feeling lost.
            </p>
          </div>

          <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="btn-secondary sm:w-auto">
            <span>Explore the community</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {spotlightUsers.map((user) => (
            <SkillCard key={user.id} user={user} onSwapRequest={handleSwapRequest} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card p-6 sm:p-8">
          <p className="section-kicker">Member feedback</p>
          <h2 className="mt-3 section-title text-left">The product feels calmer and more intentional.</h2>
          <div className="mt-6 space-y-4">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="panel-card p-5">
                <p className="text-sm leading-7 text-slate-200">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-4">
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.role}</p>
                </div>
              </blockquote>
            ))}
          </div>
        </div>

        <div className="glass-card relative overflow-hidden p-6 sm:p-8 md:p-10">
          <div className="absolute right-[-4rem] top-[-3rem] h-44 w-44 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="section-kicker">Ready to use</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Open the demo, test every main flow, and keep the experience smooth on any device.
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
              The refreshed website is meant to feel like a complete product, not just a landing page.
              Discovery, requests, profiles, and chat are all part of the same polished system.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="info-chip">
                <BadgeCheck className="h-4 w-4 text-cyan-200" />
                Fully responsive shell
              </span>
              <span className="info-chip">
                <MessageCircle className="h-4 w-4 text-cyan-200" />
                Working chat experience
              </span>
              <span className="info-chip">
                <Clock3 className="h-4 w-4 text-cyan-200" />
                Fast demo walkthrough
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="btn-primary">
                <span>{isAuthenticated ? 'Go to dashboard' : 'Start with signup'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-secondary">
                <span>Open demo account</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

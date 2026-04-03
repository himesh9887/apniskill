import { createElement } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowRightLeft,
  BadgeCheck,
  Clock3,
  MapPin,
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
  { value: '120+', label: 'profiles live' },
  { value: '84%', label: 'requests reach chat' },
  { value: '2 hrs', label: 'avg first reply' },
];

const valueBlocks = [
  {
    title: 'Clear discovery',
    description: 'Profiles are easier to read, compare, and trust before you send a request.',
    icon: Users,
  },
  {
    title: 'Smooth request flow',
    description: 'The path from match request to accepted swap feels more guided and professional.',
    icon: ArrowRightLeft,
  },
  {
    title: 'Built-in chat',
    description: 'Once a request is accepted, the conversation continues inside the same workspace.',
    icon: MessageCircle,
  },
  {
    title: 'Trust-first design',
    description: 'Ratings, skills, availability, and cleaner layout help people respond faster.',
    icon: ShieldCheck,
  },
];

const steps = [
  {
    number: '01',
    title: 'Create a strong profile',
    description: 'List what you can teach, what you want to learn, and when you are available.',
  },
  {
    number: '02',
    title: 'Send a focused request',
    description: 'Reach out to people whose goals overlap with your strongest skills.',
  },
  {
    number: '03',
    title: 'Continue in chat',
    description: 'Accepted requests move straight into a clean chat workflow for follow-up.',
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
    <div className="space-y-14 pb-6 sm:space-y-18 lg:space-y-20">
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(7,16,29,0.96),rgba(8,15,27,0.78))] px-5 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-10 xl:px-12">
        <div className="absolute left-[-3rem] top-[-2rem] h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl sm:h-52 sm:w-52" />
        <div className="absolute bottom-[-4rem] right-[-2rem] h-36 w-36 rounded-full bg-amber-200/10 blur-3xl sm:h-56 sm:w-56" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <MotionDiv initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs text-cyan-100 sm:text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="truncate">Professional skill-sharing UI for every device</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-display max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl xl:text-6xl">
                Learn faster by trading your strengths with the right people.
              </h1>
              <p className="max-w-2xl text-sm leading-8 text-slate-300 sm:text-base md:text-lg">
                ApniSkill helps users discover skill partners, send structured requests, and continue
                the exchange in chat through a cleaner, more professional interface.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="btn-primary">
                <span>{isAuthenticated ? 'Open dashboard' : 'Create free account'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-secondary">
                <BadgeCheck className="h-4 w-4" />
                <span>Use demo login</span>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div key={item.label} className="stat-card">
                  <p className="stat-number">{item.value}</p>
                  <p className="stat-label">{item.label}</p>
                </div>
              ))}
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card overflow-hidden p-5 sm:p-6"
          >
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="section-kicker">Featured member</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-white">{featuredMember.name}</h2>
                </div>
                <span className="info-chip">
                  <Clock3 className="h-4 w-4 text-cyan-200" />
                  Replying today
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="info-chip">
                  <MapPin className="h-4 w-4 text-cyan-200" />
                  {featuredMember.location}
                </span>
                <span className="info-chip">{featuredMember.completedSwaps} swaps completed</span>
                <span className="info-chip">{featuredMember.rating} rating</span>
              </div>

              <p className="text-sm leading-7 text-slate-300">{featuredMember.bio}</p>
            </div>

            <div className="grid gap-3 py-5 sm:grid-cols-2">
              <div className="panel-card p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Offers</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {featuredMember.skillsOffered.map((skill) => (
                    <span key={skill} className="tag tag-offered">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="panel-card p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Wants</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {featuredMember.skillsWanted.map((skill) => (
                    <span key={skill} className="tag tag-wanted">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button type="button" className="btn-primary" onClick={() => handleSwapRequest(featuredMember)}>
              <span>Request a swap with {featuredMember.name.split(' ')[0]}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </MotionDiv>
        </div>
      </section>

      <section className="space-y-7">
        <div className="max-w-3xl space-y-3">
          <p className="section-kicker">Why people use it</p>
          <h2 className="section-title text-left">The website now feels simpler, sharper, and easier to trust.</h2>
          <p className="text-sm leading-8 text-slate-300 sm:text-base">
            Instead of crowded sections, the home page focuses on clear value, better spacing, and
            stronger hierarchy for mobile and desktop.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {valueBlocks.map(({ title, description, icon }) => (
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

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="glass-card p-6 sm:p-7">
          <p className="section-kicker">How it works</p>
          <h2 className="mt-3 section-title text-left">Three simple steps from profile to skill exchange.</h2>
          <div className="mt-7 space-y-4">
            {steps.map((item) => (
              <div key={item.number} className="panel-card flex gap-4 p-4 sm:p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-sm font-semibold text-cyan-100">
                  {item.number}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 sm:p-7">
          <p className="section-kicker">What feels different</p>
          <h2 className="mt-3 section-title text-left">Better hierarchy, cleaner cards, and stronger mobile spacing.</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="panel-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Cleaner discovery</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Profiles, stats, and skills are easier to scan without the page feeling overloaded.
              </p>
            </div>
            <div className="panel-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">More professional flow</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Requests and chats now connect more naturally, which makes the product feel complete.
              </p>
            </div>
            <div className="panel-card p-5 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Responsive by default</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Phone, tablet, and laptop layouts now keep proper spacing and readable content instead
                of squeezing too much text into one area.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Spotlight community</p>
            <h2 className="section-title text-left">People you can connect with right now</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              Featured profiles stay visible and action-oriented so users can decide quickly.
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
    </div>
  );
}

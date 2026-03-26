import { motion } from 'framer-motion';
import { ArrowRight, ArrowRightLeft, MapPin, Star } from 'lucide-react';

function getInitials(name = '') {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || 'AS';
}

export default function SkillCard({ user, onSwapRequest, ctaLabel = 'Request Swap' }) {
  const MotionArticle = motion.article;

  return (
    <MotionArticle
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="glass-card flex h-full flex-col gap-5 overflow-hidden p-5 sm:gap-6 sm:p-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-cyan-300/20 to-amber-200/20 text-base font-semibold text-white">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="section-kicker !text-[11px] sm:!text-xs">Curated match</span>
              <span className="info-chip">{user.availability || 'Flexible'}</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">{user.name}</h3>
            <p className="text-sm leading-6 text-slate-400">{user.headline}</p>
          </div>
        </div>

        <div className="panel-card flex items-center gap-3 px-4 py-3 text-left lg:text-right">
          <div className="flex items-center gap-1 text-amber-300">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold">{user.rating ?? '5.0'}</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Completed</p>
            <p className="mt-1 text-sm font-semibold text-white">{user.completedSwaps ?? 0} swaps</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-300">
        <MapPin className="h-4 w-4 text-sky-300" />
        <span>{user.location}</span>
      </div>

      <p className="text-sm leading-7 text-slate-300">{user.bio}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel-card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-200">
            <ArrowRightLeft className="h-4 w-4" />
            <span>Skills Offered</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered?.map((skill) => (
              <span key={skill} className="tag tag-offered">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="panel-card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-300">
            <ArrowRightLeft className="h-4 w-4" />
            <span>Skills Wanted</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted?.map((skill) => (
              <span key={skill} className="tag tag-wanted">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-stretch gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Best time to connect</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{user.availability || 'Flexible'}</p>
        </div>
        <button
          type="button"
          className="btn-primary sm:w-auto"
          onClick={() => onSwapRequest?.(user)}
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </MotionArticle>
  );
}

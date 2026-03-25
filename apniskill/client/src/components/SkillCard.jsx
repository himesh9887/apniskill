import { motion } from 'framer-motion';
import { ArrowRight, ArrowRightLeft, MapPin, Star } from 'lucide-react';

export default function SkillCard({ user, onSwapRequest, ctaLabel = 'Request Swap' }) {
  const MotionArticle = motion.article;

  return (
    <MotionArticle whileHover={{ y: -6 }} className="glass-card flex h-full flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Community Match</p>
          <h3 className="text-2xl font-semibold text-white">{user.name}</h3>
          <p className="text-sm text-slate-400">{user.headline}</p>
        </div>
        <div className="rounded-2xl bg-white/5 px-3 py-2 text-right">
          <div className="flex items-center gap-1 text-amber-300">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold">{user.rating ?? '5.0'}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{user.completedSwaps ?? 0} swaps</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-300">
        <MapPin className="h-4 w-4 text-sky-300" />
        <span>{user.location}</span>
      </div>

      <p className="text-sm leading-6 text-slate-300">{user.bio}</p>

      <div className="grid gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-300">
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

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-300">
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

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          {user.availability || 'Flexible'}
        </p>
        <button type="button" className="btn-primary" onClick={() => onSwapRequest?.(user)}>
          <span>{ctaLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </MotionArticle>
  );
}

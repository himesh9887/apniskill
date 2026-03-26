import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Loader = () => {
  const MotionDiv = motion.div;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 backdrop-blur-md">
      <MotionDiv
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="glass-card flex w-full max-w-sm flex-col items-center gap-6 p-8 text-center sm:p-10"
      >
        <MotionDiv
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/20 bg-white/[0.04]"
        >
          <div className="absolute inset-2 rounded-full border border-dashed border-cyan-200/35" />
          <Loader2 className="h-8 w-8 text-cyan-200" />
        </MotionDiv>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Preparing your workspace</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Loading profiles, requests, and conversations so everything feels ready when the page
            opens.
          </p>
        </div>
      </MotionDiv>
    </div>
  );
};

export default Loader;


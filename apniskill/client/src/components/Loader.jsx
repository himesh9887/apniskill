import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Loader = () => {
  const MotionDiv = motion.div;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <MotionDiv
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-card p-12 rounded-3xl flex flex-col items-center gap-6"
      >
        <MotionDiv
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-16 h-16 text-blue-400" />
        </MotionDiv>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Loading...</h2>
          <p className="text-gray-400">Please wait while we prepare your experience</p>
        </div>
      </MotionDiv>
    </div>
  );
};

export default Loader;


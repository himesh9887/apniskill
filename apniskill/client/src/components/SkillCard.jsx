import { motion } from 'framer-motion';
import { ArrowRight, SwapHorizontal } from 'lucide-react';

const SkillCard = ({ user, onSwapRequest }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card p-8 cursor-pointer group hover:border-blue-500/50 transition-all duration-500"
      onClick={onSwapRequest}
    >
      <div className="flex items-start space-x-4">
        <motion.div 
          className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 180 }}
        >
          <span className="text-white font-bold text-lg">👤</span>
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">{user.name}</h3>
          
          <div className="space-y-3 mb-6">
            <div>
              <h4 className="flex items-center text-sm font-semibold text-blue-400 mb-2">
                <SwapHorizontal className="w-4 h-4 mr-2" />
                Skills Offered
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered?.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-xl text-blue-300 text-sm font-medium"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="flex items-center text-sm font-semibold text-purple-400 mb-2">
                <SwapHorizontal className="w-4 h-4 mr-2 rotate-180" />
                Skills Wanted
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted?.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl text-purple-300 text-sm font-medium"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-sm text-gray-400">Perfect match potential</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center space-x-2 group-hover:shadow-glow"
            >
              <ArrowRight size={20} />
              <span>Request Swap</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillCard;


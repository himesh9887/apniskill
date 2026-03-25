import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import SkillCard from '../../components/SkillCard.jsx';
import Loader from '../../components/Loader.jsx';
import { Users, GraduationCap, MessageCircle, Star } from 'lucide-react';

const mockUsers = [
  {
    id: 1,
    name: 'Priya Sharma',
    skillsOffered: ['React', 'Tailwind CSS', 'JavaScript'],
    skillsWanted: ['Python', 'Django', 'Database Design'],
  },
  {
    id: 2,
    name: 'Rahul Patel',
    skillsOffered: ['Python', 'Node.js', 'MongoDB'],
    skillsWanted: ['React', 'UI/UX Design', 'Figma'],
  },
  {
    id: 3,
    name: 'Anita Gupta',
    skillsOffered: ['Digital Marketing', 'SEO', 'Content Writing'],
    skillsWanted: ['Graphic Design', 'Video Editing', 'Photoshop'],
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  const handleSwapRequest = (user) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    alert(`Swap request sent to ${user.name}! 👋 (Mock)`);
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-32 px-4"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="max-w-6xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight"
          >
            Exchange Skills
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mt-4">
              Grow Together
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Discover talented people around you. Trade skills you have for skills you want.
            <br />
            <span className="text-blue-400 font-semibold">No money. Just skills.</span>
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="btn-primary text-lg px-12 py-6 max-w-sm w-full text-center shadow-2xl"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
            </Link>
            <Link 
              to="/dashboard" 
              className="btn-secondary text-lg px-12 py-6 max-w-sm w-full text-center"
              whileHover={{ scale: 1.05 }}
            >
              Explore Skills
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-32"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-center mb-24 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
          >
            Why Choose ApniSkill?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass-card p-8 text-center group hover:border-blue-500/50"
            >
              <motion.div 
                className="w-20 h-20 bg-blue-500/20 border-2 border-blue-500/30 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-blue-500/40 transition-all"
                whileHover={{ rotate: 360, scale: 1.1 }}
              >
                <Users className="w-10 h-10 text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Local Network</h3>
              <p className="text-gray-400 leading-relaxed">Connect with skilled people in your city. Real people, real skills.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 text-center group hover:border-purple-500/50"
            >
              <motion.div 
                className="w-20 h-20 bg-purple-500/20 border-2 border-purple-500/30 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-purple-500/40 transition-all"
                whileHover={{ scale: 1.1, rotate: -360 }}
              >
                <GraduationCap className="w-10 h-10 text-purple-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Learn Anything</h3>
              <p className="text-gray-400 leading-relaxed">From coding to cooking. Trade what you know for what you want to learn.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 text-center group hover:border-green-500/50"
            >
              <motion.div 
                className="w-20 h-20 bg-green-500/20 border-2 border-green-500/30 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-green-500/40 transition-all"
                whileHover={{ scale: 1.1 }}
              >
                <MessageCircle className="w-10 h-10 text-green-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Direct Chat</h3>
              <p className="text-gray-400 leading-relaxed">Instant messaging to arrange skill exchange sessions. Safe & simple.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 text-center group hover:border-yellow-500/50"
            >
              <motion.div 
                className="w-20 h-20 bg-yellow-500/20 border-2 border-yellow-500/30 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-yellow-500/40 transition-all"
                whileHover={{ scale: 1.1, rotate: 180 }}
              >
                <Star className="w-10 h-10 text-yellow-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Trusted Reviews</h3>
              <p className="text-gray-400 leading-relaxed">Build reputation through verified skill exchanges. See ratings first.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Matches */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-32"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Perfect Skill Matches Near You
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              People ready to exchange skills right now. Tap to connect!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SkillCard user={user} onSwapRequest={() => handleSwapRequest(user)} />
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-20"
          >
            <Link 
              to="/dashboard"
              className="btn-primary text-xl px-16 py-8 inline-flex items-center space-x-3 shadow-2xl hover:shadow-glow mx-auto"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <span>Find More Matches</span>
              <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;


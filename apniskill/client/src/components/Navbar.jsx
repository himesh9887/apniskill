  import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Home, 
  LayoutDashboard, 
  UserCog, 
  MessageCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="navbar px-4 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl glass-card flex items-center justify-center shadow-glow"
          >
            <span className="text-white font-bold text-xl">AS</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
          >
            ApniSkill
          </motion.h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1">
          <Link to="/" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
            <Home size={20} />
            <span>Home</span>
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
                <UserCog size={20} />
                <span>Profile</span>
              </Link>
              <Link to="/chat" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
                <MessageCircle size={20} />
                <span>Chat</span>
              </Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <User size={20} className="text-white" />
              </motion.div>
              <motion.div 
                className="hidden md:block px-4 py-2 text-sm font-medium text-gray-300 hover:text-white cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={handleLogout}
              >
                Logout
              </motion.div>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="btn-secondary hidden sm:block"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="btn-primary hidden md:block"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl glass-card hover:bg-white/20 transition-all duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden mt-2"
          >
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <Link 
                to="/" 
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/20 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              {isAuthenticated && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/20 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/20 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserCog size={20} />
                    <span>Profile</span>
                  </Link>
                  <Link 
                    to="/chat" 
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/20 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageCircle size={20} />
                    <span>Chat</span>
                  </Link>
                  <button
                    className="flex items-center space-x-3 p-3 w-full text-left rounded-xl hover:bg-red-500/20 transition-all"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/20 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn-primary w-full text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;


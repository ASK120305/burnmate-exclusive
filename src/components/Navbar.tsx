import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, Trophy, History, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/activities', icon: Activity, label: 'Activities' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/history', icon: History, label: 'History' },
  ];

  return (
    <nav className="bg-gradient-card shadow-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-2 bg-gradient-burn rounded-xl shadow-burn"
            >
              <Flame className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-burn bg-clip-text text-transparent">
              BurnMate
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-burn text-white shadow-burn'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:block text-sm font-medium">
                      {item.label}
                    </span>
                  </motion.div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-burn rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DailyDashboard from '@/components/DailyDashboard';
import ActivityTracker from '@/components/ActivityTracker';
import FoodSwap from '@/components/FoodSwap';
import MoodSuggestor from '@/components/MoodSuggestor';
import { useBurn } from '@/context/BurnContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const Home = () => {
  const { dailyTotal } = useBurn();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            Welcome to{' '}
            <span className="bg-gradient-burn bg-clip-text text-transparent">
              BurnMate
            </span>{' '}
            🔥
            {user && <span className="block text-2xl mt-2">Hi there, {user.name}!</span>}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Track calories burned through everyday activities and discover fun ways to stay active!
          </p>
          
          {/* Landing Page Button */}
          <Link to="/">
            <Button variant="outline" className="hover:bg-accent">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Landing Page
            </Button>
          </Link>
        </motion.div>

        {/* Daily Dashboard */}
        <DailyDashboard />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <ActivityTracker />
            <MoodSuggestor />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <FoodSwap calories={dailyTotal} />
            
            {/* Quick Tips Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-card rounded-2xl p-6 shadow-card border"
            >
              <h3 className="text-lg font-semibold mb-4">💡 Quick Tips</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <span>🚶</span>
                  <span>Take the stairs instead of elevators - every step counts!</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span>🎵</span>
                  <span>Dance while doing chores to make them more fun and active.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span>🏃</span>
                  <span>Park farther away to add extra walking to your day.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span>⏰</span>
                  <span>Set hourly reminders to move around and stretch.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
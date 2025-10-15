import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Target, TrendingUp, Award, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBurn } from '@/context/BurnContext';
import { useAuth } from '@/context/AuthContext';

const DailyDashboard = () => {
  const { dailyTotal, streak, activities } = useBurn();
  const { user } = useAuth();

  const todayActivities = activities.filter(
    activity => activity.timestamp.toDateString() === new Date().toDateString()
  );

  const stats = [
    {
      title: 'Today\'s Burn',
      value: `${dailyTotal}`,
      unit: 'calories',
      icon: Flame,
      color: 'bg-gradient-burn',
      textColor: 'text-white'
    },
    {
      title: 'Fire Streak',
      value: `${streak}`,
      unit: streak === 1 ? 'day' : 'days',
      icon: TrendingUp,
      color: 'bg-gradient-achievement',
      textColor: 'text-white'
    },
    {
      title: 'Activities',
      value: `${todayActivities.length}`,
      unit: 'completed',
      icon: Target,
      color: 'bg-gradient-card',
      textColor: 'text-foreground'
    }
  ];

  // Show login prompt if no user is logged in
  if (!user) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-3"
        >
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-8">
              <div className="text-center">
                <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Welcome to Burn Buddy Blitz!</h3>
                <p className="text-muted-foreground mb-4">
                  Log in to start tracking your fitness journey and see your daily stats.
                </p>
                <div className="text-sm text-muted-foreground">
                  Track activities, monitor calories burned, and build your fire streak!
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${stat.color} shadow-card border-0 overflow-hidden`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${stat.textColor} opacity-80`}>
                      {stat.title}
                    </p>
                    <div className="flex items-baseline space-x-1">
                      <p className={`text-3xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </p>
                      <p className={`text-sm ${stat.textColor} opacity-60`}>
                        {stat.unit}
                      </p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.textColor === 'text-white' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <Icon className={`h-6 w-6 ${stat.textColor === 'text-white' ? 'text-white' : 'text-primary'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* Achievement Badge */}
      {streak >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-3"
        >
          <Card className="bg-gradient-achievement shadow-card border-0 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-3">
                <Award className="h-8 w-8" />
                <div className="text-center">
                  <h3 className="text-lg font-bold">🔥 Fire Streak Champion! 🔥</h3>
                  <p className="text-sm opacity-90">
                    {streak} days of consistent burning! Keep it up!
                  </p>
                </div>
                <Award className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DailyDashboard;
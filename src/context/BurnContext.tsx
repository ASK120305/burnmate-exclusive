import React, { createContext, useContext, useState, useEffect } from 'react';

interface Activity {
  id: string;
  name: string;
  calories: number;
  timestamp: Date;
  duration?: number;
}

interface BurnContextType {
  activities: Activity[];
  dailyTotal: number;
  streak: number;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  leaderboard: LeaderboardEntry[];
  addToLeaderboard: (entry: Omit<LeaderboardEntry, 'id'>) => void;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  activity: string;
  calories: number;
  funCaption?: string;
}

const BurnContext = createContext<BurnContextType | undefined>(undefined);

export const useBurn = () => {
  const context = useContext(BurnContext);
  if (!context) {
    throw new Error('useBurn must be used within a BurnProvider');
  }
  return context;
};

export const BurnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedActivities = localStorage.getItem('burnmate-activities');
    const savedLeaderboard = localStorage.getItem('burnmate-leaderboard');
    
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities).map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      })));
    }
    
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('burnmate-activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('burnmate-leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  const addActivity = (activityData: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addToLeaderboard = (entryData: Omit<LeaderboardEntry, 'id'>) => {
    const newEntry: LeaderboardEntry = {
      ...entryData,
      id: Date.now().toString(),
    };
    setLeaderboard(prev => [newEntry, ...prev].sort((a, b) => b.calories - a.calories));
  };

  // Calculate today's total calories
  const today = new Date().toDateString();
  const dailyTotal = activities
    .filter(activity => activity.timestamp.toDateString() === today)
    .reduce((sum, activity) => sum + activity.calories, 0);

  // Calculate streak (simplified - consecutive days with activities)
  const streak = calculateStreak(activities);

  const value = {
    activities,
    dailyTotal,
    streak,
    addActivity,
    leaderboard,
    addToLeaderboard,
  };

  return <BurnContext.Provider value={value}>{children}</BurnContext.Provider>;
};

function calculateStreak(activities: Activity[]): number {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateString = currentDate.toDateString();
    const hasActivity = activities.some(activity => 
      activity.timestamp.toDateString() === dateString
    );

    if (hasActivity) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
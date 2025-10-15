import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { workoutApi } from '@/services/api';

interface Activity {
  id: string;
  userId: string;
  name: string;
  calories: number;
  timestamp: Date;
  duration?: number;
}

interface BurnContextType {
  activities: Activity[];
  dailyTotal: number;
  streak: number;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp' | 'userId'>) => Promise<void>;
  // Reflect a workout that was created elsewhere (e.g., Dashboard/backend) into local context/leaderboard
  reflectWorkout: (workout: { type: string; duration?: number; caloriesBurned: number }) => void;
  leaderboard: LeaderboardEntry[];
  addToLeaderboard: (entry: Omit<LeaderboardEntry, 'id' | 'userId'>) => Promise<void>;
  clearUserData: () => void;
}

interface LeaderboardEntry {
  id: string;
  userId: string;
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
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load user-specific data from localStorage
  useEffect(() => {
    if (user) {
      const savedActivities = localStorage.getItem(`burnmate-activities-${user.id}`);
      const savedLeaderboard = localStorage.getItem(`burnmate-leaderboard-${user.id}`);
      
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities).map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        })));
      } else {
        setActivities([]);
      }
      
      if (savedLeaderboard) {
        setLeaderboard(JSON.parse(savedLeaderboard));
      } else {
        setLeaderboard([]);
      }
    } else {
      // Clear data when no user is logged in
      setActivities([]);
      setLeaderboard([]);
    }
  }, [user]);

  // Save user-specific data to localStorage
  useEffect(() => {
    if (user && activities.length > 0) {
      localStorage.setItem(`burnmate-activities-${user.id}`, JSON.stringify(activities));
    }
  }, [activities, user]);

  useEffect(() => {
    if (user && leaderboard.length > 0) {
      localStorage.setItem(`burnmate-leaderboard-${user.id}`, JSON.stringify(leaderboard));
    }
  }, [leaderboard, user]);

  const addActivity = async (activityData: Omit<Activity, 'id' | 'timestamp' | 'userId'>) => {
    if (!user) return;
    
    const newActivity: Activity = {
      ...activityData,
      userId: user.id,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    // Add to activities list
    setActivities(prev => [newActivity, ...prev]);

    // Automatically reflect this activity in the leaderboard
    const activityLabel = `${newActivity.name}${newActivity.duration ? ` (${newActivity.duration} min)` : ''}`;
    const newEntry: LeaderboardEntry = {
      id: `lb-${Date.now()}`,
      userId: user.id,
      name: user.name,
      activity: activityLabel,
      calories: newActivity.calories,
      funCaption: getRandomCaption(user.name),
    };

    setLeaderboard(prev => [newEntry, ...prev].sort((a, b) => b.calories - a.calories));

    // Persist to backend workouts so Dashboard sees it
    try {
      await workoutApi.addWorkout({
        type: newActivity.name,
        duration: newActivity.duration || 0,
        caloriesBurned: newActivity.calories,
      });
      // Notify listeners (e.g., Dashboard) to refetch
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('burn:workout-updated'));
      }
    } catch (e) {
      console.error('Failed to persist activity to backend workout:', e);
    }
  };

  const addToLeaderboard = async (entryData: Omit<LeaderboardEntry, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newEntry: LeaderboardEntry = {
      ...entryData,
      userId: user.id,
      id: Date.now().toString(),
    };
    setLeaderboard(prev => [newEntry, ...prev].sort((a, b) => b.calories - a.calories));

    // Also reflect as an activity for consistency across the app
    const now = new Date();
    const inferred = inferActivityFromLeaderboard(newEntry.activity);
    const activity: Activity = {
      id: `lb-act-${now.getTime()}`,
      userId: user.id,
      name: inferred.name,
      duration: inferred.duration,
      calories: newEntry.calories,
      timestamp: now,
    };
    setActivities(prev => [activity, ...prev]);

    // Persist to backend workouts so Dashboard sees it
    try {
      await workoutApi.addWorkout({
        type: activity.name,
        duration: activity.duration || 0,
        caloriesBurned: activity.calories,
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('burn:workout-updated'));
      }
    } catch (e) {
      console.error('Failed to persist leaderboard entry as workout:', e);
    }
  };

  const clearUserData = () => {
    setActivities([]);
    setLeaderboard([]);
  };

  // Calculate today's total calories for current user
  const today = new Date().toDateString();
  const dailyTotal = activities
    .filter(activity => activity.timestamp.toDateString() === today)
    .reduce((sum, activity) => sum + activity.calories, 0);

  // Calculate streak (simplified - consecutive days with activities) for current user
  const streak = calculateStreak(activities);

  const reflectWorkout = (workout: { type: string; duration?: number; caloriesBurned: number }) => {
    if (!user) return;
    const now = new Date();

    // Update activities store (local representation)
    const activity: Activity = {
      id: `ext-${now.getTime()}`,
      userId: user.id,
      name: workout.type,
      duration: workout.duration,
      calories: workout.caloriesBurned,
      timestamp: now,
    };
    setActivities(prev => [activity, ...prev]);

    // Update leaderboard store
    const label = `${activity.name}${activity.duration ? ` (${activity.duration} min)` : ''}`;
    const entry: LeaderboardEntry = {
      id: `lb-${now.getTime()}`,
      userId: user.id,
      name: user.name,
      activity: label,
      calories: activity.calories,
      funCaption: getRandomCaption(user.name),
    };
    setLeaderboard(prev => [entry, ...prev].sort((a, b) => b.calories - a.calories));

    // Emit event to notify any backend-driven views to update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('burn:workout-updated'));
    }
  };

  const value = {
    activities,
    dailyTotal,
    streak,
    addActivity,
    reflectWorkout,
    leaderboard,
    addToLeaderboard,
    clearUserData,
  };

  return <BurnContext.Provider value={value}>{children}</BurnContext.Provider>;
};

function inferActivityFromLeaderboard(activityLabel: string): { name: string; duration?: number } {
  // Attempt to parse patterns like "Running (30 min)"
  const match = activityLabel.match(/^(.*)\s*\((\d+)\s*min\)$/i);
  if (match) {
    return { name: match[1].trim(), duration: Number(match[2]) };
  }
  return { name: activityLabel.trim() };
}

function getRandomCaption(name: string): string {
  const funCaptions = [
    `${name} crushed it! 💪`,
    `${name} is on fire! 🔥`,
    `${name} just leveled up! ⚡`,
    `${name} burned through that workout! 🌟`,
    `${name} is unstoppable! 🚀`,
  ];
  return funCaptions[Math.floor(Math.random() * funCaptions.length)];
}

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
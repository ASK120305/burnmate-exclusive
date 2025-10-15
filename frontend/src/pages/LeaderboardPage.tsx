import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, Crown, Plus, Users, User, Calendar, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBurn } from '@/context/BurnContext';
import { useAuth } from '@/context/AuthContext';
import { ACTIVITY_DATA } from '@/data/activities';
import { useToast } from '@/hooks/use-toast';
import { leaderboardApi, GlobalLeaderboardEntry } from '@/services/api';

const LeaderboardPage = () => {
  const [name, setName] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [duration, setDuration] = useState('');
  const { leaderboard, addToLeaderboard } = useBurn();
  const [globalLeaderboard, setGlobalLeaderboard] = useState<GlobalLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<GlobalLeaderboardEntry | null>(null);
  const [selectedUserWorkouts, setSelectedUserWorkouts] = useState<ReturnType<typeof Array.prototype.slice>>([] as any);
  const [loadingUser, setLoadingUser] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add entries to the leaderboard.",
        variant: "destructive",
      });
      return;
    }
    
    if (!name || !selectedActivity || !duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const activityData = ACTIVITY_DATA[selectedActivity];
    const totalCalories = Math.round(activityData.caloriesPerMinute * parseInt(duration));
    
    // Generate a fun caption
    const funCaptions = [
      `${name} crushed it! 💪`,
      `${name} is on fire! 🔥`,
      `${name} just leveled up! ⚡`,
      `${name} burned through that workout! 🌟`,
      `${name} is unstoppable! 🚀`,
    ];
    
    const randomCaption = funCaptions[Math.floor(Math.random() * funCaptions.length)];

    addToLeaderboard({
      name,
      activity: `${activityData.name} (${duration} min)`,
      calories: totalCalories,
      funCaption: randomCaption,
    });

    toast({
      title: "Added to Leaderboard! 🏆",
      description: `${name} burned ${totalCalories} calories!`,
    });

    setName('');
    setSelectedActivity('');
    setDuration('');
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankColors = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gradient-card text-foreground';
    }
  };

  const fetchGlobal = async () => {
    setLoading(true);
    try {
      const data = await leaderboardApi.getGlobal();
      setGlobalLeaderboard(data);
    } catch (e) {
      console.error('Failed to load global leaderboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobal();
    const onUpdated = () => fetchGlobal();
    window.addEventListener('burn:workout-updated', onUpdated);
    return () => window.removeEventListener('burn:workout-updated', onUpdated);
  }, []);

  const openUserDetails = async (entry: GlobalLeaderboardEntry) => {
    setSelectedUser(entry);
    setLoadingUser(true);
    try {
      const workouts = await leaderboardApi.getUserWorkouts(entry.userId);
      setSelectedUserWorkouts(workouts);
    } catch (e) {
      console.error('Failed to load user workouts:', e);
    } finally {
      setLoadingUser(false);
    }
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setSelectedUserWorkouts([]);
  };

  // Show login prompt if no user is logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-4">
              <Trophy className="inline h-8 w-8 mr-2 text-yellow-500" />
              Burn Leaderboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Compete with friends and see who's burning the most calories!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto"
          >
            <Card className="bg-gradient-card shadow-card border-0">
              <CardContent className="p-8">
                <div className="text-center">
                  <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Login Required</h3>
                  <p className="text-muted-foreground mb-4">
                    Please log in to view the leaderboard and add your own entries.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Join the competition and see how you rank!
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">
            <Trophy className="inline h-8 w-8 mr-2 text-yellow-500" />
            Burn Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Compete with friends and see who's burning the most calories!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Entry Form */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-burn rounded-lg">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  <span>Add Your Burn</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity">Activity</Label>
                    <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose activity..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {Object.entries(ACTIVITY_DATA).map(([key, activity]) => (
                          <SelectItem key={key} value={key} className="hover:bg-accent">
                            {activity.emoji} {activity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Enter duration..."
                      min="1"
                    />
                  </div>

                  {selectedActivity && duration && (
                    <div className="p-3 bg-gradient-burn rounded-lg text-white text-center">
                      <div className="font-bold">
                        {Math.round(ACTIVITY_DATA[selectedActivity].caloriesPerMinute * parseInt(duration))} calories
                      </div>
                      <div className="text-xs opacity-75">Estimated burn</div>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-gradient-burn hover:shadow-hover text-white border-0">
                    <Trophy className="h-4 w-4 mr-2" />
                    Add to Leaderboard
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Global Top Burners</span>
                  <Badge className="bg-gradient-burn text-white border-0">
                    {globalLeaderboard.length} users
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading leaderboard...</div>
                ) : globalLeaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No data yet!</h3>
                    <p className="text-muted-foreground">Start adding workouts to climb the ranks.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {globalLeaderboard.map((entry, index) => (
                        <motion.div
                          key={entry.userId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.02 }}
                          className={`rounded-lg p-4 shadow-sm border cursor-pointer ${getRankColors(index)}`}
                          onClick={() => openUserDetails(entry)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                {getRankIcon(index)}
                                <span className="font-bold text-lg">#{index + 1}</span>
                              </div>
                              <div>
                                <h4 className="font-semibold">{entry.name}</h4>
                                <p className="text-sm opacity-75">{entry.workoutsCount} workouts</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">{entry.totalCalories}</div>
                              <div className="text-xs opacity-75">calories</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeUserDetails}>
          <div className="w-full max-w-2xl bg-background rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold">{selectedUser.name}'s recent workouts</div>
              <Button variant="ghost" onClick={closeUserDetails}>Close</Button>
            </div>
            <div className="p-4">
              {loadingUser ? (
                <div className="text-center text-muted-foreground py-6">Loading...</div>
              ) : selectedUserWorkouts.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">No workouts available</div>
              ) : (
                <div className="space-y-3">
                  {selectedUserWorkouts.map((w: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 rounded-full">
                          <Activity className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium">{w.type}</div>
                          <div className="text-xs text-muted-foreground flex items-center space-x-3">
                            <span className="flex items-center space-x-1"><Calendar className="h-3 w-3" /><span>{w.date ? new Date(w.date).toLocaleString() : ''}</span></span>
                            <span className="flex items-center space-x-1"><Zap className="h-3 w-3" /><span>{w.caloriesBurned} cal</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{w.duration} min</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
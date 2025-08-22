import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, Crown, Plus, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBurn } from '@/context/BurnContext';
import { ACTIVITY_DATA } from '@/data/activities';
import { useToast } from '@/hooks/use-toast';

const LeaderboardPage = () => {
  const [name, setName] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [duration, setDuration] = useState('');
  const { leaderboard, addToLeaderboard } = useBurn();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
                  <span>Top Burners</span>
                  <Badge className="bg-gradient-burn text-white border-0">
                    {leaderboard.length} entries
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No entries yet!</h3>
                    <p className="text-muted-foreground">
                      Be the first to add your calorie burn to the leaderboard.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {leaderboard.map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`rounded-lg p-4 shadow-sm border ${getRankColors(index)}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                {getRankIcon(index)}
                                <span className="font-bold text-lg">#{index + 1}</span>
                              </div>
                              <div>
                                <h4 className="font-semibold">{entry.name}</h4>
                                <p className="text-sm opacity-75">{entry.activity}</p>
                                {entry.funCaption && (
                                  <p className="text-xs italic opacity-60 mt-1">
                                    {entry.funCaption}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">
                                {entry.calories}
                              </div>
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
    </div>
  );
};

export default LeaderboardPage;
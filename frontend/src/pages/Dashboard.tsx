import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBurn } from '@/context/BurnContext';
import { workoutApi, WorkoutDto } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flame, Trophy, Target, Clock, Zap, TrendingUp, Calendar, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [type, setType] = useState('Running');
  const { reflectWorkout } = useBurn();
  const { activities } = useBurn();
  const [duration, setDuration] = useState<number>(30);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(250);
  const [workouts, setWorkouts] = useState<WorkoutDto[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const workoutTypes = [
    'Running', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'HIIT', 
    'Walking', 'Dancing', 'Boxing', 'Pilates', 'CrossFit', 'Rowing'
  ];

  const fetchWorkouts = async () => {
    if (!user) return;
    try {
    const data = await workoutApi.getWorkouts(user.id);
    setWorkouts(data);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    }
  };

  useEffect(() => {
    fetchWorkouts();

    const onWorkoutUpdated = () => {
      fetchWorkouts();
    };
    window.addEventListener('burn:workout-updated', onWorkoutUpdated);

    return () => window.removeEventListener('burn:workout-updated', onWorkoutUpdated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const addWorkout = async () => {
    if (!type || !duration || !caloriesBurned) return;
    setIsAdding(true);
    try {
    const created = await workoutApi.addWorkout({ type, duration, caloriesBurned });
    // Reflect this workout into BurnContext so Activities/Daily totals/Leaderboard sync instantly
    reflectWorkout({ type: created.type, duration: created.duration, caloriesBurned: created.caloriesBurned });
    await fetchWorkouts();
    // notify others
    window.dispatchEvent(new CustomEvent('burn:workout-updated'));
      // Reset form
      setType('Running');
      setDuration(30);
      setCaloriesBurned(250);
    } catch (error) {
      console.error('Failed to add workout:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Calculate stats (merge backend workouts with context activities that may not yet be synced)
  const workoutKey = (w: WorkoutDto) => `${w.type}|${w.duration || 0}|${w.caloriesBurned || 0}|${new Date(w.date || '').toDateString()}`;
  const workoutKeys = new Set(workouts.map(workoutKey));

  const unsyncedActivities = activities.filter(a => {
    const key = `${a.name}|${a.duration || 0}|${a.calories || 0}|${a.timestamp.toDateString()}`;
    return !workoutKeys.has(key);
  });

  const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const extraCalories = unsyncedActivities.reduce((sum, a) => sum + (a.calories || 0), 0);
  const mergedTotalCalories = totalCalories + extraCalories;

  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0) + unsyncedActivities.reduce((s, a) => s + (a.duration || 0), 0);

  const totalWorkouts = workouts.length + unsyncedActivities.length;
  const avgCaloriesPerWorkout = totalWorkouts > 0 ? Math.round(mergedTotalCalories / totalWorkouts) : 0;
  
  // Recent workouts (last 7 days)
  const recentWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date || '');
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  });

  // Weekly goal (example: 2000 calories)
  const weeklyGoal = 2000;
  const weeklyProgress = Math.min((mergedTotalCalories / weeklyGoal) * 100, 100);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}! 🔥</h1>
            <p className="text-gray-600">Ready to crush your fitness goals today?</p>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-orange-600">{mergedTotalCalories}</span>
            <span className="text-gray-600">calories burned</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Total Calories</p>
                  <p className="text-2xl font-bold">{mergedTotalCalories}</p>
                </div>
                <Zap className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Workouts</p>
                  <p className="text-2xl font-bold">{totalWorkouts}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Time</p>
                  <p className="text-2xl font-bold">{Math.round(totalDuration / 60)}h</p>
                </div>
                <Clock className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Avg/Workout</p>
                  <p className="text-2xl font-bold">{avgCaloriesPerWorkout}</p>
                </div>
                <Target className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Weekly Progress</span>
            </CardTitle>
            <CardDescription>Goal: {weeklyGoal} calories this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{mergedTotalCalories} / {weeklyGoal} calories</span>
                <span>{Math.round(weeklyProgress)}%</span>
              </div>
              <Progress value={weeklyProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="add" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add Workout</TabsTrigger>
            <TabsTrigger value="history">Workout History</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Log Your Workout</CardTitle>
                <CardDescription>Track your fitness activities and calories burned</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Workout Type</label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select workout type" />
                      </SelectTrigger>
                      <SelectContent>
                        {workoutTypes.map((workoutType) => (
                          <SelectItem key={workoutType} value={workoutType}>
                            {workoutType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      placeholder="30"
                      min="1"
                    />
      </div>

      <div className="space-y-2">
                    <label className="text-sm font-medium">Calories Burned</label>
                    <Input
                      type="number"
                      value={caloriesBurned}
                      onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                      placeholder="250"
                      min="1"
                    />
                  </div>
                </div>

                <Button 
                  onClick={addWorkout} 
                  disabled={isAdding || !type || !duration || !caloriesBurned}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {isAdding ? 'Adding Workout...' : 'Add Workout'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Workouts</CardTitle>
                <CardDescription>Your last 7 days of fitness activities</CardDescription>
              </CardHeader>
              <CardContent>
                {recentWorkouts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No workouts yet this week</p>
                    <p className="text-sm">Start your fitness journey by adding your first workout!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentWorkouts.slice(0, 10).map((workout) => (
                      <div key={workout._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-orange-100 rounded-full">
                            <Activity className="h-5 w-5 text-orange-600" />
                          </div>
            <div>
                            <h3 className="font-semibold text-gray-900">{workout.type}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{workout.duration} min</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Zap className="h-4 w-4" />
                                <span>{workout.caloriesBurned} cal</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">
                            {workout.date ? new Date(workout.date).toLocaleDateString() : 'Today'}
                          </Badge>
            </div>
          </div>
        ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;



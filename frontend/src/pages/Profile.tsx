import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { profileApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, Camera, Save, Edit3, Mail, Calendar, MapPin, 
  Trophy, Flame, Activity, Target, Zap, Heart, Dumbbell
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useBurn } from '@/context/BurnContext';
import { workoutApi, WorkoutDto } from '@/services/api';

const Profile: React.FC = () => {
  const { user, getUserProfile } = useAuth();
  const { activities, streak } = useBurn();
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | undefined>();
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fitness stats state
  const [workouts, setWorkouts] = useState<WorkoutDto[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
      setName(user.name || '');
      setAge(user.age);
      setGender(user.gender || '');
    }
  }, [user]);

  // Load workouts for fitness stats and listen for updates
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      setIsStatsLoading(true);
      try {
        const data = await workoutApi.getWorkouts(user.id);
        setWorkouts(data);
      } catch (e) {
        console.error('Failed to load workouts for profile stats:', e);
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchStats();

    const onUpdated = () => fetchStats();
    window.addEventListener('burn:workout-updated', onUpdated);
    return () => window.removeEventListener('burn:workout-updated', onUpdated);
  }, [user?.id]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, we'll create a local URL for preview
      // In a real app, you'd upload to a service like Cloudinary
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    setStatus(null);
    try {
      await profileApi.updateProfile(user.id, { bio, avatarUrl, name, age, gender });
      await getUserProfile(user.id);
      setStatus('Profile updated successfully!');
      setIsEditing(false);
    } catch (e: any) {
      setStatus(e?.response?.data?.message || 'Save failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-gray-600 text-lg">Manage your personal information and fitness preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="backdrop-blur-lg bg-white/95 shadow-2xl border-0">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {/* Avatar Section */}
                  <div className="relative inline-block">
                    <Avatar className="h-32 w-32 mx-auto border-4 border-white shadow-lg">
                      <AvatarImage src={avatarUrl} alt={name} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Camera className="h-4 w-4" />
                    </motion.button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    {age && <p className="text-sm text-gray-500">{age} years old</p>}
                    {gender && <Badge variant="secondary" className="mt-2">{gender}</Badge>}
                  </div>

                  {bio && (
                    <div className="text-center">
                      <p className="text-gray-700 italic">"{bio}"</p>
                    </div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="fitness">Fitness Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card className="backdrop-blur-lg bg-white/95 shadow-2xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-purple-500" />
                      <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>Update your personal details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {status && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-3 rounded-lg text-sm ${
                          status.includes('successfully') 
                            ? 'bg-green-50 border border-green-200 text-green-600'
                            : 'bg-red-50 border border-red-200 text-red-600'
                        }`}
                      >
                        {status}
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                            className="pl-10 h-12"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            value={user.email}
                            disabled
                            className="pl-10 h-12 bg-gray-50"
                            placeholder="Email address"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Age</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={age || ''}
                            onChange={(e) => setAge(Number(e.target.value))}
                            disabled={!isEditing}
                            className="pl-10 h-12"
                            placeholder="25"
                            min="13"
                            max="120"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Gender</label>
                        <Select value={gender} onValueChange={setGender} disabled={!isEditing}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Bio</label>
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        disabled={!isEditing}
                        className="min-h-[100px]"
                        placeholder="Tell us about yourself and your fitness goals..."
                      />
                    </div>

                    {isEditing && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex space-x-2"
                      >
                        <Button
                          onClick={saveProfile}
                          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Zap className="h-4 w-4" />
                              </motion.div>
                              <span>Saving...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Save className="h-4 w-4" />
                              <span>Save Changes</span>
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fitness" className="space-y-4">
                <Card className="backdrop-blur-lg bg-white/95 shadow-2xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span>Fitness Achievements</span>
                    </CardTitle>
                    <CardDescription>Your fitness journey and accomplishments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isStatsLoading ? (
                      <div className="text-center text-gray-500 py-6">Loading stats...</div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(() => {
                          // Merge backend workouts with unsynced activities
                          const workoutKey = (w: WorkoutDto) => `${w.type}|${w.duration || 0}|${w.caloriesBurned || 0}|${w.date ? new Date(w.date).toDateString() : ''}`;
                          const workoutKeys = new Set(workouts.map(workoutKey));
                          const unsyncedActivities = activities.filter(a => {
                            const key = `${a.name}|${a.duration || 0}|${a.calories || 0}|${a.timestamp.toDateString()}`;
                            return !workoutKeys.has(key);
                          });

                          const totalCalories = workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
                          const extraCalories = unsyncedActivities.reduce((s, a) => s + (a.calories || 0), 0);
                          const mergedTotalCalories = totalCalories + extraCalories;

                          const totalWorkouts = workouts.length + unsyncedActivities.length;

                          // Goals achieved: days in last 30 days with >= 500 calories
                          const dayTotals = new Map<string, number>();
                          for (const w of workouts) {
                            const d = w.date ? new Date(w.date).toDateString() : new Date().toDateString();
                            dayTotals.set(d, (dayTotals.get(d) || 0) + (w.caloriesBurned || 0));
                          }
                          for (const a of unsyncedActivities) {
                            const d = a.timestamp.toDateString();
                            dayTotals.set(d, (dayTotals.get(d) || 0) + (a.calories || 0));
                          }
                          const cutoff = new Date();
                          cutoff.setDate(cutoff.getDate() - 30);
                          let goalsAchieved = 0;
                          dayTotals.forEach((val, key) => {
                            const dt = new Date(key);
                            if (dt >= cutoff && val >= 500) goalsAchieved++;
                          });

                          return (
                            <>
                              <div className="text-center p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg">
                                <Flame className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-2xl font-bold">{mergedTotalCalories}</p>
                                <p className="text-sm opacity-90">Calories Burned</p>
                              </div>
                              <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
                                <Activity className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-2xl font-bold">{totalWorkouts}</p>
                                <p className="text-sm opacity-90">Workouts</p>
                              </div>
                              <div className="text-center p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg">
                                <Target className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-2xl font-bold">{goalsAchieved}</p>
                                <p className="text-sm opacity-90">Goals Achieved</p>
                              </div>
                              <div className="text-center p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg">
                                <Heart className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-2xl font-bold">{streak}</p>
                                <p className="text-sm opacity-90">Streak Days</p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;



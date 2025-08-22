import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ACTIVITY_DATA } from '@/data/activities';
import { useBurn } from '@/context/BurnContext';
import { useToast } from '@/hooks/use-toast';

const ActivityTracker = () => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [duration, setDuration] = useState('');
  const { addActivity } = useBurn();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedActivity || !duration) {
      toast({
        title: "Missing Information",
        description: "Please select an activity and duration.",
        variant: "destructive",
      });
      return;
    }

    const activityData = ACTIVITY_DATA[selectedActivity];
    const totalCalories = Math.round(activityData.caloriesPerMinute * parseInt(duration));

    addActivity({
      name: activityData.name,
      calories: totalCalories,
      duration: parseInt(duration),
    });

    toast({
      title: "Activity Added! 🔥",
      description: `You burned ${totalCalories} calories with ${activityData.name}!`,
    });

    setSelectedActivity('');
    setDuration('');
  };

  const selectedActivityData = selectedActivity ? ACTIVITY_DATA[selectedActivity] : null;
  const estimatedCalories = selectedActivityData && duration 
    ? Math.round(selectedActivityData.caloriesPerMinute * parseInt(duration))
    : 0;

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-burn rounded-lg">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <span>Track Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="activity">Activity</Label>
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an activity..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {Object.entries(ACTIVITY_DATA).map(([key, activity]) => (
                  <SelectItem key={key} value={key} className="hover:bg-accent">
                    <div className="flex items-center space-x-2">
                      <span>{activity.emoji}</span>
                      <span>{activity.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({activity.caloriesPerMinute} cal/min)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Duration (minutes)</span>
            </Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration..."
              min="1"
              max="300"
            />
          </div>

          {estimatedCalories > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-burn rounded-lg text-white text-center"
            >
              <div className="text-2xl font-bold">{estimatedCalories} calories</div>
              <div className="text-sm opacity-90">Estimated burn</div>
            </motion.div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-burn hover:shadow-hover text-white border-0"
            disabled={!selectedActivity || !duration}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ActivityTracker;
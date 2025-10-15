import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOOD_ACTIVITIES, ACTIVITY_DATA } from '@/data/activities';

const MoodSuggestor = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [suggestion, setSuggestion] = useState<any>(null);

  const moods = [
    { value: 'stressed', label: 'Stressed 😤', emoji: '😤' },
    { value: 'bored', label: 'Bored 😑', emoji: '😑' },
    { value: 'energetic', label: 'Energetic ⚡', emoji: '⚡' },
    { value: 'tired', label: 'Tired 😴', emoji: '😴' },
  ];

  const getSuggestion = () => {
    if (!selectedMood) return;

    const moodActivities = MOOD_ACTIVITIES[selectedMood as keyof typeof MOOD_ACTIVITIES];
    const randomActivity = moodActivities[Math.floor(Math.random() * moodActivities.length)];
    const activityData = ACTIVITY_DATA[randomActivity.activity];

    setSuggestion({
      activity: activityData,
      reason: randomActivity.reason,
      mood: selectedMood
    });
  };

  return (
    <Card className="bg-mood-calm shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-burn rounded-lg">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span>How Are You Feeling?</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Select value={selectedMood} onValueChange={setSelectedMood}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your mood..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {moods.map((mood) => (
                <SelectItem key={mood.value} value={mood.value} className="hover:bg-accent">
                  <span>{mood.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={getSuggestion}
          disabled={!selectedMood}
          className="w-full bg-gradient-burn hover:shadow-hover text-white border-0"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Get Activity Suggestion
        </Button>

        <AnimatePresence>
          {suggestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-card rounded-lg p-4 border"
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{suggestion.activity.emoji}</span>
                <div>
                  <h4 className="font-semibold">{suggestion.activity.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ~{suggestion.activity.caloriesPerMinute} calories/minute
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground/80 mb-3">
                {suggestion.reason}
              </p>
              <div className="bg-gradient-burn text-white rounded-lg p-2 text-center text-sm">
                Perfect for when you're feeling {suggestion.mood}!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default MoodSuggestor;
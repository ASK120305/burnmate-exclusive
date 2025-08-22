import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, Clock, Flame, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBurn } from '@/context/BurnContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const History = () => {
  const { activities } = useBurn();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'all'>('week');

  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = activity.timestamp.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, typeof activities>);

  // Get current week's activities
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const filteredActivities = selectedPeriod === 'week' 
    ? Object.entries(groupedActivities).filter(([dateString]) => {
        const date = new Date(dateString);
        return date >= weekStart && date <= weekEnd;
      })
    : Object.entries(groupedActivities);

  // Calculate total calories for the period
  const totalCalories = filteredActivities.reduce((total, [, dayActivities]) => {
    return total + dayActivities.reduce((dayTotal, activity) => dayTotal + activity.calories, 0);
  }, 0);

  // Calculate average daily calories
  const activeDays = filteredActivities.length;
  const averageDaily = activeDays > 0 ? Math.round(totalCalories / activeDays) : 0;

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
            <Calendar className="inline h-8 w-8 mr-2" />
            Burn History
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and see your calorie burning journey!
          </p>
        </motion.div>

        {/* Period Selector & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Period Selector */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-sm">View Period</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                className={`w-full justify-start ${
                  selectedPeriod === 'week' 
                    ? 'bg-gradient-burn text-white border-0 hover:shadow-hover' 
                    : ''
                }`}
                onClick={() => setSelectedPeriod('week')}
              >
                This Week
              </Button>
              <Button
                variant={selectedPeriod === 'all' ? 'default' : 'outline'}
                className={`w-full justify-start ${
                  selectedPeriod === 'all' 
                    ? 'bg-gradient-burn text-white border-0 hover:shadow-hover' 
                    : ''
                }`}
                onClick={() => setSelectedPeriod('all')}
              >
                All Time
              </Button>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-burn shadow-card border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Total Burned</p>
                    <p className="text-2xl font-bold">{totalCalories}</p>
                    <p className="text-xs opacity-60">calories</p>
                  </div>
                  <Flame className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-achievement shadow-card border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Daily Average</p>
                    <p className="text-2xl font-bold">{averageDaily}</p>
                    <p className="text-xs opacity-60">calories</p>
                  </div>
                  <TrendingUp className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-card shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Days</p>
                    <p className="text-2xl font-bold text-foreground">{activeDays}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedPeriod === 'week' ? 'this week' : 'total'}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Weekly View Grid */}
        {selectedPeriod === 'week' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle>Week Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => {
                    const dayString = day.toDateString();
                    const dayActivities = groupedActivities[dayString] || [];
                    const dayCalories = dayActivities.reduce((sum, activity) => sum + activity.calories, 0);
                    const isToday = isSameDay(day, now);

                    return (
                      <motion.div
                        key={dayString}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className={`text-center p-3 rounded-lg border ${
                          isToday 
                            ? 'bg-gradient-burn text-white border-transparent' 
                            : dayCalories > 0 
                              ? 'bg-achievement/10 border-achievement/20' 
                              : 'bg-muted/50 border-border'
                        }`}
                      >
                        <div className="text-xs font-medium opacity-75">
                          {format(day, 'EEE')}
                        </div>
                        <div className="text-lg font-bold">
                          {format(day, 'd')}
                        </div>
                        <div className="text-xs">
                          {dayCalories > 0 ? `${dayCalories} cal` : '-'}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Activities List */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No activities yet!</h3>
                <p className="text-muted-foreground">
                  Start tracking your activities to see your history here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {filteredActivities
                    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                    .map(([dateString, dayActivities], index) => {
                      const date = new Date(dateString);
                      const dayTotal = dayActivities.reduce((sum, activity) => sum + activity.calories, 0);

                      return (
                        <motion.div
                          key={dateString}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">
                              {format(date, 'EEEE, MMMM d, yyyy')}
                            </h3>
                            <Badge className="bg-gradient-burn text-white border-0">
                              {dayTotal} calories
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {dayActivities
                              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                              .map((activity) => (
                                <motion.div
                                  key={activity.id}
                                  whileHover={{ scale: 1.02 }}
                                  className="bg-gradient-card border rounded-lg p-3"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-sm">{activity.name}</h4>
                                    <span className="text-lg font-bold text-burn-primary">
                                      {activity.calories}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>
                                      {activity.duration ? `${activity.duration} min` : 'Manual entry'}
                                    </span>
                                    <span>{format(activity.timestamp, 'HH:mm')}</span>
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
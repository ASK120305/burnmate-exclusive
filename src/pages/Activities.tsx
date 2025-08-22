import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { ACTIVITY_DATA } from '@/data/activities';
import ActivityTracker from '@/components/ActivityTracker';

const Activities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Activities', emoji: '🌟' },
    { value: 'daily', label: 'Daily Life', emoji: '🏠' },
    { value: 'exercise', label: 'Exercise', emoji: '💪' },
    { value: 'fun', label: 'Fun Activities', emoji: '🎉' },
    { value: 'household', label: 'Household', emoji: '🧹' },
  ];

  const filteredActivities = Object.entries(ACTIVITY_DATA).filter(([key, activity]) => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Activity Tracker</h1>
          <p className="text-lg text-muted-foreground">
            Track your activities and see how many calories you burn!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Tracker */}
          <div className="lg:col-span-1">
            <ActivityTracker />
          </div>

          {/* Activity Browser */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Browse Activities</span>
                </CardTitle>
                
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category.value}
                        variant={selectedCategory === category.value ? "default" : "secondary"}
                        className={`cursor-pointer transition-all ${
                          selectedCategory === category.value
                            ? 'bg-gradient-burn text-white hover:shadow-hover'
                            : 'hover:bg-accent'
                        }`}
                        onClick={() => setSelectedCategory(category.value)}
                      >
                        <span className="mr-1">{category.emoji}</span>
                        {category.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredActivities.map(([key, activity], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-card border rounded-lg p-4 hover:shadow-hover transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{activity.emoji}</span>
                          <div>
                            <h4 className="font-medium">{activity.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {activity.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-burn text-white rounded-lg p-2 text-center">
                        <div className="text-lg font-bold">
                          {activity.caloriesPerMinute} cal/min
                        </div>
                        <div className="text-xs opacity-75">
                          {activity.caloriesPerMinute * 10} cal per 10 min
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {filteredActivities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No activities found matching your search.</p>
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

export default Activities;
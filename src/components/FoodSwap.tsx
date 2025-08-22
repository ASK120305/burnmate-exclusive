import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import { FOOD_EQUIVALENTS } from '@/data/activities';

interface FoodSwapProps {
  calories: number;
}

const FoodSwap: React.FC<FoodSwapProps> = ({ calories }) => {
  if (calories === 0) return null;

  const generateFoodEquivalents = (totalCalories: number) => {
    const equivalents: Array<{ name: string; emoji: string; count: number }> = [];
    let remainingCalories = totalCalories;

    // Sort food items by calories (highest first)
    const sortedFoods = [...FOOD_EQUIVALENTS].sort((a, b) => b.calories - a.calories);

    for (const food of sortedFoods) {
      if (remainingCalories >= food.calories) {
        const count = Math.floor(remainingCalories / food.calories);
        if (count > 0) {
          equivalents.push({
            name: food.name,
            emoji: food.emoji,
            count
          });
          remainingCalories -= count * food.calories;
        }
      }
      
      // Stop when we have enough equivalents or remaining calories are too low
      if (equivalents.length >= 3 || remainingCalories < 50) break;
    }

    return equivalents;
  };

  const foodEquivalents = generateFoodEquivalents(calories);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-gradient-achievement shadow-card border-0 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Utensils className="h-5 w-5" />
            </div>
            <span>You Burned The Equivalent Of:</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {foodEquivalents.map((food, index) => (
              <motion.div
                key={food.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between bg-white/10 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{food.emoji}</span>
                  <div>
                    <div className="font-medium">
                      {food.count} {food.name}{food.count > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="text-sm opacity-75">
                  {food.count * FOOD_EQUIVALENTS.find(f => f.name === food.name)!.calories} cal
                </div>
              </motion.div>
            ))}
            
            {foodEquivalents.length === 0 && (
              <div className="text-center py-4">
                <span className="text-lg">🔥</span>
                <p className="text-sm opacity-75 mt-2">
                  Great start! Keep burning those calories!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FoodSwap;
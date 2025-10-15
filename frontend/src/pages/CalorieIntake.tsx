import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Barcode, Soup, Plus, Trash2, Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { intakeApi } from '@/services/api';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein?: number; // grams
  timestamp: string; // ISO
}

const CalorieIntake: React.FC = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState<string>('');
  const [foodProtein, setFoodProtein] = useState<string>('');
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [goals, setGoals] = useState<{ dailyCalorieTarget: number; proteinTarget: number }>({ dailyCalorieTarget: 0, proteinTarget: 0 });

  useEffect(() => {
    if (!user) return;

    // Load goals from local storage for now
    const g = localStorage.getItem(`burnmate-goals-${user.id}`);
    if (g) {
      try {
        const parsed = JSON.parse(g);
        setGoals({ dailyCalorieTarget: parsed.dailyCalorieTarget || 0, proteinTarget: parsed.proteinTarget || 0 });
      } catch {}
    }

    // Load intake entries from backend
    const load = async () => {
      try {
        const data = await intakeApi.list(user.id);
        setEntries(data.map(d => ({ id: d._id!, name: d.name, calories: d.calories, protein: d.protein, timestamp: d.timestamp || new Date().toISOString() })));
      } catch (e) {
        console.error('Failed to load intake:', e);
      }
    };
    load();
  }, [user?.id]);

  // No longer writing to localStorage; persisted in backend now.

  const addEntry = async () => {
    if (!foodName || !foodCalories || !user) return;
    try {
      const created = await intakeApi.add({ name: foodName.trim(), calories: Number(foodCalories), protein: foodProtein ? Number(foodProtein) : 0, timestamp: new Date().toISOString() });
      const entry: FoodEntry = { id: created._id!, name: created.name, calories: created.calories, protein: created.protein, timestamp: created.timestamp || new Date().toISOString() };
      setEntries(prev => [entry, ...prev]);
      setFoodName('');
      setFoodCalories('');
      setFoodProtein('');
    } catch (e) {
      console.error('Failed to add intake:', e);
      alert('Failed to add intake');
    }
  };

  const removeEntry = async (id: string) => {
    try {
      await intakeApi.remove(id);
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      console.error('Failed to remove intake', e);
    }
  };

  const today = new Date().toDateString();
  const todayEntries = entries.filter(e => new Date(e.timestamp).toDateString() === today);
  const totalCalories = todayEntries.reduce((s, e) => s + e.calories, 0);
  const totalProtein = todayEntries.reduce((s, e) => s + (e.protein || 0), 0);

  const calorieProgress = goals.dailyCalorieTarget ? Math.min((totalCalories / goals.dailyCalorieTarget) * 100, 150) : 0;
  const proteinProgress = goals.proteinTarget ? Math.min((totalProtein / goals.proteinTarget) * 100, 150) : 0;

  // Placeholder scanning handlers
  const scanBarcode = () => {
    alert('Barcode scanning is not available in this environment. Integrate a native/mobile scanner or third-party API (e.g., OpenFoodFacts) to resolve barcodes to foods.');
  };

  const scanFood = () => {
    alert('Food image recognition is not available in this environment. Integrate a vision API to detect foods from photos.');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-bold">Calorie Intake</h1>
          <p className="text-muted-foreground">Track what you eat and stay within your daily target</p>
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle>Daily Calories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-bold">{totalCalories} kcal</div>
                  <div className="text-sm text-muted-foreground">consumed today</div>
                </div>
                <Badge variant="secondary">Target: {goals.dailyCalorieTarget || 0} kcal</Badge>
              </div>
              <Progress value={calorieProgress} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle>Protein</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-bold">{totalProtein} g</div>
                  <div className="text-sm text-muted-foreground">consumed today</div>
                </div>
                <Badge variant="secondary">Target: {goals.proteinTarget || 0} g</Badge>
              </div>
              <Progress value={proteinProgress} />
            </CardContent>
          </Card>
        </div>

        {/* Entry */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Soup className="h-5 w-5" />
              <span>Add Food</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Food name" value={foodName} onChange={e => setFoodName(e.target.value)} />
              <Input type="number" placeholder="Calories (kcal)" value={foodCalories} onChange={e => setFoodCalories(e.target.value)} />
              <Input type="number" placeholder="Protein (g) - optional" value={foodProtein} onChange={e => setFoodProtein(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={addEntry} className="bg-gradient-burn text-white border-0"><Plus className="h-4 w-4 mr-2" />Add</Button>
              <Button variant="outline" onClick={scanBarcode}><Barcode className="h-4 w-4 mr-2" />Scan barcode</Button>
              <Button variant="outline" onClick={scanFood}><Camera className="h-4 w-4 mr-2" />Scan food</Button>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Today&apos;s Food</CardTitle>
          </CardHeader>
          <CardContent>
            {todayEntries.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <Flame className="h-8 w-8 mx-auto mb-2" />
                Nothing added yet
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {todayEntries.map((e) => (
                    <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{e.name}</div>
                        <div className="text-xs text-muted-foreground">{new Date(e.timestamp).toLocaleTimeString()}</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-bold">{e.calories} kcal</div>
                          {e.protein !== undefined && (<div className="text-xs text-muted-foreground">{e.protein} g protein</div>)}
                        </div>
                        <Button variant="ghost" onClick={() => removeEntry(e.id)}><Trash2 className="h-4 w-4" /></Button>
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
  );
};

export default CalorieIntake;

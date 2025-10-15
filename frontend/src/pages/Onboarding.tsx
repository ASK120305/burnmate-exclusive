import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [heightCm, setHeightCm] = useState<number | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<string>('');
  const [targetWeightKg, setTargetWeightKg] = useState<number | ''>('');
  const [weeklyBurnGoal, setWeeklyBurnGoal] = useState<number | ''>('');

  const [dailyCalorieTarget, setDailyCalorieTarget] = useState<number>(0);
  const [proteinTarget, setProteinTarget] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    // Load existing
    const saved = localStorage.getItem(`burnmate-goals-${user.id}`);
    if (saved) {
      try {
        const g = JSON.parse(saved);
        setWeightKg(g.weightKg ?? '');
        setHeightCm(g.heightCm ?? '');
        setAge(g.age ?? '');
        setGender(g.gender ?? '');
        setTargetWeightKg(g.targetWeightKg ?? '');
        setWeeklyBurnGoal(g.weeklyBurnGoal ?? '');
        setDailyCalorieTarget(g.dailyCalorieTarget ?? 0);
        setProteinTarget(g.proteinTarget ?? 0);
      } catch {}
    }
  }, [user?.id]);

  const computeTargets = () => {
    const w = Number(weightKg);
    const h = Number(heightCm);
    const a = Number(age || 30);
    const gend = gender || 'other';
    const weeklyDeficit = Number(weeklyBurnGoal || 0); // kcal/week

    // Mifflin-St Jeor BMR
    let s = 0; // sex adjustment
    if (gend === 'male') s = 5; else if (gend === 'female') s = -161; else s = -78; // neutral
    const bmr = 10 * w + 6.25 * h - 5 * a + s;
    // Assume moderate activity factor 1.55
    const tdee = bmr * 1.55;

    const dailyDeficit = weeklyDeficit / 7;
    const recommended = Math.max(1200, Math.round(tdee - dailyDeficit));

    const protein = Math.round(w * 2); // grams per day

    setDailyCalorieTarget(recommended);
    setProteinTarget(protein);
  };

  useEffect(() => {
    if (weightKg && heightCm) computeTargets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightKg, heightCm, age, gender, weeklyBurnGoal]);

  const save = () => {
    if (!user) return;
    const payload = {
      weightKg: Number(weightKg || 0),
      heightCm: Number(heightCm || 0),
      age: Number(age || 0),
      gender: gender || 'other',
      targetWeightKg: Number(targetWeightKg || 0),
      weeklyBurnGoal: Number(weeklyBurnGoal || 0),
      dailyCalorieTarget,
      proteinTarget,
    };
    localStorage.setItem(`burnmate-goals-${user.id}`, JSON.stringify(payload));
    navigate('/dashboard');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Flame className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">Set Up Your Goals</h1>
          </div>
          <p className="text-muted-foreground mt-2">We’ll personalize calorie and protein targets to help you reach your goals.</p>
        </motion.div>

        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Body & Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Weight (kg)</label>
                <Input type="number" min={20} max={400} value={weightKg} onChange={e => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))} placeholder="70" />
              </div>
              <div>
                <label className="text-sm font-medium">Height (cm)</label>
                <Input type="number" min={100} max={250} value={heightCm} onChange={e => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))} placeholder="175" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Age</label>
                <Input type="number" min={10} max={100} value={age} onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))} placeholder="25" />
              </div>
              <div>
                <label className="text-sm font-medium">Gender</label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Target Weight (kg)</label>
                <Input type="number" min={20} max={400} value={targetWeightKg} onChange={e => setTargetWeightKg(e.target.value === '' ? '' : Number(e.target.value))} placeholder="65" />
              </div>
              <div>
                <label className="text-sm font-medium">Weekly Burn Goal (kcal)</label>
                <Input type="number" min={0} max={20000} value={weeklyBurnGoal} onChange={e => setWeeklyBurnGoal(e.target.value === '' ? '' : Number(e.target.value))} placeholder="3500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50">
                <div className="text-sm text-blue-600">Recommended Daily Calories</div>
                <div className="text-2xl font-bold">{dailyCalorieTarget || 0} kcal</div>
              </div>
              <div className="p-4 rounded-lg bg-purple-50">
                <div className="text-sm text-purple-600">Protein Target</div>
                <div className="text-2xl font-bold">{proteinTarget || 0} g/day</div>
              </div>
            </div>

            <Button onClick={save} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Zap className="h-4 w-4 mr-2" /> Save & Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;

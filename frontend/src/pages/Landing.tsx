import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Activity, Trophy, Users, TrendingUp, Zap, Sparkles, CheckCircle2, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const features = [
    {
      icon: Activity,
      title: 'Track Any Activity',
      description: 'From walks to workouts — select your activity and we estimate calories in real-time.',
    },
    {
      icon: Trophy,
      title: 'Auto-Sync Leaderboard',
      description: "Every activity you log is automatically added to the leaderboard. No manual entry.",
    },
    {
      icon: TrendingUp,
      title: 'Build Streaks',
      description: 'Stay consistent and watch your streak grow day-by-day.',
    },
    {
      icon: Users,
      title: 'Compete & Motivate',
      description: 'Challenge friends and celebrate progress together.',
    },
  ];

  const howItWorks = [
    { icon: Sparkles, title: 'Choose', text: 'Pick an activity you enjoy.' },
    { icon: Timer, title: 'Track', text: 'Enter duration and add it.' },
    { icon: Trophy, title: 'Shine', text: 'See calories and rank instantly.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-rose-500/20 to-amber-500/20 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-3 mb-6"
            >
              <div className="p-4 bg-gradient-burn rounded-2xl shadow-burn">
                <Flame className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-6xl font-bold">
                <span className="bg-gradient-burn bg-clip-text text-transparent">
                  BurnMate
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="max-w-3xl mx-auto mb-10"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Fitness that feels like a game.
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Track your daily movements, get instant calorie estimates, and watch your rank climb.
                From climbing stairs to dancing — every move powers your progress.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
            >
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-burn hover:shadow-hover text-white border-0 px-8 py-6 text-lg">
                  <Zap className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
              <Link to="/activities">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg hover:bg-accent">
                  Explore Activities
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button size="lg" variant="ghost" className="px-8 py-6 text-lg">
                  View Leaderboard
                </Button>
              </Link>
            </motion.div>

            {/* Stats Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-burn bg-clip-text text-transparent">12+</div>
                <div className="text-sm text-muted-foreground">Activities Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-muted-foreground">Calories Burned Daily</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-burn bg-clip-text text-transparent">7</div>
                <div className="text-sm text-muted-foreground">Day Fire Streaks</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold mb-3">Your all-in-one fitness buddy</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple to start, satisfying to sustain. Track, compete, and keep moving.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-background shadow-card border-0 hover:shadow-hover transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-3 bg-gradient-burn rounded-lg w-fit">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold">{feature.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-10"
          >
            How it works
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="bg-gradient-card shadow-card border-0">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-burn flex items-center justify-center shadow-burn">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h4 className="font-semibold mb-1">{i + 1}. {step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex items-center justify-center space-x-3 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Activities instantly contribute to your leaderboard rank.</span>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-6">
              Ready to start your
              {' '}<span className="bg-gradient-burn bg-clip-text text-transparent">burn journey</span>?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create momentum today. Join in seconds and make fitness fun and social.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-burn hover:shadow-hover text-white border-0 px-8 py-6 text-lg">
                  <Flame className="mr-2 h-5 w-5" />
                  Get Started Now
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg hover:bg-accent">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          Built with ❤️ for movers. BurnMate.
        </div>
      </footer>
    </div>
  );
};

export default Landing;

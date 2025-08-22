import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Activity, Trophy, Users, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const features = [
    {
      icon: Activity,
      title: 'Track Any Activity',
      description: 'From climbing stairs to dancing - every movement counts!',
    },
    {
      icon: Trophy,
      title: 'Compete with Friends',
      description: 'Join the leaderboard and see who burns the most calories.',
    },
    {
      icon: TrendingUp,
      title: 'Build Streaks',
      description: 'Maintain your fire streak and achieve new milestones.',
    },
    {
      icon: Users,
      title: 'Social & Fun',
      description: 'Share achievements and motivate each other.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-3 mb-8"
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
              transition={{ delay: 0.2 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Turn Every Activity Into a{' '}
                <span className="bg-gradient-burn bg-clip-text text-transparent">
                  Calorie-Burning Game
                </span>{' '}
                🔥
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Track calories burned through everyday activities, compete with friends, 
                and discover fun ways to stay active. From climbing stairs to dancing - 
                every movement counts!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-burn hover:shadow-hover text-white border-0 px-8 py-6 text-lg">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Burning Calories
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg hover:bg-accent">
                  View Dashboard
                </Button>
              </Link>
            </motion.div>

            {/* Stats Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-burn bg-clip-text text-transparent">12+</div>
                <div className="text-sm text-muted-foreground">Activities Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-achievement bg-clip-text text-transparent">500+</div>
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
      <section className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold mb-4">Why Choose BurnMate?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just a fitness tracker - it's your fun companion for an active lifestyle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <Card className="bg-background shadow-card border-0 hover:shadow-hover transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="p-3 bg-gradient-burn rounded-lg w-fit mx-auto mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <h3 className="text-3xl font-bold mb-6">
              Ready to Start Your{' '}
              <span className="bg-gradient-burn bg-clip-text text-transparent">
                Burn Journey?
              </span>
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have made fitness fun and social with BurnMate.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-burn hover:shadow-hover text-white border-0 px-8 py-6 text-lg">
                <Flame className="mr-2 h-5 w-5" />
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
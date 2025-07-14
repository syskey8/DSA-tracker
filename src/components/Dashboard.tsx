import { motion } from 'framer-motion';
import { Flame, Target, Calendar, TrendingUp, Users, Award } from 'lucide-react';

import { DashboardHeader } from '@/components/DashboardHeader';
import { Heatmap } from '@/components/Heatmap';
import { StatsCard } from '@/components/StatsCard';
import { DailyLogForm } from '@/components/DailyLogForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useDailyLogs } from '@/hooks/useDailyLogs';
import { useStreaks } from '@/hooks/useStreaks';
import type { Username } from '@/lib/supabase';

interface DashboardProps {
  username: Username;
  onLogout: () => void;
}

export function Dashboard({ username, onLogout }: DashboardProps) {
  const { logs, isLoading, getTodaysLog } = useDailyLogs();
  
  const tanmayStats = useStreaks(logs, 'Tanmay');
  const tanishkaStats = useStreaks(logs, 'Tanishka'); 
  const userStats = useStreaks(logs, username);
  
  const todaysLog = getTodaysLog(username);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Loading your progress...</div>
      </div>
    );
  }

  const comparisonStats = [
    {
      title: 'Current Streak',
      tanmay: tanmayStats.currentStreak,
      tanishka: tanishkaStats.currentStreak,
      icon: Flame,
      color: 'emerald' as const,
    },
    {
      title: 'Total Days',
      tanmay: tanmayStats.totalDays,
      tanishka: tanishkaStats.totalDays,
      icon: Calendar,
      color: 'blue' as const,
    },
    {
      title: 'This Week',
      tanmay: tanmayStats.thisWeekCount,
      tanishka: tanishkaStats.thisWeekCount,
      icon: Target,
      color: 'purple' as const,
    },
    {
      title: 'Best Streak',
      tanmay: tanmayStats.longestStreak,
      tanishka: tanishkaStats.longestStreak,
      icon: Award,
      color: 'orange' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader username={username} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Today's Status */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysLog ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-foreground mb-3 leading-relaxed">{todaysLog.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {todaysLog.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg border border-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {todaysLog.effort_level && (
                          <div className="text-muted-foreground text-sm mt-3">
                            Effort Level: {todaysLog.effort_level}/5
                          </div>
                        )}
                      </div>
                      <DailyLogForm
                        username={username}
                        existingLog={todaysLog}
                        trigger={
                          <Button variant="outline" size="sm" className="rounded-xl">
                            Edit
                          </Button>
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-6 text-lg">
                      You haven't logged your DSA practice for today yet.
                    </div>
                    <DailyLogForm
                      username={username}
                      trigger={
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8">
                          Log Today's Session
                        </Button>
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Stats */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Current Streak"
                value={userStats.currentStreak}
                subtitle="days"
                icon={Flame}
                color="emerald"
              />
              <StatsCard
                title="Total Practice Days"
                value={userStats.totalDays}
                subtitle="all time"
                icon={Calendar}
                color="blue"
              />
              <StatsCard
                title="This Week"
                value={userStats.thisWeekCount}
                subtitle="out of 7 days"
                icon={Target}
                color="purple"
              />
              <StatsCard
                title="Best Streak"
                value={userStats.longestStreak}
                subtitle="personal record"
                icon={Award}
                color="orange"
              />
            </div>
          </motion.div>

          {/* Dual Heatmaps */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Activity Heatmaps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <Heatmap logs={logs} username="Tanmay" />
                <Separator className="bg-border" />
                <Heatmap logs={logs} username="Tanishka" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Comparison Stats */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Friendly Competition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {comparisonStats.map((stat) => (
                    <div key={stat.title} className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <stat.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{stat.title}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Tanmay</span>
                          </div>
                          <span className="text-foreground font-semibold">{stat.tanmay}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Tanishka</span>
                          </div>
                          <span className="text-foreground font-semibold">{stat.tanishka}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
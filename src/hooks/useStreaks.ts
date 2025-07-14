import { useMemo } from 'react';
import { format, parseISO, differenceInDays, subDays } from 'date-fns';
import type { DailyLog, Username } from '@/lib/supabase';

export function useStreaks(logs: DailyLog[], username: Username) {
  const userLogs = useMemo(() => 
    logs
      .filter(log => log.username === username)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [logs, username]
  );

  const currentStreak = useMemo(() => {
    if (userLogs.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    let currentDate = today;

    // Check if there's a log for today
    const todayLog = userLogs.find(log => 
      format(parseISO(log.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    );

    // If no log today, check yesterday
    if (!todayLog) {
      currentDate = subDays(today, 1);
    }

    // Count consecutive days
    for (const log of userLogs) {
      const logDate = parseISO(log.date);
      const expectedDate = format(currentDate, 'yyyy-MM-dd');
      const actualDate = format(logDate, 'yyyy-MM-dd');

      if (actualDate === expectedDate) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }

    return streak;
  }, [userLogs]);

  const longestStreak = useMemo(() => {
    if (userLogs.length === 0) return 0;

    let maxStreak = 0;
    let currentStreak = 1;

    for (let i = 0; i < userLogs.length - 1; i++) {
      const currentDate = parseISO(userLogs[i].date);
      const nextDate = parseISO(userLogs[i + 1].date);
      const daysDiff = differenceInDays(currentDate, nextDate);

      if (daysDiff === 1) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }

    return Math.max(maxStreak, currentStreak);
  }, [userLogs]);

  const totalDays = userLogs.length;

  const thisWeekCount = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    
    return userLogs.filter(log => {
      const logDate = parseISO(log.date);
      return logDate >= weekStart;
    }).length;
  }, [userLogs]);

  return {
    currentStreak,
    longestStreak,
    totalDays,
    thisWeekCount,
  };
}
import { useState, useEffect } from 'react';
import { supabase, type DailyLog, type Username } from '@/lib/supabase';
import { format } from 'date-fns';

export function useDailyLogs(username?: Username) {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [username]);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('daily_logs')
        .select('*')
        .order('date', { ascending: false });

      if (username) {
        query = query.eq('username', username);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createLog = async (logData: Omit<DailyLog, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('daily_logs')
        .insert([logData])
        .select()
        .single();

      if (error) throw error;
      
      setLogs(prev => [data, ...prev.filter(log => 
        !(log.username === data.username && log.date === data.date)
      )]);
      
      return data;
    } catch (error) {
      console.error('Error creating log:', error);
      throw error;
    }
  };

  const updateLog = async (id: string, updates: Partial<DailyLog>) => {
    try {
      const { data, error } = await supabase
        .from('daily_logs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setLogs(prev => prev.map(log => log.id === id ? data : log));
      return data;
    } catch (error) {
      console.error('Error updating log:', error);
      throw error;
    }
  };

  const getLogForDate = (username: Username, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return logs.find(log => log.username === username && log.date === dateStr);
  };

  const getTodaysLog = (username: Username) => {
    return getLogForDate(username, new Date());
  };

  return {
    logs,
    isLoading,
    createLog,
    updateLog,
    getLogForDate,
    getTodaysLog,
    refetch: fetchLogs,
  };
}
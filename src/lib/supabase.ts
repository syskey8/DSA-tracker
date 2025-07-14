import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type DailyLog = {
  id: string;
  username: 'Tanmay' | 'Tanishka';
  date: string;
  description: string;
  tags: string[];
  effort_level: number | null;
  created_at: string;
  updated_at: string;
};

export type WeeklyReflection = {
  id: string;
  username: 'Tanmay' | 'Tanishka';
  week_start: string;
  learnings: string;
  struggles: string;
  created_at: string;
  updated_at: string;
};

export type Username = 'Tanmay' | 'Tanishka';
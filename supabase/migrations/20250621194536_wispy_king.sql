/*
  # DSA Accountability Tracker Schema

  1. New Tables
    - `daily_logs`
      - `id` (uuid, primary key)
      - `username` (text, either 'Tanmay' or 'Tanishka')
      - `date` (date, unique per user per day)
      - `description` (text, required)
      - `tags` (text array, optional DSA topics)
      - `effort_level` (integer 1-5, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `weekly_reflections`  
      - `id` (uuid, primary key)
      - `username` (text, either 'Tanmay' or 'Tanishka')
      - `week_start` (date, start of the week)
      - `learnings` (text, what they learned)
      - `struggles` (text, what they struggled with)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (no auth required for this simple app)
    
  3. Constraints
    - Unique constraint on username + date for daily_logs
    - Unique constraint on username + week_start for weekly_reflections
    - Check constraint for effort_level (1-5)
    - Check constraint for username (only 'Tanmay' or 'Tanishka')
*/

-- Create daily_logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL CHECK (username IN ('Tanmay', 'Tanishka')),
  date date NOT NULL,
  description text NOT NULL,
  tags text[] DEFAULT '{}',
  effort_level integer CHECK (effort_level >= 1 AND effort_level <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(username, date)
);

-- Create weekly_reflections table  
CREATE TABLE IF NOT EXISTS weekly_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL CHECK (username IN ('Tanmay', 'Tanishka')),
  week_start date NOT NULL,
  learnings text NOT NULL DEFAULT '',
  struggles text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(username, week_start)
);

-- Enable RLS
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reflections ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we don't need auth for this simple app)
CREATE POLICY "Allow all operations on daily_logs"
  ON daily_logs
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on weekly_reflections"
  ON weekly_reflections  
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_daily_logs_updated_at 
    BEFORE UPDATE ON daily_logs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_reflections_updated_at 
    BEFORE UPDATE ON weekly_reflections 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_logs_username_date ON daily_logs(username, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(date DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_reflections_username_week ON weekly_reflections(username, week_start DESC);
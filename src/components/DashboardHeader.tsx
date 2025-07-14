import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';
import { DailyLogForm } from '@/components/DailyLogForm';
import type { Username } from '@/lib/supabase';
import tanmayImage from '@/assets/tanmay.png';
import tanishkaImage from '@/assets/tanishka.png';

interface DashboardHeaderProps {
  username: Username;
  onLogout: () => void;
}

export function DashboardHeader({ username, onLogout }: DashboardHeaderProps) {
  const displayName = username;
  const profileImage = username === 'Tanmay' ? tanmayImage : tanishkaImage;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <img
              src={profileImage}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shadow-lg"
            />
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Welcome back, {displayName}!
              </h1>
              <p className="text-muted-foreground text-sm">
                Ready for another coding session?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DailyLogForm
              username={username}
              trigger={
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-xl px-6">
                  <Plus className="w-4 h-4" />
                  Log Today
                </Button>
              }
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
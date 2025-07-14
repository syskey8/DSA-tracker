import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { format, addDays, subDays, isToday } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LogViewerModal } from '@/components/LogViewerModal';
import type { DailyLog, Username } from '@/lib/supabase';

interface HeatmapProps {
  logs: DailyLog[];
  username: Username;
  className?: string;
}

export function Heatmap({ logs, username, className = '' }: HeatmapProps) {
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const userLogs = logs.filter(log => log.username === username);
  
  const heatmapData = useMemo(() => {
    const today = new Date();
    const endDate = today;
    const startDate = subDays(endDate, 364); // Show last 365 days
    
    const data: Array<{ date: Date; log: DailyLog | null; level: number }> = [];
    
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const log = userLogs.find(l => l.date === dateStr) ?? null;
      
      let level = 0;
      if (log) {
        // Base level from having any entry
        level = 1;
        // Boost based on effort level
        if (log.effort_level) {
          level = Math.min(4, Math.floor(log.effort_level * 0.8) + 1);
        }
      }
      
      data.push({
        date: new Date(currentDate),
        log,
        level,
      });
      
      currentDate = addDays(currentDate, 1);
    }
    
    return data;
  }, [userLogs]);

  const weeks = useMemo(() => {
    const result: Array<typeof heatmapData> = [];
    
    for (let i = 0; i < heatmapData.length; i += 7) {
      result.push(heatmapData.slice(i, i + 7));
    }
    
    return result;
  }, [heatmapData]);

  const getIntensityClass = (level: number) => {
    switch (level) {
      case 0: return 'bg-secondary border-border';
      case 1: return 'bg-chart-1 border-chart-1';
      case 2: return 'bg-chart-2 border-chart-2';
      case 3: return 'bg-chart-3 border-chart-3';
      case 4: return 'bg-chart-4 border-chart-4';
      default: return 'bg-secondary border-border';
    }
  };

  const handleDayClick = (day: typeof heatmapData[0]) => {
    if (day.log) {
      setSelectedLog(day.log);
      setModalOpen(true);
    }
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <div className={`w-3 h-3 rounded-full ${username === 'Tanmay' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
        <h3 className="text-lg font-semibold text-foreground">{username}</h3>
      </div>
      
      <div className="bg-card/30 rounded-2xl p-6 border border-border backdrop-blur-sm">
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-fit">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-3">
              <div className="h-3"></div> {/* Space for month labels */}
              {dayLabels.map((day, i) => (
                <div key={day} className={`h-3 flex items-center text-xs text-muted-foreground ${i % 2 === 0 ? '' : 'opacity-0'}`}>
                  {day}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div>
              {/* Month labels */}
              <div className="flex gap-1 mb-2 h-3">
                {weeks.map((week, weekIndex) => {
                  const firstDay = week[0]?.date;
                  if (!firstDay) return <div key={weekIndex} className="w-3"></div>;
                  
                  const isFirstWeekOfMonth = firstDay.getDate() <= 7;
                  const monthName = monthLabels[firstDay.getMonth()];
                  
                  return (
                    <div key={weekIndex} className="w-3 text-xs text-muted-foreground">
                      {isFirstWeekOfMonth ? monthName : ''}
                    </div>
                  );
                })}
              </div>
              
              {/* Grid */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <TooltipProvider key={dayIndex}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ 
                                delay: (weekIndex * 7 + dayIndex) * 0.001,
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                              }}
                              onClick={() => handleDayClick(day)}
                              className={`
                                w-3 h-3 rounded-sm border transition-all duration-200
                                ${getIntensityClass(day.level)}
                                ${isToday(day.date) ? 'ring-2 ring-primary ring-opacity-60' : ''}
                                ${day.log ? 'cursor-pointer hover:scale-125 hover:border-foreground/50 hover:z-10 relative' : 'cursor-default hover:scale-110 hover:border-foreground/30'}
                              `}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-semibold">
                                {format(day.date, 'MMM d, yyyy')}
                              </div>
                              {day.log ? (
                                <div className="mt-1">
                                  <div className="text-xs opacity-80">
                                    {day.log.description.slice(0, 60)}
                                    {day.log.description.length > 60 ? '...' : ''}
                                  </div>
                                  {day.log.effort_level && (
                                    <div className="text-xs opacity-60 mt-1">
                                      Effort: {day.log.effort_level}/5
                                    </div>
                                  )}
                                  {day.log.tags.length > 0 && (
                                    <div className="text-xs opacity-60 mt-1">
                                      Tags: {day.log.tags.join(', ')}
                                    </div>
                                  )}
                                  <div className="text-xs opacity-60 mt-1 font-medium">
                                    Click to view details
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs opacity-60 mt-1">
                                  No activity
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm border ${getIntensityClass(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <LogViewerModal
        log={selectedLog}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
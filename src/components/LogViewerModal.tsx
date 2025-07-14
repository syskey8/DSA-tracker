import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Calendar, Tag, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { DailyLog } from '@/lib/supabase';
import tanmayImage from '@/assets/tanmay.png';
import tanishkaImage from '@/assets/tanishka.png';

interface LogViewerModalProps {
  log: DailyLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogViewerModal({ log, open, onOpenChange }: LogViewerModalProps) {
  if (!log) return null;

  const profileImage = log.username === 'Tanmay' ? tanmayImage : tanishkaImage;
  const userColor = log.username === 'Tanmay' ? 'emerald' : 'blue';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={profileImage} alt={log.username} />
              <AvatarFallback>{log.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{log.username}'s Practice Session</span>
              <span className="text-sm text-muted-foreground font-normal">
                {format(parseISO(log.date), 'EEEE, MMMM d, yyyy')}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">What they worked on</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 border border-border">
              <p className="text-foreground leading-relaxed">{log.description}</p>
            </div>
          </div>

          {/* Tags */}
          {log.tags && log.tags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="w-4 h-4" />
                <span className="text-sm font-medium">Topics covered</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {log.tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge 
                      variant="secondary" 
                      className={`
                        ${userColor === 'emerald' 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                          : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        } 
                        rounded-lg px-3 py-1
                      `}
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Effort Level */}
          {log.effort_level && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Effort level</span>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= log.effort_level!
                            ? `fill-${userColor}-500 text-${userColor}-500`
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-foreground font-medium">
                    {log.effort_level}/5
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {log.effort_level <= 2 ? 'Light session' : 
                     log.effort_level <= 3 ? 'Moderate session' : 
                     log.effort_level <= 4 ? 'Intense session' : 'Maximum effort'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Created: {format(parseISO(log.created_at), 'MMM d, yyyy \'at\' h:mm a')}
              </span>
              {log.updated_at !== log.created_at && (
                <span>
                  Updated: {format(parseISO(log.updated_at), 'MMM d, yyyy \'at\' h:mm a')}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
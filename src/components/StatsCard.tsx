import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'emerald' | 'blue' | 'purple' | 'orange';
  className?: string;
}

const colorVariants = {
  emerald: 'from-emerald-500 to-emerald-600',
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
};

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'emerald',
  className = '' 
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      <Card className="bg-card/50 border-border hover:bg-card/80 transition-all duration-300 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">{title}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {subtitle && (
                <p className="text-muted-foreground text-xs">{subtitle}</p>
              )}
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${colorVariants[color]} rounded-2xl flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
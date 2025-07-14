import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Code2 } from 'lucide-react';
import type { Username } from '@/lib/supabase';
import tanmayImage from '@/assets/tanmay.png';
import tanishkaImage from '@/assets/tanishka.png';

interface UserSelectorProps {
  onSelectUser: (username: Username) => void;
}

const users: { username: Username; displayName: string; imageSrc: string }[] = [
  { username: 'Tanmay', displayName: 'Tanmay', imageSrc: tanmayImage },
  { username: 'Tanishka', displayName: 'Tanishka', imageSrc: tanishkaImage },
];

export function UserSelector({ onSelectUser }: UserSelectorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary/20 to-primary/30 rounded-3xl mb-8 backdrop-blur-sm border border-primary/20"
          >
            <Code2 className="w-10 h-10 text-primary" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-foreground mb-4 tracking-tight"
          >
            DSA Tracker
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-xl"
          >
            Who's coding today?
          </motion.p>
        </div>

        <div className="flex justify-center gap-16">
          {users.map((user, index) => (
            <motion.div
              key={user.username}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <Button
                onClick={() => onSelectUser(user.username)}
                variant="ghost"
                className="flex flex-col items-center gap-6 p-8 h-auto hover:bg-transparent group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative"
                >
                  <img
                    src={user.imageSrc}
                    alt={user.displayName}
                    className="w-48 h-48 rounded-full object-cover border-4 border-transparent group-hover:border-primary/50 transition-all duration-300 shadow-2xl"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </motion.div>
                
                <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {user.displayName}
                </h3>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground text-lg">
            Let's build those problem-solving skills! 💪
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
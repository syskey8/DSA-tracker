import { useState, useEffect } from 'react';
import type { Username } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<Username | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('dsa-tracker-user') as Username | null;
    setUser(savedUser);
    setIsLoading(false);
  }, []);

  const login = (username: Username) => {
    localStorage.setItem('dsa-tracker-user', username);
    setUser(username);
  };

  const logout = () => {
    localStorage.removeItem('dsa-tracker-user');
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
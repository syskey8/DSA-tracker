import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { UserSelector } from '@/components/UserSelector';
import { Dashboard } from '@/components/Dashboard';
import { useAuth } from '@/hooks/useAuth';

function App() {
  const { user, isLoading, login, logout } = useAuth();

  useEffect(() => {
    // Set page title
    document.title = 'DSA Accountability Tracker';
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="dsa-tracker-theme">
      <div className="min-h-screen bg-background">
        {user ? (
          <Dashboard username={user} onLogout={logout} />
        ) : (
          <UserSelector onSelectUser={login} />
        )}
        <Toaster 
          theme="dark" 
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--card-foreground))',
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;

import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LogOutIcon, LogInIcon, CloudOff, CloudSync } from 'lucide-react';

export const AuthStatus = () => {
  const { user, isAuthenticated, signOut, isLocalOnly, setLocalOnly } = useAuth();
  const navigate = useNavigate();

  const toggleStorageMode = () => {
    if (isLocalOnly) {
      // Switch to cloud mode, which requires login
      setLocalOnly(false);
      navigate('/auth');
    } else {
      // Switch to local mode and sign out if necessary
      setLocalOnly(true);
      if (isAuthenticated) {
        signOut();
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Mode toggle button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleStorageMode}
        title={isLocalOnly ? "Switch to cloud sync" : "Switch to local only mode"}
        className="text-xs flex items-center"
      >
        {isLocalOnly ? (
          <>
            <CloudOff className="h-4 w-4 mr-1 text-slate-500 dark:text-slate-400" />
            <span className="hidden md:inline-block text-slate-500 dark:text-slate-400">Local</span>
          </>
        ) : (
          <>
            <CloudSync className="h-4 w-4 mr-1 text-blue-500" />
            <span className="hidden md:inline-block text-blue-500">Sync</span>
          </>
        )}
      </Button>

      {/* Auth status */}
      {isAuthenticated && !isLocalOnly ? (
        <div className="flex items-center gap-2">
          <span className="text-sm hidden md:inline-block text-slate-600 dark:text-slate-300">
            {user?.email}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            title="Sign out"
          >
            <LogOutIcon className="h-4 w-4 mr-1" />
            <span className="hidden md:inline-block">Sign out</span>
          </Button>
        </div>
      ) : !isLocalOnly ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/auth')}
          title="Sign in"
        >
          <LogInIcon className="h-4 w-4 mr-1" />
          <span className="hidden md:inline-block">Sign in</span>
        </Button>
      ) : null}
    </div>
  );
};

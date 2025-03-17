
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LogOutIcon, LogInIcon } from 'lucide-react';

export const AuthStatus = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm hidden md:inline-block">
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
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate('/auth')}
      title="Sign in"
    >
      <LogInIcon className="h-4 w-4 mr-1" />
      <span className="hidden md:inline-block">Sign in</span>
    </Button>
  );
};


import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NotesSearchProps {
  onSearch: (term: string) => void;
  className?: string;
}

export const NotesSearch: React.FC<NotesSearchProps> = ({
  onSearch,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Update search when searchTerm changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);
  
  // Clear search term
  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };
  
  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
        isFocused && "text-primary"
      )}>
        <Search className="h-4 w-4" />
      </div>
      
      <Input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="pl-9 pr-9"
      />
      
      {searchTerm && (
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

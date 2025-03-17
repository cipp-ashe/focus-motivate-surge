
import React from 'react';
import { formatDate } from '@/lib/utils/dateUtils';

interface NoteMetaProps {
  createdAt: string;
  updatedAt?: string;
  compact?: boolean;
}

export const NoteMeta = ({ createdAt, updatedAt, compact = false }: NoteMetaProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <time>{formatDate(createdAt)}</time>
        {updatedAt && (
          <>
            <span>•</span>
            <time>Updated {formatDate(updatedAt)}</time>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <time>{formatDate(createdAt)}</time>
      {updatedAt && (
        <>
          <span>•</span>
          <time>Updated {formatDate(updatedAt)}</time>
        </>
      )}
    </div>
  );
};

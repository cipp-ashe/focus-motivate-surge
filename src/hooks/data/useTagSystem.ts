
import { useState, useEffect, useCallback } from 'react';

interface TagData {
  id: string;
  name: string;
  color: string;
}

export const useTagSystem = (storageKey: string = 'app-tags') => {
  const [tags, setTags] = useState<TagData[]>(() => {
    const savedTags = localStorage.getItem(storageKey);
    return savedTags ? JSON.parse(savedTags) : [];
  });

  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tags));
  }, [tags, storageKey]);

  const addTag = useCallback((newTag: Omit<TagData, 'id'>) => {
    setTags(prevTags => [
      ...prevTags,
      { ...newTag, id: `tag-${Date.now()}` }
    ]);
  }, []);

  const removeTag = useCallback((tagId: string) => {
    setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
  }, []);

  const updateTag = useCallback((tagId: string, updates: Partial<Omit<TagData, 'id'>>) => {
    setTags(prevTags => 
      prevTags.map(tag => 
        tag.id === tagId ? { ...tag, ...updates } : tag
      )
    );
  }, []);

  return { tags, addTag, removeTag, updateTag };
};

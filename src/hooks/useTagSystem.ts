
import { useState, useCallback, useEffect } from 'react';
import { Tag, TagRelation, EntityType } from '@/types/core';
import { toast } from 'sonner';

const TAG_STORAGE_KEY = 'unified-tags';
const TAG_RELATIONS_KEY = 'tag-relations';

export const useTagSystem = () => {
  const [tags, setTags] = useState<Tag[]>(() => {
    const saved = localStorage.getItem(TAG_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [relations, setRelations] = useState<TagRelation[]>(() => {
    const saved = localStorage.getItem(TAG_RELATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem(TAG_RELATIONS_KEY, JSON.stringify(relations));
  }, [relations]);

  const createTag = useCallback((name: string, color: Tag['color'] = 'default') => {
    const existingTag = tags.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (existingTag) {
      return existingTag;
    }

    const newTag: Tag = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      createdAt: new Date().toISOString(),
    };

    setTags(prev => [...prev, newTag]);
    return newTag;
  }, [tags]);

  const updateTag = useCallback((tagId: string, updates: Partial<Omit<Tag, 'id'>>) => {
    setTags(prev => prev.map(tag => 
      tag.id === tagId
        ? { ...tag, ...updates, updatedAt: new Date().toISOString() }
        : tag
    ));
  }, []);

  const deleteTag = useCallback((tagId: string) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
    setRelations(prev => prev.filter(relation => relation.tagId !== tagId));
  }, []);

  const getEntityTags = useCallback((entityId: string, entityType: EntityType): Tag[] => {
    const entityRelations = relations.filter(r => 
      r.entityId === entityId && r.entityType === entityType
    );
    return tags.filter(tag => 
      entityRelations.some(relation => relation.tagId === tag.id)
    );
  }, [relations, tags]);

  const addTagToEntity = useCallback((
    tagName: string,
    entityId: string,
    entityType: EntityType
  ) => {
    // Find existing tag or create new one
    let tag = tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    if (!tag) {
      tag = createTag(tagName);
    }

    // Check if relation already exists
    const existingRelation = relations.find(r => 
      r.tagId === tag!.id && 
      r.entityId === entityId && 
      r.entityType === entityType
    );

    if (existingRelation) {
      return;
    }

    const newRelation: TagRelation = {
      id: crypto.randomUUID(),
      tagId: tag.id,
      entityId,
      entityType,
      createdAt: new Date().toISOString()
    };

    setRelations(prev => [...prev, newRelation]);

    // Dispatch event for components to update
    window.dispatchEvent(new Event('tagsUpdated'));
  }, [tags, relations, createTag]);

  const removeTagFromEntity = useCallback((
    tagName: string,
    entityId: string,
    entityType: EntityType
  ) => {
    const tag = tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    if (!tag) return;

    setRelations(prev => prev.filter(r => 
      !(r.tagId === tag.id && r.entityId === entityId && r.entityType === entityType)
    ));
    
    window.dispatchEvent(new Event('tagsUpdated'));
  }, [tags]);

  const updateTagColor = useCallback((
    tagName: string,
    color: Tag['color']
  ) => {
    setTags(prev => prev.map(tag => 
      tag.name.toLowerCase() === tagName.toLowerCase()
        ? { ...tag, color, updatedAt: new Date().toISOString() }
        : tag
    ));
    window.dispatchEvent(new Event('tagsUpdated'));
  }, []);

  return {
    tags,
    createTag,
    updateTag,
    deleteTag,
    getEntityTags,
    addTagToEntity,
    removeTagFromEntity,
    updateTagColor
  };
};


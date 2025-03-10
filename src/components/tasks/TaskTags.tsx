
import React, { useState, useEffect, useRef } from "react";
import { NoteTags } from "../notes/components/NoteTags";
import { Tag } from "@/types/core";
import { Task } from "@/types/tasks";
import { useTagSystem } from "@/hooks/useTagSystem";
import { toast } from "sonner";
import { eventBus } from "@/lib/eventBus";

interface TaskTagsProps {
  task: Task;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskTags = ({ task, preventPropagation }: TaskTagsProps) => {
  const { getEntityTags, addTagToEntity, removeTagFromEntity, updateTagColor } = useTagSystem();
  const [tags, setTags] = useState<Tag[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const lastUpdateTimeRef = useRef(0);
  const isInitialMountRef = useRef(true);

  // Update tags more efficiently with debouncing
  useEffect(() => {
    const updateTags = () => {
      if (!task?.id) return;
      
      const now = Date.now();
      // Debounce updates to prevent excessive re-renders
      if (!isInitialMountRef.current && now - lastUpdateTimeRef.current < 800) {
        console.log(`Skipping tags update for task ${task.id}, too frequent`);
        return;
      }
      
      lastUpdateTimeRef.current = now;
      isInitialMountRef.current = false;
      
      console.log(`Updating tags for task ${task.id}`);
      const currentTags = getEntityTags(task.id, 'task');
      // Deduplicate tags by name
      const uniqueTags = currentTags.reduce((acc: Tag[], current) => {
        const exists = acc.find(tag => tag.name === current.name);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
      setTags(uniqueTags);
    };

    // Initial tag loading
    updateTags();
    
    // Set up fewer event listeners to reduce the update frequency
    const domEvents = ['tagsUpdated', 'force-tags-update'];
    const busEvents = ['task:create', 'task:update', 'task:delete', 'habit:template-delete'];
    
    const domHandlers = domEvents.map(eventName => {
      const handler = () => {
        const now = Date.now();
        if (now - lastUpdateTimeRef.current < 800) return;
        
        console.log(`TaskTags: Detected ${eventName} event, updating tags for ${task.id}`);
        setTimeout(updateTags, 50);
      };
      
      window.addEventListener(eventName, handler);
      return { eventName, handler };
    });
    
    const unsubscribers = busEvents.map(eventName => {
      return eventBus.on(eventName, () => {
        const now = Date.now();
        if (now - lastUpdateTimeRef.current < 800) return;
        
        console.log(`TaskTags: Detected ${eventName} event, updating tags for ${task.id}`);
        setTimeout(updateTags, 50);
      });
    });
    
    // Instead of updating every 2 seconds, update only every 5 seconds maximum
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now - lastUpdateTimeRef.current >= 5000) {
        setForceUpdate(prev => prev + 1);
      }
    }, 5000);
    
    // Trigger a tags update whenever forceUpdate changes, but with debouncing
    if (forceUpdate > 0 && !isInitialMountRef.current) {
      const now = Date.now();
      if (now - lastUpdateTimeRef.current >= 2000) {
        updateTags();
      }
    }
    
    return () => {
      // Clean up dom event listeners
      domHandlers.forEach(({ eventName, handler }) => {
        window.removeEventListener(eventName, handler);
      });
      
      // Clean up event bus listeners
      unsubscribers.forEach(unsub => unsub());
      
      // Clear interval
      clearInterval(intervalId);
    };
  }, [task.id, getEntityTags, forceUpdate]);

  // Use effect specifically for task changes
  useEffect(() => {
    if (task?.id) {
      console.log(`Task changed, updating tags for task ${task.id}`);
      const currentTags = getEntityTags(task.id, 'task');
      setTags(currentTags);
      
      // Dispatch event after a small delay to ensure all related data is loaded
      setTimeout(() => {
        window.dispatchEvent(new Event('force-tags-update'));
      }, 100);
    }
  }, [task, getEntityTags]);

  const handleAddTag = (tagName: string) => {
    // Check if tag already exists before adding
    const existingTag = tags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
    if (!existingTag) {
      addTagToEntity(tagName, task.id, 'task');
      
      // Force immediate UI update
      setTimeout(() => {
        window.dispatchEvent(new Event('tagsUpdated'));
      }, 50);
    }
  };

  const handleRemoveTag = (tagName: string) => {
    if (tagName === 'Habit') {
      toast.error("Cannot remove Habit tag");
      return;
    }
    removeTagFromEntity(tagName, task.id, 'task');
    
    // Force immediate UI update
    setTimeout(() => {
      window.dispatchEvent(new Event('tagsUpdated'));
    }, 50);
  };

  const handleTagClick = (tag: Tag) => {
    if (tag.name === 'Habit') return;
    
    const colors: Tag['color'][] = ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
    const currentIndex = colors.indexOf(tag.color);
    const nextColor = colors[(currentIndex + 1) % colors.length];
    
    updateTagColor(tag.name, nextColor);
    
    // Force immediate UI update
    setTimeout(() => {
      window.dispatchEvent(new Event('tagsUpdated'));
    }, 50);
  };

  if (!tags || tags.length === 0) return null;

  return (
    <div 
      className="flex items-center flex-wrap gap-1"
      onClick={preventPropagation}
      onTouchStart={preventPropagation}
    >
      <NoteTags
        tags={tags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onTagClick={handleTagClick}
      />
    </div>
  );
};

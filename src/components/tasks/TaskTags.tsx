import React, { useState, useEffect } from "react";
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

  // Update tags more aggressively
  useEffect(() => {
    const updateTags = () => {
      if (!task?.id) return;
      
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
    
    // Set up more event listeners for tag updates
    const events = [
      'tagsUpdated',
      'force-task-update',
      'force-tags-update',
      'task:create',
      'task:update',
      'task:delete',
      'habit:template-delete'
    ];
    
    // Listen for all events that might affect tags
    const eventHandlers = events.map(eventName => {
      const handler = () => {
        console.log(`TaskTags: Detected ${eventName} event, updating tags for ${task.id}`);
        setTimeout(updateTags, 50);
      };
      
      if (eventName.includes(':')) {
        // EventBus event
        return { 
          eventName, 
          unsubscribe: eventBus.on(eventName, handler),
          isEventBus: true 
        };
      } else {
        // DOM event
        window.addEventListener(eventName, handler);
        return { 
          eventName,
          handler,
          isEventBus: false 
        };
      }
    });
    
    // Set up periodic tag refresh (every 2 seconds)
    const intervalId = setInterval(() => {
      setForceUpdate(prev => prev + 1);
    }, 2000);
    
    // Trigger a tags update whenever forceUpdate changes
    if (forceUpdate > 0) {
      updateTags();
    }
    
    return () => {
      // Clean up all event listeners
      eventHandlers.forEach(eh => {
        if (eh.isEventBus) {
          eh.unsubscribe();
        } else {
          window.removeEventListener(eh.eventName, eh.handler);
        }
      });
      
      clearInterval(intervalId);
    };
  }, [task?.id, getEntityTags, forceUpdate]);

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

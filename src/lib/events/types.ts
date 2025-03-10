
import { EventType, EventHandler } from './EventManager';

export type { EventType, EventHandler };

// Export additional tag event types that might be needed
export type TagEventType = 'tag:select' | 'tag:remove' | 'tags:force-update' | 'tag:create' | 'tag:delete';

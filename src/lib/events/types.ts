
import { EventType } from './EventManager';

export type { EventType };

// Export additional tag event types that might be needed
export type TagEventType = 'tag:select' | 'tag:remove' | 'tags:force-update' | 'tag:create' | 'tag:delete';


import type { StateContext, EntityRelationship } from '@/types/state/index';

type RelationshipAction = 
  | { type: 'ADD_RELATIONSHIP'; payload: EntityRelationship }
  | { type: 'REMOVE_RELATIONSHIP'; payload: { sourceId: string; targetId: string } };

export const relationshipReducer = (
  state: StateContext['relationships'], 
  action: RelationshipAction
): StateContext['relationships'] => {
  switch (action.type) {
    case 'ADD_RELATIONSHIP':
      return [...state, action.payload];

    case 'REMOVE_RELATIONSHIP':
      return state.filter(
        rel =>
          !(rel.sourceId === action.payload.sourceId && rel.targetId === action.payload.targetId)
      );

    default:
      return state;
  }
};


import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect } from 'vitest';
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  const mockItems = Array.from({ length: 10 }, (_, i) => ({ id: i, value: `Item ${i}` }));

  it('should initialize with correct values', () => {
    const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 3 }));
    
    expect(result.current.currentPage).toBe(0);
    expect(result.current.totalPages).toBe(4);
    expect(result.current.paginatedItems).toHaveLength(3);
  });

  it('should handle page changes', () => {
    const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 3 }));
    
    act(() => {
      result.current.setCurrentPage(1);
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.paginatedItems[0]).toEqual({ id: 3, value: 'Item 3' });
  });

  it('should update when items change', () => {
    const { result, rerender } = renderHook(
      ({ items }) => usePagination({ items, itemsPerPage: 3 }), 
      { initialProps: { items: mockItems } }
    );

    const newItems = mockItems.slice(0, 5);
    rerender({ items: newItems });

    expect(result.current.totalPages).toBe(2);
    expect(result.current.paginatedItems).toHaveLength(3);
  });

  it('should handle empty items array', () => {
    const { result } = renderHook(() => usePagination({ items: [], itemsPerPage: 3 }));
    
    expect(result.current.currentPage).toBe(0);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.paginatedItems).toHaveLength(0);
  });

  it('should not allow invalid page numbers', () => {
    const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 3 }));
    
    act(() => {
      result.current.setCurrentPage(-1);
    });
    expect(result.current.currentPage).toBe(0);

    act(() => {
      result.current.setCurrentPage(10);
    });
    expect(result.current.currentPage).toBe(3);
  });
});

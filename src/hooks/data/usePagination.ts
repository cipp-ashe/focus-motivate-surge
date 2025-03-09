
import { useState } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage: number;
}

export function usePagination<T>({ items, itemsPerPage }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems
  };
}

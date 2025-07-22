import { useState, useEffect } from 'react';
import { books } from '../data/books';
import { filterBooks, sortBooks, debounce } from '../utils/bookUtils';

/**
 * Custom hook for managing book search and filtering
 */
export const useBooks = () => {
  const [allBooks] = useState(books);
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = debounce((term) => {
    setSearchTerm(term);
  }, 300);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      let result = filterBooks(allBooks, searchTerm);
      result = sortBooks(result, sortBy);
      setFilteredBooks(result);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [allBooks, searchTerm, sortBy]);

  const handleSearch = (term) => {
    debouncedSearch(term);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('title');
  };

  return {
    books: filteredBooks,
    allBooks,
    searchTerm,
    sortBy,
    isLoading,
    handleSearch,
    handleSortChange,
    resetFilters
  };
};

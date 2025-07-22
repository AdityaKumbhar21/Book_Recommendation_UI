import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { sortOptions } from '../data/books';

const SearchAndFilter = ({ 
  onSearch, 
  onSortChange,
  onReset,
  sortBy,
  className = ''
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value); // Real-time search
  };

  const handleReset = () => {
    setSearchInput('');
    onReset();
  };

  return (
    <div className={`bg-white rounded-xl shadow-soft border border-gray-200 p-6 ${className}`}>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by title or author..."
            value={searchInput}
            onChange={handleSearchChange}
            className="pl-10 pr-4"
          />
          {searchInput && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchInput('');
                onSearch('');
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Filter Toggle */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Hide Sorting' : 'Show Sorting'}
        </Button>
        
        <Button
          variant="ghost"
          onClick={handleReset}
          className="text-gray-500 hover:text-gray-700"
        >
          Reset All
        </Button>
      </div>

      {/* Sort Options */}
      {showFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Books By
            </label>
            <Select
              value={sortBy}
              onValueChange={onSortChange}
              placeholder="Sort by..."
            >
              {sortOptions.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;

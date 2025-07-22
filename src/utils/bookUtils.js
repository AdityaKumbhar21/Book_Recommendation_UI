/**
 * Utility functions for the book recommendation system
 */

/**
 * Filter books based on search term
 */
export const filterBooks = (books, searchTerm) => {
  return books.filter(book => {
    const matchesSearch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
};

/**
 * Sort books based on the selected sort option
 */
export const sortBooks = (books, sortBy) => {
  const sortedBooks = [...books];
  
  switch (sortBy) {
    case "title":
      return sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
    case "author":
      return sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
    case "year":
      return sortedBooks.sort((a, b) => b.year - a.year);
    case "yearOld":
      return sortedBooks.sort((a, b) => a.year - b.year);
    default:
      return sortedBooks;
  }
};

/**
 * Get recommended books based on a given book's author and title similarity
 */
export const getRecommendedBooks = (currentBook, allBooks, limit = 6) => {
  if (!currentBook) return [];
  
  const recommendations = allBooks
    .filter(book => book.id !== currentBook.id)
    .map(book => {
      let score = 0;
      
      // Author match (highest priority)
      if (book.author === currentBook.author) {
        score += 10;
      }
      
      // Similar time period (within 20 years)
      const yearDiff = Math.abs(book.year - currentBook.year);
      if (yearDiff <= 20) {
        score += 3;
      } else if (yearDiff <= 50) {
        score += 1;
      }
      
      // Title word similarity
      const currentWords = currentBook.title.toLowerCase().split(' ');
      const bookWords = book.title.toLowerCase().split(' ');
      const commonWords = currentWords.filter(word => 
        bookWords.includes(word) && word.length > 3
      );
      score += commonWords.length * 2;
      
      return { ...book, score };
    })
    .filter(book => book.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
    
  // If we don't have enough recommendations, add some random books
  if (recommendations.length < limit) {
    const remaining = allBooks
      .filter(book => 
        book.id !== currentBook.id && 
        !recommendations.find(rec => rec.id === book.id)
      )
      .slice(0, limit - recommendations.length);
    
    recommendations.push(...remaining);
  }
    
  return recommendations.slice(0, limit);
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Debounce function for search input
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

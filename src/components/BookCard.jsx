import React from 'react';
import { Heart, Star } from 'lucide-react';
import Button from './ui/Button';
import { useFavorites } from '../contexts/FavoritesContext';
import Card from './ui/Card';

const BookCard = ({ book, onViewDetails, compact = false, hideRatings = false }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(book.id);
  };

  // Get average rating and number of ratings from various possible fields
  const avgRating =
    typeof book.avg_rating === 'number' && !isNaN(book.avg_rating) ? book.avg_rating :
    typeof book.avg === 'number' && !isNaN(book.avg) ? book.avg :
    typeof book.average_rating === 'number' && !isNaN(book.average_rating) ? book.average_rating :
    (typeof book.avg_rating === 'string' && !isNaN(Number(book.avg_rating)) ? Number(book.avg_rating) :
    typeof book.avg === 'string' && !isNaN(Number(book.avg)) ? Number(book.avg) :
    typeof book.average_rating === 'string' && !isNaN(Number(book.average_rating)) ? Number(book.average_rating) :
    null);

  const numRatings =
    typeof book.num_ratings === 'number' && !isNaN(book.num_ratings) ? book.num_ratings :
    typeof book.ratings === 'number' && !isNaN(book.ratings) ? book.ratings :
    typeof book.number_of_ratings === 'number' && !isNaN(book.number_of_ratings) ? book.number_of_ratings :
    (typeof book.num_ratings === 'string' && !isNaN(Number(book.num_ratings)) ? Number(book.num_ratings) :
    typeof book.ratings === 'string' && !isNaN(Number(book.ratings)) ? Number(book.ratings) :
    typeof book.number_of_ratings === 'string' && !isNaN(Number(book.number_of_ratings)) ? Number(book.number_of_ratings) :
    0);

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (compact) {
    return (
      <div 
        className="flex flex-row bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer" 
        onClick={() => onViewDetails && onViewDetails(book)}
      >
        <div className="w-20 h-28 flex-shrink-0">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/api/placeholder/80/112';
            }}
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                {book.title}
              </h3>
              <p className="text-xs text-gray-600 mb-1">{book.author}</p>
              <div className="flex items-center space-x-1 text-yellow-400 mb-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={12}
                    fill={index < Math.round(avgRating) ? "#FACC15" : "none"}
                    stroke="#FACC15"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                {avgRating && !isNaN(avgRating) ? Number(avgRating).toFixed(1) : 'N/A'} / 5.0 · {numRatings ? numRatings.toLocaleString() : '0'} ratings
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteClick}
              className="ml-2"
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  isFavorite(book.id) 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-400 hover:text-red-500'
                }`} 
              />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className="overflow-hidden group"
      hover={true}
      onClick={() => onViewDetails && onViewDetails(book)}
    >
      <div className="relative">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/400';
          }}
        />
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-soft"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isFavorite(book.id) 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              }`} 
            />
          </Button>
        </div>
      </div>
      <Card.Content className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 font-medium mb-1">{book.author}</p>
        </div>
        {!hideRatings && (
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${avgRating && !isNaN(avgRating) && i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
              ))}
            </span>
            <span className="text-gray-700 font-medium text-sm">{avgRating && !isNaN(avgRating) ? Number(avgRating).toFixed(1) : 'N/A'}</span>
            <span className="text-gray-400 text-xs">({numRatings ? numRatings.toLocaleString() : '0'} ratings)</span>
          </div>
        )}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {truncateText(book.description, 120)}
        </p>
      </Card.Content>
    </Card>
  );
};

export default BookCard;

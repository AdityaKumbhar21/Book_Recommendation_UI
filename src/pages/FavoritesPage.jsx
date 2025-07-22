import React, { useEffect, useState, useMemo } from 'react';
import { Heart, BookOpen, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import Button from '../components/ui/Button';
import { useFavorites } from '../contexts/FavoritesContext';

// Utility to generate consistent book ID
const generateBookId = (book) =>
  `${book.title}-${book.author || book.authors || 'unknown'}`
    .replace(/\s+/g, '-')
    .toLowerCase();

const FavoritesPage = () => {
  const { favorites, clearAllFavorites } = useFavorites();
  const [allBooks, setAllBooks] = useState([]);

  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    fetch(`${apiBaseUrl}/home`)
      .then((res) => res.json())
      .then((data) => {
        const booksData = data.popular || data.books || data;
        const mappedBooks = Array.isArray(booksData)
          ? booksData.map((book) => {
              const title = book.title || '';
              const author = book.author || book.authors || 'Unknown';
              return {
                ...book,
                id: generateBookId({ title, author }),
                title,
                author,
                image: book['Image-URL-M'] || book.image_url || book.image || '/api/placeholder/300/400',
                year: book.year || book.publication_year || '',
              };
            })
          : [];
        setAllBooks(mappedBooks);
      })
      .catch((error) => {
        console.error('Failed to fetch books:', error);
        setAllBooks([]);
      });
  }, []);

  const favoriteBooks = useMemo(() => {
    return allBooks.filter((book) => favorites.includes(book.id));
  }, [favorites, allBooks]);

  const uniqueAuthorsCount = useMemo(() => {
    return new Set(favoriteBooks.map((book) => book.author)).size;
  }, [favoriteBooks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white py-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Heart className="w-16 h-16 text-pink-200 animate-pulse" fill="currentColor" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-200 rounded-full animate-bounce"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              My Favorite Books
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Your personal collection of beloved books that have captured your heart
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{favoriteBooks.length}</div>
                <div className="text-sm opacity-75">Favorite Books</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{uniqueAuthorsCount}</div>
                <div className="text-sm opacity-75">Authors</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-white/30 bg-white text-pink-600 hover:text-pink-600 hover:bg-white transition-all"
                >
                  <ArrowLeft className="w-5 h-5 text-inherit" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/recommend">
                <Button variant="secondary" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Get More Recommendations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {favoriteBooks.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {favoriteBooks.length} Book{favoriteBooks.length !== 1 ? 's' : ''} in Your Collection
              </h2>
              {favoriteBooks.length > 3 && (
                <Button
                  variant="outline"
                  onClick={clearAllFavorites}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Clear All Favorites
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favoriteBooks.map((book) => (
                <div key={book.id} className="transform hover:scale-105 transition-transform duration-200">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="relative mb-8">
              <BookOpen className="w-32 h-32 text-gray-300 mx-auto mb-4" />
              <Heart className="w-12 h-12 text-pink-400 absolute top-0 right-1/2 transform translate-x-8 -translate-y-2" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No Favorite Books Yet</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Start building your personal library by adding books to your favorites.
              Click the heart icon on any book to save it here for easy access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Browse Books
                </Button>
              </Link>
              <Link to="/recommend">
                <Button size="lg" variant="outline" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Get Recommendations
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Heart, Award } from 'lucide-react';
import BookCard from '../components/BookCard';
import Button from '../components/ui/Button';
import { books } from '../data/books';
import { useFavorites } from '../contexts/FavoritesContext';

const HomePage = () => {
  const { favorites } = useFavorites();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    
    fetch(`${apiBaseUrl}/home`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch books');
        return res.json();
      })
      .then(data => {
        const booksData = data.popular || data.books || data;

        const mappedBooks = Array.isArray(booksData)
          ? booksData.map(book => {
              const title = book.title?.trim();
              const author = book.author || book.authors || book.writer || 'Unknown';

              return {
                ...book,
                id:
                  book.id ||
                  `${title}-${author}`
                    .replace(/\s+/g, '-')
                    .replace(/[^a-zA-Z0-9\-]/g, '')
                    .toLowerCase(),
                image:
                  book['Image-URL-M'] ||
                  book.image_url ||
                  book.image ||
                  '/api/placeholder/300/400',
                title,
                author,
                year:
                  book.year ||
                  book.publication_year ||
                  book.published ||
                  book.first_publish_year ||
                  '',
              };
            })
          : [];

        setFeaturedBooks(mappedBooks);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching featured books:', err);
        // fallback to static books
        setFeaturedBooks(books.slice(0, 8));
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-accent-400/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <BookOpen className="w-16 h-16 text-accent-400 animate-bounce-gentle" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Discover Your Next
              <span className="block bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
                Great Read
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-90 leading-relaxed">
              Explore our curated collection of timeless classics and modern masterpieces. 
              Find personalized recommendations tailored just for you.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-12 text-primary-100">
              <div className="text-center">
                <div className="text-3xl font-bold">{books.length}+</div>
                <div className="text-sm opacity-75">Books Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{favorites.length}</div>
                <div className="text-sm opacity-75">Your Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm opacity-75">Authors</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/recommend">
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex items-center gap-3 px-8 py-4 text-lg font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300 rounded-full"
                >
                  <Sparkles className="w-6 h-6" />
                  Get Recommendations
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link to="/favorites">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-3 px-8 py-4 text-lg font-semibold border-2 border-white/30 text-primary-600 hover:text-gray-800 hover:bg-white backdrop-blur-sm transition-all duration-300"
                >
                  <Heart className="w-6 h-6" />
                  My Favorites ({favorites.length})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Award className="w-10 h-10 text-primary-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Featured Books
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our handpicked selection of exceptional books across all genres
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 rounded-2xl h-60 mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-3/4"></div>
              </div>
            ))
          ) : featuredBooks.length > 0 ? (
            featuredBooks.map((book) => <BookCard key={book.id} book={book} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No featured books available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

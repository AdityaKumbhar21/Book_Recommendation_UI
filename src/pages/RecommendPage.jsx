import React, { useState, useEffect } from 'react';
import { Search, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import BookCard from '../components/BookCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { books } from '../data/books';

const RecommendPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [lastSearchedTerm, setLastSearchedTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [error, setError] = useState(null);

  const [allBooks, setAllBooks] = useState([]);
  useEffect(() => {
    setAllBooks(books);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setError(null);
    setRecommendations([]);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    fetch(`${apiBaseUrl}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ book_name: searchTerm })
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Book not found. Please try with the full book name.');
          }
          throw new Error('Failed to fetch recommendations');
        }
        return res.json();
      })
      .then(data => {
        if (!data.recommendations || !Array.isArray(data.recommendations)) {
          setError('No recommendations found.');
          setRecommendations([]);
        } else {
          const recs = data.recommendations.map((rec, idx) => ({
            ...rec,
            id: rec.id || `${rec.title}-${rec.author}-${idx}`.replace(/\s+/g, '-').toLowerCase(),
            image: rec.image_url || rec.image || '/api/placeholder/300/400',
            avg_rating: rec.avg_rating || rec.avg || rec.average_rating || null,
            num_ratings: rec.num_ratings || rec.ratings || rec.number_of_ratings || 0,
          }));
          setRecommendations(recs);
          setLastSearchedTerm(searchTerm); 
        }
        setIsSearching(false);
        setSearchTerm('');
      })
      .catch(err => {
        setError('Failed to get recommendations: ' + err.message);
        setIsSearching(false);
        setSearchTerm('');
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleViewDetails = (book) => {
    console.log('View details for:', book.title);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 text-yellow-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Get Personalized Book Recommendations
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Tell us about a book you love, and we'll find your next favorite read
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <Card className="mb-8 shadow-soft border border-gray-200">
          <Card.Content className="p-8">
            <div className="text-center mb-6">
              <BookOpen className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Find a Book You Love
              </h2>
              <p className="text-gray-600">
                Search for a book by title or author to get started
              </p>
            </div>

            <div className="relative mb-6">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Enter book title or author..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10"
                      disabled={isSearching}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!searchTerm.trim() || isSearching}
                    className="px-6"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      'Search'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Card.Content>
        </Card>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Books You Might Love
              </h2>
              {lastSearchedTerm && (
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Here are some personalized recommendations based on your search for "<span className="font-semibold">{lastSearchedTerm}</span>".
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onViewDetails={handleViewDetails}
                  hideRatings={true}
                />
              ))}
            </div>

            {/* Recommendation Explanation */}
            <Card className="mt-8 shadow-soft border border-gray-200">
              <Card.Content className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Why these recommendations?
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Based on your search</p>
                  <p>• Curated recommendations from our system</p>
                </div>
              </Card.Content>
            </Card>
          </section>
        )}

        {/* Error Section */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* How it Works Section */}
        {!selectedBook && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              How Our Recommendations Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Search & Select</h3>
                <p className="text-gray-600">
                  Find a book you've enjoyed by searching our extensive catalog
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Analyze Preferences</h3>
                <p className="text-gray-600">
                  Our algorithm analyzes author patterns and publication periods
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Discover Books</h3>
                <p className="text-gray-600">
                  Get personalized recommendations tailored to your taste
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default RecommendPage;

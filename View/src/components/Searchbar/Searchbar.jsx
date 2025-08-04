import React, { useState } from 'react';
import { Search } from 'lucide-react';

// SearchBar Component - Integrated into Header
function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Simulate search (you'll replace this with actual API call to your MERN backend)
    if (query.length > 2) {
      setIsSearching(true);
      // Simulate API delay
      setTimeout(() => {
        // Mock search results (replace with actual API call)
        const mockResults = [
          { id: 1, type: 'destination', title: 'Paris, France', description: 'City of Light' },
          { id: 2, type: 'discover', title: 'My Trip to Bali', description: 'Amazing beaches and culture' },
          { id: 3, type: 'tip', title: 'Budget Travel Tips', description: 'How to travel on a budget' }
        ].filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
        );
        
        setSearchResults(mockResults);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      console.log(`Searching for: ${searchQuery}`);
      // Later: call your MERN backend API
      // Example: searchAPI(searchQuery).then(results => setSearchResults(results));
    }
  };

  // Handle clicking on a search result
  const handleResultClick = (result) => {
    console.log(`Clicked on: ${result.title}`);
    setSearchQuery('');
    setSearchResults([]);
    // Later: navigate to the result page
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
            placeholder="Search destinations, stories..."
            className="w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-full shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 pr-10"
          />
          
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          
          <button
            onClick={handleSearchSubmit}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full transition-colors duration-200"
          >
            <Search className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border
         border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : (
            <div className="py-2">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors 
                  duration-200 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 text-lg">
                      {result.type === 'destination' && '📍'}
                      {result.type === 'discover' && '👥'}
                      {result.type === 'tip' && '🧭'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{result.title}</h4>
                      <p className="text-sm text-gray-600">{result.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default SearchBar
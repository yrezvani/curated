import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './SearchResults.css';

// Component to display search results
const SearchResults = ({ apiKey }) => {
  // State hooks for managing component state
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);  
  const navigate = useNavigate();
  const location = useLocation();

  // Effect hook to perform search on component mount or update
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryParam = queryParams.get('query');
    const artistParam = queryParams.get('artist');
    if (queryParam || artistParam) {
      setSearchAttempted(true);
      setQuery(queryParam || '');
      setArtist(artistParam || '');
      setLoading(true);
      fetchArtworks(queryParam, artistParam);
    } else {
      setLoading(false);
      setResults([]);
      setSearchAttempted(false);
    }
  }, [location, apiKey]);
  
  // Function to fetch artworks based on query
  const fetchArtworks = async (queryParam, artistParam) => {
    let apiURL = `https://api.harvardartmuseums.org/object?apikey=${apiKey}&size=5000`;
    setLoading(true);
    const fetchPage = async (page) => {
      const response = await fetch(`${apiURL}&page=${page}${queryParam ? `&title=${encodeURIComponent(queryParam)}` : ''}${artistParam ? `&person=${encodeURIComponent(artistParam)}` : ''}`);
      const data = await response.json();
      return data.records.filter((record) => record.primaryimageurl);
    };
  
    try {
      const initialResponse = await fetch(`${apiURL}&page=1`);
      const initialData = await initialResponse.json();
      const totalPages = Math.ceil(initialData.info.totalrecords / 100);
      const pageNumbers = Array.from({ length: Math.min(totalPages, 50) }, (_, i) => i + 1);
      const pagesData = await Promise.all(pageNumbers.map((page) => fetchPage(page)));
      const allRecords = pagesData.flat();
      setResults(allRecords);
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchAttempted(true);
    navigate(`/search?query=${encodeURIComponent(query)}&artist=${encodeURIComponent(artist)}`);
  };

  // Render search form and results
  return (
    <div className="search-results-container">
      <h2 className='font-sans font-thin'>Search for artwork</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title" className="font-sans font-thin search-input" />
        <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Search by artist" className="font-sans font-thin search-input" />
        <button type="submit" className="font-sans font-thin search-button">Search</button>
      </form>
      {loading ? (
        <p className="font-sans font-thin results-loading">Loading...</p>
      ) : !searchAttempted ? (
        <p className="font-sans font-thin search-text">Please enter a search query.</p>
      ) : results.length === 0 ? (
        <div className="font-sans font-thin no-results-message">
          <p>No artworks found. Please try another search.</p>
        </div>
      ) : (
        <div className="artwork-results">
          {results.map((artwork, index) => (
            <div key={index} className="font-sans font-thin artwork-item" onClick={() => navigate(`/artwork/${artwork.id}`)}>
              <h3>{artwork.title}</h3>
              {artwork.primaryimageurl && (
                <LazyLoadImage alt={artwork.title} src={artwork.primaryimageurl} effect="blur" className="artwork-image" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;

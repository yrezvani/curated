import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './SearchResults.css'

const SearchResults = ({ apiKey }) => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryParam = queryParams.get('query');
    const artistParam = queryParams.get('artist');
    setQuery(queryParam || '');
    setArtist(artistParam || '');
    fetchArtworks(queryParam, artistParam);
  }, [location]);

  const fetchArtworks = async (queryParam, artistParam) => {
    let apiURL = `https://api.harvardartmuseums.org/object?apikey=${apiKey}&size=5000`;
    setLoading(true);
    const fetchPage = async (page) => {
      const response = await fetch(
        `${apiURL}&page=${page}${queryParam ? `&title=${encodeURIComponent(queryParam)}` : ''}${
          artistParam ? `&person=${encodeURIComponent(artistParam)}` : ''
        }`
      );
      const data = await response.json();
      return data.records.filter((record) => record.primaryimageurl);
    };
  
    try {
      const initialResponse = await fetch(`${apiURL}&page=1`);
      const initialData = await initialResponse.json();
      const totalPages = Math.ceil(initialData.info.totalrecords / 100);
      const pageNumbers = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1); 
  
      const pagesData = await Promise.all(pageNumbers.map((page) => fetchPage(page)));
      const allRecords = pagesData.flat();
  
      setResults(allRecords);
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query)}&artist=${encodeURIComponent(artist)}`);
  };

  return (
    <div className="search-results-container"> 
      <form onSubmit={handleSubmit} className="search-form"> 
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Artwork"
          className="search-input" 
        />
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Search by Artist"
          className="search-input" 
        />
        <button type="submit" className="search-button">Search</button> 
      </form>
      {loading ? (
        <p className='results-loading' >Loading...</p>
      ) : results.length === 0 ? (
        <div className="no-results-message"> 
          <p>No artworks found. Please try another search.</p>
        </div>
      ) : (
            <div className="artwork-results"> 
              {results.map((artwork, index) => (
                <div key={index} className="artwork-item" onClick={() => navigate(`/artwork/${artwork.id}`)}> 
                  <h3>{artwork.title}</h3>
                  {artwork.primaryimageurl && (
                    <LazyLoadImage
                      alt={artwork.title}
                      src={artwork.primaryimageurl}
                      effect="blur"
                      className="artwork-image" 
                    />
                  )}
                </div>
              ))}
            </div>

      )}
    </div>
  );
};

export default SearchResults;

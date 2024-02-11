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
    setLoading(true);
    let allRecords = [];
    let apiURL = `https://api.harvardartmuseums.org/object?apikey=${apiKey}&size=100`;
    if (queryParam) apiURL += `&title=${encodeURIComponent(queryParam)}`;
    if (artistParam) apiURL += `&person=${encodeURIComponent(artistParam)}`;

    try {
      while (apiURL) {
        const response = await fetch(apiURL);
        const data = await response.json();
        allRecords = [...allRecords, ...data.records.filter(record => record.primaryimageurl)];
        apiURL = data.info.next;
      }
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
            <div key={index} className="artwork-item"> 
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

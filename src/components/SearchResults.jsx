import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const SearchResults = ({ apiKey }) => {
  const [results, setResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');
    if (query) {
      fetchArtworks(query);
    }
  }, [location]);

  const fetchArtworks = async (query='stone') => {
    let allRecords = [];
    let nextPage = `https://api.harvardartmuseums.org/object?apikey=${apiKey}&title=${encodeURIComponent(query)}&size=100`;
  
    try {
      while (nextPage) {
        const response = await fetch(nextPage);
        const data = await response.json();
        allRecords = [...allRecords, ...data.records];
        nextPage = data.info.next;
      }
  
      setResults(allRecords);
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
    }
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query)}&artist=${encodeURIComponent(artist)}`);
  };

  return (
    <>
    <div>
      {results.map((artwork, index) => (
        <div key={index}>
          <h3>{artwork.title}</h3>
          {artwork.primaryimageurl && (
            <LazyLoadImage
              alt={artwork.title}
              src={artwork.primaryimageurl}
              effect="blur"
            />
          )}
        </div>
      ))}
    </div>
    <div>
        <form onSubmit={handleSearch}>
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Artwork"
            />
            <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Search by Artist"
            />
            <button type="submit">Search</button>
      </form>        
    </div>
    </>
  );
};

export default SearchResults;

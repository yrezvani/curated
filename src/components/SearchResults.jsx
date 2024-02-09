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

  const fetchArtworks = async (query) => {
    const url = `https://api.harvardartmuseums.org/object?apikey=${apiKey}&title=${encodeURIComponent(query)}&size=10`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setResults(data.records);
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
    }
  };

  return (
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
  );
};

export default SearchResults;

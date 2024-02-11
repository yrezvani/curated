import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const SearchResults = ({ apiKey }) => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [artist, setArtist] = useState('');
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
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query)}&artist=${encodeURIComponent(artist)}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
    </>
  );
};


export default SearchResults;

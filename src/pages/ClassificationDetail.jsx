// Import necessary hooks and components from React, React Router, and third-party libraries
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './ClassificationDetail.css'; 

// Component to display artworks of a specific classification
const ClassificationDetail = ({ apiKey }) => {
    const [artworks, setArtworks] = useState([]); // State to store artworks
    const [classificationInfo, setClassificationInfo] = useState(null); // State to store classification info
    const [loading, setLoading] = useState(true); // State to manage loading state
    const { classificationId } = useParams(); // Extract classification ID from URL

    const navigate = useNavigate(); // Hook to programmatically navigate

    // Fetch classification info and artworks on component mount or when classificationId changes
    useEffect(() => {
        fetchClassificationInfo(classificationId);
        fetchAllArtworksForClassification(classificationId);
    }, [classificationId, apiKey]);

    // Fetches classification information from the API
    const fetchClassificationInfo = async (classificationId) => {
        const url = `https://api.harvardartmuseums.org/classification/${classificationId}?apikey=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setClassificationInfo(data); // Update state with fetched data
        } catch (error) {
            console.error(`Fetching classification info failed:`, error);
        }
    };

    // Fetches all artworks for a given classification from the API
    const fetchAllArtworksForClassification = async (classificationId) => {
        let allArtworks = [];
        const maxArtworks = 5000; // Limit on artworks to fetch
        const pageSize = 80; // Number of artworks per API call
        const maxPages = Math.ceil(maxArtworks / pageSize); // Calculate max number of pages

        try {
            // Function to fetch a single page of artworks
            const fetchPage = (page) =>
                fetch(`https://api.harvardartmuseums.org/object?apikey=${apiKey}&classification=${classificationId}&size=${pageSize}&page=${page}&fields=id,title,primaryimageurl`)
                    .then(response => response.json())
                    .then(data => data.records.filter(record => record.primaryimageurl)); // Filter for records with images

            // Fetch all pages in parallel
            const pagePromises = Array.from({ length: maxPages }, (_, i) => fetchPage(i + 1));
            const pageResults = await Promise.all(pagePromises);

            allArtworks = pageResults.flat().slice(0, maxArtworks);

            setArtworks(allArtworks); // Update artworks state
            setLoading(false); // Update loading state
        } catch (error) {
            console.error(`Fetching artworks failed:`, error);
        }
    };
    
    // Render classification details and gallery of artworks
    return (
        <div>
            <h2 className="class-title font-sans font-thin">{classificationInfo?.name}</h2>
            <p>{classificationInfo?.description}</p>
            {artworks.length === 0 && loading && <p className="font-sans font-thin loading-text">Loading...</p>} {/* Show loading text if no artworks are loaded yet */}
            <div className="gallery">
                {artworks.map((artwork, index) => (
                    <div
                        key={index}
                        className="artwork"
                        onClick={() => navigate(`/artwork/${artwork.id}`)} // Navigate to artwork detail on click
                    >
                        <LazyLoadImage
                            alt={artwork.title}
                            src={artwork.primaryimageurl}
                            effect="blur"
                            className="artwork-image"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassificationDetail;
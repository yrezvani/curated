import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './ClassificationDetail.css'

const ClassificationDetail = ({ apiKey }) => {
    const [artworks, setArtworks] = useState([]);
    const [classificationInfo, setClassificationInfo] = useState(null); 
    const [loading, setLoading] = useState(true);
    const { classificationId } = useParams();

    const navigate = useNavigate()

    useEffect(() => {
        fetchClassificationInfo(classificationId);
        fetchAllArtworksForClassification(classificationId);
    }, [classificationId, apiKey]);

    const fetchClassificationInfo = async (classificationId) => {

        const url = `https://api.harvardartmuseums.org/classification/${classificationId}?apikey=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setClassificationInfo(data); 
        } catch (error) {
            console.error(`Fetching classification info failed:`, error);
        }
    };

    const fetchAllArtworksForClassification = async (classificationId) => {
        let allArtworks = [];
        let page = 1;
        const maxArtworks = 5000;
        const pageSize = 80; 
        const maxPages = Math.ceil(maxArtworks / pageSize); 
    
        try {
            const fetchPage = (page) => 
                fetch(`https://api.harvardartmuseums.org/object?apikey=${apiKey}&classification=${classificationId}&size=${pageSize}&page=${page}&fields=id,title,primaryimageurl`)
                    .then(response => response.json())
                    .then(data => data.records.filter(record => record.primaryimageurl));
    
            const pagePromises = Array.from({ length: maxPages }, (_, i) => fetchPage(i + 1));
    
            const pageResults = await Promise.all(pagePromises);
    
            allArtworks = pageResults.flat().slice(0, maxArtworks);
    
            setArtworks(allArtworks);
            setLoading(false);
        } catch (error) {
            console.error(`Fetching artworks failed:`, error);
        }
    };
    
    return (
        <div>
            <h2 className="class-title font-sans font-thin">{classificationInfo?.name}</h2>
            <p>{classificationInfo?.description}</p>
            {artworks.length === 0 && <p className="font-sans font-thin loading-text">Loading...</p>} {/* Render loading text when no artworks */}            
            <div className="gallery">
                {artworks.map((artwork, index) => (
                    <div
                        key={index}
                        className="artwork"
                        onClick={() => navigate(`/artwork/${artwork.id}`)}
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
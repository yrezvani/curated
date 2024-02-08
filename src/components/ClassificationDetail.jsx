import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './ClassificationDetail.css'

const ClassificationDetail = ({ apiKey }) => {
    const [artworks, setArtworks] = useState([]);
    const [classificationInfo, setClassificationInfo] = useState(null); 
    const { classificationId } = useParams();

    const navigate = useNavigate()

    useEffect(() => {
        fetchClassificationInfo(classificationId);
        fetchArtworksForClassification(classificationId);
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

    const fetchArtworksForClassification = async (classificationId) => {
        const url = `https://api.harvardartmuseums.org/object?apikey=${apiKey}&classification=${classificationId}&size=30&fields=id,title,primaryimageurl`; // Removed period from fields
        try {
            const response = await fetch(url);
            const data = await response.json();
            setArtworks(data.records.filter(record => record.primaryimageurl)); // Directly set artworks without grouping
        } catch (error) {
            console.error(`Fetching artworks failed:`, error);
        }
    };
    
    return (
        <div>
            <h2 className='category-title' >{classificationInfo?.name}</h2>
            <p>{classificationInfo?.description}</p>
            <div className="gallery">
                {artworks.map((artwork, index) => (
                    <div key={index} className="artwork" onClick={() => navigate(`/artwork/${artwork.id}`)}>
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

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ClassificationDetail = ({ apiKey }) => {
    const [artworks, setArtworks] = useState([]);
    const [classificationInfo, setClassificationInfo] = useState(null); /

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
        const url = `https://api.harvardartmuseums.org/object?apikey=${apiKey}&classification=${classificationId}&size=30&fields=id,title,primaryimageurl,period`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const filteredArtworks = data.records.filter(record => record.primaryimageurl);

            const groupedByPeriod = filteredArtworks.reduce((acc, artwork) => {
                const period = artwork.period || 'Unknown'; 
                if (!acc[period]) {
                    acc[period] = [];
                }
                acc[period].push(artwork);
                return acc;
            }, {});
            setArtworks(groupedByPeriod);
        } catch (error) {
            console.error(`Fetching artworks failed:`, error);
        }
    };

    return (
        <div>
            <h2>{classificationInfo?.name}</h2> 
            <p>{classificationInfo?.description}</p> 
            {Object.keys(artworks).map(period => (
                <div key={period}>
                    <h3>{period}</h3>
                    <div className="gallery">
                        {artworks[period].map((artwork, index) => (
                            <div key={index} className="artwork">
                                <LazyLoadImage
                                    alt={artwork.title}
                                    src={artwork.primaryimageurl}
                                    effect="blur"
                                    className="artwork-image"
                                />
                                <p>{artwork.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ClassificationDetail;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ArtworkDetail.css'

const ArtworkDetail = ({ apiKey }) => {
    const { artworkId } = useParams();
    const [artwork, setArtwork] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://api.harvardartmuseums.org/object/${artworkId}?apikey=${apiKey}`);
            const data = await response.json();
            console.log(data);
            setArtwork(data);
        };
        fetchData();
    }, [artworkId, apiKey]);

    if (!artwork) return <div>Loading...</div>;

    return (
        <div className='artwork-detail' >
            <h2>{artwork.title}</h2>
            <img src={artwork.primaryimageurl} alt={artwork.title} />
            <p>{artwork.description}</p>
        </div>
    );
};

export default ArtworkDetail;

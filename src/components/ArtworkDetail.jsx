import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './ArtworkDetail.css';

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

    {/*create function to save artwork to local storage*/} 
    const saveToGallery = () => {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        if (artwork) {
            items.push(artwork);
            localStorage.setItem('items', JSON.stringify(items));
            console.log(items);
        }
    };

    if (!artwork) return <div>Loading...</div>;

    return (
        <div className='artwork-detail'>
            <h2>{artwork.title}</h2>
            <div className='artwork-image-container'>
                <LazyLoadImage
                    alt={artwork.title}
                    src={artwork.primaryimageurl}
                    effect="blur"
                    className='artwork-image'
                />
                {/*create save button and call save to local storage function*/} 
                <div className='icon-overlay'>
                    <button onClick={saveToGallery} className='icon-button'>🖤</button>
                    <p className="btn-caption">Save to your gallery</p>
                </div>
            </div>

            {artwork.period && <p><strong>Period:</strong> {artwork.period}</p>}
            {artwork.people && <p><strong>Artist:</strong> {artwork.people[0].name}</p>}
            <p>{artwork.description}</p>
        </div>
    );
};

export default ArtworkDetail;

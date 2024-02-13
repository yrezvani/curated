import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './ArtworkDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const ArtworkDetail = ({ apiKey }) => {
    const { artworkId } = useParams();
    const [artwork, setArtwork] = useState(null);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://api.harvardartmuseums.org/object/${artworkId}?apikey=${apiKey}`);
            const data = await response.json();
            console.log(data);
            setArtwork(data);
        };
        fetchData();
    }, [artworkId, apiKey]);

    const saveToGallery = () => {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        if (artwork) {
            {/* create a check in local storage */}
            const isAlreadySaved = items.some(item => item.id === artwork.id);
            if (!isAlreadySaved) {
                items.push(artwork);
                localStorage.setItem('items', JSON.stringify(items));
                console.log(items);
                handleButtonClick();
            } else {
                console.log("Artwork already saved.");
            }
        }
    };

    const handleButtonClick = () => {
        setIsClicked(true);
        setTimeout(() => {
            setIsClicked(false);
        }, 1000);
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
                <div className={`icon-overlay ${isClicked ? 'clicked' : ''}`}>
                    <button onClick={saveToGallery} className='icon-button'>
                        <FontAwesomeIcon icon={faHeart} />
                    </button>
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

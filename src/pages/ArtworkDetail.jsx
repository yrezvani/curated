// Import necessary hooks and components from React and third-party libraries
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './ArtworkDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

// Component to display details of a single artwork
const ArtworkDetail = ({ apiKey }) => {
    const { artworkId } = useParams(); // Extracting artworkId from the URL
    const [artwork, setArtwork] = useState(null); // State for storing artwork details
    const [isClicked, setIsClicked] = useState(false); // State to track if the save icon has been clicked

    // Fetch artwork details from the API on component mount or when artworkId/apiKey changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://api.harvardartmuseums.org/object/${artworkId}?apikey=${apiKey}`);
            const data = await response.json();
            setArtwork(data); // Update state with fetched artwork details
        };
        fetchData();
    }, [artworkId, apiKey]);

    // Saves the current artwork to localStorage if not already saved
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

    // Toggles the isClicked state to provide feedback
    const handleButtonClick = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 1000);
    };

    // Show loading text until artwork details are fetched
    if (!artwork) return <div className='font-sans font-thin'>Loading...</div>;

    // Render the artwork details with a save icon
    return (
        <div className='artwork-detail'>
            <h2 className='font-sans font-thin'>{artwork.title}</h2>
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
                    <p className="save-btn-caption font-sans font-thin">Save to your gallery</p>
                </div>
            </div>
            {artwork.period && <p className='font-sans font-thin'><strong>Period:</strong> {artwork.period}</p>}
            {artwork.people && <p className='font-sans font-thin'><strong>Artist:</strong> {artwork.people[0].name}</p>}
            <p className='font-sans font-thin'>{artwork.description}</p>
        </div>
    );
};

export default ArtworkDetail;


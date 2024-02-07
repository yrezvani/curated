import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './ArtGallery.css';

const apiKey = '0f4dc3f5-f76a-40aa-adaf-78bcdc8f2e05';

function ArtGallery() {
    const [classificationArtworks, setClassificationArtworks] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const [loadingImages, setLoadingImages] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        fetchClassifications();
    }, []);

    const fetchClassifications = async () => {
        const url = `https://api.harvardartmuseums.org/classification?apikey=${apiKey}&size=100`; // Adjust size as needed
        try {
            const response = await fetch(url);
            const data = await response.json();
            const classifications = data.records;
            fetchArtworksForClassifications(classifications);
        } catch (error) {
            console.error('Fetching classifications failed:', error);
        }
    };

    const fetchArtworksForClassifications = async (classifications) => {
        const promises = classifications.map(classification =>
            fetch(`https://api.harvardartmuseums.org/object?apikey=${apiKey}&classification=${classification.id}&size=1&fields=id,title,primaryimageurl`)
                .then(response => response.json())
                .then(data => {
                    if (data.records.length > 0 && data.records[0].primaryimageurl) {
                        return {
                            classificationId: classification.id,
                            classification: classification.name,
                            artwork: data.records[0]
                        };
                    }
                    return null;
                })
        );
        
        const results = await Promise.all(promises);
        setClassificationArtworks(results.filter(result => result !== null));
        // setLoading(false);
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3, 
        slidesToScroll: 3,
        afterChange: current => setActiveSlide(current)
    };

    const handleArtworkClick = (classificationId) => {
        if (classificationId) {
            navigate(`/classification/${classificationId}`);
        } else {
            console.error('Classification ID is undefined');
        }
    };


    const handleImageLoad = (imageId) => {
        setLoadingImages(prev => {
            const newLoading = new Set(prev);
            newLoading.delete(imageId);
            return newLoading;
        });
    };

    
    return (
        <div className="art-gallery">
            <header>
                <h1>Art Explorer</h1>
            </header>
            <main>
                <Slider {...settings}>
                    {classificationArtworks.map((item, index) => (
                        <div key={index} className="slide" onClick={() => handleArtworkClick(item.classificationId)}>
                            <h3>{item.classification}</h3>
                            {loadingImages.has(item.artwork.id) && <div className="loading-text">Loading...</div>}
                            <LazyLoadImage
                                alt={item.artwork.title}
                                src={item.artwork.primaryimageurl}
                                effect="blur"
                                width="100%"
                                className='artwork-image'
                                onLoad={() => handleImageLoad(item.artwork.id)}
                            />
                            <p>{item.artwork.title}</p>
                        </div>
                    ))}
                </Slider>
            </main>
            <footer>
                <p>© 2024 Art Explorer. All rights reserved.</p>
            </footer>
        </div>
    );
}


export default ArtGallery;
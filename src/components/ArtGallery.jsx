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
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        fetchClassifications();
    }, []);

    const fetchClassifications = async () => {
        const url = `https://api.harvardartmuseums.org/classification?apikey=${apiKey}&size=100`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const classifications = data.records;
            await fetchArtworksForClassifications(classifications);
            setLoading(false);
        } catch (error) {
            console.error('Fetching classifications failed:', error);
            setLoading(false);
        }
    };

    const fetchArtworksForClassifications = async (classifications) => {
        const promises = classifications.map(async classification => {
            const response = await fetch(`https://api.harvardartmuseums.org/object?apikey=${apiKey}&classification=${classification.id}&size=1&fields=id,title,primaryimageurl`);
            const data = await response.json();
            if (data.records.length > 0 && data.records[0].primaryimageurl) {
                return {
                    classificationId: classification.id,
                    classification: classification.name,
                    artwork: data.records[0]
                };
            }
            return null;
        });

        const results = await Promise.all(promises);
        setClassificationArtworks(results.filter(result => result !== null));
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3, 
        slidesToScroll: 3,
    };

    if (window.innerWidth < 768) {
        settings.slidesToShow = 1;
        settings.slidesToScroll = 1;
    }
    
    const handleArtworkClick = (classificationId) => {
        if (classificationId) {
            navigate(`/classification/${classificationId}`);
        } else {
            console.error('Classification ID is undefined');
        }
    };

    return (
        <div className="art-gallery">
            <header>
                <h1>Art Explorer</h1>
            </header>
            <main>
                {loading ? ( 
                    <div className="loading-text">Loading...</div>
                ) : (
                    <Slider {...settings}>
                        {classificationArtworks.map((item, index) => (
                            <div key={index} className="slide" onClick={() => handleArtworkClick(item.classificationId)}>
                                <h3>{item.classification}</h3>
                                <LazyLoadImage
                                    alt={item.artwork.title}
                                    src={item.artwork.primaryimageurl}
                                    effect="blur"
                                    width="100%"
                                    className='artwork-image'
                                />
                                <p>{item.artwork.title}</p>
                            </div>
                        ))}
                    </Slider>
                )}
            </main>
            <footer>
                <p>© 2024 Art Explorer. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default ArtGallery;

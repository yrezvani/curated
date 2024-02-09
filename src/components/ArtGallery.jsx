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
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        handleResize();
    }, []); 

    const interestedClassificationIds = ['492', '1078', '344', '197', '17', '19', '21', '23', '26', '30', '32', '50', '62', '75', '105', '133', '155', '185', '242', '359', '381', '384', '1185'];
    
    const fetchClassifications = async () => {
        const url = `https://api.harvardartmuseums.org/classification?apikey=${apiKey}&size=100`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const classifications = data.records;
            console.log(classifications);
            await fetchArtworksForClassifications(classifications);
            setLoading(false);
        } catch (error) {
            console.error('Fetching classifications failed:', error);
            setLoading(false);
        }
    };

    const fetchArtworksForClassifications = async (classifications) => {
        const filteredClassifications = classifications.filter(classification => interestedClassificationIds.includes(classification.id.toString()));
        const promises = filteredClassifications.map(async classification => {
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

    const handleResize = () => {
        const newSettings = { ...settings };
        if (window.innerWidth < 768) {
            newSettings.slidesToShow = 1;
            newSettings.slidesToScroll = 1;
        } else {
            newSettings.slidesToShow = 3;
            newSettings.slidesToScroll = 3;
        }
        setSettings(newSettings);
    };

    const [settings, setSettings] = useState({
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3, 
        slidesToScroll: 3,
    });
    
    const handleArtworkClick = (classificationId) => {
        if (classificationId) {
            navigate(`/classification/${classificationId}`);
        } else {
            console.error('Classification ID is undefined');
        }
    };

    return (
        <div className="art-gallery">
            <h1 className='explorer-title' >Art Explorer</h1>
            <main>
                {loading ? ( 
                    <div className="loading-text">Loading...</div>
                ) : (
                    <Slider {...settings}>
                        {classificationArtworks.map((item, index) => (
                            <div key={index} className="slide" onClick={() => handleArtworkClick(item.classificationId)}>
                                <h3 className='class-name' >{item.classification}</h3>
                                <div className="image-container">
                                    <LazyLoadImage
                                        alt={item.artwork.title}
                                        src={item.artwork.primaryimageurl}
                                        effect="blur"
                                        width="100%"
                                        className='artwork-image'
                                    />
                                </div>
                                <p>{item.artwork.title}</p>
                            </div>
                        ))}
                    </Slider>
                )}
            </main>
        </div>
    );
}

export default ArtGallery;

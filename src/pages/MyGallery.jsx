import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './MyGallery.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

const MyGallery = () => {

    const [isClicked, setIsClicked] = useState(false);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const [items, setItems] = useState([]);

    {/*getting data stored in local storage*/ }
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('items'));
        if (data) {
            setItems(data);
        }
    }, []);

    const removeFromGallery = () => {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        if (artwork) {
            {/* create a check in local storage */ }
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


    return (
        <div className='art-gallery'>
            <Slider {...settings} className='slides'>
                {items.map(item => (
                    <>
                        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 gallery-item" key={item.id}>
                            <img className="rounded-t-lg artwork-image" src={item.primaryimageurl} alt={item.title} />
                            <div className="p-5">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.title}</h5>
                                {item.period && <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"><strong>Period:</strong> {item.period}</p>}
                                {item.people && <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"><strong>Artist:</strong> {item.people[0].name}</p>}
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.description}</p>
                            </div>
                        </div>

                    </>
                ))}
            </Slider>
            <div className={`icon-overlay ${isClicked ? 'clicked' : ''}`}>
                                <button onClick={removeFromGallery} className='icon-button'>
                                <FontAwesomeIcon icon={faX} />
                                </button>
                                <p className="btn-caption">Remove from gallery</p>
                            </div>
        </div>

    );
};

export default MyGallery;
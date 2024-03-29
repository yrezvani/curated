import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './MyGallery.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

const MyGallery = () => {
    const [isClicked, setIsClicked] = useState(false);
    const [items, setItems] = useState([]);

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('items'));
        if (data) {
            setItems(data);
        }
    }, []);

    const removeFromGallery = (itemId) => {
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);
        localStorage.setItem('items', JSON.stringify(updatedItems));
        handleButtonClick();
        toggleAlert('Item removed');
    };

    const handleButtonClick = () => {
        setIsClicked(true);
        setTimeout(() => {
            setIsClicked(false);
        }, 1000);
    };

    return (
        <div className='art-gallery'>
            <h1 className='font-sans font-thin contact-heading text-3xl text-center py-10 mx-8'>My gallery</h1>
            <Slider {...settings} className='slides'>
                {items.map(item => (
                    <div key={item.id}>
                        <div className="font-sans font-thin max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 gallery-item">
                            <div>
                                <div className={`${isClicked ? 'clicked' : ''}`}>
                                    <button onClick={() => removeFromGallery(item.id)} className='icon-button'>
                                        <FontAwesomeIcon icon={faX} />
                                    </button>
                                    <p className="font-sans font-thin btn-caption">Remove from gallery</p>
                                </div>
                                <img className="rounded-t-lg artwork-image pt-3" src={item.primaryimageurl} alt={item.title} />
                                
                            </div>
                            <div className="p-5">
                                <h5 className="mb-2 text-2xl font-sans font-thin tracking-tight text-gray-900 dark:text-white">{item.title}</h5>
                                {item.period && <p className="font-sans font-thin mb-3 font-normal text-gray-700 dark:text-gray-400"><strong>Period:</strong> {item.period}</p>}
                                {item.people && <p className="font-sans font-thin mb-3 font-normal text-gray-700 dark:text-gray-400"><strong>Artist:</strong> {item.people[0].name}</p>}
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default MyGallery;

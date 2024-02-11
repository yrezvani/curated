import React, { useEffect, useState } from 'react';
import './MyGallery.css';

const MyGallery = () => {

    const [items, setItems] = useState([]);

    {/*getting data stored in local storage*/}
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('items'));
        if (data) {
         setItems(data);
        }
    }, []);
    

    return (
        <div className='my-gallery'>
            {items.map(item => (
                <>
            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 gallery-item" key={item.id}>
            <img className="rounded-t-lg" src={item.primaryimageurl} alt={item.title} />
            <div className="p-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.title}</h5>
            {item.period && <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"><strong>Period:</strong> {item.period}</p>}
            {item.people && <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"><strong>Artist:</strong> {item.people[0].name}</p>}
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.description}</p>
            </div>
        </div>

            </>      
            ))}
            
        </div>

    );
};

export default MyGallery;
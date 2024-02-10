import React, { useEffect, useState } from 'react';

const MyGallery = () => {

    const [items, setItems] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('items'));
        if (data) {
         setItems(data);
        }
    }, []);
    
    console.log(items);

    return (
        <div>
            <h1>Hello</h1>
        </div>

    )
};

export default MyGallery;
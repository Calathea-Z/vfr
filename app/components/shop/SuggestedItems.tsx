"use client"
import React from 'react';

const SuggestedItems = ({ category }) => {
    const [suggestedItems, setSuggestedItems] = React.useState([]);

    React.useEffect(() => {
        // Fetch items from the server or a local source based on the category
        fetch(`/api/items?category=${category}`)
            .then(response => response.json())
            .then(data => setSuggestedItems(data))
            .catch(error => console.error('Error fetching suggested items:', error));
    }, [category]);

    return (
        <div>
            {suggestedItems.map(item => (
                <div key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <h4>{item.name}</h4>
                    <p>${item.price}</p>
                </div>
            ))}
        </div>
    );
};

export default SuggestedItems;
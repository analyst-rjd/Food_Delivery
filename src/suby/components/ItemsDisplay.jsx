import React, { useState, useEffect } from 'react'
import { itemData } from '../data/itemData'
import { menuData } from '../data/menuData'
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft, FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { API_URL } from '../api';

const ItemsDisplay = () => {
    const [displayItem, setDisplayItem] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)

    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch(`${API_URL}/items`);
            const data = await response.json();
            setDisplayItem(data);
        };

        fetchItems();
    }, []);

    const handleScroll = (direction) => {
        const gallery = document.getElementById("itemGallery");
        const scrollAmount = 300;

        if (direction === "left") {
            gallery.scrollTo({
                left: gallery.scrollLeft - scrollAmount,
                behavior: "smooth"
            });
        } else if (direction === "right") {
            gallery.scrollTo({
                left: gallery.scrollLeft + scrollAmount,
                behavior: "smooth"
            });
        }
    }

    const findItemInRestaurants = (itemName) => {
        // Helper function to check if names are similar
        const isSimilarName = (name1, name2) => {
            const normalize = str => str.toLowerCase().replace(/\s+/g, '');
            const n1 = normalize(name1);
            const n2 = normalize(name2);
            return n1.includes(n2) || n2.includes(n1);
        };

        return Object.entries(menuData).map(([restaurantId, restaurant]) => {
            // Check each item in the restaurant's menu
            const matchingItem = restaurant.items.find(item => 
                isSimilarName(item.name, itemName) || // Check exact name
                (item.category && isSimilarName(item.category, itemName)) // Check category
            );

            if (matchingItem) {
                return {
                    restaurantId,
                    restaurantName: restaurant.name,
                    item: matchingItem
                };
            }
            return null;
        }).filter(Boolean); // Remove null entries
    }

    return (
        <div className="itemSectionContainer">
            <h3>Popular Dishes</h3>
            <div className="itemBtnSection">
                <button onClick={() => handleScroll("left")}>
                    <FaRegArrowAltCircleLeft className='btnIcons' />
                </button>
                <button onClick={() => handleScroll("right")}>
                    <FaRegArrowAltCircleRight className='btnIcons' />
                </button>
            </div>
            <div className="itemSection" id="itemGallery">
                <div className="itemWrapper">
                    {displayItem.map((item) => (
                        <div 
                            className="gallery" 
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                        >
                            <img src={item.item_img} alt={item.name} />
                            <p className="item-name">{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {selectedItem && (
                <div className="item-modal">
                    <div className="modal-content">
                        <button 
                            className="close-button"
                            onClick={() => setSelectedItem(null)}
                        >
                            <FaTimes />
                        </button>
                        <h3>{selectedItem.name}</h3>
                        <div className="restaurants-list">
                            {findItemInRestaurants(selectedItem.name).map((result, index) => (
                                <Link 
                                    to={`/products/${result.restaurantId}/${result.restaurantName}`}
                                    key={index}
                                    className="restaurant-item"
                                    onClick={() => setSelectedItem(null)}
                                >
                                    <div className="restaurant-info">
                                        <h4>{result.restaurantName}</h4>
                                        <p>₹{result.item.price}</p>
                                    </div>
                                    <button className="order-now-btn">
                                        Order Now
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ItemsDisplay
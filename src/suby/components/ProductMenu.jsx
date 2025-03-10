import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../api';
import { menuData } from '../data/menuData';
import { FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';
import CustomizationModal from './CustomizationModal';
import SustainabilityBadge from './SustainabilityBadge';

const ProductMenu = () => {
    const { firmId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [cart, setCart] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [customizingItem, setCustomizingItem] = useState(null);
    
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchRestaurant = async () => {
            const response = await fetch(`${API_URL}/restaurants/${firmId}`);
            const data = await response.json();
            setRestaurant(data);
        };

        fetchRestaurant();
    }, [firmId]);

    if (!restaurant) {
        return <div>Restaurant not found</div>;
    }

    const addToCart = (item, customizations = null) => {
        const cartItemId = customizations 
            ? `${item.id}_${JSON.stringify(customizations)}`
            : item.id;
            
        setCart(prev => ({
            ...prev,
            [cartItemId]: {
                ...prev[cartItemId],
                quantity: (prev[cartItemId]?.quantity || 0) + 1,
                item,
                customizations
            }
        }));
    };

    const removeFromCart = (cartItemId) => {
        setCart(prev => {
            const newCart = { ...prev };
            if (newCart[cartItemId].quantity > 1) {
                newCart[cartItemId].quantity--;
            } else {
                delete newCart[cartItemId];
            }
            return newCart;
        });
    };

    const getCartTotal = () => {
        return Object.values(cart).reduce((total, { quantity, item }) => {
            return total + (item.price * quantity);
        }, 0);
    };

    const handleCustomizationSave = (customizations) => {
        addToCart(customizingItem, customizations);
        setCustomizingItem(null);
    };

    return (
        <div className="menuContainer">
            <div className="menuHeader">
                <div>
                    <h2>{restaurant?.name}</h2>
                    {restaurant?.sustainabilityMetrics && (
                        <SustainabilityBadge metrics={restaurant.sustainabilityMetrics} />
                    )}
                </div>
                <div className="cartIcon">
                    <FaShoppingCart />
                    <span className="cartCount">
                        {Object.values(cart).reduce((a, { quantity }) => a + quantity, 0)}
                    </span>
                </div>
            </div>

            <div className="categoryFilter">
                <button 
                    className={selectedCategory === 'all' ? 'active' : ''} 
                    onClick={() => setSelectedCategory('all')}
                >
                    All
                </button>
                {restaurant?.categories.map(cat => (
                    <button
                        key={cat}
                        className={selectedCategory === cat ? 'active' : ''}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="menuGrid">
                {restaurant?.items
                    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
                    .map(item => (
                        <div key={item.id} className="menuItem">
                            <img src={item.image} alt={item.name} />
                            <div className="itemDetails">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <div className="itemPrice">₹{item.price}</div>
                                <div className="itemActions">
                                    {Object.entries(cart)
                                        .filter(([_, { item: cartItem }]) => cartItem.id === item.id)
                                        .map(([cartItemId, { quantity, customizations }]) => (
                                            <div key={cartItemId} className="quantityControl">
                                                <button onClick={() => removeFromCart(cartItemId)}>
                                                    <FaMinus />
                                                </button>
                                                <span>{quantity}</span>
                                                <button onClick={() => addToCart(item, customizations)}>
                                                    <FaPlus />
                                                </button>
                                                {customizations && <span className="customized-badge">Customized</span>}
                                            </div>
                                        ))}
                                    {!Object.values(cart).some(({ item: cartItem }) => cartItem.id === item.id) && (
                                        <button 
                                            className="addToCart"
                                            onClick={() => setCustomizingItem(item)}
                                        >
                                            Customize & Add
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {customizingItem && (
                <CustomizationModal 
                    item={customizingItem}
                    onClose={() => setCustomizingItem(null)}
                    onSave={handleCustomizationSave}
                />
            )}

            {Object.keys(cart).length > 0 && (
                <div className="cartSummary">
                    <div className="cartTotal">
                        <span>Total: ₹{getCartTotal()}</span>
                        <button 
                            className="checkoutBtn" 
                            onClick={() => navigate('/order-tracking')}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductMenu;

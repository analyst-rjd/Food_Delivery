import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { restaurantData } from '../data/restaurants';

const FirmCollections = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Get unique categories from all vendors
    const categories = ['all', ...new Set(restaurantData.vendors.flatMap(
        vendor => vendor.firm.flatMap(item => item.categories || [])
    ))];

    // Filter vendors based on selected category
    const filteredVendors = restaurantData.vendors.map(vendor => ({
        ...vendor,
        firm: vendor.firm.filter(item => 
            selectedCategory === 'all' || 
            (item.categories && item.categories.includes(selectedCategory))
        )
    })).filter(vendor => vendor.firm.length > 0);

    return (
        <div className='mediaSection'>
            <h3 className='collectionTitle'>Order from these collections</h3>
            
            <div className="categoryFilter">
                {categories.map(category => (
                    <button
                        key={category}
                        className={selectedCategory === category ? 'active' : ''}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            <section className="collectionSection">
                <div className="collectionWrapper">
                    {filteredVendors.map((vendor) => (
                        <div className="vendorBox" key={vendor._id}>
                            {vendor.firm.map((item) => (
                                <Link 
                                    to={`/products/${vendor._id}/${item.firmName}`} 
                                    className="link" 
                                    key={item._id}
                                >
                                    <div className="firmImage">
                                        <img 
                                            src={item.image} 
                                            alt={item.firmName} 
                                        />
                                        <div className="firmName">{item.firmName}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default FirmCollections;

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { restaurantData } from '../data/restaurants';

const Chains = () => {
    const scrollContainerRef = useRef(null);

    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = 300;
            const newScrollPosition = direction === "left" 
                ? container.scrollLeft - scrollAmount 
                : container.scrollLeft + scrollAmount;
            
            container.scrollTo({
                left: newScrollPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className='mediaChainSection'>
            <h3 className='chainTitle'>Top restaurant chains in Hyderabad</h3>
            <section className="chainSection">
                <div className="btnSection">
                    <button onClick={() => handleScroll("left")}>
                        <FaRegArrowAltCircleLeft className='btnIcons' />
                    </button>
                    <button onClick={() => handleScroll("right")}>
                        <FaRegArrowAltCircleRight className='btnIcons' />
                    </button>
                </div>
                <div 
                    className="chainWrapper" 
                    ref={scrollContainerRef}
                >
                    {restaurantData.vendors.map((vendor) => (
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

export default Chains;
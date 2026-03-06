import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../backtootop/backtootop.css'

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <>
            {isVisible && (
                <Link to="#"
                    id="backto-top"
                    className="back-to-top show"
                    onClick={scrollToTop}>
                    <i className="fas fa-angle-up"></i>
                </Link>
            )}
        </>
    );
};

export default BackToTop;

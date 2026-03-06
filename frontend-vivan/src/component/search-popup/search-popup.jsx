import React, { useState } from 'react';
import '../search-popup/search-popup.css'

const SearchPopup = ({ isActive, closePopup }) => {
    return (
        <div className={`search-popup ${isActive ? 'active' : ''}`}>
            <div className="search-popup__overlay search-toggler"></div>
            <div className="close-pop" onClick={closePopup}><i className="fas fa-window-close"></i></div>
            <div className="search-popup__content">
                <form role="search" method="get" className="search-popup__form">
                    <input type="text" id="search" placeholder="Search Here..." />
                    <button type="submit">
                        <i className="fal fa-search"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SearchPopup;

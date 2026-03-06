import React, { useState } from 'react';
import ProfileDropdown from '../nav-profile/nav-profile'
import SearchPopup from '../search-popup/search-popup'
import SideNavbar from '../sidebar-menu/sidebarmenu'

const HeaderRightIcons = () => {


    const WalletButtons = () => (
        <button className="wallet-hbtn">
            <div>
                <label className="font-medium hover:cursor-pointer">
                    <div className="d-flex align-items-center gap-2">
                        <svg aria-label="An image of a closed passport" fill="none" viewBox="0 0 23 20" className="w-5 h-5 mr-3">
                            <path d="M21 11.2857V7.4C21 5.15979 21 4.03968 20.564 3.18404C20.1805 2.43139 19.5686 1.81947 18.816 1.43597C17.9603 1 16.8402 1 14.6 1H7.4C5.15979 1 4.03968 1 3.18404 1.43597C2.43139 1.81947 1.81947 2.43139 1.43597 3.18404C1 4.03968 1 5.15979 1 7.4V12.6C1 14.8402 1 15.9603 1.43597 16.816C1.81947 17.5686 2.43139 18.1805 3.18404 18.564C4.03968 19 5.15979 19 7.4 19H13M1.5 6H20.5M5 10H8M16 17H22M22 17L20 15M22 17L20 19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        </svg>
                        ₹0
                        
                    </div>
                </label>
            </div>
        </button>

    );

    const AuthButtons = () => (
        <div className="main-menu-signup__login d-xl-flex">
            <WalletButtons />
            <ProfileDropdown />
        </div>
    );

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };
    const closePopup = () => {
        setIsPopupVisible(false);
    };


    const [isSNavbarVisible, setIsSNavbarVisible] = useState(false);

    const toggleSNavbar = () => {
        setIsSNavbarVisible(!isSNavbarVisible);
    };
    const closeSNavbar = () => {
        setIsSNavbarVisible(false);
    };


    return (
        <>
            <div className="main-menu_rig">
                <button className="main-menu__search search-toggler d-xl-flex d-none" onClick={togglePopup}>
                    <i className="fal fa-search"></i>
                </button>

                <AuthButtons />

                <button className="main-menu__toggler mobile-nav__toggler"
                    onClick={toggleSNavbar} style={{ color: isSNavbarVisible ? 'white' : '', }}>
                    <i className={`fa ${isSNavbarVisible ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
            </div>
            <SearchPopup isActive={isPopupVisible} closePopup={closePopup} />

            <SideNavbar isSNavbarActive={isSNavbarVisible} closeSNavbar={closeSNavbar} />

        </>
    )
}

export default HeaderRightIcons
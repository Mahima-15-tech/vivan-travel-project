import React, { useState, useEffect } from 'react';

import { Link, NavLink, useNavigate } from 'react-router-dom';
import './sidebarmenu.css'
import { FaHome, FaPlane, FaPassport, FaClipboardCheck, FaInfoCircle, FaPhoneAlt, FaUserCircle, FaSignOutAlt, FaSignInAlt, FaLockOpen } from "react-icons/fa";
import { account_logout } from "../../API/endpoints";
import { post, get } from "../../API/apiHelper";


// Components

const MainMenuList = ({ closeSNavbar }) => {
    const navigate = useNavigate();

    const [data, setUserData] = useState(null);
    useEffect(() => {
        const userDataFromSession = sessionStorage.getItem('userData');
        // console.log(userDataFromSession)
        if (userDataFromSession) {
            const userData = JSON.parse(userDataFromSession);
            setUserData(userData.model);
        }

    }, []);


    const [isSNavbarVisible, setIsSNavbarVisible] = useState(false);

    const toggleSNavbar = () => {
        setIsSNavbarVisible(!isSNavbarVisible);
    };

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are You Sure You Want to Sign Out?");
        if (confirmLogout) {
            try {
                const response = await post(account_logout, true);
                const data = await response.json();

                if (data.status === false) {
                    alert(data.message);
                } else {
                    localStorage.removeItem("authtoken");
                    localStorage.removeItem("userDatamain");
                    localStorage.removeItem("lastActivityTime");
                    sessionStorage.removeItem("userData");
                    alert(data.msg);
                    navigate("/");
                    window.location.reload();


                }
            } catch (error) {
                alert("Sign Out Failed. Please Try Again.");
            }
        }
    };


    return (<div className="mobile-nav__container">
        <ul className="main-menu__list">
            <li>
                <NavLink exact to="/" activeClassName="active" onClick={() => {
                    closeSNavbar();
                }}>
                    <FaHome className="menu-icon" /> HOME
                </NavLink>
            </li>
            <li>
                <NavLink to={data ? "/flight-listing" : "/login"} activeClassName="active" onClick={() => {
                    closeSNavbar();
                }}>
                    <FaPlane className="menu-icon" /> FLIGHTS
                </NavLink>
            </li>

            {/* {
                data && data.type == 2 && (
                    <>
                        <li><NavLink to={data ? "/Series-flight-listing" : "/login"} activeClassName="active" onClick={() => {
                            closeSNavbar();
                        }}>
                            <FaPlane />
                            SERIES FLIGHTS
                        </NavLink>
                        </li>
                    </>
                )
            } */}

            <li>
                <NavLink to={data ? "/visa" : "/login"} activeClassName="active" onClick={() => {
                    closeSNavbar();
                }}>
                    <FaPassport className="menu-icon" /> VISA
                </NavLink>
            </li>
            <li>
                <NavLink to={data ? "/oktb" : "/login"} activeClassName="active" onClick={() => {
                    closeSNavbar();
                }}>
                    <FaClipboardCheck className="menu-icon" /> OK TO BOARD
                </NavLink>
            </li>

            <li>
                <NavLink to="/about-us" activeClassName="active" onClick={() => {
                    closeSNavbar();
                }}>
                    <FaInfoCircle className="menu-icon" /> ABOUT
                </NavLink>
            </li>
            <li>
                <NavLink to="/Contact-us" activeClassName="active" onClick={() => {
                    closeSNavbar();
                }}>
                    <FaPhoneAlt className="menu-icon" /> CONTACT
                </NavLink>
            </li>

            {
                !data && (
                    <>
                        <li>
                            <NavLink to="/login" onClick={() => {
                                closeSNavbar();
                            }}>
                                <FaSignInAlt className="menu-icon" /> SIGN IN
                            </NavLink>
                        </li>
                    </>
                )
            }






            {data && <li>
                <NavLink to="/user/profile-main" activeClassName="active" onClick={() => {
                    closeSNavbar();
                }}>
                    <FaUserCircle className="menu-icon" /> PROFILE
                </NavLink>
            </li>}
            {data && <li>
                <NavLink class="inactive" onClick={() => {
                    handleLogout();
                    closeSNavbar();
                }}>
                    <FaSignOutAlt className="menu-icon" /> SIGN OUT
                </NavLink>
            </li>}
        </ul>
    </div>);
}


const LogoBox = () => (
    <div className="logo-box">
        <Link to="/" aria-label="logo image">
            <img src="assets/media/logo.png" alt="" className="invisible" />
        </Link>
    </div>
);

// const MobileNavContainer = ({closeSNavbar}) => (
//     <MainMenuList />
// );

const MobileNavContact = ({ setting }) => (
    <ul className="mobile-nav__contact list-unstyled">
        <li>
            <i className="fas fa-envelope"></i>
            <a href={`mailto:${setting.support_email}`}>{setting.support_email}</a>
        </li>
        <li>
            <i className="fa fa-phone-alt"></i>
            <a href={`tel:${setting.support_no}`}>{setting.support_no}</a>
        </li>
    </ul>
);

const MobileNavWrapper = ({ isSNavbarActive, setting, closeSNavbar }) => (
    <div className={`mobile-nav__wrapper ${isSNavbarActive ? "expanded" : ""}`}>
        {/* <CloseButton /> */}
        <div className="mobile-nav__overlay mobile-nav__toggler"></div>
        <div className="mobile-nav__content">
            <LogoBox />
            <MainMenuList closeSNavbar={closeSNavbar} />
            {setting && <MobileNavContact setting={setting} />}
        </div>
    </div>
);

export default MobileNavWrapper;

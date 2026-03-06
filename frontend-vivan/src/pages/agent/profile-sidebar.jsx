import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
// import './ProfileSidebarWidget.css';  
import { get } from "../../API/apiHelper";
import { users_profile, IMAGE_BASE_URL } from "../../API/endpoints";
import profileimage from "../../assets/images/profile.png";





const ProfileSidebarWidget = () => {
    const [userData, setUserData] = useState(null);
    const [profilePreview, setProfilePreview] = useState(profileimage); // Image preview state

    useEffect(() => {
        const userDataFromSession = sessionStorage.getItem('userData');
        if (userDataFromSession && userDataFromSession !== null) {
            const userData = JSON.parse(userDataFromSession);
            setUserData(userData.model);
        }
    }, []);

    const [formData, setFormData] = useState(null);
    const fetchUserData = async () => {
        try {
            const response = await get(users_profile, true);
            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(`Error ${response.status}: ${errorMsg}`);
            }
            const data = await response.json();

            setFormData(data.data);
            setProfilePreview(`${IMAGE_BASE_URL}${data.data.profile_photo}` || profileimage);

        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="col-xl-3 col-lg-4">
            <div className="sbcstmcls d-none d-lg-block">
                <div className="bg-light w-100 card">
                    <div className="p-3 card-body">
                        <div className="text-center mb-3">
                            <div className="avatar avatar-xl mb-2">
                                <img
                                    src={profilePreview}
                                    className="avatar-img rounded-circle border border-2 border-white"
                                    alt="User Avatar"
                                />
                            </div>
                            <h4 className="mb-0">{formData?.name || 'Guest'}</h4>
                            <NavLink className="text-reset text-primary-hover small" to="/agent-profile">
                                {formData?.email || 'guest@example.com'}
                            </NavLink>
                            <hr className="bg-light-gray mt-16 mb-16" />
                        </div>
                        <ul className="nav nav-pills-primary-soft flex-column">

                            <li className="nav-item">
                                <NavLink className="nav-link items-center" to="/user/profile-main" activeClassName="active">
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon me-2" width="20" height="20">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M5 20c0-7 14-7 14 0v1H5v-1z" />
                                    </svg> */}
                                    <i className="fas fa-user fa-fw me-2"></i>
                                    My Profile
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link items-center" to="/user/my-bookings" activeClassName="active">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon me-2" width="20" height="20" >

                                        <rect x="3" y="7" width="18" height="12" rx="3" ry="3" fill="#ffffff" stroke="currentColor"></rect>
                                        <path d="M3 7h18"></path>
                                        <path d="M6 3v4M18 3v4" stroke="currentColor"></path>

                                        <path d="M9 12l2 2 4-4" stroke="currentColor" fill="none"></path>
                                    </svg>
                                    My Bookings
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link items-center" to="/user/wallet-history" activeClassName="active">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon wallet-history-icon me-2" width="20" height="20" >
                                        <rect x="2" y="2" width="20" height="20" rx="3" ry="3"></rect>
                                        <path d="M5 8h10a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"></path>
                                        <circle cx="16" cy="12" r="3"></circle>
                                        <path d="M16 10v2l1 1"></path>
                                    </svg>
                                    Wallet History
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link items-center" to="/visa-status" activeClassName="active">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-check me-2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <path d="M9 15l2 2 4-4"></path>
                                    </svg>
                                    Applied Visa History
                                </NavLink>
                            </li>


                            <li className="nav-item">
                                <NavLink className="nav-link items-center" to="/otb-status" activeClassName="active">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-check me-2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <path d="M9 15l2 2 4-4"></path>
                                    </svg>
                                    Applied OTB History
                                </NavLink>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebarWidget;

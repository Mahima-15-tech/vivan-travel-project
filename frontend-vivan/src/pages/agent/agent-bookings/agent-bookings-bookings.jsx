import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileSidebarWidget from '../profile-sidebar'
import '../../../component/nav-profile/nav-profile.css'
import '../agent-profile/profile-main.css'
import './my-bookings.css'
import { ToastContainer, toast } from "react-toastify";
// import { FaPlane } from 'font';
import BookingWidget from './booking-component/upcoming-booking'
import MenuIcons from '../menu-icons';


const ProfileMain = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userDataFromSession = sessionStorage.getItem('userData');
        if (userDataFromSession && userDataFromSession != null) {
            const userData = JSON.parse(userDataFromSession);
            setUserData(userData.model);
        } else {
            navigate("/");
        }
    }, []);

    // Tabs js 
    const [activeTab, setActiveTab] = useState('upcoming');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };



    const bookings = [
        {
            title: 'France to New York',
            bookingID: 'CGDSUAHA12548',
            type: 'Business class',
            timeDetails: {
                departure: 'Tue 05 Aug 12:00 AM',
                arrival: 'Tue 06 Aug 4:00 PM'
            },
            bookedBy: 'Frances Guerrero',
            isFlight: true
        },
        {
            title: 'Chicago to San Antonio',
            bookingID: 'CGDSUAHA12548',
            type: 'Camry, Accord',
            addressDetails: {
                pickup: '40764 Winchester Rd',
                drop: '11185 Mary Ball Rd'
            },
            bookedBy: 'Frances Guerrero',
            isFlight: false
        }
    ];




    return (
        <section className="pt-3 pb-5">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="container">
                <div className="row">
                    {/* <div className="col-xl-3 col-lg-4">
                        <div className="d-none d-lg-block">
                            <div className="bg-light w-100 card">
                                <div className="position-absolute top-0 end-0 p-3">
                                    <span>
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                                        </svg>
                                    </span>
                                </div>
                                <div className="p-3 card-body">
                                    <div className="text-center mb-3">
                                        <div className="avatar avatar-xl mb-2">
                                            <img
                                                src="https://miro.medium.com/v2/resize:fit:640/1*3yBOGvRJfYD8KB6RGd3ljg.png"
                                                className="avatar-img rounded-circle border border-2 border-white"
                                                alt="User Avatar"
                                            />
                                        </div>
                                        {console.log(userData)}
                                        <h4 className="mb-0">{userData?.name || ''}</h4>
                                        <Link className="text-reset text-primary-hover small" to="/user/profile-main">
                                            {userData?.email || ''}
                                        </Link>
                                        <hr className="bg-light-gray mt-16 mb-16" />
                                    </div>
                                    <ul className="nav nav-pills-primary-soft flex-column">
                                        <li className="nav-item">
                                            <Link className="nav-link items-center" to="/user/profile-main">
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="fa-fw me-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
                                                </svg>
                                                My Profile
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link items-center active" to="/user/my-bookings">
                                                <svg
                                                    stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="fa-fw me-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4 4.85v.9h1v-.9H4Zm7 0v.9h1v-.9h-1Zm-7 1.8v.9h1v-.9H4Zm7 0v.9h1v-.9h-1Zm-7 1.8v.9h1v-.9H4Zm7 0v.9h1v-.9h-1Zm-7 1.8v.9h1v-.9H4Zm7 0v.9h1v-.9h-1Z"></path>
                                                    <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3h-13ZM1 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1.05a2.5 2.5 0 0 0 0 4.9v1.05a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1.05a2.5 2.5 0 0 0 0-4.9V4.5Z"></path>
                                                </svg>
                                                My Bookings
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link items-center" to="/user/travelers">
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="fa-fw me-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.72C2.312 10.629 3.282 10 5 10c.304 0 .606.034.9.09A5.97 5.97 0 0 0 4.92 10Zm1.564-1.5c.39-.59.813-1.159 1.312-1.646a6.363 6.363 0 0 1 .822-.646A5.976 5.976 0 0 0 5.2 8c-2.98 0-4.32 2-5 3a.5.5 0 0 0 .17.687c.03.013.063.021.095.021h4.133Z"></path>
                                                </svg>
                                                My Travelers
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link items-center" to="/user/invoices">
                                                <svg
                                                    stroke="currentColor"
                                                    fill="currentColor"
                                                    strokeWidth="0"
                                                    viewBox="0 0 16 16"
                                                    className="fa-fw me-2"
                                                    height="1em"
                                                    width="1em"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M9 0H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7l-4-4ZM5 1h4l4 4v1H3V2a1 1 0 0 1 1-1Zm5 14H5a1 1 0 0 1-1-1v-1h8v1a1 1 0 0 1-1 1Zm-5-3h4a.5.5 0 0 0 0-1H5a.5.5 0 0 0 0 1Z"></path>
                                                </svg>
                                                My Invoices
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <ProfileSidebarWidget />
                    <div className="col-xl-9 col-lg-8">
                        <MenuIcons />

                        <div className="vstack gap-4">
                            <div className="border bg-transparent card">
                                <div className="bg-transparent border-bottom card-header">
                                    <h3 className="card-header-title">My Bookings</h3>
                                </div>
                                <div className="p-0 card-body">
                                    {/* Tab Navigation */}
                                    <div className="nav nav-tabs nav-bottom-line nav-responsive nav-justified" role="tablist">
                                        <div className="nav-item">
                                            <button
                                                role="tab"
                                                className={`mb-0 flex-centered nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
                                                onClick={() => handleTabClick('upcoming')}
                                            >
                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class=" fa-fw me-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5z"></path><path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85v5.65z"></path></svg> Upcoming Booking
                                            </button>
                                        </div>
                                        <div className="nav-item">
                                            <button
                                                role="tab"
                                                className={`mb-0 flex-centered nav-link ${activeTab === 'canceled' ? 'active' : ''}`}
                                                onClick={() => handleTabClick('canceled')}
                                            >
                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class=" fa-fw me-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"></path><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path></svg>
                                                {/* <FaPlane className="me-1" />  */}
                                                Canceled Booking
                                            </button>
                                        </div>
                                        <div className="nav-item">
                                            <button
                                                role="tab"
                                                className={`mb-0 flex-centered nav-link ${activeTab === 'completed' ? 'active' : ''}`}
                                                onClick={() => handleTabClick('completed')}
                                            >
                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class=" fa-fw me-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"></path><path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z"></path></svg>
                                                Completed Booking
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tab Content */}
                                    <div className="p-2 p-sm-4 tab-content">
                                        {activeTab === 'upcoming' && (
                                            <div role="tabpanel" className="fade tab-pane active show">
                                                <h5 className='mb-2'>Completed booking ({bookings.length})</h5>
                                                {bookings.map((booking, index) => (
                                                    <BookingWidget key={index} {...booking} />
                                                ))}
                                            </div>
                                        )}
                                        {activeTab === 'canceled' && (
                                            <div role="tabpanel" className="tab-pane active show">
                                                <h6>Canceled bookings</h6>
                                                {/* Canceled bookings content */}
                                                {/* Replace this comment with your canceled bookings JSX code */}
                                            </div>
                                        )}
                                        {activeTab === 'completed' && (
                                            <div role="tabpanel" className="tab-pane active show">
                                                <h6>Completed bookings</h6>
                                                {/* Completed bookings content */}
                                                {/* Replace this comment with your completed bookings JSX code */}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileMain;

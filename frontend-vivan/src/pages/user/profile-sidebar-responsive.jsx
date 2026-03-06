import React, { useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileSidebarWidget from './profile-sidebar'

const OffCanvasSidebar = ({ isUserSidebarVisible, closeUserSidebar }) => {
    const [show, setShow] = useState(false);

    const toggleOffCanvas = () => {
        setShow(!show);
    };

    return (
        <>
            {/* <div className={`fade offcanvas-backdrop ${isUserSidebarVisible} ? 'show' : ''}`}></div> */}
            <div className={`profile-sidbar ${isUserSidebarVisible ? 'd-block' : 'd-none'}`}>
                <div className="fade offcanvas-backdrop show"></div>
                <div className="pro-sid">
                    <div className="removeicns justify-content-end pb-2">
                        {/* Close button triggers closeUserSidebar */}
                        <button type="button" className="btn-close" onClick={closeUserSidebar}></button>
                    </div>
                    <div className="p-3 p-lg-0 offcanvas-body">
                        <div className="bg-light w-100 card">
                            <ProfileSidebarWidget />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OffCanvasSidebar;

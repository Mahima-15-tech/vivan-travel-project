import React from "react";
import TitleBanner from '../visa/title-bans'
import { ToastContainer } from "react-toastify";
import VisafFor from '../visa/visa-f'
import VisaList from '../visa/visa-list/visa-list'
import MenuIcons from '../menu-icons';
import '../visa/visa.css'
import { Link, useNavigate } from "react-router-dom";

// const VisaApplys = () => (
//     // <button className="wallet-hbtn">
//     //     <div className="">
//     //         <label className="font-medium hover:cursor-pointer">
//     //             <div className="d-flex align-items-center gap-2">
//     //                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-check">
//     //                     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path> <polyline points="14 2 14 8 20 8"></polyline> <path d="M9 15l2 2 4-4"></path>
//     //                 </svg>
//     //                 Applied Visa Status
//     //             </div>
//     //         </label>
//     //     </div>
//     // </button>
//     <Link to='/visa/visa-status' className="wallet-hbtn">
//         <div className="">
//             <label className="font-medium hover:cursor-pointer">
//                 <div className="d-flex align-items-center gap-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-check">
//                         <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path> <polyline points="14 2 14 8 20 8"></polyline> <path d="M9 15l2 2 4-4"></path>
//                     </svg>
//                     Applied Visa Status
//                 </div>
//             </label>
//         </div>
//     </Link>
// );

const VisaApplication = () => {
    const navigate = useNavigate();

    const userDataFromSession = sessionStorage.getItem("userData");
    if (!userDataFromSession) {
      navigate("/login");
    }
    return (

        <>

            <TitleBanner />
            <section className="pt-3 pb-5" style={{ minHeight: 'calc(100vh - 436px)' }}>
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
                        <div className="col-xl-12 col-lg-12 m-auto">
                            <MenuIcons />

                            <div className="vstack gap-4">
                                <div className="border card">
                                    <div className="border-bottom card-header d-flex justify-content-between align-items-center">
                                        <h3 className="card-header-title">Visa Apply</h3>
                                        {/* <VisaApplys /> */}
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="position-relative max-w-screen-lg rounded-br-5 p-5 visa-fr">
                                            <VisafFor />
                                        </div>
                                    </div>
                                    <div className="card-body p-0 visa-list">
                                        <VisaList />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >

            </section >
        </>
    );
};

export default VisaApplication;








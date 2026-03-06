import React, { useState } from 'react';
import ProfileSidebarWidget from '../profile-sidebar'
import '../wallet-history/wallet-history.css'
import { ToastContainer, toast } from "react-toastify";
import WalletPopup from '../wallet-history/wallet-popup'
import MenuIcons from '../menu-icons';
const OrderWidget = () => {

    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);


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
                    <ProfileSidebarWidget />
                    <div className="col-xl-9 col-lg-8">
                        <MenuIcons />
                        <div className="vstack gap-4">
                            <div className="border card">
                                <div className="border-bottom card-header">
                                    <h3 className="card-header-title">Wallet History</h3>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th scope="col">Details</th>
                                                    <th scope="col">Source</th>
                                                    <th scope="col">Order</th>
                                                    <th scope="col" className="text-end">Amount</th>
                                                    <th scope="col" className="text-end">Balance</th>
                                                    <th scope="col" className="text-center">Status</th>
                                                    <th scope="col" className="text-center">View</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Example Order Row */}
                                                <tr>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="vtt-type-icon bg-success-dim text-success p-2 rounded-circle me-3">
                                                                <i class="fa fa-long-arrow-up rotate-45"></i>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 fw-bold">Deposited Funds</p>
                                                                <small className="text-muted">18/10/2019 12:04 PM</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">Using PayPal Account</p>
                                                        <small className="text-muted">mypay*****com</small>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">YWLX52JG73</p>
                                                        <span class="badge-dot text-success">Deposit</span>
                                                    </td>
                                                    <td className="text-end">
                                                        <p className="mb-0">+ 0.010201 <span>BTC</span></p>
                                                        <small className="text-muted">1290.49 USD</small>
                                                    </td>
                                                    <td className="text-end">
                                                        <p className="mb-0">1.30910201 <span>BTC</span></p>
                                                        <small className="text-muted">101290.49 USD</small>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge bg-success">Completed</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="btn-group">
                                                            <button type="button" className="btn btn-outline-primary btn-sm bg-white btn btn-sm btn-outline-light btn-icon btn-tooltip text-black"
                                                                data-bs-toggle="tooltip" data-bs-placement="top" title="View Details" onClick={handleShow}>
                                                                <i className="fa fa-eye" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="vtt-type-icon bg-danger-dim text-danger p-2 rounded-circle me-3">
                                                                <i class="fa fa-arrow-up rotate-45"></i>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 fw-bold">Deposited Funds</p>
                                                                <small className="text-muted">18/10/2019 12:04 PM</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">Using PayPal Account</p>
                                                        <small className="text-muted">mypay*****com</small>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">YWLX52JG73</p>
                                                        <span class="badge-dot text-danger">Deposit</span>
                                                    </td>
                                                    <td className="text-end">
                                                        <p className="mb-0">+ 0.010201 <span>BTC</span></p>
                                                        <small className="text-muted">1290.49 USD</small>
                                                    </td>
                                                    <td className="text-end">
                                                        <p className="mb-0">1.30910201 <span>BTC</span></p>
                                                        <small className="text-muted">101290.49 USD</small>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge bg-danger">Canceled</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="btn-group">

                                                            <button type="button" className="btn btn-outline-primary btn-sm bg-white btn btn-sm btn-outline-light btn-icon btn-tooltip text-black"
                                                                data-bs-toggle="tooltip" data-bs-placement="top" title="View Details">
                                                                <i className="fa fa-eye" />
                                                            </button>


                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="vtt-type-icon bg-warning-dim text-warning p-2 rounded-circle me-3">
                                                                <i class="fa fa-arrow-up rotate-45"></i>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 fw-bold">Deposited Funds</p>
                                                                <small className="text-muted">18/10/2019 12:04 PM</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">Using PayPal Account</p>
                                                        <small className="text-muted">mypay*****com</small>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">YWLX52JG73</p>
                                                        <span class="badge-dot text-warning">Deposit</span>
                                                    </td>
                                                    <td className="text-end">
                                                        <p className="mb-0">+ 0.010201 <span>BTC</span></p>
                                                        <small className="text-muted">1290.49 USD</small>
                                                    </td>
                                                    <td className="text-end">
                                                        <p className="mb-0">1.30910201 <span>BTC</span></p>
                                                        <small className="text-muted">101290.49 USD</small>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge bg-warning">Pending</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="btn-group">
                                                            <button type="button" className="btn btn-outline-primary btn-sm bg-white btn btn-sm btn-outline-light btn-icon btn-tooltip text-black"
                                                                data-bs-toggle="tooltip" data-bs-placement="top" title="View Details">
                                                                <i className="fa fa-eye" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* Repeat rows for more orders */}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <WalletPopup show={showModal} handleClose={handleClose} />
        </section >



    );
};

export default OrderWidget;

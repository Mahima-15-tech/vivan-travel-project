import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSidebarWidget from '../profile-sidebar';
import MenuIcons from '../menu-icons';
import { post } from "../../../API/apiHelper";
import { Series_Booking_list, booking_cancle } from "../../../API/endpoints";
import { ToastContainer, toast } from "react-toastify";
import '../../user/my-bookings/my-bookings.css'
import { Modal } from 'react-bootstrap';
import Ticket_Details from '../../../widget/air_iq_ticket_details';


const Series_booking_list = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [bookings, setDetails] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [cancelReason, setCancelReason] = useState('');
    const [Upiid, setUpiid] = useState(null);


    useEffect(() => {
        const userDataFromSession = sessionStorage.getItem('userData');
        if (userDataFromSession) {
            const userData = JSON.parse(userDataFromSession);
            setUserData(userData.model);
        } else {
            navigate("/login");
        }
    }, []);

    const fetchDetails = async (page = 1) => {
        try {
            const response = await post(Series_Booking_list, { user_id: userData.id, page: page.toString(), limit: '5' }, true);
            if (response.ok) {
                const data = await response.json();
                setDetails(data.data);
                setPagination(data.pagination);
                setTotalPages(data.pagination.totalPages); // assuming total pages are within pagination data
                setCurrentPage(page);
            } else {
                console.error('Failed To List');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchDetails();
        }
    }, [userData]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            fetchDetails(newPage);
        }
    };

    // Generate array for pages based on totalPages
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    const [showModal, setShowModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const [selectedBooking, setSelectedBooking] = useState(null);
    const toggleModal = (booking) => {
        setSelectedBooking(booking);
        setShowModal(!showModal);
    };


    const [selectedCancelBooking, setCancelBooking] = useState(null);
    const [Paying_method, setpaying_method] = useState(null);

    const toggleCancelModal = (booking = null, paying_method) => {
        setCancelBooking(booking);
        setpaying_method(paying_method);
        setShowCancelModal(!showCancelModal);
    };


    const handleCancelBooking = async ({ cancelReason }) => {

        try {
            if (!cancelReason.trim()) {
                toast.error('Please provide a reason for cancellation.');
                return;
            }

            if (Paying_method == 'Rezorpay') {
                if (!Upiid) {
                    toast.error('Please enter UPI ID');
                    return;
                }
            }

            const info = {
                Booking_RefNo: selectedCancelBooking,
                description: cancelReason,
                upi: (Upiid) ? (Upiid) : null,
                type: (Upiid) ? 'Online' : 'Wallet',
                // amount: data.Amount,
                user_id: userData.id,
                cancel_api_type: 'Airiq',
            }

            const response = await post(booking_cancle, info, true); // Replace with actual endpoint
            if (response.ok) {
                toast.success('Booking cancelled successfully.');
                setShowCancelModal(false);
            } else {
                toast.error('Failed to cancel booking.');
            }

        } catch (error) {
            console.error('Cancellation error:', error.message);
            alert('An error occurred during cancellation.');
        }
    };


    return (
        <section className="pt-3 pb-5">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} theme="light" />
            <div className="container">
                <div className="row">
                    <ProfileSidebarWidget />
                    <div className="col-xl-9 col-lg-8">
                        <MenuIcons />
                        <div className="vstack gap-4">
                            <div className="border bg-transparent card">
                                <div className="bg-transparent border-bottom card-header">
                                    <h3 className="card-header-title">My Series Bookings ({pagination?.totallist || 0})</h3>
                                </div>
                                <div className="p-0 card-body">
                                    <div className="p-2 p-sm-4 tab-content">
                                        <div role="tabpanel" className="fade tab-pane active show">
                                            <div className="border-0 mb-4 card">


                                                <div className="table-responsive">
                                                    <table className="table table-bordered table-striped m-0">
                                                        <thead className="thead-dark">
                                                            <tr>

                                                                <th>Booking Ref No</th>
                                                                <th>Passanger</th>
                                                                <th>Amount</th>
                                                                <th>Status</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {bookings.map((booking, index) => (
                                                                <tr>


                                                                    <td>{(booking.Agency_RefNo != null && booking.Agency_RefNo) ? booking.Agency_RefNo : 'N/A'}</td>
                                                                    <td>
                                                                        {JSON.parse(booking.PAX_Details).map((item, i) => (
                                                                            <div key={i}>
                                                                                {item.title} {item.firstName} {item.lastName}
                                                                                {item.dateOfBirth && ` (DOB: ${item.dateOfBirth})`}
                                                                            </div>
                                                                        ))}
                                                                    </td>
                                                                    <td>
                                                                        ₹{booking.Amount}
                                                                    </td>
                                                                    <td>
                                                                        {booking.status}
                                                                    </td>
                                                                    <td>
                                                                        <div className="action-buttons d-flex gap-2">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-primary btn-sm"
                                                                                onClick={() => toggleModal(booking.booking_id)}
                                                                            >
                                                                                <i className="fa fa-ticket m-1"></i> <span className="button-text">Show Ticket</span>
                                                                            </button>

                                                                            {booking.status !== "cancelled completed" && (
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-danger btn-sm"
                                                                                    onClick={() => toggleCancelModal(booking.booking_id, booking.paying_method)}>

                                                                                    <i className="fa fa-times-circle m-1"></i>{' '}
                                                                                    <span className="button-text">Cancel Ticket</span>
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody >
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Show Ticket Modal */}
                                    <Modal show={showModal} onHide={toggleModal} size="xl" backdrop="static">
                                        <Modal.Header closeButton>
                                            <Modal.Title>Ticket Details</Modal.Title>
                                        </Modal.Header>
                                        <Ticket_Details reference_id={selectedBooking} />
                                    </Modal>

                                    <Modal show={showCancelModal} onHide={toggleCancelModal} backdrop="static">
                                        <Modal.Header closeButton>
                                            <Modal.Title>Cancel Booking</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <p>Are you sure you want to cancel this booking?</p>
                                            <br />

                                            <div className="mb-3">
                                                <label htmlFor="cancelReason" className="form-label">Cancellation Reason</label>
                                                <textarea
                                                    id="cancelReason"
                                                    className="form-control"
                                                    placeholder="Please provide a reason for cancellation (optional)"
                                                    rows="2"
                                                    value={cancelReason}
                                                    onChange={(e) => setCancelReason(e.target.value)}
                                                ></textarea>
                                            </div>

                                            {
                                                (Paying_method == 'Rezorpay') ? (
                                                    <>
                                                        <div className="mb-3">
                                                            <label htmlFor="cancelReason" className="form-label">Enter UPI ID To Receving Payment</label>
                                                            <input
                                                                type="text"
                                                                name="uipid"
                                                                onChange={(e) => setUpiid(e.target.value)}
                                                                placeholder="Enter UPI ID here"
                                                                className="form-control wizard-required"
                                                                required
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="mb-3">
                                                            <h4>Amount will be  receive in your wallet after cancel process</h4>
                                                        </div>
                                                    </>
                                                )
                                            }

                                        </Modal.Body>
                                        <Modal.Footer>
                                            <button type="button" className="btn btn-secondary" onClick={toggleCancelModal}>
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => handleCancelBooking({ cancelReason })}
                                            >
                                                Confirm Cancel
                                            </button>
                                        </Modal.Footer>
                                    </Modal>



                                    <div className="table-responsive mt-4">
                                        <div className="px-4 d-flex justify-content-lg-end">
                                            <nav>
                                                <ul className="pagination">
                                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                            disabled={currentPage === 1}>
                                                            ‹
                                                        </button>
                                                    </li>
                                                    {pages.map((page) => (
                                                        <li
                                                            key={page}
                                                            className={`page-item ${page === currentPage ? "active" : ""}`}
                                                            aria-current={page === currentPage ? "page" : null}>
                                                            {page === currentPage ? (
                                                                <span className="page-link">{page}</span>
                                                            ) : (
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => handlePageChange(page)}
                                                                >
                                                                    {page}
                                                                </button>
                                                            )}
                                                        </li>
                                                    ))}
                                                    <li
                                                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}
                                                            disabled={currentPage === totalPages}>
                                                            ›
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
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

export default Series_booking_list;

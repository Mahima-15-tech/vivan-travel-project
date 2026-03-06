import React, { useState, useEffect } from 'react';
import ProfileSidebarWidget from '../profile-sidebar'
import '../wallet-history/wallet-history.css'
import { ToastContainer, toast } from "react-toastify";
import WalletPopup from '../wallet-history/wallet-popup'
import MenuIcons from '../menu-icons';
import { post } from "../../../API/apiHelper";
import { wallet_list } from "../../../API/endpoints";
import { useNavigate } from "react-router-dom";


const OrderWidget = () => {

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);


    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setDetails] = useState([]);

    useEffect(() => {
        const userDataFromSession = sessionStorage.getItem('userData');
        if (userDataFromSession && userDataFromSession != null) {
          const userData = JSON.parse(userDataFromSession);
          setUserData(userData.model);
        } else {
          navigate("/login");
        }
    }, []);

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const response = await post(wallet_list, { user_id: userData.id, page: '1', limit: '50' }, true);
            if (response.ok) {
                const data = await response.json();
                setDetails(data.data);
            } else {
                console.error('Failed to list');
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchDetails();
        }
    }, [userData]);


    const formatDate = (dateString) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        const date = new Date(dateString);
        return date.toLocaleString('en-US', options);
    };


    const handlePageChangeWalleth = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            fetchDetails(newPage);
        }
    };

    // Generate array for pages based on totalPages
    const pagesWalleth = Array.from({ length: totalPages }, (_, index) => index + 1);




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
                      <table className="table table-hover tab">
                        <thead className="table-light">
                          <tr>
                            <th className="text-center" scope="col">
                              Date Time
                            </th>
                            <th className="text-center" scope="col">
                              Payment Method
                            </th>
                            <th className="text-center" scope="col">
                              Order
                            </th>
                            <th className="text-center" scope="col">
                              Amount
                            </th>
                            <th className="text-center" scope="col">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Example Order Row */}

                          {history.map((list, index) => (
                            <tr>
                              <td className="text-center">
                                <div className="d-flex align-items-center">
                                  <div
                                    className={`vtt-type-icon ${
                                      list.type == 1
                                        ? "bg-success-dim text-success"
                                        : "bg-danger-dim text-danger"
                                    } p-2 rounded-circle me-3`}
                                  >
                                    <i class="fa fa-long-arrow-up rotate-45"></i>
                                  </div>
                                  <div>
                                    <small className="text-muted">
                                      {formatDate(list.createdAt)}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center">
                                <p className="mb-0">
                                  {list.payment_getway === "Rezorpay"
                                    ? "Online"
                                    : list.payment_getway}{" "}
                                  -{" "}
                                  <span
                                    class={`${
                                      list.type == 1
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {list.type == 1 ? "Credit" : "Debit"}
                                  </span>
                                </p>
                              </td>
                              <td className="text-center">
                                <p className="mb-0">{list.order_id}</p>
                              </td>
                              <td className="text-center">
                                <small className="text-muted">
                                  {new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: userData.currency_code,
                                    minimumFractionDigits: 2,
                                  }).format(list.amount)}
                                </small>
                              </td>

                              <td className="text-center">
                                <small className="text-muted">
                                  {list.transaction_type}
                                </small>
                              </td>
                            </tr>
                          ))}

                          {/* <tr>
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
                                                </tr> */}
                          {/* Repeat rows for more orders */}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="table-responsive mt-4">
                      <div className="px-4 d-flex justify-content-lg-end">
                        <nav>
                          <ul className="pagination">
                            <li
                              className={`page-item ${
                                currentPage === 1 ? "disabled" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() =>
                                  handlePageChangeWalleth(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                              >
                                ‹
                              </button>
                            </li>
                            {pagesWalleth.map((page) => (
                              <li
                                key={page}
                                className={`page-item ${
                                  page === currentPage ? "active" : ""
                                }`}
                                aria-current={
                                  page === currentPage ? "page" : null
                                }
                              >
                                {page === currentPage ? (
                                  <span className="page-link">{page}</span>
                                ) : (
                                  <button
                                    className="page-link"
                                    onClick={() =>
                                      handlePageChangeWalleth(page)
                                    }
                                  >
                                    {page}
                                  </button>
                                )}
                              </li>
                            ))}
                            <li
                              className={`page-item ${
                                currentPage === totalPages ? "disabled" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() =>
                                  handlePageChangeWalleth(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                              >
                                ›
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                    {/* End of Pagination */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <WalletPopup show={showModal} handleClose={handleClose} />
      </section>
    );
};

export default OrderWidget;

import React, { useState, useEffect } from 'react';
import ProfileSidebarWidget from './profile-sidebar'
import './wallet-history/wallet-history.css'
import { ToastContainer, toast } from "react-toastify";
import WalletPopup from './wallet-history/wallet-popup'
import MenuIcons from './menu-icons';
import { post } from "../../API/apiHelper";
import { wallet_list } from "../../API/endpoints";


const Commission_history = () => {

    const [showModal, setShowModal] = useState(false);
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
                        </tbody>
                      </table>
                    </div>
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

export default Commission_history;

import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import ProfileSidebarWidget from '../../profile-sidebar';
import { ToastContainer, toast } from "react-toastify";
import MenuIcons from '../../menu-icons';
import '../../../flight-listing/booking-area-listing.css';
import './visa-status.css';
import { post } from "../../../../API/apiHelper";
import { applied_visa_list } from "../../../../API/endpoints";
import { Link } from 'react-router-dom';

const CheckCircleFillIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-success" >
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path d="M8 12l1 4 8-8" stroke="#fff" />
    </svg>
);

const StatusIndicator = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#198754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-success" >
        <circle cx="12" cy="12" r="10" fill="#dedfe3" />
        <path d="M8 12l1 4 8-8" stroke="transparent" />
    </svg>
);

const StatusIndicatorNext = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#dedfe3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-success" >
        <circle cx="12" cy="12" r="10" fill="#dedfe3" />
        <path d="M8 12l1 4 8-8" stroke="transparent" />
    </svg>
);

const VerticalLine = () => (
    <div aria-hidden="true" className="position-absolute" style={{ top: '50%', left: '8px', height: '100%', width: '0.125rem', backgroundColor: '#E5E7EB', }}></div>
);

const VisaStatus = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [visaData, setDetails] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userDataFromSession = sessionStorage.getItem('userData');
        if (userDataFromSession) {
            const userData = JSON.parse(userDataFromSession);
            setUserData(userData.model);
        }
    }, []);

    const handleTabClick = (tab) => setActiveTab(tab);

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const response = await post(applied_visa_list, { id: userData.id, page: '1', limit: '10' }, true);
            if (response.ok) {
                const data = await response.json();
                setDetails(data.data);
            } else {
                console.error('Failed to fetch visa details');
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

    const filteredData = visaData && activeTab === 'all'
        ? visaData
        : visaData.filter(item => item.status.toLowerCase() === activeTab.toLowerCase());

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
      <section
        className="pt-3 pb-5"
        style={{ minHeight: "calc(100vh - 436px)" }}
      >
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
              <ul className="nav nav-tabs border-0 mb-24 w-100">
                <li className="nav-item col-4">
                  <Button
                    variant={
                      activeTab === "all" ? "primary" : "outline-primary"
                    }
                    className={`cus-btn primary-light primary ${
                      activeTab === "all" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("all")}
                  >
                    All
                  </Button>
                </li>
                <li className="nav-item col-4">
                  <Button
                    variant={
                      activeTab === "approved" ? "primary" : "outline-primary"
                    }
                    className={`cus-btn primary-light primary ${
                      activeTab === "approved" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("approved")}
                  >
                    Approved
                  </Button>
                </li>
                <li className="nav-item col-4">
                  <Button
                    variant={
                      activeTab === "Pending" ? "primary" : "outline-primary"
                    }
                    className={`cus-btn primary-light primary ${
                      activeTab === "Pending" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("Pending")}
                  >
                    Pending
                  </Button>
                </li>
              </ul>
              {filteredData.length > 0 ? (
                filteredData.map((visa) => (
                  <div key={visa.id} className="visa-stats card my-4">
                    <div className="vs-name">
                      <svg
                        fill="none"
                        height="18"
                        viewBox="0 0 18 18"
                        width="18"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                      >
                        <path
                          d="M3.79297 13.9416C3.79297 12.0639 5.3152 10.5416 7.19297 10.5416H11.7263C13.6041 10.5416 15.1263 12.0639 15.1263 13.9416V13.9416C15.1263 15.1935 14.1115 16.2083 12.8596 16.2083H6.05963C4.80779 16.2083 3.79297 15.1935 3.79297 13.9416V13.9416Z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M12.293 4.87496C12.293 6.43977 11.0244 7.70829 9.45964 7.70829C7.89483 7.70829 6.6263 6.43977 6.6263 4.87496C6.6263 3.31015 7.89483 2.04163 9.45964 2.04163C11.0244 2.04163 12.293 3.31015 12.293 4.87496Z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <span>
                        Visa{" "}
                        {visa.status.charAt(0).toUpperCase() +
                          visa.status.slice(1)}
                      </span>
                    </div>
                    <div className="card-body row">
                      <div className="col-xl-4">
                        <div className="first-ro">
                          <div className="mb-3">
                            <h5>{visa.name}</h5>
                            <p>
                              Submitted On:{" "}
                              {new Date(visa.submittedOn).toLocaleString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  second: "numeric",
                                  hour12: true,
                                }
                              )}
                            </p>
                            <p>Passport Number: {visa.passportNumber}</p>
                          </div>
                          <div className="mb-3">
                            <h6>{visa.country}</h6>
                            <p>Visa: {visa.visaType}</p>
                            <p>Travel: {visa.travelDates}</p>
                          </div>
                          <div className="mb-0">
                            <h6>Reference No:</h6>
                            <p className="v-color">{visa.referenceNo}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-8">
                        <div className="status-bar visa-step">
                          <div className="step-block step-block-completed">
                            <StatusIndicator />
                            <VerticalLine />
                            <span className="step-title">Application</span>
                          </div>
                          <div className="step-block step-block-completed">
                            <StatusIndicator />
                            <VerticalLine />
                            <span className="step-title">Submission</span>
                          </div>
                          <div className="step-block step-block-completed">
                            <CheckCircleFillIcon />
                            <VerticalLine />
                            <span className="step-title">Processing</span>
                          </div>
                          <div className="step-block">
                            <StatusIndicatorNext />
                            <span className="step-title">Complete</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer d-flex justify-content-end">
                      <Link to={`/visa/${visa.id}`} className="btn btn-primary">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data-found mt-5">
                  <div className="text-center">
                    <div className="mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="50"
                        height="50"
                        className="text-danger"
                      >
                        <path d="M12 2v20M2 12h20" />
                      </svg>
                      <h5 className="mt-4">No Data Available</h5>
                      <p>There are no records to display.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
};

export default VisaStatus;

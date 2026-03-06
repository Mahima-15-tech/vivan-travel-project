import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import ProfileSidebarWidget from "../../profile-sidebar";
import { ToastContainer, toast } from "react-toastify";
import MenuIcons from "../../menu-icons";
import "./visa-status.css";
import { Link } from "react-router-dom";
import { post } from "../../../../API/apiHelper";
import { applied_oktb_list } from "../../../../API/endpoints";

const CheckCircleFillIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    className="text-success"
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path d="M8 12l1 4 8-8" stroke="#fff" />
  </svg>
);
const StatusIndicator = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    stroke="#198754"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    className="text-success"
  >
    <circle cx="12" cy="12" r="10" fill="#dedfe3" />
    <path d="M8 12l1 4 8-8" stroke="transparent" />
  </svg>
);
const StatusIndicatorNext = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    stroke="#dedfe3"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    className="text-success"
  >
    <circle cx="12" cy="12" r="10" fill="#dedfe3" />
    <path d="M8 12l1 4 8-8" stroke="transparent" />
  </svg>
);
// const StatusIndicator = ({ className = '', visible = true }) => {
//     return (
//         <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="check" className={`svg-inline--fa fa-check ${className} ${visible ? '' : 'd-none'}`} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em">
//             <circle cx="12" cy="12" r="10" fill="currentColor" />
//             <path fill="currentColor" d="M443.3 100.7c6.2 6.2 6.2 16.4 0 22.6l-272 272c-6.2 6.2-16.4 6.2-22.6 0l-144-144c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L160 361.4 420.7 100.7c6.2-6.2 16.4-6.2 22.6 0z"></path>
//         </svg>
//     );
// };

const VerticalLine = () => {
  return (
    <div
      aria-hidden="true"
      className="position-absolute"
      style={{
        top: "50%",
        left: "8px",
        height: "100%",
        width: "0.125rem",
        backgroundColor: "#E5E7EB",
      }}
    ></div>
  );
};

const VisaStatus = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [otbdata, setDetails] = useState(null);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession && userDataFromSession != null) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    }
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const response = await post(
        applied_oktb_list,
        { id: userData.id, page: "1", limit: "10" },
        true
      );
      if (response.ok) {
        const data = await response.json();
        setDetails(data.data);
      } else {
        // console.log('Failed to fetch visa details');
      }
    } catch (error) {
      // console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const filteredData =
    otbdata && activeTab === "all"
      ? otbdata
      : otbdata?.filter((item) => item.status === activeTab);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="pt-3 pb-5" style={{ minHeight: "calc(100vh - 436px)" }}>
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
                  variant={activeTab === "all" ? "primary" : "outline-primary"}
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
                    activeTab === "Approved" ? "primary" : "outline-primary"
                  }
                  className={`cus-btn primary-light primary ${
                    activeTab === "Approved" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("Approved")}
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

            {filteredData && filteredData.length > 0 ? (
              filteredData.map((dataotb) => (
                <div key={dataotb.id} className="visa-stats card my-4">
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
                    <span>{dataotb.otb_type.toUpperCase()} OTB</span>
                  </div>
                  <div className="card-body row">
                    <div className="col-md-4">
                      <div className="first-ro">
                        <div className="mb-3">
                          <h5>{dataotb.applieduser.name}</h5>
                          <p>
                            Submitted On:{" "}
                            {new Date(dataotb.createdAt).toLocaleString(
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

                          {dataotb.otb_type !== "group" && (
                            <>
                              <p>PNR : {dataotb.pnr}</p>
                              <p>Date-of-birth : {dataotb.dob}</p>
                            </>
                          )}
                        </div>

                        {dataotb.otb_type !== "group" && (
                          <>
                            <div className="mb-3">
                              <h6>{dataotb.country}</h6>
                              <p>OTB type : {dataotb.otb_type}</p>
                              <p>Airlines: {dataotb.airlines}</p>
                            </div>
                          </>
                        )}

                        <div className="mb-0">
                          <h6>Reference No:</h6>
                          <p className="v-color">{dataotb.refrense_no}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="secnd-ro">
                        <h6 className="mb-2">Application Details:</h6>
                        <ul className="list-unstyled">
                          <li class="position-relative pb-3">
                            <VerticalLine />
                            <div aria-hidden="true" class="position-relative">
                              <CheckCircleFillIcon />
                              Under review
                            </div>
                          </li>
                          <li class="position-relative pb-3">
                            <VerticalLine />
                            <div aria-hidden="true" class="position-relative">
                              <StatusIndicator />
                              Under process
                            </div>
                          </li>
                          <li class="position-relative pb-3">
                            <VerticalLine />
                            <div aria-hidden="true" class="position-relative">
                              <StatusIndicator /> Application Paid
                            </div>
                          </li>
                          <li class="position-relative pb-3">
                            <div aria-hidden="true" class="position-relative">
                              <StatusIndicatorNext /> Visa Approved
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="col-md-5">
                      <div className="third-ro">
                        <div className="d-flex align-items-start gap-2 rounded-3 px-3 py-3 bg-primary text-white mt-n2">
                          <svg
                            fill="none"
                            viewBox="0 0 33 31"
                            width="33"
                            xmlns="http://www.w3.org/2000/svg"
                            className="me-2"
                          >
                            <path
                              d="M4.57422 13.723C4.57422 11.3412 4.57422 10.1503 4.90446 9.11653C5.30397 7.86594 6.04888 6.75378 7.05326 5.90833C7.88349 5.20947 8.99015 4.75396 11.2035 3.84293C13.141 3.04542 14.1097 2.64666 15.0915 2.47159C16.1696 2.27934 17.2732 2.27934 18.3513 2.47159C19.3331 2.64666 20.3019 3.04542 22.2394 3.84293C24.4527 4.75396 25.5593 5.20947 26.3896 5.90833C27.394 6.75378 28.1389 7.86594 28.5384 9.11653C28.8686 10.1503 28.8686 11.3412 28.8686 13.723C28.8686 16.3042 28.8686 17.5949 28.5624 18.7575C28.1641 20.2694 27.3905 21.6563 26.3133 22.7894C25.4849 23.6608 24.4004 24.3304 22.2313 25.6697C20.4402 26.7755 19.5447 27.3285 18.5998 27.5932C17.3712 27.9374 16.0716 27.9374 14.843 27.5932C13.8981 27.3285 13.0026 26.7755 11.2115 25.6697C9.04248 24.3304 7.95794 23.6608 7.12957 22.7894C6.05234 21.6563 5.27872 20.2694 4.88047 18.7575C4.57422 17.5949 4.57422 16.3042 4.57422 13.723Z"
                              fill="currentColor"
                              opacity="0.12"
                            ></path>
                            <path
                              d="M12.6724 15.3217L15.3717 17.8217L21.4453 12.1967M11.2035 3.84293V3.84293C8.99015 4.75396 7.88349 5.20947 7.05326 5.90833C6.04888 6.75378 5.30397 7.86594 4.90446 9.11653C4.57422 10.1503 4.57422 11.3412 4.57422 13.723V13.723C4.57422 16.3042 4.57422 17.5949 4.88047 18.7575C5.27872 20.2694 6.05234 21.6563 7.12957 22.7894C7.95794 23.6608 9.04248 24.3304 11.2115 25.6697V25.6697C13.0026 26.7755 13.8982 27.3285 14.843 27.5932C16.0716 27.9374 17.3712 27.9374 18.5998 27.5932C19.5447 27.3285 20.4402 26.7755 22.2313 25.6697V25.6697C24.4004 24.3304 25.4849 23.6608 26.3133 22.7894C27.3905 21.6563 28.1641 20.2694 28.5624 18.7575C28.8686 17.5949 28.8686 16.3042 28.8686 13.723V13.723C28.8686 11.3412 28.8686 10.1503 28.5384 9.11653C28.1389 7.86594 27.394 6.75378 26.3896 5.90833C25.5593 5.20947 24.4527 4.75396 22.2394 3.84293V3.84293C20.3019 3.04542 19.3331 2.64666 18.3513 2.47159C17.2732 2.27934 16.1696 2.27934 15.0915 2.47159C14.1097 2.64666 13.141 3.04542 11.2035 3.84293Z"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            ></path>
                          </svg>

                          <div className="d-flex flex-column">
                            <label className="h5 mb-2">OTB approved</label>

                            <div className="d-flex align-items-center gap-1 small text-white mb-1">
                              <label>Estimated on:</label>
                              {new Date(
                                new Date(dataotb.createdAt).setDate(
                                  new Date(dataotb.createdAt).getDate() + 5
                                )
                              ).toLocaleString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>

                            <div className="d-flex align-items-center gap-1 font-weight-bold medium text-white mb-1">
                              <label>Delivered on:</label>
                              {dataotb.deliveredOn
                                ? dataotb.deliveredOn
                                : "Not yet delivered"}
                            </div>
                            <span className="badge rounded-pill d-inline-flex px-2 py-1 text-sm bg-light w-fit-content">
                              <div className="d-flex align-items-center gap-2 text-success">
                                <svg
                                  aria-hidden="true"
                                  focusable="false"
                                  data-prefix="far"
                                  data-icon="check"
                                  className="svg-inline--fa fa-check"
                                  role="img"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 448 512"
                                  style={{ width: "1em", height: "1em" }}
                                >
                                  <path
                                    fill="currentColor"
                                    d="M441 103c9.4 9.4 9.4 24.6 0 33.9L177 401c-9.4 9.4-24.6 9.4-33.9 0L7 265c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l119 119L407 103c9.4-9.4 24.6-9.4 33.9 0z"
                                  />
                                </svg>
                                <label className="m-0">before time</label>
                              </div>
                            </span>
                          </div>
                        </div>

                        <div className="d-flex align-items-end justify-content-between w-100 h-100 gap-2 mt-2">
                          <div>
                            <Link
                              className="d-flex px-4 py-2 text-sm text-center text-gray-600 bg-gray rounded-5 border"
                              to="#"
                            >
                              <div className="d-flex align-items-center gap-1">
                                <svg
                                  fill="none"
                                  viewBox="0 0 16 17"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4 v-color me-2"
                                  width={18}
                                  height={18}
                                >
                                  <path
                                    d="M12.4852 8.58195V1.28533L10.5353 2.16325C10.415 2.21739 10.3549 2.24447 10.2979 2.26605C9.65035 2.51139 8.92194 2.40429 8.3724 1.98292C8.32405 1.94586 8.27426 1.90262 8.17468 1.81615V1.81615C8.04258 1.70145 7.97653 1.6441 7.91506 1.59847C7.20722 1.07309 6.23888 1.07309 5.53105 1.59847C5.46957 1.6441 5.40352 1.70145 5.27142 1.81615V1.81615C5.17184 1.90262 5.12205 1.94586 5.07371 1.98292C4.52416 2.40429 3.79575 2.51139 3.14817 2.26605C3.09121 2.24447 3.03108 2.21739 2.91082 2.16325L0.960938 1.28533V9.47857C0.960938 11.7188 0.960938 12.8389 1.39691 13.6945C1.7804 14.4472 2.39233 15.0591 3.14498 15.4426C4.00062 15.8786 5.12073 15.8786 7.36094 15.8786H13.9257M12.4852 8.58195V8.58195C13.3055 8.58195 13.7157 8.58195 14.0445 8.70047C14.6047 8.90241 15.0458 9.34349 15.2477 9.90369C15.3662 10.2325 15.3662 10.6426 15.3662 11.463V14.438C15.3662 15.2336 14.7213 15.8786 13.9257 15.8786V15.8786C13.1301 15.8786 12.4852 15.2336 12.4852 14.438V8.58195ZM8.16358 7.12262H6.72305M6.72305 7.12262H6.36292C5.76623 7.12262 5.28252 7.61264 5.28252 8.21712C5.28252 8.82159 5.76623 9.31161 6.36292 9.31161H7.08318C7.67987 9.31161 8.16358 9.80163 8.16358 10.4061C8.16358 11.0106 7.67987 11.5006 7.08318 11.5006H6.72305M6.72305 7.12262V6.39296M6.72305 11.5006H5.28252M6.72305 11.5006V12.2303"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                Invoice
                              </div>
                            </Link>
                          </div>
                          <div className="d-flex flex-column gap-2">
                            <Link
                              className="text-blue-500 d-flex justify-content-center w-40 h-8 px-4 py-2 text-sm text-center text-gray-600 bg-white border border-gray-400 rounded-5"
                              to={`/visa-detail/${dataotb.id}`}
                            >
                              View Application
                            </Link>
                          </div>
                        </div>
                        <div className="d-flex align-items-end justify-content-between w-100 h-100 gap-2 mt-2">
                          <Link
                            className="d-flex align-items-center justify-content-center w-40 h-8 px-3 py-2 text-sm text-white bg-primary rounded-5 w-100"
                            to="#"
                          >
                            Download Visa
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No data available</div>
            )}
          </div>
        </div>
      </div>
      {/* </div > */}
    </section>
  );
};

export default VisaStatus;

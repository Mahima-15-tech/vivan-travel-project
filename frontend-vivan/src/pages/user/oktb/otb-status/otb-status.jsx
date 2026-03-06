import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import ProfileSidebarWidget from "../../profile-sidebar";
import { ToastContainer, toast } from "react-toastify";
import MenuIcons from "../../menu-icons";
import "./visa-status.css";
import { Link } from "react-router-dom";
import { post } from "../../../../API/apiHelper";
import { applied_oktb_list, IMAGE_BASE_URL } from "../../../../API/endpoints";
import { useNavigate } from "react-router-dom";

// const StatusIndicator = ({ className = '', visible = true }) => {
//     return (
//         <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="check" className={`svg-inline--fa fa-check ${className} ${visible ? '' : 'd-none'}`} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em">
//             <circle cx="12" cy="12" r="10" fill="currentColor" />
//             <path fill="currentColor" d="M443.3 100.7c6.2 6.2 6.2 16.4 0 22.6l-272 272c-6.2 6.2-16.4 6.2-22.6 0l-144-144c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L160 361.4 420.7 100.7c6.2-6.2 16.4-6.2 22.6 0z"></path>
//         </svg>
//     );
// };

const VisaStatus = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [otbdata, setDetails] = useState(null);
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession && userDataFromSession != null) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    } else {
      navigate("/login");
    }
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchDetails = async (page) => {
    setIsLoading(true);
    try {
      const response = await post(
        applied_oktb_list,
        { id: userData.id, page: (page || 1).toString(), limit: "50" },
        true
      );
      if (response.ok) {
        const data = await response.json();
        setDetails(data.data);
        setTotalPages(data.pagination.totalPages);
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
  }, [userData]);

  const filteredData =
    otbdata && activeTab === "all"
      ? otbdata
      : otbdata?.filter((item) => item.status === activeTab);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handlePageChangeOTB = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchDetails(newPage);
      setCurrentPage(newPage);
    }
  };

  // Generate array for pages based on totalPages
  const pagesOtb = Array.from({ length: totalPages }, (_, index) => index + 1);

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

            {/* <ul className="nav nav-tabs border-0 mb-24 w-100">
                            <li className="nav-item col-4">
                                <Button variant={activeTab === 'all' ? 'primary' : 'outline-primary'} className={`cus-btn primary-light primary ${activeTab === 'all' ? 'active' : ''}`} onClick={() => handleTabClick('all')}>
                                    All
                                </Button>
                            </li>
                            <li className="nav-item col-4">
                                <Button variant={activeTab === 'Approved' ? 'primary' : 'outline-primary'} className={`cus-btn primary-light primary ${activeTab === 'Approved' ? 'active' : ''}`} onClick={() => handleTabClick('Approved')}>
                                    Approved
                                </Button>
                            </li>
                            <li className="nav-item col-4">
                                <Button variant={activeTab === 'Pending' ? 'primary' : 'outline-primary'} className={`cus-btn primary-light primary ${activeTab === 'Pending' ? 'active' : ''}`} onClick={() => handleTabClick('Pending')}>
                                    Pending
                                </Button>
                            </li>
                        </ul> */}

            {/* enter table header part */}

            <div className="vstack gap-4">
              <div className="border bg-transparent card">
                <div className="bg-transparent border-bottom card-header">
                  <h3 className="card-header-title">Applied OTB</h3>
                </div>
                <div className="p-0 card-body">
                  <div className="p-2 p-sm-4 tab-content">
                    <div role="tabpanel" className="fade tab-pane active show">
                      <div className="border-0 mb-4 card">
                        <div className="table-responsive">
                          <table className="table table-bordered table-striped m-0">
                            <thead className="thead-dark">
                              <tr>
                                <th>Reference No:</th>
                                <th>Name</th>
                                <th>Submitted On</th>
                                <th>PNR Number</th>
                                <th>DOB</th>
                                <th>Country</th>
                                <th>Airline</th>
                                <th>Status</th>
                                {/* <th>Type</th> */}
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData && filteredData.length > 0 ? (
                                filteredData.map((dataotb) => (
                                  <>
                                    <tr>
                                      <td>{dataotb.refrense_no}</td>
                                      <td>{dataotb.name}</td>
                                      <td>
                                        {new Date(
                                          dataotb.createdAt
                                        ).toLocaleString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "numeric",
                                          minute: "numeric",
                                          second: "numeric",
                                          hour12: true,
                                        })}
                                      </td>
                                      <td>{dataotb.pnr}</td>
                                      <td>{dataotb.dob}</td>
                                      <td>{dataotb.country}</td>
                                      <td>{dataotb.airlinedata?.code}</td>
                                      <td
                                        style={{
                                          color:
                                            dataotb.working_status ===
                                            "In Process"
                                              ? "orange"
                                              : dataotb.working_status ===
                                                "Additional Document Required"
                                              ? "red"
                                              : dataotb.working_status ===
                                                "On Hold"
                                              ? "red"
                                              : dataotb.working_status ===
                                                "Rejected"
                                              ? "red"
                                              : "green",
                                        }}
                                      >
                                        <b> {dataotb.working_status}</b>
                                      </td>
                                      <td>
                                        <div className="action-buttons d-flex gap-2">
                                          {dataotb.created_file && (
                                            <a
                                              href={`${
                                                IMAGE_BASE_URL +
                                                dataotb.created_file
                                              }`}
                                              className="btn btn-primary btn-sm action-button px-2 py-1"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              download="otb_file.pdf"
                                            >
                                              <i className="fa fa-download m-1"></i>{" "}
                                              {/* Font Awesome Icon */}
                                              <span className="button-text">
                                                Download OTB
                                              </span>
                                            </a>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  </>

                                  // <div key={dataotb.id} className="visa-stats card my-4">
                                  //     <div className="vs-name">
                                  //         <svg fill="none" height="18" viewBox="0 0 18 18" width="18" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                  //             <path d="M3.79297 13.9416C3.79297 12.0639 5.3152 10.5416 7.19297 10.5416H11.7263C13.6041 10.5416 15.1263 12.0639 15.1263 13.9416V13.9416C15.1263 15.1935 14.1115 16.2083 12.8596 16.2083H6.05963C4.80779 16.2083 3.79297 15.1935 3.79297 13.9416V13.9416Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                  //             <path d="M12.293 4.87496C12.293 6.43977 11.0244 7.70829 9.45964 7.70829C7.89483 7.70829 6.6263 6.43977 6.6263 4.87496C6.6263 3.31015 7.89483 2.04163 9.45964 2.04163C11.0244 2.04163 12.293 3.31015 12.293 4.87496Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                  //         </svg>
                                  //         <span>{dataotb.otb_type.toUpperCase()} OTB</span>
                                  //     </div>
                                  //     <div className="card-body row">
                                  //         <div className="col-md-4">
                                  //             <div className="first-ro">
                                  //                 <div className='mb-3'>
                                  //                     <h5>{dataotb.applieduser.name}</h5>
                                  //                     <p>Submitted On: {new Date(dataotb.createdAt).toLocaleString('en-US', {
                                  //                         year: 'numeric',
                                  //                         month: 'long',
                                  //                         day: 'numeric',
                                  //                         hour: 'numeric',
                                  //                         minute: 'numeric',
                                  //                         second: 'numeric',
                                  //                         hour12: true
                                  //                     })}</p>

                                  //                     {dataotb.otb_type !== 'group' && (
                                  //                         <>
                                  //                             <p>PNR : {dataotb.pnr}</p>
                                  //                             <p>Date-of-birth : {dataotb.dob}</p>
                                  //                         </>
                                  //                     )}
                                  //                 </div>

                                  //                 {dataotb.otb_type !== 'group' && (
                                  //                     <>
                                  //                         <div className='mb-3'>
                                  //                             <h6>{dataotb.country}</h6>
                                  //                             <p>OTB type : {dataotb.otb_type}</p>
                                  //                             <p>Airlines: {dataotb.airlines}</p>
                                  //                         </div>
                                  //                     </>
                                  //                 )}

                                  //                 <div className='mb-0'>
                                  //                     <h6>Reference No:</h6>
                                  //                     <p className='v-color'>{dataotb.refrense_no}</p>
                                  //                 </div>
                                  //             </div>
                                  //         </div>

                                  //         <div className="col-md-3">
                                  //             <div className="secnd-ro">
                                  //                 <h6 className='mb-2'>Application Details:</h6>
                                  //                 <ul className="list-unstyled">
                                  //                     <li class="position-relative pb-3">
                                  //                         <VerticalLine />
                                  //                         <div aria-hidden="true" class="position-relative">
                                  //                             <CheckCircleFillIcon />Under review</div></li>
                                  //                     <li class="position-relative pb-3">
                                  //                         <VerticalLine />
                                  //                         <div aria-hidden="true" class="position-relative">
                                  //                             <StatusIndicator />Under process</div></li>
                                  //                     <li class="position-relative pb-3">
                                  //                         <VerticalLine />
                                  //                         <div aria-hidden="true" class="position-relative">
                                  //                             <StatusIndicator /> Application Paid</div></li>
                                  //                     <li class="position-relative pb-3">

                                  //                         <div aria-hidden="true" class="position-relative">
                                  //                             <StatusIndicatorNext /> Visa Approved</div></li>
                                  //                 </ul>
                                  //             </div>
                                  //         </div>

                                  //         <div className="col-md-5">
                                  //             <div className="third-ro">
                                  //                 <div className="d-flex align-items-start gap-2 rounded-3 px-3 py-3 bg-primary text-white mt-n2">
                                  //                     <svg fill="none" viewBox="0 0 33 31" width="33" xmlns="http://www.w3.org/2000/svg" className="me-2">
                                  //                         <path d="M4.57422 13.723C4.57422 11.3412 4.57422 10.1503 4.90446 9.11653C5.30397 7.86594 6.04888 6.75378 7.05326 5.90833C7.88349 5.20947 8.99015 4.75396 11.2035 3.84293C13.141 3.04542 14.1097 2.64666 15.0915 2.47159C16.1696 2.27934 17.2732 2.27934 18.3513 2.47159C19.3331 2.64666 20.3019 3.04542 22.2394 3.84293C24.4527 4.75396 25.5593 5.20947 26.3896 5.90833C27.394 6.75378 28.1389 7.86594 28.5384 9.11653C28.8686 10.1503 28.8686 11.3412 28.8686 13.723C28.8686 16.3042 28.8686 17.5949 28.5624 18.7575C28.1641 20.2694 27.3905 21.6563 26.3133 22.7894C25.4849 23.6608 24.4004 24.3304 22.2313 25.6697C20.4402 26.7755 19.5447 27.3285 18.5998 27.5932C17.3712 27.9374 16.0716 27.9374 14.843 27.5932C13.8981 27.3285 13.0026 26.7755 11.2115 25.6697C9.04248 24.3304 7.95794 23.6608 7.12957 22.7894C6.05234 21.6563 5.27872 20.2694 4.88047 18.7575C4.57422 17.5949 4.57422 16.3042 4.57422 13.723Z" fill="currentColor" opacity="0.12"></path>
                                  //                         <path d="M12.6724 15.3217L15.3717 17.8217L21.4453 12.1967M11.2035 3.84293V3.84293C8.99015 4.75396 7.88349 5.20947 7.05326 5.90833C6.04888 6.75378 5.30397 7.86594 4.90446 9.11653C4.57422 10.1503 4.57422 11.3412 4.57422 13.723V13.723C4.57422 16.3042 4.57422 17.5949 4.88047 18.7575C5.27872 20.2694 6.05234 21.6563 7.12957 22.7894C7.95794 23.6608 9.04248 24.3304 11.2115 25.6697V25.6697C13.0026 26.7755 13.8982 27.3285 14.843 27.5932C16.0716 27.9374 17.3712 27.9374 18.5998 27.5932C19.5447 27.3285 20.4402 26.7755 22.2313 25.6697V25.6697C24.4004 24.3304 25.4849 23.6608 26.3133 22.7894C27.3905 21.6563 28.1641 20.2694 28.5624 18.7575C28.8686 17.5949 28.8686 16.3042 28.8686 13.723V13.723C28.8686 11.3412 28.8686 10.1503 28.5384 9.11653C28.1389 7.86594 27.394 6.75378 26.3896 5.90833C25.5593 5.20947 24.4527 4.75396 22.2394 3.84293V3.84293C20.3019 3.04542 19.3331 2.64666 18.3513 2.47159C17.2732 2.27934 16.1696 2.27934 15.0915 2.47159C14.1097 2.64666 13.141 3.04542 11.2035 3.84293Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                  //                     </svg>

                                  //                     <div className="d-flex flex-column">
                                  //                         <label className="h5 mb-2">OTB approved</label>

                                  //                         <div className="d-flex align-items-center gap-1 small text-white mb-1">
                                  //                             <label>Estimated on:</label>
                                  //                             {new Date(new Date(dataotb.createdAt).setDate(new Date(dataotb.createdAt).getDate() + 5)).toLocaleString('en-US', {
                                  //                                 year: 'numeric',
                                  //                                 month: 'long',
                                  //                                 day: 'numeric',
                                  //                             })}
                                  //                         </div>

                                  //                         <div className="d-flex align-items-center gap-1 font-weight-bold medium text-white mb-1">
                                  //                             <label>Delivered on:</label>{dataotb.deliveredOn ? dataotb.deliveredOn : 'Not yet delivered'}
                                  //                         </div>
                                  //                         <span className="badge rounded-pill d-inline-flex px-2 py-1 text-sm bg-light w-fit-content">
                                  //                             <div className="d-flex align-items-center gap-2 text-success">
                                  //                                 <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="check" className="svg-inline--fa fa-check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ width: '1em', height: '1em' }} >
                                  //                                     <path fill="currentColor" d="M441 103c9.4 9.4 9.4 24.6 0 33.9L177 401c-9.4 9.4-24.6 9.4-33.9 0L7 265c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l119 119L407 103c9.4-9.4 24.6-9.4 33.9 0z" />
                                  //                                 </svg>
                                  //                                 <label className="m-0">before time</label>
                                  //                             </div>
                                  //                         </span>
                                  //                     </div>
                                  //                 </div>

                                  //                 {dataotb.created_file != null && (
                                  //                     <div className="d-flex align-items-end justify-content-between w-100 h-100 gap-2 mt-2">
                                  //                         <a
                                  //                             href={`${IMAGE_BASE_URL + dataotb.created_file}`}
                                  //                             className="btn btn-primary"
                                  //                             target="_blank"
                                  //                             rel="noopener noreferrer"
                                  //                             download="visa_file.pdf"  // Add a specific filename if possible
                                  //                         >
                                  //                             Download
                                  //                         </a>
                                  //                     </div>
                                  //                 )
                                  //                 }

                                  //             </div>
                                  //         </div>
                                  //     </div>
                                  // </div>

                                  // </>
                                ))
                              ) : (
                                <div>No data available</div>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
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
                                handlePageChangeOTB(currentPage - 1)
                              }
                              disabled={currentPage === 1}
                            >
                              ‹
                            </button>
                          </li>
                          {pagesOtb.map((page) => (
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
                                  onClick={() => handlePageChangeOTB(page)}
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
                                handlePageChangeOTB(currentPage + 1)
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
      {/* </div > */}
    </section>
  );
};

export default VisaStatus;

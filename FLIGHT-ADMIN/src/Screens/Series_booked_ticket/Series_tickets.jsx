import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { post, get } from "../../API/apiHelper";
import Ticketlist from "./Series_ticketlist";
import { FormGroup, FormControl } from "react-bootstrap";
import { S_Booking_list, siteconfig } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import usersimage from "../../Assets/Images/travel-agent.png";

function Series_tickets() {
  const navigate = useNavigate();
  const [email, agent_email] = useState("");
  const [a_mobile, agent_mobile] = useState("");
  const [res, setResponce] = useState({
    status: true,
    message: "Data retrieved successfully",
    data: [],
    pagination: {
      totalUsers: 1,
      currentPage: 2,
      totalPages: 1,
      pageSize: 10,
    },
  });
  const [currentPage, setcurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [issearch, setIssearch] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, SetLoading] = useState(true);


  const handlePageChange = (page) => {
    setcurrentPage(page);
    getAgentlist(page);
  };

  const handleSearch = () => {
    setcurrentPage(1);
    setIssearch(true);
    getAgentlist(1);
  };

  const handleReset = () => {
    setcurrentPage(1);
    setIssearch(false);
    getAgentlist(1);
    window.location.reload();
  };

  useEffect(() => {
    if (settings) {
      getAgentlist(1);
    }
  }, [settings, currentPage]);

  const handle_mobile_no = (event) => {
    agent_mobile(event.target.value);
  };
  const handle_email = (event) => {
    agent_email(event.target.value);
  };



  useEffect(() => {
    const fetchSettings = async () => {
      SetLoading(true);
      try {
        const res = await get(siteconfig, true);
        const response = await res.json();
        setSettings(response.data);
      } catch (error) {
        toast.error("Failed to fetch settings");
      } finally {
        SetLoading(false);
      }
    };
    fetchSettings();
  }, []);

  async function getAgentlist(page) {
    if (!settings) {
      return;
    }

    SetLoading(true);
    const response = await post(
      S_Booking_list,
      {
        page: page,
        limit: '50',
        email: issearch ? email : "",
        mobile_no: issearch ? a_mobile : "",
      },
      true
    );
    const data = await response.json();

    if (response.status === 200) {
      setResponce(data);
      const totalPages = data.pagination.totalPages;
      const pagesArray = Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
      setPages(pagesArray);
      SetLoading(false);
    } else if (response.status === 403) {
      data.errors.forEach((error) => {
        toast.error(error.msg);
      });
    } else if (response.status === 401) {
      sessionStorage.setItem("authtoken", null);
      navigate("/");
      toast.error("Session Expired");
    } else {
      toast.error("Something Went Wrong");
    }
  }

  return (
    <main id="content" role="main" className="main pointer-event">
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
      <div className="content container-fluid">
        <div className="mb-4">
          <h6 className="h1 mb-0 text-capitalize d-flex align-items-center gap-2">
            <img width="30" src={usersimage} alt="" />
            Series Tickets list
            <span className="badge badge-soft-dark radius-50">{res.pagination.totallist}</span>
          </h6>
        </div>
        <div className="card">
          <div className="px-3 py-4">
            <div className="row gy-2 align-items-center">
              <div className="col-lg-12">
                <div className="row justify-content-between">
                  <div className="input-group input-group-merge col-12 col-sm-6 col-md-4 col-lg-4 mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="tio-search"></i>
                      </div>
                    </div>
                    <input
                      id="datatableSearch_"
                      type="search"
                      name="name"
                      className="form-control"
                      placeholder="Search by email"
                      aria-label="Search emails"
                      value={email}
                      onChange={handle_email}
                    />
                  </div>
                  <div className="input-group input-group-merge col-12 col-sm-6 col-md-4 col-lg-4 mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="tio-search"></i>
                      </div>
                    </div>
                    <input
                      id="datatableSearch_"
                      type="search"
                      name="mobile_no"
                      className="form-control"
                      placeholder="Search by mobile no"
                      aria-label="Search orders"
                      value={a_mobile}
                      onChange={handle_mobile_no}
                    />
                  </div>

                  <div className="input-group input-group-merge col-12 col-sm-6 col-md-4 col-lg-4 mb-2">
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                    <div style={{ width: "10px" }}></div>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive datatable-custom">
            <table className="table table-hover table-borderless table-thead-bordered table-nowrap table-align-middle card-table w-100">
              <thead className="thead-light thead-50 text-capitalize">
                <tr>
                  <th className="text-center">SL</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Mobile No</th>
                  <th className="text-center">Booking RefNo</th>
                  <th className="text-center">Amount</th>
                  <th className="text-center">Paying method</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              {loading ? (<CircularProgressBar />) : (
                <tbody>
                  {res.data.map((tickets, index) => (
                    <Ticketlist key={index} data={tickets} onUpdate={getAgentlist} />
                  ))}
                </tbody>
              )}
            </table>
          </div>
          <div className="table-responsive mt-4">
            <div className="px-4 d-flex justify-content-lg-end">
              <nav className="pagination">
                <ul className="pagination">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                  </li>
                  {pages.map((page) => (
                    <li
                      key={page}
                      className={`page-item ${page === currentPage ? "active" : ""}`}
                      aria-current={page === currentPage ? "page" : null}
                    >
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
                    className={`page-item ${currentPage === res.pagination.totalPages ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      ›
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default Series_tickets;

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Applied_visas_list from "./Applied_visas_list";
import { FormGroup, FormControl } from "react-bootstrap";
import { appliedlist, siteconfig } from "../../API/endpoints";
import { post, get } from "../../API/apiHelper";
import CircularProgressBar from "../Component/Loading";
import usersimage from "../../Assets/Images/visa.png";

function Applied_visas() {
  const navigate = useNavigate();
  const [going_f, going_from] = useState("");
  const [going_t, going_to] = useState("");
  const [v_status, status] = useState("");
  const [res, setResponce] = useState({
    status: true,
    message: "Data retrieved successfully",
    data: [],
    pagination: {
      totalUsers: 0,
      currentPage: parseInt(localStorage.getItem("currentPage")) || 1,
      totalPages: 1,
      pageSize: 10,
    },
  });
  const [currentPage, setcurrentPage] = useState(parseInt(localStorage.getItem("currentPage")) || 1);
  const [pages, setPages] = useState([]);
  const [issearch, setIssearch] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, SetLoading] = useState(true);

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > res.pagination.totalPages) return;
    setcurrentPage(page);
    getAppliedlist(page);
  };

  const handleSearch = () => {
    setcurrentPage(1);
    setIssearch(true);
    getAppliedlist(1);
  };

  const handleReset = () => {
    going_from("");
    going_to("");
    status("");
    setcurrentPage(1);
    setIssearch(false);
    getAppliedlist(1);
  };

  useEffect(() => {
    if (settings) {
      getAppliedlist(currentPage);
    }
  }, [settings]);

  const handle_gt = (event) => {
    going_to(event.target.value);
  };
  const handle_gf = (event) => {
    going_from(event.target.value);
  };
  const visa_status = (event) => {
    status(event.target.value);
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

    // Clean up localStorage on component unmount
    // return () => {
    //   localStorage.removeItem("currentPage");
    // };
  }, []);

  async function getAppliedlist(page) {
    if (!settings) {
      return;
    }

    SetLoading(true);
    try {
      const response = await post(
        appliedlist,
        {
          page,
          limit: settings.par_page_limit,
          going_from: issearch ? going_f : "",
          going_to: issearch ? going_t : "",
          status: issearch ? v_status : "",
          isadmin: "yes"
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
    } catch (error) {
      toast.error("Network Error");
    } finally {
      SetLoading(false);
    }
  }

  const getPageRange = () => {
    const totalPages = res.pagination.totalPages;
    const current = currentPage;
    let start = Math.max(1, current - 2);
    let end = Math.min(totalPages, current + 2);

    if (current <= 3) {
      end = Math.min(5, totalPages);
    }
    if (current >= totalPages - 2) {
      start = Math.max(totalPages - 4, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

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
            Applied Visas list
            <span className="badge badge-soft-dark radius-50">
              {res.pagination.totalUsers}
            </span>
          </h6>
        </div>

        <div className="card">
          <div className="px-3 py-4">
            <div className="row gy-2 align-items-center">
              <div className="col-lg-12">
                <div className="row justify-content-between">
                  <div className="input-group input-group-merge col-12 col-sm-6 col-md-4 col-lg-3 mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="tio-search"></i>
                      </div>
                    </div>
                    <input
                      id="datatableSearch_"
                      type="search"
                      name="going_from"
                      className="form-control"
                      placeholder="Search by Going from"
                      aria-label="Search orders"
                      onChange={handle_gf}
                      value={going_f}
                    />
                  </div>
                  <div className="input-group input-group-merge col-12 col-sm-6 col-md-4 col-lg-3 mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="tio-search"></i>
                      </div>
                    </div>
                    <input
                      id="datatableSearch_"
                      type="search"
                      name="going_to"
                      className="form-control"
                      placeholder="Search by Going to"
                      aria-label="Search orders"
                      onChange={handle_gt}
                      value={going_t}
                    />
                  </div>
                  <div className="input-group input-group-merge col-12 col-sm-6 col-md-4 col-lg-3 mb-2">
                    <FormGroup>
                      <FormControl
                        as="select"
                        name="searchStatus"
                        value={v_status}
                        onChange={visa_status}
                      >
                        <option value="">Select Status</option>
                        <option value="In Process">In Process</option>
                        <option value="Additional Document Required">
                          Additional Document Required
                        </option>
                        <option value="On Hold">On Hold</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Approved">Approved</option>
                      </FormControl>
                    </FormGroup>
                  </div>
                  <div className="input-group input-group-merge col-12 col-sm-6 col-md-4 col-lg-3 mb-2">
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
                  <th className="text-center">Applied By</th>
                  <th className="text-center">Applied Country</th>
                  <th className="text-center">User</th>
                  <th className="text-center">Reference</th>
                  <th className="text-center">Visa type</th>
                  <th className="text-center">Internal ID</th>
                  <th className="text-center">Passport No</th>
                  <th className="text-center">Pan No</th>
                  <th className="text-center">Is Insurance</th>
                  <th className="text-center">Amount</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Submitted Date</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              {loading ? (
                <CircularProgressBar />
              ) : (
                <tbody>
                  {res.data.length > 0 ? (
                    res.data.map((list, index) => (
                      <Applied_visas_list
                        key={index}
                        data={list}
                        onUpdate={() => getAppliedlist(currentPage)}
                        index={index + (currentPage - 1) * settings.par_page_limit}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center py-4">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </div>

          {res.pagination.totalPages > 1 && (
            <div className="table-responsive mt-4">
              <div className="px-4 d-flex justify-content-lg-end">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ‹
                      </button>
                    </li>

                    {currentPage > 3 && res.pagination.totalPages > 5 && (
                      <li className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
                      </li>
                    )}

                    {currentPage > 4 && res.pagination.totalPages > 6 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}

                    {getPageRange().map((page) => (
                      <li
                        key={page}
                        className={`page-item ${page === currentPage ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}

                    {currentPage < res.pagination.totalPages - 3 && res.pagination.totalPages > 6 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}

                    {currentPage < res.pagination.totalPages - 2 && res.pagination.totalPages > 5 && (
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(res.pagination.totalPages)}
                        >
                          {res.pagination.totalPages}
                        </button>
                      </li>
                    )}

                    <li className={`page-item ${currentPage === res.pagination.totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === res.pagination.totalPages}
                      >
                        ›
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Applied_visas;
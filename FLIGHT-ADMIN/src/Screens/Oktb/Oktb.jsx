import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { post, get } from "../../API/apiHelper";
import { FormGroup, FormControl } from "react-bootstrap";
import { otblist, siteconfig } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import usersimage from "../../Assets/Images/customers.png";
import OtbTable from "./Oktblist";

function Otb() {
  const navigate = useNavigate();
  const [email, Setemail] = useState("");
  const [number, Setnumber] = useState("");
  const [status, Setstatus] = useState("");
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
    getotblist(page);
  };

  const handleSearch = () => {
    setcurrentPage(1);
    setIssearch(true);
    getotblist(1);
  };

  const handleReset = () => {
    setcurrentPage(1);
    setIssearch(false);
    getotblist(1);
    // Removed window.location.reload() to prevent breaking pagination
  };

  useEffect(() => {
    if (settings) {
      getotblist(currentPage); // Use currentPage instead of hardcoded 1
    }
  }, [settings]); // Removed currentPage from dependencies to avoid infinite loops

  const handle_gt = (event) => {
    Setnumber(event.target.value);
  };
  const handle_gf = (event) => {
    Setemail(event.target.value);
  };
  const visa_status = (event) => {
    Setstatus(event.target.value);
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

  async function getotblist(page) {
    if (!settings) {
      return;
    }

    SetLoading(true);
    try {
      const response = await post(
        otblist,
        {
          page: page,
          limit: settings.par_page_limit,
          email: issearch ? email : "",
          number: issearch ? number : "",
          status: issearch ? status : "",
        },
        true
      );
      const data = await response.json();

      if (response.status === 200) {
        setResponce(data);
        const totalPages = data.pagination?.totalPages || 1; // Safe access
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
      toast.error("Failed to fetch data");
    } finally {
      SetLoading(false); // Ensure loading is reset in all cases
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
            Applied OTB
            <span className="badge badge-soft-dark radius-50">
              {res.pagination.totallist}
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
                      placeholder="Search by E-mail"
                      aria-label="Search orders"
                      onChange={handle_gf}
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
                      placeholder="Search by Number"
                      aria-label="Search orders"
                      onChange={handle_gt}
                    />
                  </div>
                  <div className="input-group input-group-merge col-12 col-sm-6 col-md-4 col-lg-3 mb-2">
                    <FormGroup>
                      <FormControl
                        as="select"
                        name="searchStatus"
                        value={status}
                        onChange={visa_status}
                      >
                        <option value="">Select Status</option>
                        <option value="In Process">In Process</option>
                        <option value="Additional Document Required">
                          Additional Document Required
                        </option>
                        <option value="On hold">On Hold</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
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
                    <div style={{ width: "10px" }}></div>
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
                  <th className="text-center">Profile</th>
                  <th className="text-center">Applied user</th>
                  <th className="text-center">Country</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">PNR</th>
                  <th className="text-center">Dob</th>
                  <th className="text-center">Airlines</th>
                  <th className="text-center">Amount</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              {loading ? (
                <CircularProgressBar />
              ) : (
                <tbody>
                  {res.data.map((listdata, index) => (
                    <OtbTable
                      key={index}
                      data={listdata}
                      onUpdate={getotblist}
                    />
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
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
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
                      className={`page-item ${
                        page === currentPage ? "active" : ""
                      }`}
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
                    className={`page-item ${
                      currentPage === (res.pagination?.totalPages || 1)
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === (res.pagination?.totalPages || 1)} // Fixed: Added disabled prop
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

export default Otb;
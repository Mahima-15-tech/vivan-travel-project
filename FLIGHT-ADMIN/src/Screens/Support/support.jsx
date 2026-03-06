import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { post, get } from "../../API/apiHelper";
import { toast, ToastContainer } from "react-toastify";
import SupportTableRow from "./Widget/SupportTableRow"

import { support_list, siteconfig } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import supportimage from "../../Assets/Images/support.png";

function Support() {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (settings) {
      getsupportlist(1);
    }
  }, [settings]);

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

  // Function to handle page change
  const handlePageChange = (page) => {
    setcurrentPage(page);
    getsupportlist(page);
  };
  const handleSearch = () => {
    setcurrentPage(1);
    setIssearch(true);
    getsupportlist(1);
  };

  const handleReset = () => {
    setcurrentPage(1);
    setIssearch(false);
    setEmail("");
    setNumber("");
    setUserName("");
    getsupportlist(1);
  };
  const [loading, SetLoading] = useState(true);

  const handelemail = (event) => {
    setEmail(event.target.value);
  };
  const handelnumber = (event) => {
    setNumber(event.target.value);
  };
  const handelname = (event) => {
    setUserName(event.target.value);
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

  async function getsupportlist(page) {
    if (!settings) {
      return;
    }

    SetLoading(true);
    const response = await post(
      support_list,
      {
        page: page,
        limit: settings.par_page_limit,
        name: issearch ? username : "",
        email: issearch ? email : "",
        mobile_no: issearch ? number : "",
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
      toast.error("Session Expire");
    } else {
      toast.error("Somthing Went Wrong");
    }
  }





  return (
    <main id="content" role="main" class="main pointer-event">
      {" "}
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
            <img
              width="30"
              src={supportimage}
              alt=""
            />
            Support list
            <span className="badge badge-soft-dark radius-50">{res.pagination.totallist}</span>
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
                      name="searchValue"
                      className="form-control"
                      placeholder="Search by Name"
                      aria-label="Search orders"
                      value={username}
                      onChange={handelname}
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
                      name="searchValue"
                      className="form-control"
                      placeholder="Search by Email"
                      aria-label="Search orders"
                      value={email}
                      onChange={handelemail}
                    />
                  </div>{" "}
                  <div className="input-group input-group-merge col-12 col-sm-6 col-md-4 col-lg-3 mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="tio-search"></i>
                      </div>
                    </div>
                    <input
                      id="datatableSearch_"
                      type="search"
                      name="searchValue"
                      className="form-control"
                      placeholder="Search by Number"
                      aria-label="Search orders"
                      value={number}
                      onChange={handelnumber}
                    />
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
              {/* <SearchForm />
            <ExportDropdown /> */}
            </div>
          </div>
          <div className="table-responsive datatable-custom">
            <table className="table table-hover table-bordered table-thead-bordered  table-align-middle card-table w-100">
              <thead className="thead-light thead-50 text-capitalize">
                <tr>
                  <th className="text-center">Support Id</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Mobile No</th>
                  <th className="text-center">Description</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              {loading ? (<CircularProgressBar />) : (<tbody>
                {res.data.map((support, index) => (
                  <SupportTableRow
                    key={index}
                    support={support}
                    onUpdate={getsupportlist} />
                ))}
              </tbody>)}
            </table>
          </div>
          <div class="table-responsive mt-4">
            <div className="px-4 d-flex justify-content-lg-end">
              <nav className="pagination">
                <ul className="pagination">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""
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
                      className={`page-item ${page === currentPage ? "active" : ""
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
                    className={`page-item ${currentPage === res.pagination.totalPages
                      ? "disabled"
                      : ""
                      }`}
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
          {/* <Pagination /> */}
        </div>
      </div>
    </main>
  );
}

export default Support;

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { post, get } from "../../API/apiHelper";
import { toast, ToastContainer } from "react-toastify";
import FeedbackTableRow from "./Widget/FeedbackTableRow";

import { feedback_list, siteconfig } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import supportimage from "../../Assets/Images/support.png";

function Support() {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");

  useEffect(() => {
      getsupportlist(1);
  }, []);

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

  // Function to handle page change
  const handlePageChange = (page) => {
    setcurrentPage(page);
    getsupportlist(page);
  };


  const [loading, SetLoading] = useState(true);






  async function getsupportlist(page) {


    SetLoading(true);
    const response = await post(
      feedback_list,
      {
        page: page,
        limit: 10,
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
            <img width="30" src={supportimage} alt="" />
            Feedback list
            <span className="badge badge-soft-dark radius-50">
              {res.pagination.totallist}
            </span>
          </h6>
        </div>
        <div className="card">
          <div className="px-3 py-4">
            <div className="row gy-2 align-items-center">
              {/* <SearchForm />
            <ExportDropdown /> */}
            </div>
          </div>
          <div className="table-responsive datatable-custom">
            <table className="table table-hover table-bordered table-thead-bordered  table-align-middle card-table w-100">
              <thead className="thead-light thead-50 text-capitalize">
                <tr>
                  <th className="text-center">Feedback Id</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Designation</th>
                  <th className="text-center">Message</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              {loading ? (
                <CircularProgressBar />
              ) : (
                <tbody>
                  {res.data.map((support, index) => (
                    <FeedbackTableRow
                      key={index}
                      support={support}
                      onUpdate={getsupportlist}
                    />
                  ))}
                </tbody>
              )}
            </table>
          </div>
          <div class="table-responsive mt-4">
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
                      currentPage === res.pagination.totalPages
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSidebarWidget from "../profile-sidebar";
import MenuIcons from "../menu-icons";
import BookingWidget from "./booking-component/upcoming-booking";
import { post } from "../../../API/apiHelper";
import { booking_list } from "../../../API/endpoints";
import { ToastContainer } from "react-toastify";
import "../../user/my-bookings/my-bookings.css";

const ProfileMain = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [bookings, setDetails] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    } else {
      navigate("/login");
    }
  }, []);

  const fetchDetails = async (page = 1) => {
    try {
      const response = await post(
        booking_list,
        { user_id: userData.id, page: page.toString() },
        true
      );
      if (response.ok) {
        const data = await response.json();
        setDetails(data.data);
        setPagination(data.pagination);
        setTotalPages(data.pagination.totalPages); // assuming total pages are within pagination data
        setCurrentPage(page);
      } else {
        console.error("Failed To List");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchDetails();
    }
  }, [userData]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchDetails(newPage);
    }
  };

  // Generate array for pages based on totalPages
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <section className="pt-3 pb-5">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        theme="light"
      />
      <div className="container">
        <div className="row">
          <ProfileSidebarWidget />
          <div className="col-xl-9 col-lg-8">
            <MenuIcons />
            <div className="vstack gap-4">
              <div className="border bg-transparent card">
                <div className="bg-transparent border-bottom card-header">
                  <h3 className="card-header-title">
                    My Bookings ({pagination?.totallist || 0})
                  </h3>
                </div>
                <div className="p-0 card-body">
                  <div className="p-2 p-sm-4 tab-content">
                    <div role="tabpanel" className="fade tab-pane active show">
                      <div className="border-0 mb-4 card">
                        <div className="table-responsive">
                          <table className="table table-bordered table-striped m-0">
                            <thead className="thead-dark">
                              <tr>
                                <th>Airline</th>
                                <th>Booking Ref No</th>
                                <th>Origin/Destination</th>
                                <th>Passenger</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bookings.map((booking, index) => (
                                <BookingWidget key={index} data={booking} />
                              ))}
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
                              aria-current={
                                page === currentPage ? "page" : null
                              }
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
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage + 1)}
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
    </section>
  );
};

export default ProfileMain;

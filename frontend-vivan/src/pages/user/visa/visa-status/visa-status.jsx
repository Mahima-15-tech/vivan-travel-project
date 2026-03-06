import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import ProfileSidebarWidget from "../../profile-sidebar";
import { ToastContainer, toast } from "react-toastify";
import MenuIcons from "../../menu-icons";
import "../../../flight-listing/booking-area-listing.css";
import "./visa-status.css";
import { post } from "../../../../API/apiHelper";
import { useLocation } from "react-router-dom";

import {
  applied_visa_list,
  IMAGE_BASE_URL,
  details_visa,
  maincountry_list,
  visa_delete,
  API_BASE_URL,
} from "../../../../API/endpoints";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import VisaDetails from "../../../../widget/visa_details";
import { set } from "date-fns";

const VisaStatus = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tabParam = params.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam ? tabParam : "applied");
  const [isLoading, setIsLoading] = useState(false);
  const [visaData, setDetails] = useState([]);
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [options, setOptions] = useState([]);
  const [countrylist, setCountrylist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState(null);

  const toggleModal = (visa = null) => {
    setSelectedVisa(visa);
    setShowModal(!showModal);
  };

  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    } else {
      navigate("/login");
    }
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Get current hash (e.g., #/visa-status)
    const currentHash = window.location.hash.split("?")[0]; // only `#/visa-status`

    // Build new query string
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);

    // Construct new full URL with hash and query
    const newUrl = `${
      window.location.pathname
    }${currentHash}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);

    // Trigger API call
    fetchDetails(tab);
  };

  const fetchDetails = async (page) => {
    let Tab = page;

    // Check if `page` is null, undefined, or empty string
    const isEmpty = (val) =>
      val === undefined || val === null || val.trim?.() === "";

    if (isEmpty(Tab)) {
      const params = new URLSearchParams(location.search);
      const tabParam = params.get("tab");

      Tab = !isEmpty(tabParam) ? tabParam : "applied";
    }
    setIsLoading(true);
    try {
      const response = await post(
        applied_visa_list,
        {
          id: userData.id,
          page: (page || 1).toString(),
          limit: "10",
          Tab: Tab,
        },
        true
      );
      if (response.ok) {
        const data = await response.json();
        setDetails(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        console.error("Failed to fetch visa details");
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
    let scountry;
    let country_type = "visa";
    if (userData && userData.type == 2) {
      scountry = userData.agents.block_visa_country;
      country_type = "";
    }
    const fatchcountry = async (country) => {
      try {
        const res = await post(
          maincountry_list,
          {
            type: country_type,
            country: scountry ? scountry : "",
            limit: 50000,
          },
          true
        );
        const response = await res.json();
        setCountrylist(response.data);
        const options = response.data.map((option) => ({
          country_id: option.id,
          value: option.country_name,
          label: option.country_name,
          currency: option.currency,
        }));

        setOptions(options);
      } catch (error) {}
    };
    fatchcountry();
  }, [userData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handlePageChangeVisa = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchDetails(newPage);
      setCurrentPage(newPage);
    }
  };

  const pagesVisa = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleClick = async (visa) => {
    const encodedData = btoa(visa.visa_id);

    // const response = await post(details_visa, { id: visa.visa_id });
    // const data = await response.json();
    const formData = {
      going_from: visa.appliedvisa.going_from,
      going_to: visa.appliedvisa.going_to,
      travelDate: visa.travelDate,
      returnDate: visa.returnDate,
      visa_data: countrylist.find(
        (country) => country.country_name === visa.appliedvisa.going_to
      ),
      applied_visa_refrense_no: visa.refrense_no,
      applied_visa_id: visa.id,
    };
    const jsonString = JSON.stringify(formData);
    const encodedformData = btoa(jsonString);
    const encodedid = btoa(visa.id);
    window.open(
      `/#/visa-verification/?data=${encodedData}&other=${encodedformData}`,
      "_blank"
    );
  };

  const handleDelete = (visa) => {
    const draftVisa = visa.applied_visa_list.find(
      (item) => item.status && item.status.toLowerCase() === "draft"
    );

    if (!draftVisa) {
      alert("No draft visa found to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this draft visa?"
    );
    if (!confirmDelete) return;

    fetch(API_BASE_URL + visa_delete + `/${draftVisa.refrense_no}`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete visa");
        return res.json();
      })
      .then((data) => {
        alert("Draft visa deleted successfully!");
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting draft visa.");
      });
  };

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

            <div className="vstack gap-4">
              <div className="border bg-transparent card">
                <div className="bg-transparent border-bottom card-header">
                  <h3 className="card-header-title">Applied Visa History</h3>
                </div>
                <div className="p-0 card-body">
                  <div className="p-2 p-sm-4 tab-content">
                    {/* Tabs for All, Draft */}
                    <ul className="nav nav-tabs mb-4">
                      <li className="nav-item">
                        <button
                          className={`nav-link ${
                            activeTab === "all" ? "active" : ""
                          }`}
                          onClick={() => handleTabClick("all")}
                        >
                          All
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${
                            activeTab === "applied" ? "active" : ""
                          }`}
                          onClick={() => handleTabClick("applied")}
                        >
                          Applied
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${
                            activeTab === "draft" ? "active" : ""
                          }`}
                          onClick={() => handleTabClick("draft")}
                        >
                          Draft
                        </button>
                      </li>
                    </ul>
                    <div role="tabpanel" className="fade tab-pane active show">
                      <div className="border-0 mb-4 card">
                        {visaData.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-bordered table-striped table-hover m-0">
                              <thead className="thead-dark">
                                <tr>
                                  <th>Reference Number</th>
                                  <th>Name</th>
                                  <th>Submitted On</th>
                                  <th>Passport Number</th>
                                  <th>Pan Number</th>
                                  <th>Nationality</th>
                                  <th>Visa Type</th>
                                  <th>Status</th>
                                  {/* <th>Remarks</th> */}
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {visaData.map((visa) => (
                                  <tr key={visa.id}>
                                    <td>{visa.refrense_no}</td>
                                    <td>
                                      {visa.applied_visa_list.map(
                                        (visa_user) => (
                                          <div
                                            key={visa_user.id}
                                            className="onelinetext"
                                          >
                                            {visa_user.first_name}{" "}
                                            {visa_user.last_name}
                                          </div>
                                        )
                                      )}
                                    </td>
                                    <td>
                                      {new Date(visa.createdAt).toLocaleString(
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
                                    </td>
                                    <td>
                                      {visa.applied_visa_list.map(
                                        (visa_user) => (
                                          <div
                                            key={visa_user.id}
                                            className="onelinetext"
                                          >
                                            {visa_user.passport_no
                                              ? visa_user.passport_no
                                              : " N/A"}
                                          </div>
                                        )
                                      )}
                                    </td>
                                    <td>
                                      {visa.applied_visa_list.map(
                                        (visa_user) => (
                                          <div
                                            key={visa_user.id}
                                            className="onelinetext"
                                          >
                                            {" "}
                                            {visa_user.pen_card_no &&
                                            visa_user.pen_card_no.trim() !== ""
                                              ? visa_user.pen_card_no
                                              : "N/A"}
                                          </div>
                                        )
                                      )}
                                    </td>
                                    <td>
                                      {" "}
                                      {visa.applied_visa_list.map(
                                        (visa_user) => (
                                          <div
                                            key={visa_user.id}
                                            className="onelinetext"
                                          >
                                            {visa_user.nationality ?? " N/A"}
                                          </div>
                                        )
                                      )}
                                    </td>
                                    <td>
                                      {visa.applied_visa_list.length == 1
                                        ? "Individual"
                                        : "Group"}
                                    </td>

                                    <td>
                                      {visa.applied_visa_list.map(
                                        (visa_user) => (
                                          <>
                                            {" "}
                                            <span
                                              style={{
                                                color:
                                                  visa_user.status ===
                                                  "In Process"
                                                    ? "orange"
                                                    : visa_user.status ===
                                                      "Additional Document Required"
                                                    ? "red"
                                                    : visa_user.status ===
                                                      "On Hold"
                                                    ? "red"
                                                    : visa_user.status ===
                                                      "Rejected"
                                                    ? "red"
                                                    : "green",
                                              }}
                                            >
                                              <b className="onelinetext text-capitalize">
                                                {visa_user.status}
                                              </b>
                                            </span>
                                            <br></br>
                                          </>
                                        )
                                      )}
                                    </td>
                                    {/* <td>{visa.remark ? visa.remark : "N/A"}</td> */}
                                    <td>
                                      <div className="action-buttons d-flex gap-2">
                                        <button
                                          className="btn btn-success btn-sm action-button px-2 py-1"
                                          onClick={() => toggleModal(visa)}
                                        >
                                          <i className="fa fa-eye m-1"></i>
                                          <span className="button-text">
                                            View
                                          </span>
                                        </button>

                                        {/* Show "Pay and Process" button if status is draft */}
                                        {visa.applied_visa_list.filter(
                                          (item) =>
                                            item.status &&
                                            (item.status.toLowerCase() ===
                                              "draft" ||
                                              item.status.toLowerCase() ===
                                                "additional document required")
                                        ).length > 0 && (
                                          <button
                                            className="btn btn-warning btn-sm action-button px-2 py-1"
                                            onClick={() => handleClick(visa)}
                                          >
                                            <i className="fa fa-edit m-1"></i>
                                            <span className="button-text">
                                              Edit
                                            </span>
                                          </button>
                                        )}
                                        {visa.created_file && (
                                          <a
                                            href={`${
                                              IMAGE_BASE_URL + visa.created_file
                                            }`}
                                            className="btn btn-primary btn-sm action-button px-2 py-1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download="visa_file.pdf"
                                          >
                                            <i className="fa fa-download m-1"></i>{" "}
                                            <span className="button-text">
                                              Download Visa
                                            </span>
                                          </a>
                                        )}
                                        {visa.insurance_file && (
                                          <a
                                            href={`${
                                              IMAGE_BASE_URL +
                                              visa.insurance_file
                                            }`}
                                            className="btn btn-primary btn-sm action-button px-2 py-1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download="insurance_file.pdf"
                                          >
                                            <i className="fa fa-download m-1"></i>
                                            <span className="button-text">
                                              Download Insurance
                                            </span>
                                          </a>
                                        )}

                                        {visa.applied_visa_list.some(
                                          (item) =>
                                            item.status &&
                                            item.status.toLowerCase() ===
                                              "draft"
                                        ) && (
                                          <button
                                            className="btn btn-danger btn-sm action-button px-2 py-1"
                                            onClick={() => handleDelete(visa)}
                                          >
                                            <i className="fa fa-trash m-1"></i>
                                            <span className="button-text">
                                              Delete
                                            </span>
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="no-data-found mt-5">
                            <div className="text-center">
                              <div className="mt-4">
                                <svg
                                  xmlns="  "
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
                                handlePageChangeVisa(currentPage - 1)
                              }
                              disabled={currentPage === 1}
                            >
                              ‹
                            </button>
                          </li>
                          {pagesVisa.map((page) => (
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
                                  onClick={() => handlePageChangeVisa(page)}
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
                                handlePageChangeVisa(currentPage + 1)
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

                  <Modal
                    show={showModal}
                    onHide={toggleModal}
                    size="fullscreen"
                    backdrop="static"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Applied Visa Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-2">
                      {selectedVisa && <VisaDetails visa={selectedVisa} />}
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisaStatus;

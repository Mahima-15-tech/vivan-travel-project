import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { post, get } from "../../API/apiHelper";
import VisaTable from "./Visalist";
import { Button, Modal, Form, Col, FormGroup, FormLabel, FormControl, Row } from "react-bootstrap";
import {
  visa_add,
  visalist,
  siteconfig,
  maincountry_list,
} from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import usersimage from "../../Assets/Images/visa.png";
import "./VisaDetails.css";
import Select from "react-select";

function Visa() {
  const navigate = useNavigate();
  const [going_f, going_from] = useState("");
  const [going_t, going_to] = useState("");
  const [v_status, status] = useState("");
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

    const [options, setOptions] = useState([]);
    const [countrylist, setCountrylist] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [issearch, setIssearch] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, SetLoading] = useState(true);

  // New states for modal
  const [showModal, setShowModal] = useState(false);
  const [newVisa, setNewVisa] = useState({
    going_from: "",
    going_to: "",
    about: "",
    description: "",
    entry: "",
    validity: "",
    processing_time: "",
    amount: "",
    child_amount: "",
    absconding_fees: "",
    duration: "",
    documents: "",
    status: "Active",
  });

  const handlePageChange = (page) => {
    setcurrentPage(page);
    getvisalist(page);
  };

  const handleSearch = () => {
    setcurrentPage(1);
    setIssearch(true);
    getvisalist(1);
  };

  const handleReset = () => {
    setcurrentPage(1);
    setIssearch(false);
    getvisalist(1);
    window.location.reload();
  };

  useEffect(() => {
    if (settings) {
      getvisalist(1);
    }
  }, [settings,]);

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
 const fatchcountry = async (country) => {
   try {
     const res = await post(
       maincountry_list,
       { limit: 50000 },
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
   } catch (error) {
     console.log(error);
   }
 };
 fatchcountry();
    fetchSettings();
  }, []);

  async function getvisalist(page) {
    if (!settings) {
      return;
    }

    SetLoading(true);
    const response = await post(
      visalist,
      {
        page: page||currentPage,
        limit: settings.par_page_limit,
        going_from: issearch ? going_f : "",
        going_to: issearch ? going_t : "",
        status: issearch ? v_status : "",
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

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false);
    setNewVisa({
      going_from: "",
      going_to: "",
      about: "",
      description: "",
      entry: "",
      validity: "",
      processing_time: "",
      amount: "",
      child_amount: "",
      absconding_fees: "",
      duration: "",
      documents: "",
      status: "Active",
    });
  };

  const handleNewVisaChange = (e) => {
    const { name, value } = e.target;
    setNewVisa((prev) => ({ ...prev, [name]: value }));
  };

    const countryname = (e) => {
      const { name, value } = e.target;
      setNewVisa((prev) => ({ ...prev, [name]: value }));
    };
  const handleNewVisaSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await post(visa_add, newVisa, true);
      if (response.status === 200) {
        toast.success("Visa added successfully!");
        handleModalClose();
        getvisalist(currentPage);
      } else {
        toast.error("Failed to add visa.");
      }
    } catch (error) {
      toast.error("An error occurred while adding visa.");
    }
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
            Visa list
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
                      placeholder="Search by Going from"
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
                      placeholder="Search by Going to"
                      aria-label="Search orders"
                      onChange={handle_gt}
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
                        <option value="Active">Active</option>
                        <option value="Deactive">Deactive</option>
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
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={handleModalShow}
                    >
                      + Add Visa
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
                  <th>SL</th>
                  <th>From - Where</th>
                  <th>About</th>
                  <th>Description</th>
                  <th>Entry</th>
                  <th>Validity</th>
                  <th>Processing time</th>
                  <th>Child Amount</th>
                  <th>Amount</th>
                  <th>Absconding fees</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              {loading ? (
                <CircularProgressBar />
              ) : (
                <tbody>
                  {res.data.map((visas, index) => (
                    <VisaTable
                      key={index}
                      data={visas}
                      onUpdate={getvisalist}
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
        </div>
      </div>

      {/* Modal for Adding Visa */}

      <Modal show={showModal} onHide={handleModalClose} className="cstmnodl">
        <Modal.Header closeButton>
          <Modal.Title>Add Visa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleNewVisaSubmit}>
            <Row>
              <Col md={6}>
                <FormGroup controlId="going_from">
                  <FormLabel>Going From</FormLabel>
                  {/* <FormControl
                    type="text"
                    name="going_from"
                    value={newVisa.going_from}
                    onChange={handleNewVisaChange}
                    required
                  /> */}
                  <Select
                    options={options}
                    name="going_from"
                    id="going_from"
                    value={options.find(
                      (option) => option.value === newVisa.going_from
                    )}
                    className="form-control with-icon"
                    classNamePrefix="react-select"
                    // placeholder="Citizen of"
                    isSearchable
                    required
                    onChange={(e) =>
                      setNewVisa((prev) => ({
                        ...prev,
                        ["going_from"]: e.value,
                      }))
                    }
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        paddingLeft: "1.6rem",
                      }),
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup controlId="going_to">
                  <FormLabel>Going To</FormLabel>
                  {/* <FormControl
                    type="text"
                    name="going_to"
                    value={newVisa.going_to}
                    onChange={handleNewVisaChange}
                    required
                  /> */}
                  <Select
                    options={options}
                    name="going_to"
                    id="going_to"
                    value={options.find(
                      (option) => option.value === newVisa.going_to
                    )}
                    className="form-control with-icon"
                    classNamePrefix="react-select"
                    // placeholder="Citizen of"
                    isSearchable
                    required
                    onChange={(e) =>
                      setNewVisa((prev) => ({
                        ...prev,
                        ["going_to"]: e.value,
                      }))
                    }
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        paddingLeft: "1.6rem",
                      }),
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup controlId="about">
                  <FormLabel>About</FormLabel>
                  <FormControl
                    type="text"
                    name="about"
                    value={newVisa.about}
                    onChange={handleNewVisaChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <FormLabel>Description</FormLabel>
                  <FormControl
                    as="textarea"
                    rows={4}
                    name="description"
                    value={newVisa.description}
                    onChange={handleNewVisaChange}
                    placeholder="Enter a detailed description" // Optional placeholder
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup controlId="entry">
                  <FormLabel>Entry</FormLabel>
                  <FormControl
                    type="text"
                    name="entry"
                    value={newVisa.entry}
                    onChange={handleNewVisaChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup controlId="validity">
                  <FormLabel>Validity</FormLabel>
                  <FormControl
                    type="text"
                    name="validity"
                    value={newVisa.validity}
                    onChange={handleNewVisaChange}
                    required
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup controlId="duration">
                  <FormLabel>Duration</FormLabel>
                  <FormControl
                    type="text"
                    name="duration"
                    value={newVisa.duration}
                    onChange={handleNewVisaChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup controlId="processing_time">
                  <FormLabel>Processing Time</FormLabel>
                  <FormControl
                    type="text"
                    name="processing_time"
                    value={newVisa.processing_time}
                    onChange={handleNewVisaChange}
                    required
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup controlId="documents">
                  <FormLabel>Documents</FormLabel>
                  <FormControl
                    type="text"
                    name="documents"
                    value={newVisa.documents}
                    onChange={handleNewVisaChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={newVisa.going_to == "United Arab Emirates"?3:6}>
                <FormGroup controlId="amount">
                  <FormLabel>Amount</FormLabel>
                  <FormControl
                    type="number"
                    name="amount"
                    value={newVisa.amount}
                    onChange={handleNewVisaChange}
                    required
                  />
                </FormGroup>
              </Col>
              {newVisa.going_to == "United Arab Emirates" && (
                <Col md={3}>
                  <FormGroup controlId="amount">
                    <FormLabel>Child Amount</FormLabel>
                    <FormControl
                      type="number"
                      name="child_amount"
                      value={newVisa.child_amount}
                      onChange={handleNewVisaChange}
                      required
                    />
                  </FormGroup>
                </Col>
              )}

              <Col md={6}>
                <FormGroup controlId="absconding_fees">
                  <FormLabel>Absconding Fees</FormLabel>
                  <FormControl
                    type="number"
                    name="absconding_fees"
                    value={newVisa.absconding_fees}
                    onChange={handleNewVisaChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup controlId="status">
                  <FormLabel>Status</FormLabel>
                  <FormControl
                    as="select"
                    name="status"
                    value={newVisa.status}
                    onChange={handleNewVisaChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Deactive">Deactive</option>
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>
            <br />
            <Button variant="primary" type="submit">
              Add Visa
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </main>
  );
}

export default Visa;

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { post, get } from "../../API/apiHelper";
import Countrylist from "./List";
import {
  Button,
  Modal,
  Form,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  Row,
} from "react-bootstrap";
import {
  country_list,
  siteconfig,
  country_add,country_status_list
} from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import citys from "../../Assets/Images/airport.png";

function Country() {
  const navigate = useNavigate();
  const [name, Setname] = useState("");
  const [shortname, Setshortname] = useState("");
  const [status, Setstatus] = useState("");
  const [res, setResponce] = useState({
    status: true,
    message: "Data retrieved successfully",
    data: [],
    pagination: {
      totalUsers: 1,
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
    },
  });  const [countryData, setCountryData] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [modalData, setModalData] = useState({
    status: "",
    country_code: "",
    alpha_2: "",
    alpha_3: "",
    let: "",
    lng: "",
    country_id:""
  });

  const [currentPage, setcurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [issearch, setIssearch] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, SetLoading] = useState(true);

  // New states for modal
  const [showModal, setShowModal] = useState(false);


  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setcurrentPage(page);
      getcountrylist(page);
    }
  };

  const handleSearch = () => {
    setcurrentPage(1);
    setIssearch(true);
    getcountrylist(1);
  };

  const handleReset = () => {
    setcurrentPage(1);
    setIssearch(false);
    getcountrylist(1);
    window.location.reload();
  };

  useEffect(() => {
    if (settings) {
      getcountrylist(currentPage);
    }
  }, [settings, currentPage]);

  const hangle_short = (event) => {
    Setshortname(event.target.value);
  };
  const handle_country = (event) => {
    Setname(event.target.value);
  };

  const country_status = (event) => {
    Setstatus(event.target.value);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      SetLoading(true);
      try {
        const res = await get(siteconfig, true);
        const response = await res.json();
        setSettings(response.data);
          const countryresponse = await post(
            country_status_list,
            {
              is_from_all: "yes",
              otb_status: "",
              visa_status: "",
              limit: 10000,
              search: "",
            },
            true
          );
          const datacountry = await countryresponse.json();

          if (countryresponse.status === 200) {
            setCountryData(datacountry.data);
          }
      } catch (error) {
        toast.error("Failed to fetch settings");
      } finally {
        SetLoading(false);
      }
    };

    fetchSettings();
  }, []);

  async function getcountrylist(page) {
    console.log(page);
    if (!settings) {
      return;
    }

    SetLoading(true);
    const response = await post(
      country_list,
      {
        page: page,
        limit: settings.par_page_limit,
        name: issearch ? name : "",
        alpha_2: issearch ? shortname : "",
        status: issearch ? status : "",
      },
      true
    );
    const data = await response.json();

    if (response.status === 200) {
      setResponce(data);      

      if (page === 1) {
        const totalPages = data.pagination.totalPages;
        const pagesArray = Array.from(
          { length: totalPages },
          (_, index) => index + 1
        );
        setPages(pagesArray);
      }
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

  const handleModalClose = () => {
    setShowModal(false);
   
  };

  const handleNewVisaChange = (e) => {
    const { name, value } = e.target;
  };

  const handleShowEdit = () => {
    setModalData({
      status: "",
      country_code: "",
      alpha_2: "",
      alpha_3: "",
      let: "",
      lng: "",
      country_id:""
    });
    setShowEditModal(true);
  };
  const handleSave = async () => {
    try {
      const response = await post(
        country_add,
        {
          status: modalData.status,
          country_code: modalData.country_code,
          alpha_2: modalData.alpha_2,
          alpha_3: modalData.alpha_3,
          let: modalData.let,
          lng: modalData.lng,
          country_id: modalData.country_id,
        },
        true
      );
      const data = await response.json();
      if (data.status === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      handleCloseEdit();
      // onUpdate();
    } catch (error) {
      toast.error("An error occurred");
    }
  };
  const handleCloseEdit = () => setShowEditModal(false);

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
            <img width="30" src={citys} alt="" />
            Airport list
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
                      type="text"
                      name="country_name"
                      className="form-control"
                      placeholder="Search by name"
                      aria-label="Search name"
                      onChange={handle_country}
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
                      type="text"
                      name="alpha_2"
                      className="form-control"
                      placeholder="Search short name"
                      aria-label="Search name"
                      onChange={hangle_short}
                    />
                  </div>

                  <div className="input-group input-group-merge col-12 col-sm-6 col-md-4 col-lg-3 mb-2">
                    <FormGroup>
                      <FormControl
                        as="select"
                        name="searchStatus"
                        className="form-control"
                        value={status}
                        onChange={country_status}
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
                    <div style={{ width: "4px" }}></div>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                    <div style={{ width: "4px" }}></div>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={handleShowEdit}
                    >
                      Add
                    </button>
                    {/* <Button variant="danger" size="sm" onClick={handleShowEdit}>
                      <i className="tio-edit"></i>
                    </Button> */}
                    <Modal show={showEditModal} onHide={handleCloseEdit}>
                      <Modal.Header closeButton className="customModalHeader">
                        <Modal.Title>Add New</Modal.Title>
                      </Modal.Header>
                      <Form>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={modalData.country_code}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              country_code: e.target.value,
                            })
                          }
                        ></Form.Control>
                        <Form.Group controlId="country_id">
                          <Form.Label>Country Name:</Form.Label>
                          <Form.Control
                            as="select"
                            value={modalData.country_id}
                            onChange={(e) =>
                              setModalData({
                                ...modalData,
                                country_id: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Country</option>
                            {countryData.map((country) => (
                              <option key={country.id} value={country.id}>
                                {country.country_name}
                                {/* Replace `name` with the appropriate property name from your `countryData` */}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                        <Form.Label>SHORT NAME 1</Form.Label>
                        <Form.Control
                          type="text"
                          value={modalData.alpha_2}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              alpha_2: e.target.value,
                            })
                          }
                        ></Form.Control>
                        <Form.Label>SHORT NAME 2</Form.Label>
                        <Form.Control
                          type="text"
                          value={modalData.alpha_3}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              alpha_3: e.target.value,
                            })
                          }
                        ></Form.Control>
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control
                          type="text"
                          value={modalData.let}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              let: e.target.value,
                            })
                          }
                        ></Form.Control>
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control
                          type="text"
                          value={modalData.lng}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              lng: e.target.value,
                            })
                          }
                        ></Form.Control>
                        <Form.Group controlId="status">
                          <Form.Label>Status:</Form.Label>
                          <Form.Control
                            as="select"
                            value={modalData.status}
                            onChange={(e) =>
                              setModalData({
                                ...modalData,
                                status: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Status</option>
                            <option value="Deactive">Deactive</option>
                            <option value="Active">Active</option>
                          </Form.Control>
                        </Form.Group>
                      </Form>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEdit}>
                          Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                          Save
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive datatable-custom">
            <table className="table table-hover table-bordered table-thead-bordered table-nowrap table-align-middle card-table w-100">
              <thead className="thead-light thead-50 text-capitalize">
                <tr>
                  <th className="text-center">SL</th>
                  <th className="text-center">airport name</th>
                  <th className="text-center">Country name</th>
                  <th className="text-center">short name 1</th>
                  <th className="text-center">short name 2</th>
                  <th className="text-center">latitude</th>
                  <th className="text-center">longitude </th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              {loading ? (
                <CircularProgressBar />
              ) : (
                <tbody>
                  {res.data.map((data, index) => (
                    <Countrylist
                      key={index}
                      list={countryData}
                      data={data}
                      onUpdate={getcountrylist}
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
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
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
                      disabled={currentPage === res.pagination.totalPages}
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

export default Country;

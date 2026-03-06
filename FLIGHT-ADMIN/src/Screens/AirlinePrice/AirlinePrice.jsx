import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { post, get } from "../../API/apiHelper";
import AirlinePriceList from "./AirlinePriceList";
import {
  createOrUpdateAirlinePrice,airlinelist,
  country_status_list,
} from "../../API/endpoints";

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
import { listAirlinePrices, siteconfig } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import airport_image from "../../Assets/Images/airport.png";

function AirlinePrice() {
  const navigate = useNavigate();
  const [going_f, going_from] = useState("");
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
  });
  const [AirlinePriceData, setAirlinePriceData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [airlineData, setAirlineData] = useState([]);

  const [currentPage, setcurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, SetLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalData, setModalData] = useState({
    airline_id: "",
    country_id: "",
    price: "",
    status: "",
  });
  const handleCloseEdit = () => setShowEditModal(false);
  const handleSave = async () => {
    try {
      if (
        modalData.airline_id != "" &&
        modalData.country_id != "" &&
        modalData.price != "" &&
        modalData.status != ""
      ) {
        const response = await post(
          createOrUpdateAirlinePrice,
          {
            airline_id: modalData.airline_id,
            country_id: modalData.country_id,
            price: modalData.amount,
            status: modalData.status,
          },
          true
        );
        const data = await response.json();
        getcountrylist(1);
        if (data.status === false) {
          toast.error(data.message);
        } else {
          toast.success(data.message);
        }
        handleCloseEdit();
        // onUpdate();
      } else {
        toast.error("All Field Required");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setcurrentPage(page);
      getcountrylist(page);
    }
  };
  const handleShowEdit = () => {
    setModalData({
      status: "",
      country_code: "",
      alpha_2: "",
      alpha_3: "",
      let: "",
      lng: "",
    });
    setShowEditModal(true);
  };
  const handleSearch = () => {
    setcurrentPage(1);
    getcountrylist(1);
  };

  const handleReset = () => {
    setcurrentPage(1);
    getcountrylist(1);
    window.location.reload();
  };
  useEffect(() => {
    if (settings) {
      getcountrylist(currentPage);
    }
  }, [settings, currentPage]);

  const handle_country = (event) => {
    going_from(event.target.value);
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

  async function getcountrylist(page) {
    console.log(page);
    if (!settings) {
      return;
    }

    SetLoading(true);
    const response = await post(
      listAirlinePrices,
      {"isadmin":"yes",
        page: page,
      },
      true
    );
    const data = await response.json();

    if (response.status === 200) {
      setResponce(data);
      setAirlinePriceData(data.data);

      if (page === 1) {
        const totalPages = data.pagination.totalPages;
        const pagesArray = Array.from(
          { length: totalPages },
          (_, index) => index + 1
        );
        setPages(pagesArray);
      }
      SetLoading(false);
      const countryresponse = await post(
        country_status_list,
        {
          is_from_all: "yes",
          otb_status: "",
          visa_status: "",
          limit:10000,
          search:""
        },
        true
      );
    const datacountry = await countryresponse.json();

    if (countryresponse.status === 200) {
      setCountryData(datacountry.data);
    }
      const airlineresponse = await post(
        airlinelist,
        {
          is_from_all: "yes",
          otb_status: "",
          visa_status: "",
          limit: 10000,
          search: "",
        },
        true
      );
    const dataairline = await airlineresponse.json();

    if (airlineresponse.status === 200) {
      setAirlineData(dataairline.data);
    }
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
  const handleUpdate = (updatedItem, index) => {
    setAirlinePriceData((prevData) => {
      const newData = [...prevData];
      newData[index] = updatedItem;
      return newData;
    });
    // setAirlinePriceData((prevData) => {
    //   const newData = [...prevData];
    //   newData[index] = updatedItem;
    //   return newData;
    // });
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
            <img width="30" src={airport_image} alt="" />
            OTB Price list
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
                    {/* <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="tio-search"></i>
                      </div>
                    </div>
                    <input
                      id="datatableSearch_"
                      type="text"
                      name="country_name"
                      className="form-control"
                      placeholder="Search by country name"
                      aria-label="Search country name"
                      onChange={handle_country}
                    /> */}
                  </div>

                  {/* <div className="input-group input-group-merge col-12 col-sm-6 col-md-4 col-lg-3 mb-2">
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
                  </div> */}

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
                      <Form.Group controlId="airline_id">
                        <Form.Label>Airline Name:</Form.Label>
                        <Form.Control
                          as="select"
                          value={modalData.airline_id}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              airline_id: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Airline</option>
                          {airlineData.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                              {/* Replace `name` with the appropriate property name from your `countryData` */}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
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
                      <Form.Group controlId="Amount">
                        <Form.Label>Amount:</Form.Label>
                        <Form.Control
                          type="number"
                          name="amount"
                          value={modalData.amount}
                          min="0"
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              amount: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
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
                          <option value="Active">Active</option>
                          <option value="Deactive">Deactive</option>
                        </Form.Control>
                        <Form.Control
                          type="hidden"
                          value={modalData.id}
                          onChange={(e) =>
                            setModalData({ ...modalData, id: e.target.value })
                          }
                        />
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

          <div className="table-responsive datatable-custom">
            <table className="table table-hover table-bordered table-thead-bordered table-nowrap table-align-middle card-table w-100">
              <thead className="thead-light thead-50 text-capitalize">
                <tr>
                  <th className="text-center">SL</th>
                  <th className="text-center">Airline Name</th>
                  <th className="text-center">Country Name</th>
                  <th className="text-center">Amount</th>
                  <th className="text-center">Status </th>
                  <th className="text-center">Action </th>
                </tr>
              </thead>
              {loading ? (
                <CircularProgressBar />
              ) : (
                <tbody>
                  {AirlinePriceData.map((data, index) => (
                    <AirlinePriceList
                      key={index}
                      data={data}
                      onUpdate={(updatedItem) =>
                        handleUpdate(updatedItem, index)
                      }
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

export default AirlinePrice;

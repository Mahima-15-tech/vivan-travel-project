import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { post, get } from "../../API/apiHelper";
import CountryStatusList from "./AirlineList";
import {
  FormGroup,
  FormControl,
} from "react-bootstrap";
import { Modal, Button, Form } from "react-bootstrap";

import { airlinelist, siteconfig, airlineaddupdate } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import airport_image from "../../Assets/Images/plane.png";

function Airline() {
  const navigate = useNavigate();
  const [going_f, going_from] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);

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
  const [countryData, setCountryData] = useState([]);

  const [currentPage, setcurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, SetLoading] = useState(true);

  const [modalData, setModalData] = useState({
    id: "",
    name: "",
    code: "",
    airline_logo: null,
  });
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setcurrentPage(page);
      getairlinelist(page);
    }
  };

  const handleSearch = () => {
    setcurrentPage(1);
    getairlinelist(1);
  };

  const handleReset = () => {
    setcurrentPage(1);
    getairlinelist(1);
    window.location.reload();
  };

  useEffect(() => {
    if (settings) {
      getairlinelist(currentPage);
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

  async function getairlinelist(page) {
    console.log(page);
    if (!settings) {
      return;
    }

    SetLoading(true);
    const response = await post(
      airlinelist,
      {
        search: going_f || "",
        page: page,
      },
      true
    );
    const data = await response.json();

    if (response.status === 200) {
      setResponce(data);
      setCountryData(data.data);
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
  const handleUpdate = (updatedItem, index) => {
    setCountryData((prevData) => {
      const newData = [...prevData];
      newData[index] = updatedItem;
      return newData;
    });
    // setCountryData((prevData) => {
    //   const newData = [...prevData];
    //   newData[index] = updatedItem;
    //   return newData;
    // });
  };const handleShowEdit = () => {
    setModalData({
      name: "",
      code: "",
      airline_logo: null,
    });
    setShowEditModal(true);
  };
  const handleCloseEdit = () => setShowEditModal(false);
  const handleSave = async (dataval, type) => {
    try {
      if(modalData.name!==""&&modalData.code!==""&&modalData.airline_logo!==null){
      const response = await post(airlineaddupdate, modalData, true);
      const data = await response.json();
      getairlinelist(1);
      setShowEditModal(false);
      if (data.status == false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }}else{
        toast.error("All Field Required");
      }
    } catch (error) {
      setShowEditModal(false);

      toast.error("An error occurred");
    }
  };
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setModalData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
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
            Airline list
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
                      placeholder="Search by country name"
                      aria-label="Search country name"
                      onChange={handle_country}
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
                      Add New
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal show={showEditModal} onHide={handleCloseEdit}>
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>Update Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={modalData.name}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      name: e.target.value,
                    })
                  }
                ></Form.Control>

                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  value={modalData.code}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      code: e.target.value,
                    })
                  }
                ></Form.Control>

                <Form.Group controlId="logo">
                  <Form.Label>Upload Airline Logo</Form.Label>
                  <Form.Control
                    type="file"
                    name="airline_logo"
                    accept="image/"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Control
                  type="hidden"
                  value={modalData.id}
                  onChange={(e) =>
                    setModalData({ ...modalData, id: e.target.value })
                  }
                />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEdit}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="table-responsive datatable-custom">
            <table className="table table-hover table-bordered table-thead-bordered table-nowrap table-align-middle card-table w-100">
              <thead className="thead-light thead-50 text-capitalize">
                <tr>
                  <th className="text-center">SL</th>
                  <th className="text-center">name</th>
                  <th className="text-center">code</th>
                  <th className="text-center">logo</th>
                  <th className="text-center">Action </th>
                </tr>
              </thead>
              {loading ? (
                <CircularProgressBar />
              ) : (
                <tbody>
                  {countryData.map((data, index) => (
                    <CountryStatusList
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

export default Airline;

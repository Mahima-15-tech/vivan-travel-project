import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { post, get } from "../../API/apiHelper";
import CountryStatusList from "./CountryStatusList";
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
import Select from "react-select";
import { maincountry_add } from "../../API/endpoints";
import {
  country_status_list,
  siteconfig,
} from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import airport_image from "../../Assets/Images/skyscraper.png";

function Country() {
  const navigate = useNavigate();
  const [going_f, going_from] = useState("");
  const [otb_status, Updateotb_status] = useState("");
  const [visa_status, Updatevisa_status] = useState("");
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
  const [issearch, setIssearch] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, SetLoading] = useState(true);


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
    Updateotb_status("");
    Updatevisa_status("");
    setcurrentPage(1);
    setIssearch(false);
    getcountrylist(1);
    window.location.reload();
  };
  const [showModal, setShowModal] = useState(false);
  const [country, setcountry] = useState({
    country_name: "",
    code: "",
    currency: "",
    status: "Active",
  });
  const handlecountryChange = (e) => {
    const { name, value } = e.target;
    setcountry((prev) => ({ ...prev, [name]: value }));
  };
  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false);
    setcountry({
      name: "",
      code: "",
      currency: "",
    });
  };
  useEffect(() => {
    if (settings) {
      getcountrylist(currentPage);
    }
  }, [settings, currentPage]);


  const handle_country = (event) => {
    going_from(event.target.value);
  };
  const handleAddcountry = async (e) => {
    e.preventDefault();
    try {
      const response = await post(maincountry_add, country, true);
      if (response.status === 200) {
        toast.success("Visa added successfully!");
        handleModalClose();
       getcountrylist(0);
      } else {
        toast.error("Failed to add visa.");
      }
    } catch (error) {
      toast.error("An error occurred while adding visa.");
    }
  };
  const country_status = (event) => {
    Updatevisa_status(event.target.value);;
  };
  const otb_status_update = (event) => {
    Updateotb_status(event.target.value);
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
      country_status_list,
      {
        page: page,
        limit: settings.par_page_limit,
        search: going_f || "",
        otb_status: otb_status,
        visa_status: visa_status,
        is_from_all:"yes"
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
            Countries list
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
                    <FormGroup>
                      <FormControl
                        as="select"
                        name="searchStatus"
                        className="form-control"
                        value={visa_status}
                        onChange={country_status}
                      >
                        <option value="">Select Visa Status</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </FormControl>
                    </FormGroup>
                  </div>
                  <div className="input-group input-group-merge col-12 col-sm-6 col-md-4 col-lg-3 mb-2">
                    <FormGroup>
                      <FormControl
                        as="select"
                        name="searchStatus"
                        className="form-control"
                        value={otb_status}
                        onChange={otb_status_update}
                      >
                        <option value="">Select OTB Status</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
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
                    <div style={{ width: "10px" }}></div>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={handleModalShow}
                    >
                      + Add country
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            show={showModal}
            onHide={handleModalClose}
            className="cstmnodl"
          >
            <Modal.Header closeButton>
              <Modal.Title>Add Country</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleAddcountry}>
                <Row>
                  <Col md={6}>
                    <FormGroup controlId="about">
                      <FormLabel>Name</FormLabel>
                      <FormControl
                        type="text"
                        name="country_name"
                        value={country.country_name}
                        onChange={handlecountryChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <FormLabel>Code</FormLabel>
                      <FormControl
                        type="text"
                        name="code"
                        value={country.code}
                        onChange={handlecountryChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <FormLabel>currency</FormLabel>
                      <FormControl
                        type="text"
                        name="currency"
                        value={country.currency}
                        onChange={handlecountryChange}
                        required
                      />
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
          <div className="table-responsive datatable-custom">
            <table className="table table-hover table-bordered table-thead-bordered table-nowrap table-align-middle card-table w-100">
              <thead className="thead-light thead-50 text-capitalize">
                <tr>
                  <th className="text-center">SL</th>
                  <th className="text-center">name</th>
                  <th className="text-center">code</th>
                  <th className="text-center">currency</th>
                  <th className="text-center">allow for visa</th>
                  <th className="text-center">allow for otb </th>
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

export default Country;

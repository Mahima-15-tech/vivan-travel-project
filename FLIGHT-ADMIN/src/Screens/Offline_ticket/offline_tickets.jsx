import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { post, get } from "../../API/apiHelper";
import List from "./List";
import {
  Button,
  Modal,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";
import {
  offline_ticket_add,
  offline_ticket_list,
  siteconfig,
  airlinelist,
  country_list,
} from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import ticket_image from "../../Assets/Images/travel-agent.png";
import "react-toastify/dist/ReactToastify.css";

function OfflineTickets() {
  const navigate = useNavigate();

  // State Management
  const [Arirline, setAirline] = useState([]);
  const [countrys, setcountry] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    shortname: "",
    status: "",
    airline_id: "",
  });

  const [modalData, setModalData] = useState({
    airline_id: "",
    from_country_id: "",
    to_country_id: "",
    adult_price: "",
    child_price: "",
    infant_price: "",
    seat: "",
    flight_code: "",
    check_in_bag: "",
    cabin_in_bag: "",
    departure_time: "",
    arrived_time: "",
    isrefundable: "",
    status: "",
  });
  const [addstate, setAddState] = useState(false);

  const [state, setState] = useState({
    responseData: {
      status: true,
      message: "Data retrieved successfully",
      data: [],
      pagination: {
        totalUsers: 1,
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
      },
    },
    pages: [],
    isSearch: false,
    settings: null,
    loading: false,
    showAddModal: false,
  });

  // Handlers
  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleModalInputChange = (field) => (event) => {
    setModalData({ ...modalData, [field]: event.target.value });
  };

  const handlePageChange = (page) => {
    if (page !== state.responseData.pagination.currentPage) {
      setState((prev) => ({
        ...prev,
        responseData: {
          ...prev.responseData,
          pagination: { ...prev.responseData.pagination, currentPage: page },
        },
      }));
    }
  };

  const handleSearch = () => {
    setState((prev) => ({
      ...prev,
      isSearch: true,
      responseData: {
        ...prev.responseData,
        pagination: { ...prev.responseData.pagination, currentPage: 1 },
      },
    }));
  };

  const handleReset = () => {
    setFormData({ name: "", shortname: "", status: "", airline_id: "" });
    setState((prev) => ({
      ...prev,
      isSearch: false,
      responseData: {
        ...prev.responseData,
        pagination: { ...prev.responseData.pagination, currentPage: 1 },
      },
    }));
  };

  const handleShowAdd = () => {
    setModalData({
      airline_id: "",
      from_country_id: "",
      to_country_id: "",
      adult_price: "",
      child_price: "",
      infant_price: "",
      status: "",
    });
    setState((prev) => ({ ...prev, showAddModal: true }));
  };

  const handleCloseAdd = () => {
    setState((prev) => ({ ...prev, showAddModal: false }));
  };

  // API Calls
  const fetchSettings = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const res = await get(siteconfig, true);
      const response = await res.json();
      setState((prev) => ({ ...prev, settings: response.data }));
    } catch (error) {
      toast.error("Failed to fetch settings");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const fetchAirlines = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const airline = await post(airlinelist, { limit: 100000000 }, true);
      const airlines = await airline.json();
      if (airline.status === 200) {
        setAirline(airlines.data || []);
      } else {
        toast.error("Failed to fetch airlines");
      }
    } catch (error) {
      toast.error("Failed to fetch airlines");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const fetchCountry = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const country = await post(country_list, { limit: 100000000 }, true);
      const countryResponse = await country.json();
      if (countryResponse?.status && Array.isArray(countryResponse.data)) {
        setcountry(countryResponse.data);
      } else {
        toast.error("Invalid country data received");
        setcountry([]);
      }
    } catch (error) {
      toast.error("Failed to fetch countries");
      setcountry([]);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const fetchList = async () => {
    if (!state.settings) return;

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await post(
        offline_ticket_list,
        {
          page: state.responseData.pagination.currentPage,
          limit: state.settings.par_page_limit,
          name: state.isSearch ? formData.name : "",
          alpha_2: state.isSearch ? formData.shortname : "",
          status: state.isSearch ? formData.status : "",
          airline_id: state.isSearch ? formData.airline_id : "",
        },
        true
      );
      const data = await response.json();

      if (response.status === 200) {
        setState((prev) => ({
          ...prev,
          responseData: data,
          pages:
            data.pagination.totalPages > 1
              ? Array.from(
                  { length: data.pagination.totalPages },
                  (_, index) => index + 1
                )
              : [],
        }));
      } else {
        handleApiError(response, data);
      }
    } catch (error) {
      toast.error("An error occurred while fetching ticket list");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSave = async () => {
    try {
      setAddState(true);
      const response = await post(offline_ticket_add, modalData, true);
      const data = await response.json();

      if (data.status) {
        toast.success(data.message);
        handleCloseAdd();
        fetchList();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while saving ticket");
    } finally {
      setAddState(false);
    }
  };

  const handleApiError = (response, data) => {
    if (response.status === 403) {
      data.errors?.forEach((error) => toast.error(error.msg));
    } else if (response.status === 401) {
      sessionStorage.setItem("authtoken", null);
      navigate("/");
      toast.error("Session Expired");
    } else {
      toast.error("Something went wrong");
    }
  };

  // Effects
  useEffect(() => {
    fetchSettings();
    fetchAirlines();
    fetchCountry();
  }, []); // Run only on mount

  useEffect(() => {
    if (state.settings) {
      fetchList();
    }
  }, [
    state.settings,
    state.responseData.pagination.currentPage,
    state.isSearch,
  ]); // Fetch list when settings, page, or search state changes

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
            <img width="30" src={ticket_image} alt="Ticket" />
            Offline Ticket List
            <span className="badge badge-soft-dark radius-50">
              {/* {state.responseData.pagination.totallist || 0} */}
            </span>
          </h6>
        </div>
        <div className="card">
          <div className="px-3 py-4">
            <div className="row gy-3">
              {/* Search by name */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="input-group input-group-merge">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="tio-search"></i>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="country_name"
                    className="form-control"
                    placeholder="Search by name"
                    value={formData.name}
                    onChange={handleInputChange("name")}
                  />
                </div>
              </div>

              {/* Search by short name */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="input-group input-group-merge">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="tio-search"></i>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="alpha_2"
                    className="form-control"
                    placeholder="Search short name"
                    value={formData.shortname}
                    onChange={handleInputChange("shortname")}
                  />
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <FormGroup>
                  <FormControl
                    as="select"
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleInputChange("status")}
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Deactive">Deactive</option>
                  </FormControl>
                </FormGroup>
              </div>

              {/* Airline Dropdown */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <FormGroup>
                  <FormControl
                    as="select"
                    name="airline_id"
                    className="form-control"
                    value={formData.airline_id}
                    onChange={handleInputChange("airline_id")}
                  >
                    <option value="">Select Airline</option>
                    {Array.isArray(Arirline) &&
                      Arirline.map((airline) => (
                        <option key={airline.id} value={airline.id}>
                          {airline.name || "Unknown Airline"}
                        </option>
                      ))}
                  </FormControl>
                </FormGroup>
              </div>

              {/* Action Buttons */}
              <div className="col-12">
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={handleShowAdd}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Modal show={state.showAddModal} onHide={handleCloseAdd}>
            <Form>
              <Modal.Header closeButton className="customModalHeader">
                <Modal.Title>Add New Ticket</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FormGroup controlId="airline_id">
                  <FormLabel>Airline</FormLabel>
                  <FormControl
                    as="select"
                    value={modalData.airline_id}
                    onChange={handleModalInputChange("airline_id")}
                    required
                  >
                    <option value="" disabled>
                      Select Airline
                    </option>
                    {Array.isArray(Arirline) &&
                      Arirline.map((airline) => (
                        <option key={airline.id} value={airline.id}>
                          {airline.name || "Unknown Airline"}
                        </option>
                      ))}
                  </FormControl>
                </FormGroup>

                <FormGroup controlId="from_country_id">
                  <FormLabel>From</FormLabel>
                  <FormControl
                    as="select"
                    value={modalData.from_country_id}
                    onChange={handleModalInputChange("from_country_id")}
                    required
                  >
                    <option value="" disabled>
                      Select Country
                    </option>
                    {Array.isArray(countrys) &&
                      countrys.map((country) => (
                        <option key={country.id} value={country.id}>
                          {(country.alpha_2 || "N/A") +
                            " -- " +
                            (country.country_code || "N/A")}
                        </option>
                      ))}
                  </FormControl>
                </FormGroup>

                <FormGroup controlId="to_country_id">
                  <FormLabel>To</FormLabel>
                  <FormControl
                    as="select"
                    value={modalData.to_country_id}
                    onChange={handleModalInputChange("to_country_id")}
                    required
                  >
                    <option value="" disabled>
                      Select Country
                    </option>
                    {Array.isArray(countrys) &&
                      countrys.map((country) => (
                        <option key={country.id} value={country.id}>
                          {(country.alpha_2 || "N/A") +
                            " -- " +
                            (country.country_code || "N/A")}
                        </option>
                      ))}
                  </FormControl>
                </FormGroup>

                <FormGroup controlId="adult_price">
                  <FormLabel>Adult Price</FormLabel>
                  <FormControl
                    type="number"
                    min="0"
                    value={modalData.adult_price}
                    onChange={handleModalInputChange("adult_price")}
                    required
                  />
                </FormGroup>

                <FormGroup controlId="child_price">
                  <FormLabel>Child Price</FormLabel>
                  <FormControl
                    type="number"
                    min="0"
                    value={modalData.child_price}
                    onChange={handleModalInputChange("child_price")}
                    required
                  />
                </FormGroup>

                <FormGroup controlId="infant_price">
                  <FormLabel>Infant Price</FormLabel>
                  <FormControl
                    type="number"
                    min="0"
                    value={modalData.infant_price}
                    onChange={handleModalInputChange("infant_price")}
                    required
                  />
                </FormGroup>
                <FormGroup controlId="seat">
                  <FormLabel>Seat</FormLabel>
                  <FormControl
                    type="number"
                    min="0"
                    value={modalData.seat}
                    onChange={handleModalInputChange("seat")}
                    required
                  />
                </FormGroup>
                <FormGroup controlId="flight_code">
                  <FormLabel>Flight Code</FormLabel>
                  <FormControl
                    type="text"
                    min="0"
                    value={modalData.flight_code}
                    onChange={handleModalInputChange("flight_code")}
                    required
                  />
                </FormGroup>
                <FormGroup controlId="check_in_bag">
                  <FormLabel>Checkin Bag</FormLabel>
                  <FormControl
                    type="text"
                    min="0"
                    value={modalData.check_in_bag}
                    onChange={handleModalInputChange("check_in_bag")}
                    required
                  />
                </FormGroup>
                <FormGroup controlId="cabin_in_bag">
                  <FormLabel>Cabin Bag</FormLabel>
                  <FormControl
                    type="text"
                    min="0"
                    value={modalData.cabin_in_bag}
                    onChange={handleModalInputChange("cabin_in_bag")}
                    required
                  />
                </FormGroup>
                <FormGroup controlId="departure_time">
                  <FormLabel>Departure Date Time</FormLabel>
                  <FormControl
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    value={modalData.departure_time}
                    onChange={handleModalInputChange("departure_time")}
                    required
                  />
                </FormGroup>
                <FormGroup controlId="arrived_time">
                  <FormLabel>Arrived Date Time</FormLabel>
                  <FormControl
                    type="datetime-local"
                    min="0"
                    value={modalData.arrived_time}
                    onChange={handleModalInputChange("arrived_time")}
                    required
                  />
                </FormGroup>
                <FormGroup controlId="isrefundable">
                  <FormLabel>Is Refundable</FormLabel>
                  <FormControl
                    as="select"
                    value={modalData.isrefundable}
                    onChange={handleModalInputChange("isrefundable")}
                    required
                  >
                    <option value="" disabled>
                      Select Is Refundable
                    </option>
                    <option value="Yes">Yes</option>
                    <option value="No" selected>
                      No
                    </option>
                  </FormControl>
                </FormGroup>

                <FormGroup controlId="status">
                  <FormLabel>Status</FormLabel>
                  <FormControl
                    as="select"
                    value={modalData.status}
                    onChange={handleModalInputChange("status")}
                    required
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="Active">Active</option>
                    <option value="Deactive">Deactive</option>
                  </FormControl>
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAdd}>
                  Close
                </Button>
                {addstate ? (
                  <progress></progress>
                ) : (
                  <Button variant="primary" onClick={handleSave}>
                    Save
                  </Button>
                )}
              </Modal.Footer>{" "}
            </Form>
          </Modal>

          <div className="table-responsive datatable-custom">
            <table className="table table-hover table-bordered table-thead-bordered table-nowrap table-align-middle card-table w-100">
              <thead className="thead-light thead-50 text-capitalize">
                <tr>
                  <th className="text-center">SL</th>
                  <th className="text-center">Airline Name</th>
                  <th className="text-center">From</th>
                  <th className="text-center">To</th>
                  <th className="text-center">Adult Price</th>
                  <th className="text-center">Child Price</th>
                  <th className="text-center">Infant Price</th>
                  <th className="text-center">Seat</th>{" "}
                  <th className="text-center">Flight Code</th>
                  <th className="text-center">Check-In Bag</th>
                  <th className="text-center">Cabin Bag</th>
                  <th className="text-center">Departure</th>
                  <th className="text-center">Arrival</th>
                  <th className="text-center">Refundable</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {state.loading ? (
                  <tr>
                    <td colSpan="9">
                      <CircularProgressBar />
                    </td>
                  </tr>
                ) : state.responseData.data.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  Array.isArray(state.responseData.data) &&
                  state.responseData.data.map((data, index) => (
                    <List
                      key={data.id || index}
                      list={countrys}
                      data={data}
                      airlineList={Arirline}
                      onUpdate={fetchList}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-responsive mt-4">
            <div className="px-4 d-flex justify-content-lg-end">
              <nav className="pagination">
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      state.responseData.pagination.currentPage === 1
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        handlePageChange(
                          state.responseData.pagination.currentPage - 1
                        )
                      }
                      disabled={state.responseData.pagination.currentPage === 1}
                    >
                      ‹
                    </button>
                  </li>
                  {Array.isArray(state.pages) &&
                    state.pages.map((page) => (
                      <li
                        key={page}
                        className={`page-item ${
                          page === state.responseData.pagination.currentPage
                            ? "active"
                            : ""
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
                      state.responseData.pagination.currentPage ===
                      state.responseData.pagination.totalPages
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        handlePageChange(
                          state.responseData.pagination.currentPage + 1
                        )
                      }
                      disabled={
                        state.responseData.pagination.currentPage ===
                        state.responseData.pagination.totalPages
                      }
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

export default OfflineTickets;

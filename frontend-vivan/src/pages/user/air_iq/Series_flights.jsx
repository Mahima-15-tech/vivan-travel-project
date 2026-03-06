import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../flight-booking/flight-booking-main/flight-booking-main.css";
import "../../flight-listing/flight-listing.css";
import "../../flight-listing/flight-listing-main.css";
import "../../flight-listing/booking-area-listing.css";
import TitleBanner from "../../flight-listing/title-ban";
import icon2 from "../../../assets/images/flight_icon/icon-2.png";
import route_plane from "../../../assets/images/icon/route-plan.png";

import ProfileSidebarWidget from "../profile-sidebar";
import MenuIcons from "../menu-icons";
import { Box, Typography, Container } from "@mui/material";
import { FaPlaneSlash } from "react-icons/fa";
import NoFlightsSVG from "../../../assets/images/plane.png";
import { post } from "../../../API/airline";
import { get, post as apipost, formatDate } from "../../../API/apiHelper";
import {
  AIR_SEARCH,
  AIR_REPRINT,
  third_party,
  AIR_IQ,
  AIR_IQ_SEARCH,
  AIR_2_URL,
  country_list,
  siteconfig,
  AIR_FARERULE,
  api_logs,
} from "../../../API/endpoints";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AutoCompleteDropdown from "../../../widget/custom-dropdown/custom-dropdown";
import Progress from "../../../component/Loading";
import { MdOutlineDelete } from "react-icons/md";
import Series_flight_booking from "./Series_flight_booking";
import { Modal } from "react-bootstrap";

const FlightItem = ({
  flight,
  index,
  toggleExpand,
  expanded,
  othercharges,
  adultcount,
  onUpdate,
  onUpdatenew,
}) => {
  const Buttonclick = (ticket_id) => {
    onUpdatenew({
      ticket_id: ticket_id,
      flight: flight,
      charges: othercharges,
      adultcount: adultcount,
    });
  };

  return (
    <div className="meri_marji">
      <div className="flight-block bg-white light-shadow p-16 br-10 mb-16">
        <div className="flight-area">
          <div className="airline-name">
            <div>
              <h5 className="lightest-black mb-8">{flight.airline}</h5>
              <h6 className="dark-gray">{flight.flight_number}</h6>
            </div>
          </div>
          <div className="flight-detail">
            <div className="flight-departure">
              <h5 className="color-black">{flight.departure_time}</h5>
              <h5 className="dark-gray text-end">{flight.origin}</h5>
            </div>

            <div className="d-inline-flex align-items-center gap-8">
              <span>To</span>
              <div className="from-to text-center">
                <h5 className="dark-gray">{flight.inventory_type}</h5>
                <img
                  className="f_icon_list"
                  src={route_plane}
                  alt="route-plan"
                />
                <h6 className="color-black">{flight.flight_route}</h6>
              </div>
              <span>From</span>
            </div>

            <div className="flight-departure">
              <h5 className="color-black">{flight.arival_time}</h5>
              <h5 className="dark-gray">{flight.destination}</h5>
            </div>
          </div>

          <div className="flight-button">
            <div className="amount amountsss">
              <h5 className="color-black">
                ₹
                {(Number(flight.price) + Number(othercharges)) *
                  Number(adultcount.adult) +
                  (Number(flight.price) + Number(othercharges)) *
                    Number(adultcount.child) +
                  (Number(flight.infant_price) + Number(othercharges)) *
                    Number(adultcount.infant)}
              </h5>
              <h6 className="dark-gray text-end">Price</h6>
            </div>
          </div>
        </div>
        <hr className="bg-light-gray mt-16 mb-16" />
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="color-black">{formatDate(flight.departure_date)}</h5>
          <div>
            <button
              className="accordion-button color-primary h5 collapsed"
              onClick={() => Buttonclick(flight.ticket_id)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="paginations mt-8">
      <ul className="unstyled">
        {/* Previous Button */}
        <li className="arrow">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="h4 fw-600 mb-0"
            disabled={currentPage === 1}
          >
            <i className="far fa-chevron-left"></i>
          </button>
        </li>

        {/* Current Page and Total Pages Display */}
        <li className="page-info">
          <span className="h6 fw-600 mb-0">
            Page {currentPage} of {totalPages}
          </span>
        </li>

        {/* Next Button */}
        <li className="arrow">
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="h4 fw-600 mb-0"
            disabled={currentPage === totalPages}
          >
            <i className="far fa-chevron-right"></i>
          </button>
        </li>
      </ul>
    </div>
  );
};

const FlightList = ({
  flights,
  flightsPerPage,
  adult,
  onUpdate,
  onUpdatenew,
  configdata,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedIndex, setExpandedIndex] = useState(null);
  //   const [configdata, setSettings] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  // useEffect(() => {
  //     const fetchSettings = async () => {
  //         try {
  //             const res = await get(siteconfig, true);
  //             const response = await res.json();
  //             setSettings(response.data.series_flight_agency_charge);
  //         } catch (error) {
  //             console.log(error)
  //         }
  //     };

  //     fetchSettings();
  // }, []);

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(flights.length / flightsPerPage);

  return (
    <div>
      {currentFlights.map((flight, index) => (
        <FlightItem
          key={index}
          flight={flight}
          index={index}
          toggleExpand={toggleExpand}
          expanded={expandedIndex === index}
          othercharges={configdata ? configdata : "0"}
          adultcount={adult}
          onUpdate={(updatedItem) => {
            onUpdate({
              ...updatedItem,
            });
          }}
          onUpdatenew={(data) => {
            onUpdatenew({
              ...data,
            });
          }}
        />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

const Series_flights = () => {
  const navigate = useNavigate();
  const userDataFromSession = sessionStorage.getItem("userData");
  if (!userDataFromSession) {
    navigate("/login");
  }
  const [loading, setLoding] = useState(null);
  const [lastName, setLastName] = useState("");
  const [returnDate, setReturnDate] = useState(null);
  const [activeTabStatus, setActiveTabStatus] = useState("byRoute");
  const [tripinfodetails, setTripinfo] = useState([]);
  const [tripinfodata, setTripdata] = useState([]);
  const [setting, setSettings] = useState(null);
  const [configdata, setconfigdata] = useState("0");

  const fetchSettings = async () => {
    try {
      const res = await get(siteconfig, true);
      const response = await res.json();
      setSettings(response.data);
    } catch (error) {
      // console.log(error)
    }
  };
  let isuat = "";
  if (setting) {
    if (setting.airiq_api_prod_on == 1) {
      isuat = "no";
    } else {
      isuat = "yes";
    }
  }

  const handleTabClickStatus = (tabId) => {
    setActiveTabStatus(tabId);
  };

  const [depDate, setDepDate] = useState(null);
  const [passengers, setPassengers] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const [activeTab, setActiveTab] = useState("flight");
  const [flightType, setFlightType] = useState("0");
  const [bookingDetails, setBookingDetails] = useState({
    depFrom: "",
    arrivalTo: "",
    depDate: "",
    returnDate: "",
    promoCode: "",
  });
  const [arrivalTo, setArrivalTo] = useState("");
  const [departureFrom, setDepartureFrom] = useState("");
  const [showError, setShowError] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab == "status") {
      handleTabClickStatus("byRoute");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  const handleFlightTypeChange = (e) => {
    setFlightType(e.target.value);
  };
  const [selectedDate, setSelectedDate] = useState(null);

  const getNextDay = (date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  };

  const [flightsdata, setarraydata] = useState(null);
  const [flightsitem, setflightitem] = useState(null);
  const [searchlabel, setSearchlabel] = useState("Search Flight");
  const [tempflightData, setarraydata3] = useState(null);
  const [selectedAirline, setSelectedAirline] = useState("");
  const [airpostlist, setAirpostlist] = useState([]);

  const fetchCountry = async () => {
    try {
      const response = await apipost(
        country_list,
        { page: "0", limit: "50000" },
        true
      );
      const data = await response.json();
      const res = data.data.map((country) => ({
        code: country.alpha_2,
        name: country.country_name,
        country_id: country.country_id,
        display: `${country.alpha_2} - ${country.country_code}`,
      }));
      setAirpostlist(res);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchCountry();
    fetchSettings();
  }, []);

  const handleClear = () => {
    setSelectedAirline("");
    setarraydata(tempflightData);
  };
  const handleFilter = (event, type) => {
    let Shortdata = [...tempflightData]; // Initialize Shortdata to a copy of tempflightData
    if (type === "airline") {
      setSelectedAirline(event.target.value);
      Shortdata = tempflightData.filter((flight) =>
        flight.airline.toLowerCase().includes(event.target.value.toLowerCase())
      );
    }
    if (Shortdata.length === 0) {
      Shortdata = [...tempflightData]; // Reset to the original data
    }
    setarraydata(Shortdata); // Update the state with filtered data
  };

  let airlineCounts = [];
  if (tempflightData) {
    airlineCounts = tempflightData.reduce((acc, flight) => {
      const airlineName = flight.airline;
      acc[airlineName] = (acc[airlineName] || 0) + 1;
      return acc;
    }, {});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentTotal =
      passengers.adult + passengers.child + passengers.infant;
    if (currentTotal == 0) {
      setLoding(false);
      return alert("Select Passengers First..");
    } else if (passengers.adult == 0) {
      setLoding(false);
      return alert("Select one adult please..");
    }

    setLoding(true);
    Setselectedlistbooking([]);
    const departureFromdata = airpostlist.find(
      (item) => item.code === departureFrom
    );
    const arrivalTodata = airpostlist.find((item) => item.code === arrivalTo);

    if (!departureFromdata) {
      setLoding(false);
      return alert("Select vaild From");
    }
    if (!arrivalTodata) {
      setLoding(false);
      return alert("Select vaild To");
    }
    const formattedDate = depDate
      ? depDate.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : null;
    const payload = {
      api_c: "b",
      is_uat: isuat,
      origin: departureFrom,
      destination: arrivalTo,
      departure_date: formattedDate,
      adult: passengers.adult,
      child: passengers.child,
      infant: passengers.infant,
      airline_code: "",
    };

    const api_url = AIR_IQ + AIR_IQ_SEARCH;
    const response = await post(third_party, JSON.stringify(payload), api_url);
    const data = await response.json();

    const logs_response = await apipost(
      api_logs,
      {
        user_id: userData.id,
        api_name: "AIR_IQ_SEARCH",
        api_url: api_url,
        api_payload: JSON.stringify(payload),
        api_response: JSON.stringify(data),
      },
      true
    );

    let userData = sessionStorage.getItem("userData");
    userData = userData ? JSON.parse(userData) : {};
    setconfigdata(
      userData.model.agents != null
        ? userData.model.agents.series_flight_booking_c || "0"
        : "0"
    );

    if (data.status == false) {
      alert(
        "Please enter a departure date that is at least 30 days from today and ensure it is in the format yyyy/MM/dd."
      );
      setLoding(false);
    } else {
      setSearchlabel("Modified Search");
      setLoding(false);
      setarraydata(data.data.data);
      setarraydata3(data.data.data);
    }
  };

  const handlePassengerChange = (type, action) => {
    setPassengers((prevPassengers) => {
      Setselectedlistbooking([]);
      setarraydata(null);
      setflightitem(null);
      setarraydata3(null);
      const currentTotal =
        prevPassengers.adult + prevPassengers.child + prevPassengers.infant;
      // Calculate the new count for the type (e.g., adult, child, infant)
      const count = prevPassengers[type];
      const updatedCount = action === "increment" ? count + 1 : count - 1;
      // Allow increment only if the total passengers would be 9 or less
      if (action === "increment" && currentTotal >= 9) {
        return prevPassengers; // Do nothing if total is already 9 or more
      }
      // Ensure count does not go below 0
      return {
        ...prevPassengers,
        [type]: Math.max(0, updatedCount),
      };
    });
  };
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const [isAirlinesExpanded, setAirlinesExpanded] = useState(true);

  const today = new Date();
  const [reference, setReference] = useState("");
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const [selectedlist, Setselectedlist] = useState([]);
  const [selectedlistbooking, Setselectedlistbooking] = useState([]);
  const [selectedlistloading, Setselectedlistloading] = useState(false);

  return (
    <div className="flight-listing mt-32">
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
      {/* <TitleBanner /> */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        theme="light"
      />
      <div className="container p-0">
        <div className="row">
          <ProfileSidebarWidget />
          <div className="col-xl-9 col-lg-8">
            <MenuIcons />

            <section className="booking mt-0 mb-60">
              <div className="container p-0">
                <div className="content">
                  <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body tab-content">
                      <form onSubmit={handleSubmit}>
                        <div className="row booking-info mb-16">
                          <div className="col-12 d-xl-flex align-items-center justify-content-between gap-16 d-block p-0">
                            <div className="custom-sel-input-block sitdrpdwn">
                              <label className="h6 color-medium-gray">
                                From
                              </label>
                              <AutoCompleteDropdown
                                placeholder="From"
                                value={departureFrom}
                                onChange={(inputValue) => {
                                  setDepartureFrom(inputValue);
                                }}
                                showError={showError}
                              />
                            </div>
                            <div
                              className="arrows"
                              onClick={() => {
                                const temp = departureFrom;
                                setDepartureFrom(arrivalTo);
                                setArrivalTo(temp);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <g clipPath="url(#clip0_518_2277)">
                                  <path
                                    d="M23.6804 6.07409L18.2259 0.619583C17.7999 0.193537 17.1092 0.193537 16.6831 0.619583C16.2571 1.04563 16.2571 1.73628 16.6831 2.16233L20.2754 5.75464H1.09096C0.488472 5.75464 3.51626e-05 6.24307 3.51626e-05 6.84556C3.51626e-05 7.44804 0.488472 7.93648 1.09096 7.93648H20.2754L16.6832 11.5287C16.2571 11.9548 16.2571 12.6455 16.6832 13.0715C16.8961 13.2845 17.1753 13.391 17.4545 13.391C17.7337 13.391 18.0129 13.2845 18.2258 13.0714L23.6804 7.61688C24.1064 7.19084 24.1064 6.50013 23.6804 6.07409Z"
                                    fill="#ffa85d"
                                  />
                                  <path
                                    d="M22.9091 16.6637H3.72462L7.31683 13.0714C7.74288 12.6453 7.74288 11.9547 7.31683 11.5286C6.89088 11.1026 6.20013 11.1026 5.77409 11.5286L0.319535 16.9831C-0.106512 17.4092 -0.106512 18.0998 0.319535 18.5259L5.77404 23.9804C5.98713 24.1935 6.26627 24.3 6.54546 24.3C6.82465 24.3 7.10388 24.1935 7.31679 23.9804C7.74283 23.5544 7.74283 22.8637 7.31679 22.4377L3.72457 18.8455H22.9091C23.5116 18.8455 24 18.357 24 17.7546C24 17.1521 23.5116 16.6637 22.9091 16.6637Z"
                                    fill="#ffa85d"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_518_2277">
                                    <rect width="24" height="24" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <div className="custom-sel-input-block">
                              <label className="h6 color-medium-gray">To</label>
                              <AutoCompleteDropdown
                                placeholder="To"
                                value={arrivalTo}
                                onChange={(inputValue) => {
                                  setArrivalTo(inputValue);
                                }}
                                showError={showError}
                              />
                            </div>
                            <div className="col-12 col-xl-3 d-xl-flex align-items-center gap-16">
                              <div className="input-date-picker">
                                <label
                                  htmlFor="dep"
                                  className="h6 color-medium-gray"
                                >
                                  Departure
                                </label>
                                <DatePicker
                                  selected={depDate}
                                  onChange={(date) => setDepDate(date)}
                                  placeholderText="dd-MM-yyyy"
                                  dateFormat="dd-MMM-yyyy"
                                  className="sel-input date_from"
                                  style={{
                                    width: "100%",
                                    padding: "10px",
                                    cursor: "pointer",
                                  }}
                                  required
                                  minDate={new Date(today)}
                                  showMonthDropdown={false} // Disable month dropdown
                                  showYearDropdown={false} // Disable year dropdown
                                />
                              </div>
                            </div>
                            <div className="col-12 col-xl-4 d-xl-flex align-items-center gap-16">
                              <div className="custom-sel-input-block">
                                <div className="h6 color-medium-gray">
                                  Passengers No.
                                </div>
                                <div
                                  className="seat-booking color-black"
                                  onClick={togglePopup}
                                >
                                  <span className="total-passenger">
                                    {passengers.adult +
                                      passengers.child +
                                      passengers.infant}{" "}
                                    Passengers
                                  </span>
                                </div>
                                {showPopup && (
                                  <div
                                    ref={popupRef}
                                    className="passenger-area pessenger-box bg-white light-shadow br-5 p-24"
                                    style={{ display: "block" }}
                                  >
                                    <h4 className="color-black mb-32">
                                      Passengers
                                    </h4>
                                    <div className="passenger-box mb-24">
                                      <div className="row">
                                        <div className="col-md-7 col-sm-6 col-6">
                                          <div className="content-box">
                                            <h5 className="lightest-black">
                                              Adult
                                            </h5>
                                            <p className="color-medium-gray light">
                                              {" "}
                                              Above 12 years.
                                            </p>
                                          </div>
                                        </div>
                                        <div className="col-md-5 col-sm-6 col-6">
                                          <div className="quantity quantity-wrap">
                                            <button
                                              className="decrement"
                                              type="button"
                                              onClick={() =>
                                                handlePassengerChange(
                                                  "adult",
                                                  "decrement"
                                                )
                                              }
                                            >
                                              -
                                            </button>
                                            <input
                                              className="number"
                                              type="text"
                                              value={passengers.adult}
                                              readOnly
                                              required
                                            />
                                            <button
                                              className="increment"
                                              type="button"
                                              onClick={() =>
                                                handlePassengerChange(
                                                  "adult",
                                                  "increment"
                                                )
                                              }
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="passenger-box mb-24">
                                      <div className="row">
                                        <div className="col-md-7 col-sm-6 col-6">
                                          <div className="content-box">
                                            <h5 className="lightest-black">
                                              Child
                                            </h5>
                                            <p className="color-medium-gray light">
                                              {" "}
                                              2-12 years on travel date.
                                            </p>
                                          </div>
                                        </div>
                                        <div className="col-md-5 col-sm-6 col-6">
                                          <div className="quantity quantity-wrap">
                                            <button
                                              className="decrement"
                                              type="button"
                                              onClick={() =>
                                                handlePassengerChange(
                                                  "child",
                                                  "decrement"
                                                )
                                              }
                                            >
                                              -
                                            </button>
                                            <input
                                              className="number"
                                              type="text"
                                              value={passengers.child}
                                              readOnly
                                            />
                                            <button
                                              className="increment"
                                              type="button"
                                              onClick={() =>
                                                handlePassengerChange(
                                                  "child",
                                                  "increment"
                                                )
                                              }
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="passenger-box mb-24">
                                      <div className="row">
                                        <div className="col-md-7 col-sm-6 col-6">
                                          <div className="content-box">
                                            <h5 className="lightest-black">
                                              Infant
                                            </h5>
                                            <p className="color-medium-gray light">
                                              {" "}
                                              Below 2 years.
                                            </p>
                                          </div>
                                        </div>
                                        <div className="col-md-5 col-sm-6 col-6">
                                          <div className="quantity quantity-wrap">
                                            <button
                                              className="decrement"
                                              type="button"
                                              onClick={() =>
                                                handlePassengerChange(
                                                  "infant",
                                                  "decrement"
                                                )
                                              }
                                            >
                                              -
                                            </button>
                                            <input
                                              className="number"
                                              type="text"
                                              value={passengers.infant}
                                              readOnly
                                            />
                                            <button
                                              className="increment"
                                              type="button"
                                              onClick={() =>
                                                handlePassengerChange(
                                                  "infant",
                                                  "increment"
                                                )
                                              }
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="color-medium-gray light mb-32">
                                      Please note: You can book for a maximum of
                                      nine passengers.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row d-flex justify-content-end mt-4">
                          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-9">
                            <div className="row align-items-center justify-content-end">
                              <div className="col-sm-8">
                                {loading ? (
                                  <Progress />
                                ) : (
                                  <>
                                    <button type="submit" className="cus-btn">
                                      {searchlabel}
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 32 32"
                                        fill="none"
                                      >
                                        <g clipPath="url(#clip0_502_1331)">
                                          <path
                                            d="M31.6933 0.544584C30.6572 -0.491824 27.1402 1.34503 26.1041 2.38143L21.9545 6.53127H3.07887C2.63024 6.53127 2.24462 6.85011 2.16055 7.29104C2.07669 7.73189 2.31798 8.16995 2.73524 8.3348L15.2174 13.2677L7.5633 20.9216H0.323909C0.168651 20.9221 0.0346723 21.0323 0.00576263 21.1852C-0.023357 21.3385 0.060152 21.4901 0.20498 21.5471L6.29687 23.9548C6.33201 24.1078 6.38108 24.2574 6.44394 24.4038L6.17745 24.6709C5.79778 25.0503 5.79778 25.6651 6.17745 26.045C6.55664 26.4247 7.17263 26.4247 7.55182 26.045L7.81194 25.785C7.95935 25.8501 8.11132 25.9014 8.26623 25.9382L10.6144 31.9561C10.6709 32.1013 10.8229 32.1851 10.976 32.1568C11.0419 32.145 11.1002 32.1123 11.1451 32.0673C11.2044 32.0087 11.2399 31.9274 11.2399 31.8382V24.7512L19.0155 16.976L23.9019 29.4993C24.0654 29.9177 24.5037 30.1608 24.9452 30.0781C25.136 30.0421 25.3038 29.9498 25.4333 29.8212C25.6038 29.6499 25.7071 29.4151 25.7077 29.1591V10.284L29.8573 6.13423C30.893 5.09789 32.7293 1.58085 31.6933 0.544584Z"
                                            fill="white"
                                          />
                                        </g>
                                        <defs>
                                          <clipPath id="clip0_502_1391">
                                            <rect
                                              width="32"
                                              height="32"
                                              fill="black"
                                            />
                                          </clipPath>
                                        </defs>
                                      </svg>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="flight-listing-page mb-60">
              <div className="container p-0">
                <div className="row">
                  {flightsdata && flightsdata.length > 0 ? (
                    selectedlistbooking.length != 0 ? (
                      <Series_flight_booking
                        data={selectedlistbooking}
                        onUpdate={(updatedItem) => {
                          Setselectedlistbooking([]);
                        }}
                      />
                    ) : (
                      <>
                        <div className="col-xl-9 col-lg-9">
                          <FlightList
                            flights={flightsdata}
                            flightsPerPage={5}
                            adult={passengers}
                            onUpdate={(updatedItem) => {
                              setflightitem(updatedItem);
                            }}
                            onUpdatenew={(updatedItem) => {
                              Setselectedlistbooking([updatedItem]);
                            }}
                            configdata={configdata}
                          />
                        </div>

                        <div className="col-xl-3 col-lg-3 mb-xl-0 mb-32">
                          <div className="sidebar pb-2 bg-white br-10 light-shadow mb-4">
                            <div className="sidebar-title d-flex justify-content-between align-items-center">
                              <h4 className="lightest-black">Filter Search</h4>
                              <p className="cler-cls" onClick={handleClear}>
                                Clear
                              </p>
                            </div>

                            <div className="filter-block plr-24 box-3">
                              <div
                                className="title mb-16 mt-16 d-flex justify-content-between align-items-center"
                                onClick={() =>
                                  setAirlinesExpanded(!isAirlinesExpanded)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <h4 className="color-black fw-500">Airlines</h4>
                                <i
                                  className={`fal fa-chevron-${
                                    isAirlinesExpanded ? "up" : "down"
                                  } color-primary`}
                                ></i>
                              </div>
                              {isAirlinesExpanded && (
                                <div className="content-block">
                                  {Object.entries(airlineCounts).map(
                                    ([airlineName, count], index) => (
                                      <div
                                        className="custom-control"
                                        key={index}
                                      >
                                        <div className="d-flex justify-content-between align-items-center mb-24">
                                          <div className="radio-button">
                                            <input
                                              type="radio"
                                              name="airline"
                                              className="custom-control-input"
                                              onChange={(e) =>
                                                handleFilter(e, "airline")
                                              }
                                              value={airlineName}
                                              id={airlineName
                                                .replace(/\s/g, "")
                                                .toLowerCase()}
                                              checked={
                                                selectedAirline === airlineName
                                              }
                                            />
                                            <label
                                              className="custom-control-label lightest-black"
                                              htmlFor={airlineName
                                                .replace(/\s/g, "")
                                                .toLowerCase()}
                                            >
                                              {airlineName}
                                            </label>
                                          </div>
                                          <h5 className="light-black">
                                            ({count})
                                          </h5>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                              <hr className="bg-sec-gray mb-16" />
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  ) : (
                    <Container
                      maxWidth={false}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "50px 20px",
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={NoFlightsSVG}
                        alt="No Flights"
                        style={{
                          maxWidth: "300px",
                          borderRadius: "8px",
                          marginBottom: "20px",
                        }}
                      />
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: "bold",
                          color: "#343a40",
                          fontFamily: "Roboto, sans-serif",
                          marginBottom: "10px",
                        }}
                      >
                        Oops! No Flights Available ✈️
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{
                          fontSize: "18px",
                          color: "#6c757d",
                          marginBottom: "30px",
                        }}
                      >
                        It looks like there are no flights available at the
                        moment. Please check again later.
                      </Typography>
                    </Container>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Series_flights;

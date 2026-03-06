import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../visa/visa.css";
import { post, get } from "../../../API/apiHelper";
import {
  search_visa,
  maincountry_list,
  users_profile,
} from "../../../API/endpoints";
import { toast, ToastContainer } from "react-toastify";
import AutoCompleteDropdown from "../../../widget/custom-dropdown/custom-dropdown";
import country from "../../../widget/country";
import Select from "react-select";
import { GoHome } from "react-icons/go";
import { FaPlane } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const VisaWidget = () => {
  const today = new Date();

  const [going_from, setCitizenOf] = useState("");
  const [going_from_id, setGoingFromId] = useState("");
  const [going_to, setGoingTo] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCitizenOfChange = (e) => {
    setCitizenOf(e.value);
    setGoingFromId(
      options.find((option) => option.value === e.value)?.country_id
    );
  };
  const handleGoingToChange = (e) => setGoingTo(e.value);
  const handleTravelDateChange = (e) => setTravelDate(e);
  const handleReturnDateChange = (e) => setReturnDate(e);
  const location = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    // const userDataFromSession = sessionStorage.getItem('userData');
    // if (userDataFromSession) {
    //     const userData = JSON.parse(userDataFromSession);
    //     setUserData(userData.model);
    // }
    const fetchUserData = async () => {
      try {
        const response = await get(users_profile, true);
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (location.state) {
      const { going_from, going_to, travelDate, returnDate } =
        location.state.formData || {};
      setCitizenOf(going_from || "");
      setGoingTo(going_to || "");
      setTravelDate(travelDate || "");
      setReturnDate(returnDate || "");
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const formData = {
      going_from: going_from,
      going_to: going_to,
      travelDate: travelDate,
      returnDate: returnDate,
      visa_data: countrylist.find(
        (country) => country.country_name === going_to
      ),
    };

    try {
      const response = await post(search_visa, formData, true);
      const data = await response.json();
      if (data.status == false) {
        toast.error(data.message);
      } else {
        const vdata = data.data;
        navigate("/visa", { state: { vdata, formData } });
      }
    } catch (error) {
      setMessage(`Submission failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const [options, setOptions] = useState([]);
  const [countrylist, setCountrylist] = useState([]);

  useEffect(() => {
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
      } catch (error) {
        // console.log(error);
      }
    };
    fatchcountry();
  }, [userData]);

  // const options = country.map(option => ({
  //     value: option.name,
  //     label: option.name,
  //     currency: option.currency,
  // }));

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column justify-content-between"
    >
      <h1 className="text-4xl font-semibold text-black mb-4">
        Guaranteed{" "}
        <span className="text-transparent underline cursor-pointer bg-text-gradient bg-clip-text decoration-purple-800 decoration-1 underline-offset-4">
          visa on time
        </span>{" "}
        to
      </h1>
      <div className="d-flex flex-column gap-8 flex-sm-row">
        {/* Citizen of */}
        <div className="col-sm-6 mb-3 sitdrpdwn">
          <label className="form-label">
            Citizen of<span className="text-danger">*</span>
          </label>
          <div className="position-relative visaaply">
            <GoHome className="left-start-icon" />
            <Select
              options={options}
              name="going_from"
              id="going_from"
              value={options.find((option) => option.value === going_from)}
              className="form-control with-icon"
              classNamePrefix="react-select"
              placeholder="Citizen of"
              isSearchable
              required
              onChange={handleCitizenOfChange}
              styles={{
                control: (provided) => ({
                  ...provided,
                  paddingLeft: "1.6rem",
                }),
              }}
            />
          </div>
        </div>

        {/* Going to */}
        <div className="col-sm-6 mb-3 sitdrpdwn">
          <label className="form-label">
            Going to<span className="text-danger">*</span>
          </label>
          <div className="position-relative">
            <FaPlane className="left-start-icon" />

            <Select
              options={options}
              name="going_to"
              id="going_to"
              value={options.find((option) => option.value === going_to)}
              className="form-control with-icon"
              classNamePrefix="react-select"
              placeholder="Going to"
              isSearchable
              required
              onChange={handleGoingToChange}
              styles={{
                control: (provided) => ({
                  ...provided,
                  paddingLeft: "1.6rem",
                }),
              }}
            />
          </div>
        </div>
      </div>

      <div className="d-flex flex-column gap-8 flex-sm-row">
        {/* Travel Date */}
        <div className="col-sm-6 mb-3">
          <label className="form-label">
            Travel Date<span className="text-danger">*</span>
          </label>
          <div className="mb-24 position-relative">
            <FaRegCalendarAlt className="left-start-icon" />
            <DatePicker
              selected={travelDate}
              onChange={(date) => {
                handleTravelDateChange(date); // Update travel date
                handleReturnDateChange(null); // Reset return date
              }}
              autoComplete="off"
              placeholderText="MM/DD/YYYY"
              dateFormat="dd-MMM-yyyy"
              className="form-control with-icon sel-input date_from"
              style={{
                width: "100%",
                padding: "10px",
                cursor: "pointer",
              }}
              required
              minDate={new Date(today)}
              showMonthDropdown={true} // Disable month dropdown
              showYearDropdown={true} // Disable year dropdown
            />
          </div>
        </div>

        {/* Return Date */}
        <div className="col-sm-6 mb-3">
          <label className="form-label">
            Return Date<span className="text-danger">*</span>
          </label>
          <div className="mb-24 position-relative">
            <FaRegCalendarAlt className="left-start-icon" />
            <DatePicker
              selected={returnDate}
              onChange={handleReturnDateChange}
              autoComplete="off"
              placeholderText="MM/DD/YYYY"
              dateFormat="dd-MMM-yyyy"
              className="form-control with-icon sel-input date_from"
              style={{
                width: "100%",
                padding: "10px",
                cursor: "pointer",
              }}
              required
              minDate={new Date(travelDate)}
              disabled={!travelDate}
            />
          </div>
        </div>
      </div>

      {/* Submit Button and Message */}
      <div className="d-flex justify-content-end">
        <button type="submit" className="cus-btn" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
        {/* <div id="message" className="alert-msg">
                    {message}
                </div> */}
      </div>
    </form>
  );
};

export default VisaWidget;

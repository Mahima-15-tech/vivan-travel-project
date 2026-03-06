import React, { useState, useEffect } from "react";
import "../../flight-booking/flight-booking-main/flight-booking-main.css";
import { useNavigate } from "react-router-dom";
import Progress from "../../../component/Loading";
import Select from "react-select";
import { SiRazorpay } from "react-icons/si";
import { CiWallet } from "react-icons/ci";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import route_plane from "../../../assets/images/icon/route-plan.png";
import PaymentStatusPopup from "../../user/check_payment";

import {
  third_party,
  AIR_IQ,
  AIR_IQ_BOOKING,
  booking_add_v2,
  wallet_add,
  siteconfig,
} from "../../../API/endpoints";
import { post } from "../../../API/airline";
import { ToastContainer, toast } from "react-toastify";
import { razarpaypayment } from "../../../API/utils";
// import { hdfcPayment } from "../../API/utils";

import {
  post as HelperPost,
  get,
  formatDate,
  formatTime,
} from "../../../API/apiHelper";
import country from "../../../widget/country";

const Series_flight_booking_offline = ({
  data,
  traveltype,
  tripinfo,
  onUpdate,
}) => {
  const navigate = useNavigate();
  const adultcount = data[0].adultcount.adult;
  const childcount = data[0].adultcount.child;
  const infantcount = data[0].adultcount.infant;
  const flight = data[0].flight;
  const userinfo = data[0].uData;
  console.log(JSON.stringify(data));
  const [setting, setSettings] = useState(null);
  const [payment_id_forcheck, setpayment_id_forcheck] = useState(null);
  const [finaldatafor_payment, setfinaldatafor_payment] = useState(null);
  const fetchSettings = async () => {
    try {
      const res = await get(siteconfig, true);
      const response = await res.json();
      setSettings(response.data);
    } catch (error) {
      // console.log(error);
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
  const [dataree, setdataree] = useState(null);
  const infant = data[0].adultcount.infant;
  const Adult = data[0].adultcount.adult;
  const child = data[0].adultcount.child;

  const options = country.map((option) => ({
    value: option.code,
    label: option.name,
    currency: option.currency,
    name: option.name,
  }));

  useEffect(() => {
    if (setting == null) {
      fetchSettings();
    }
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession && userDataFromSession != null) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    }
    const count = Number(adultcount) + Number(childcount) + Number(infantcount);

    const createPassengerArray = () => {
      setLoding(false);
      const passengersArray = [];

      // Add adults
      for (let i = 0; i < Number(adultcount); i++) {
        passengersArray.push({
          ...initialPassengerData,
          passenger_type: "adult",
        });
      }

      // Add children
      for (let i = 0; i < Number(childcount); i++) {
        passengersArray.push({
          ...initialPassengerData,
          passenger_type: "infant",
        });
      }

      // Add infants
      for (let i = 0; i < Number(infantcount); i++) {
        passengersArray.push({
          ...initialPassengerData,
          passenger_type: "child",
        });
      }
      return passengersArray;
    };
    setPassengers(createPassengerArray());
  }, []); // Empty dependency array ensures it runs only once

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  const [Progressing, setLoding] = useState(null);

  const passengerTypeOptions = [
    { value: "adult", label: "Adult" },
    { value: "child", label: "Child" },
    { value: "infant", label: "Infant" },
  ];
  const selectgender = [
    { value: "0", label: "Male" },
    { value: "1", label: "Female" },
  ];
  const selecttitle = [
    { value: "Mr", label: "MR", type: "adult" },
    { value: "Ms", label: "MS", type: "adult" },
    { value: "Mrs", label: "MRS", type: "adult" },
    { value: "Mstr", label: "MSTR", type: "child" },
    { value: "Miss", label: "MISS", type: "child" },
  ];

  const initialPassengerData = {
    type: "adult",
    first_name: "",
    last_name: "",
    dob: "",
    date_of_issue: "",
    passport_expiry: "",
    title: "",
    nationality: "",
    passport_num: "",
    place_of_issue: "",
    place_of_birth: "",
  };

  const [passengers, setPassengers] = useState([initialPassengerData]);

  const [userData, setUserData] = useState(null);

  const handleInputChange = (eventOrOption, index) => {
    const updatedPassengers = [...passengers];
    if (eventOrOption.target) {
      const { name, value } = eventOrOption.target;
      updatedPassengers[index][name] = value;
    } else {
      const { name, value } = eventOrOption;
      updatedPassengers[index][name] = value;
    }
    setPassengers(updatedPassengers);
  };
  const [isConfirmed, setIsConfirmed] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsConfirmed(e.target.checked);
  };

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const twelveYearsAgo = new Date(
    today.getFullYear() - 12,
    today.getMonth(),
    today.getDate()
  );
  const twoYearsAgo = new Date(
    today.getFullYear() - 2,
    today.getMonth(),
    today.getDate()
  );

  // Number(Infantamount) + Number(Adult_amount) + Number(child_amount) ;

  async function formattedDate(dateOfBirth) {
    const date = new Date(dateOfBirth);
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "/");
    return formattedDate;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConfirmed) {
      return alert("Please Confirm By Checking The Box Before Booking.");
    }

    const payingamount =
      ((flight.other.adult_price || 0) +
        Number(userinfo?.agents?.flight_charges["5"] || 0)) *
        adultcount +
      ((flight.other.child_price || 0) +
        Number(userinfo?.agents?.flight_charges["5"] || 0)) *
        child +
      ((flight.other.infant_price || 0) +
        Number(userinfo?.agents?.flight_charges["5"] || 0)) *
        infant;
        const ordre_id = "VT" + Math.floor(1000000 + Math.random() * 9000000);
    if (paymentMethod === "razorpay") {
      setpayment_id_forcheck(ordre_id);
      setfinaldatafor_payment({
        1: ordre_id,
        2: payingamount,
        3: data[0].flight.key,
      });
      console.log("🔥 PAYMENT FROM: OFFLINE BOOKING");
      razarpaypayment(
        ordre_id,
        payingamount,
        "Ticket Transaction",
        data[0].flight.key,
        (response) => {
          if (
            response.razorpay_payment_id &&
            response.razorpay_payment_id != null
          ) {
            setLoding(true);
            proceed_booking(
              "Rezorpay",
              payingamount,
              data[0].flight.key,
              JSON.stringify(response)
            );
          }
        }
      );
    } else {
      setLoding(true);
      const userDataFromSessionup = sessionStorage.getItem("userData");
      if (userDataFromSessionup) {
        let userDataup = JSON.parse(userDataFromSessionup).model;

        if (Number(userDataup.wallet) >= payingamount) {
          proceed_booking(
            "Wallet",
            payingamount,
            data[0].flight.key,
            "Ticket Transaction"
          );
        } else {
          toast.error("Your Wallet Balance is low");
          setLoding(false);
        }
      }
    }
  };
  const calculateAge = (dob) => {
    // Try to create a date from the input string
    let birthDate = new Date(dob);

    // Check if the date is invalid
    if (isNaN(birthDate.getTime())) {
      // Attempt to fix common format issues (e.g., "2007-28-02" might mean "2007-02-28")
      const parts = dob.split("-");
      if (parts.length === 3) {
        let [year, month, day] = parts;
        // Swap month and day if month is > 12
        if (parseInt(month) > 12 && parseInt(day) <= 12) {
          [month, day] = [day, month]; // Swap values
        }
        // Reconstruct the date
        birthDate = new Date(`${year}-${month}-${day}`);
      }
    }

    // If still invalid, return an error message
    if (isNaN(birthDate.getTime())) {
      return "Invalid date provided. Please use YYYY-MM-DD format (e.g., 2007-02-28)";
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthdate hasn't occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };
  const proceed_booking = async (paytype, amount, flight_id, rzres) => {
    const refval = "VT" + Math.floor(1000000 + Math.random() * 9000000);
    // Formatting passenger details based on the given structure
    const PAX_Details = passengers.map((passenger) => ({
      type: "adult", // You can customize this if you have passenger.type
      title: passenger.title || "", // e.g. Mr/Miss
      first_name: passenger.first_name || "",
      last_name: passenger.last_name || "",
      dob: passenger.dateOfBirth?.split("/").reverse().join("-") || "",
      date_of_issue: passenger.date_of_issue || "",
      passport_expiry: passenger.passport_expiry || "",
      nationality: passenger.nationality || "",
      passport_num: passenger.passport_num || "",
      place_of_issue: passenger.place_of_issue || "",
      place_of_birth: passenger.place_of_birth || "",
    }));

    // Creating the payload
    const payload = {
      id: data[0].flight.other.id, // Assuming this is a static ID; update dynamically if needed
      onward_date: data[0].flight.other.departure_time,
      return_date: "",
      adult: adultcount,
      children: childcount,
      infant: infantcount,
      dep_city_code: data[0].flight.origin,
      arr_city_code: data[0].flight.destination,
      flight: flight,
      total_book_seats:
        Number(adultcount) + Number(childcount) + Number(infantcount),
      contact_name: data[0].uData?.name?.trim()
        ? data[0].uData?.name
        : "vivantravels",
      contact_email: data[0].uData?.email?.trim()
        ? data[0].uData?.email
        : "mail@vivantravels.com",
      contact_number: data[0].uData?.mobile_no?.trim()
        ? data[0].uData?.mobile_no
        : "12345678",
      flight_traveller_details: PAX_Details,
      total_amount: amount,
    };
    // console.log(payload);

    const formData = {
      user_id: userData.id,
      Booking_RefNo: "",
      Agency_RefNo: refval,
      BookingFlightDetails: JSON.stringify(data[0]),
      PAX_Details: JSON.stringify(passengers),
      // amount_res: rzres,
      Ticket_Details: JSON.stringify(payload),
      Amount: amount,
      paying_method: paytype,
      amount_res: rzres,
      type: 5,
      status: "Pending",
    };
    const apiresponse = await HelperPost(booking_add_v2, formData, true);
    if (apiresponse.ok) {
      if (paytype == "Wallet") {
        const formData = {
          user_id: userData.id,
          order_id: flight_id,
          transaction_type: "Ticket Booking",
          amount: amount,
          payment_getway: paytype,
          details: "Ticket Booking",
          type: "2",
          status: "Success",
        };
        await HelperPost(wallet_add, formData, true);

        let user = sessionStorage.getItem("userData");
        user = user ? JSON.parse(user) : {};
        let finlaamount = Number(user.model.wallet) - Number(amount);
        user.model.wallet = finlaamount;
        sessionStorage.setItem("userData", JSON.stringify(user));
        setUserData((prevData) => ({
          ...prevData,
          wallet: finlaamount,
        }));
      }
      toast.success("Ticket book Successfully");
      navigate("/user/my-bookings");
      window.location.reload();
    } else {
      toast.error("Somthing Went Wrong");
    }
    setLoding(false);
  };

  return (
    <section className="flight-booking">
      <div className="contain">
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

        <div className="row">
          <div className="col-xl-8">
            <div className="booking-form">
              <form
                onSubmit={(e) => handleSubmit(e)}
                id="flight-form"
                method="post"
                role="form"
                className="contact-form form-wizard"
              >
                <div className="form-wizard-header">
                  <ul className="nav list-unstyled form-wizard-steps clearfix">
                    <li className="nav-item activated">
                      <button type="button" className="nav-link">
                        <span className="number">1</span>
                        <i className="fal fa-check"></i>
                      </button>
                      <h5 className="color-black">Your Selection</h5>
                    </li>
                    <li className="nav-item active">
                      <button type="button" className="nav-link">
                        <span className="number">2</span>
                        <i className="fal fa-check"></i>
                      </button>
                      <h5 className="color-black">Your Details</h5>
                    </li>
                    <li className="nav-item">
                      <button type="button" className="nav-link">
                        <span className="number">3</span>
                        <i className="fal fa-check"></i>
                      </button>
                      <h5 className="color-black">Final Step</h5>
                    </li>
                  </ul>
                </div>

                <div className="wizard-content overflow-visible mb-24">
                  <fieldset
                    id="step-2"
                    className="tab-pane show wizard-fieldset p-0"
                  >
                    <div className="detail-form mb-32">
                      <h4 className="black p-0 mb-30">Enter Your Details</h4>
                      {passengers.map((passenger, index) => (
                        <div key={index} className="passenger-section">
                          <h5>Passenger {index + 1}</h5>
                          <br />
                          <div className="col-12">
                            <div className="row mb-12">
                              <div className="col-sm-6 mb-12 sitdrpdwn">
                                <div className="gender-select">
                                  <label
                                    htmlFor="passenger_type"
                                    className="h6 color-medium-gray mb-1"
                                  >
                                    Passenger Type
                                  </label>
                                  <Select
                                    options={passengerTypeOptions}
                                    name="passenger_type"
                                    id="passenger_type"
                                    value={passengerTypeOptions.find(
                                      (option) =>
                                        option.value ===
                                        passenger.passenger_type
                                    )}
                                    onChange={(selectedOption) =>
                                      handleInputChange(
                                        {
                                          ...selectedOption,
                                          name: "passenger_type",
                                        },
                                        index
                                      )
                                    }
                                    classNamePrefix="react-select"
                                    placeholder="Select Passenger Type"
                                    isSearchable
                                    required
                                    isDisabled
                                  />
                                </div>
                              </div>

                              <div className="col-sm-6 mb-12 sitdrpdwn">
                                <div className="gender-select">
                                  <label
                                    htmlFor="title"
                                    className="h6 color-medium-gray mb-1"
                                  >
                                    Select Title
                                  </label>
                                  <Select
                                    options={selecttitle.filter(
                                      (p) =>
                                        p.type ===
                                        (passenger.passenger_type === "adult"
                                          ? "adult"
                                          : "child")
                                    )}
                                    name="title"
                                    id="title"
                                    value={selecttitle.find(
                                      (option) =>
                                        option.value === passenger.title
                                    )}
                                    onChange={(selectedOption) =>
                                      handleInputChange(
                                        { ...selectedOption, name: "title" },
                                        index
                                      )
                                    }
                                    classNamePrefix="react-select"
                                    placeholder="Title"
                                    isSearchable
                                    required
                                  />
                                </div>
                              </div>

                              <div className="col-sm-6 mb-12 pe-1">
                                <label
                                  htmlFor="firstName"
                                  className="h6 color-medium-gray mb-1"
                                >
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  name="first_name"
                                  value={passenger.first_name}
                                  onChange={(e) => handleInputChange(e, index)}
                                  placeholder="First Name"
                                  className="form-control wizard-required"
                                  required
                                />
                              </div>

                              <div className="col-sm-6 mb-12">
                                <label
                                  htmlFor="lastName"
                                  className="h6 color-medium-gray mb-1"
                                >
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  name="last_name"
                                  value={passenger.last_name}
                                  onChange={(e) => handleInputChange(e, index)}
                                  placeholder="Last Name"
                                  className="form-control wizard-required"
                                />
                              </div>
                              <div className="col-sm-6 mb-12">
                                <label
                                  htmlFor="passport_num"
                                  className="h6 color-medium-gray mb-1"
                                >
                                  Passport Number
                                </label>
                                <input
                                  type="text"
                                  name="passport_num"
                                  value={passenger.passport_num}
                                  onChange={(e) => handleInputChange(e, index)}
                                  placeholder="Passport Number"
                                  className="form-control wizard-required"
                                  required={true}
                                />
                              </div>
                              <div className="col-sm-6 mb-12">
                                <label
                                  htmlFor="place_of_issue"
                                  className="h6 color-medium-gray mb-1"
                                >
                                  Place of issue
                                </label>
                                <input
                                  type="text"
                                  name="place_of_issue"
                                  value={passenger.place_of_issue}
                                  onChange={(e) => handleInputChange(e, index)}
                                  placeholder="Place of issue"
                                  className="form-control wizard-required"
                                  required={true}
                                />
                              </div>
                              <div className="col-sm-6 mb-12">
                                <label
                                  htmlFor="place_of_birth"
                                  className="h6 color-medium-gray mb-1"
                                >
                                  Place of birth
                                </label>
                                <input
                                  type="text"
                                  name="place_of_birth"
                                  value={passenger.place_of_birth}
                                  onChange={(e) => handleInputChange(e, index)}
                                  placeholder="Place of Birth"
                                  className="form-control wizard-required"
                                  required={true}
                                />
                              </div>

                              {/* {passenger.passenger_type == 2 && (
                                <> */}
                              <div className="col-sm-6 mb-12">
                                <div className="input-date-picker">
                                  <label
                                    htmlFor="dateOfBirth"
                                    className="h6 color-medium-gray mb-1"
                                  >
                                    Date of Birth
                                  </label>
                                  <DatePicker
                                    selected={passenger.dateOfBirth}
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    onChange={(date) =>
                                      handleInputChange(
                                        {
                                          target: {
                                            name: "dateOfBirth",
                                            value: format(
                                              new Date(date),
                                              "MM/dd/yyyy"
                                            ),
                                          },
                                        },
                                        index
                                      )
                                    }
                                    dateFormat="MM/dd/yyyy"
                                    className="sel-input date_from form-control wizard-required"
                                    placeholderText="Date of Birth"
                                    required
                                    // maxDate={new Date()}
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    maxDate={
                                      passenger.passenger_type === "adult"
                                        ? new Date(eighteenYearsAgo)
                                        : passenger.passenger_type === "child"
                                        ? new Date(twoYearsAgo)
                                        : new Date()
                                    }
                                    minDate={
                                      passenger.passenger_type === "adult"
                                        ? null
                                        : passenger.passenger_type === "child"
                                        ? new Date(twelveYearsAgo)
                                        : new Date(twoYearsAgo)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-sm-6 mb-12">
                                <div className="input-date-picker">
                                  <label
                                    htmlFor="date_of_issue"
                                    className="h6 color-medium-gray mb-1"
                                  >
                                    Date of issue
                                  </label>
                                  <DatePicker
                                    selected={passenger.date_of_issue}
                                    id="date_of_issue"
                                    name="date_of_issue"
                                    onChange={(date) =>
                                      handleInputChange(
                                        {
                                          target: {
                                            name: "date_of_issue",
                                            value: format(
                                              new Date(date),
                                              "MM/dd/yyyy"
                                            ),
                                          },
                                        },
                                        index
                                      )
                                    }
                                    dateFormat="MM/dd/yyyy"
                                    className="sel-input date_from form-control wizard-required"
                                    placeholderText="Date of issue"
                                    required
                                    // maxDate={new Date()}
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    maxDate={new Date()}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-6 mb-12">
                                <div className="input-date-picker">
                                  <label
                                    htmlFor="dateOfexp"
                                    className="h6 color-medium-gray mb-1"
                                  >
                                    Date of Passport Expiry
                                  </label>
                                  <DatePicker
                                    selected={passenger.passport_expiry}
                                    id="passport_expiry"
                                    name="passport_expiry"
                                    onChange={(date) =>
                                      handleInputChange(
                                        {
                                          target: {
                                            name: "passport_expiry",
                                            value: format(
                                              new Date(date),
                                              "MM/dd/yyyy"
                                            ),
                                          },
                                        },
                                        index
                                      )
                                    }
                                    dateFormat="MM/dd/yyyy"
                                    className="sel-input date_from form-control wizard-required"
                                    placeholderText="Date of Passport Expiry"
                                    required
                                    // maxDate={new Date()}
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    minDate={new Date()}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-6 mb-12">
                                <div className="input-date-picker">
                                  <label
                                    htmlFor="dateOfBirth"
                                    className="h6 color-medium-gray mb-1"
                                  >
                                    Nationality
                                  </label>
                                  <Select
                                    options={options}
                                    name="nationality"
                                    id="nationality"
                                    value={options.find(
                                      (option) =>
                                        option.value === passenger.nationality
                                    )}
                                    onChange={(selectedOption) =>
                                      handleInputChange(
                                        {
                                          ...selectedOption,
                                          name: "nationality",
                                        },
                                        index
                                      )
                                    }
                                    classNamePrefix="react-select"
                                    placeholder="Select Nationality"
                                    isSearchable
                                    required
                                  />
                                </div>
                              </div>
                              {/* </>
                              )} */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                  <div className="mb-2">
                    <input
                      type="checkbox"
                      id="confirmBooking"
                      checked={isConfirmed}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="confirmBooking" className="ms-2">
                      I Confirm That I Want To Proceed With The Booking
                    </label>
                  </div>
                  <div className="row mb-4">
                    <div className="col-sm-12 mb-3">
                      <div className="final_step">
                        <div className="radio-group-sit">
                          <h5 className="mb-2">Choose Payment Method</h5>
                          <div className="row justify-content-between align-items-center">
                            <div className="col-sm-9 mb-3">
                              <div className="radio-container paybutton">
                                <label
                                  className={
                                    paymentMethod === "razorpay" ? "active" : ""
                                  }
                                >
                                  <input
                                    type="radio"
                                    name="payment"
                                    value="razorpay"
                                    checked={paymentMethod === "razorpay"}
                                    onChange={handlePaymentChange}
                                  />
                                  <SiRazorpay />
                                  <p className="textrr">Online</p>
                                </label>

                                <label
                                  className={
                                    paymentMethod === "wallet" ? "active" : ""
                                  }
                                >
                                  <input
                                    type="radio"
                                    name="payment"
                                    value="wallet"
                                    checked={paymentMethod === "wallet"}
                                    onChange={handlePaymentChange}
                                  />
                                  <CiWallet />
                                  <p className="textrr">Wallet</p>
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-3 mb-3">
                              {Progressing ? (
                                <Progress />
                              ) : (
                                <>
                                  <div className="col-12 float-end">
                                    <button
                                      type="submit"
                                      className="form-wizard-next-btn cus-btn cus-btn-strng w-100"
                                    >
                                      Book Now
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>{" "}
              <PaymentStatusPopup
                paymentId={payment_id_forcheck} // your txnid
                onSuccess={() => {
                  setLoding(true);
                  proceed_booking(
                    finaldatafor_payment["1"],
                    finaldatafor_payment["2"],
                    finaldatafor_payment["3"],
                    ""
                  );
                  // apply_visaafterpayment();
                  setpayment_id_forcheck(null);
                }}
              />
            </div>
          </div>

          <div className="col-xl-4 mb-lg-0 mb-32">
            <div className="flight-booking-detail light-shadow mb-32">
              <div className="flight-title">
                <h4 className="color-black">Your Booking Detail</h4>
              </div>
              <div className="box bg-white p-24">
                <div className="flight-detail mb-32">
                  <div className="flight-departure">
                    <h5 className="color-black">
                      {formatTime(data[0].flight.departure_datetime)}
                    </h5>
                    <h5 className="dark-gray text-end">
                      {data[0].flight.origin}
                    </h5>
                  </div>
                  <div className="d-inline-flex align-items-center gap-8">
                    <span>From</span>
                    <div className="from-to text-center">
                      {/* <h5 className="dark-gray">{data[0].flight.origin}</h5> */}
                      <img
                        className="route-plan"
                        src={route_plane}
                        alt="Route Plan"
                      />
                      <h6 className="color-black">
                        {data[0].flight.flight_route}
                      </h6>
                    </div>
                    <span>To</span>
                  </div>
                  <div className="flight-departure">
                    <h5 className="color-black">
                      {formatTime(data[0].flight.arrival_datetime)}
                    </h5>
                    <h5 className="dark-gray">{data[0].flight.destination}</h5>
                  </div>
                </div>
                <div className="d-flex justify-content-around mb-20">
                  <div className="flight-departure">
                    <h6 className="dark-gray">Departure</h6>
                    <h5 className="color-black">
                      {formatDate(data[0].flight.departure_datetime)}
                    </h5>
                  </div>
                  <div className="vr-line"></div>
                  <div className="flight-departure">
                    <h6 className="dark-gray">Arrival</h6>
                    <h5 className="color-black">
                      {formatDate(data[0].flight.arrival_datetime)}
                    </h5>
                  </div>
                </div>
                <hr className="bg-medium-gray mb-20" />
                <div className="text">
                  <h6 className="color-medium-gray">
                    Operated by{" "}
                    {data?.[0]?.airlines?.find(
                      (airline) =>
                        airline.code === data?.[0]?.flight?.Airline_Code
                    )?.name || ""}
                  </h6>
                  <h6 className="color-medium-gray">
                    Flight {data[0].flight.flight_numbers.join(" ")}{" "}
                  </h6>
                </div>
                <br />
              </div>
            </div>
            <div className="flight-booking-detail light-shadow mb-32">
              <div className="flight-title">
                <div className="row d-flex align-items-center justify-content-between">
                  <h4 className="color-black col-7">Payment Details</h4>
                  <h6
                    className="color-black col-5"
                    style={{ cursor: "pointer", textAlign: "right" }}
                    onClick={() => onUpdate({})}
                  >
                    Change Flight
                  </h6>
                </div>
              </div>
              <div className="box bg-white p-24">
                <h6 className="text-secondary fw-bold mb-1">Fare Details</h6>
                <div className="ps-2">
                  {Adult > 0 && (
                    <>
                      <div className="d-flex justify-content-between mb-1">
                        <p className="mb-0 text-muted">Adult(s) Amount : </p>
                        <p className="mb-0">
                          ({Adult} x{" "}
                          {(flight.other.adult_price || 0) +
                            Number(userinfo?.agents?.flight_charges["5"] || 0)}
                          ) = ₹
                          {(flight.other.adult_price || 0) +
                            Number(userinfo?.agents?.flight_charges["5"] || 0) *
                              adultcount}
                        </p>
                      </div>
                    </>
                  )}

                  {child > 0 && (
                    <>
                      <div className="d-flex justify-content-between mb-1">
                        <p className="mb-0 text-muted">Child(s) Amount :</p>
                        <p className="mb-0">
                          ({child} x{" "}
                          {(flight.other.child_price || 0) +
                            Number(userinfo?.agents?.flight_charges["5"] || 0)}
                          ) = ₹
                          {(flight.other.child_price || 0) +
                            Number(userinfo?.agents?.flight_charges["5"] || 0) *
                              child}
                        </p>
                      </div>
                    </>
                  )}

                  {infant > 0 && (
                    <>
                      <div className="d-flex justify-content-between mb-1">
                        <p className="mb-0 text-muted">Infant(s) Amount :</p>
                        <p className="mb-0">
                          {" "}
                          ({infant} x{" "}
                          {(flight.other.infant_price || 0) +
                            Number(userinfo?.agents?.flight_charges["5"] || 0)}
                          ) = ₹
                          {(flight.other.infant_price || 0) +
                            Number(userinfo?.agents?.flight_charges["5"] || 0) *
                              infant}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* <div className="additional-charges mb-2">
                    <h6 className="text-secondary fw-bold">
                      Additional Charges
                    </h6>
                    <div className="ps-2">
                      <div className="d-flex justify-content-between">
                        <p className="mb-0 text-muted">Services Fees:</p>
                        <p className="mb-0">₹{data[0].charges}</p>
                      </div>
                    </div>
                  </div> */}

                <div className="additional-charges mb-2">
                  <h6 className="text-secondary fw-bold">Sub Total</h6>
                  <div className="ps-2">
                    <div className="d-flex justify-content-between">
                      <p className="mb-0 text-muted">Amount:</p>
                      <p className="mb-0">
                        ₹
                        {((flight.other.adult_price || 0) +
                          Number(userinfo?.agents?.flight_charges["5"] || 0)) *
                          adultcount +
                          ((flight.other.child_price || 0) +
                            Number(
                              userinfo?.agents?.flight_charges["5"] || 0
                            )) *
                            child +
                          ((flight.other.infant_price || 0) +
                            Number(
                              userinfo?.agents?.flight_charges["5"] || 0
                            )) *
                            infant}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Series_flight_booking_offline;

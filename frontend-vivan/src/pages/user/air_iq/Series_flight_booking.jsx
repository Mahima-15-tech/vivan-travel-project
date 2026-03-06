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

const Series_flight_booking = ({ data, traveltype, tripinfo, onUpdate }) => {
  const navigate = useNavigate();
  const adultcount = data[0].adultcount.adult;
  const childcount = data[0].adultcount.child;
  const infantcount = data[0].adultcount.infant;
  const finalcharge =
    data[0].uData.type === "2"
      ? data[0].uData.agents.flight_charges["2"] ?? 0
      : data[0].charges;
  const [setting, setSettings] = useState(null);
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

  useEffect(() => {
    fetchSettings();
  }, [data]);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  const [Progressing, setLoding] = useState(null);

  const [payment_id_forcheck, setpayment_id_forcheck] = useState(null);
  const [finaldatafor_payment, setfinaldatafor_payment] = useState(null);
  const passengerTypeOptions = [
    { value: "0", label: "Adult" },
    { value: "1", label: "Child" },
    { value: "2", label: "Infant" },
  ];
  const selectgender = [
    { value: "0", label: "Male" },
    { value: "1", label: "Female" },
  ];
  const selecttitle = [
    { value: "Mr.", label: "MR", type: "0" },
    { value: "Ms.", label: "MS", type: "0" },
    { value: "Mrs.", label: "MRS", type: "0" },
    { value: "Mstr.", label: "MSTR", type: "1" },
    { value: "Miss", label: "MISS", type: "1" },
  ];

  const initialPassengerData = {
    passenger_type: "0",
    gender: "",
    title: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  };

  const [passengers, setPassengers] = useState([initialPassengerData]);
  const PAX_Details = passengers.map((passenger, index) => ({
    Pax_Id: index + 1,
    Pax_type: passenger.passenger_type,
    Title: passenger.title,
    First_Name: passenger.firstName,
    Last_Name: passenger.lastName,
    Age: passenger.Age,
    DOB: passenger.dateOfBirth,
  }));

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession && userDataFromSession != null) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    }
    const count = Number(adultcount) + Number(childcount) + Number(infantcount);

    const createPassengerArray = () => {
      const passengersArray = [];

      // Add adults
      for (let i = 0; i < Number(adultcount); i++) {
        passengersArray.push({ ...initialPassengerData, passenger_type: "0" });
      }

      // Add children
      for (let i = 0; i < Number(childcount); i++) {
        passengersArray.push({ ...initialPassengerData, passenger_type: "1" });
      }

      // Add infants
      for (let i = 0; i < Number(infantcount); i++) {
        passengersArray.push({ ...initialPassengerData, passenger_type: "2" });
      }
      return passengersArray;
    };
    setPassengers(createPassengerArray());
  }, []);

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
  const twoYearsAgo = new Date(
    today.getFullYear() - 2,
    today.getMonth(),
    today.getDate()
  );

  const infant = passengers.filter((p) => p.passenger_type === "2").length;
  const Adult = passengers.filter((p) => p.passenger_type === "0").length;
  const child = passengers.filter((p) => p.passenger_type === "1").length;

  let Infantamount = 0;
  let Adult_amount = 0;
  let child_amount = 0;

  if (infant > 0) {
    Infantamount =
      (Number(data[0].flight.infant_price) + Number(finalcharge)) *
      Number(infant);
  }
  if (Adult > 0) {
    Adult_amount =
      (Number(data[0].flight.price) + Number(finalcharge)) * Number(Adult);
  }
  if (child > 0) {
    child_amount =
      (Number(data[0].flight.price) + Number(finalcharge)) * Number(child);
  }

  const payingamount =
    Number(Infantamount) + Number(Adult_amount) + Number(child_amount);

  async function formattedDate(dateOfBirth) {
    const date = new Date(dateOfBirth);
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "/");
    return formattedDate;
  }

  const handleSubmit = async (e, flight_id) => {
    e.preventDefault();
  
    if (!isConfirmed) {
      return alert("Please Confirm By Checking The Box Before Booking.");
    }
  
    setLoding(true);
  
    // 🔥 STEP 1: CALL AIRIQ BOOKING FIRST
    const payload = {
      api_c: "b",
      is_uat: isuat,
      ticket_id: flight_id.ticket_id,
      total_pax: passengers.length,
      adult: Adult,
      child: child,
      infant: infant,
      adult_info: passengers
        .filter((p) => p.passenger_type === "0")
        .map((p) => ({
          title: p.title,
          first_name: p.firstName,
          last_name: p.lastName,
        })),
      child_info: passengers
        .filter((p) => p.passenger_type === "1")
        .map((p) => ({
          title: p.title,
          first_name: p.firstName,
          last_name: p.lastName,
        })),
      infant_info: passengers
        .filter((p) => p.passenger_type === "2")
        .map((p) => ({
          title: p.title,
          first_name: p.firstName,
          last_name: p.lastName,
          dob: p.dateOfBirth,
          travel_with: 1,
        })),
    };
  
    const api_url = AIR_IQ + AIR_IQ_BOOKING;
    const response = await post(third_party, JSON.stringify(payload), api_url);
    const data = await response.json();
  
    if (!data.status) {
      setLoding(false);
      return toast.error("AIRIQ Booking Failed");
    }
  
    const bookingRef = data.data.booking_id;
  
    // 🔥 STEP 2: SAVE BOOKING IN DB WITH PENDING STATUS
  
    const saveResponse = await HelperPost(
      booking_add_v2,
      {
        user_id: userData.id,
        Booking_RefNo: bookingRef,
        sit_type: sitType, 
        Agency_RefNo: "VT" + Math.floor(1000000 + Math.random() * 9000000),
        BookingFlightDetails: JSON.stringify(flight_id),
        PAX_Details: JSON.stringify(passengers),
        Ticket_Details: JSON.stringify(data.data),
        Amount: payingamount,
        paying_method: paymentMethod,
        amount_res: "",
        type: 2,
        status: "Pending",
        amount_status: "Pending",
      },
      true
    );
  
    if (!saveResponse.ok) {
      setLoding(false);
      return toast.error("Booking Save Failed");
    }
  
    // 🔥 STEP 3: START PAYMENT USING SAME BOOKING REF
  
    if (paymentMethod === "razorpay") {
      setpayment_id_forcheck(bookingRef);
      console.log("🔥 PAYMENT FROM: SERIES NORMAL BOOKING");
      razarpaypayment(
        bookingRef, // 🔥 IMPORTANT CHANGE
        payingamount,
        "Ticket Transaction",
        flight_id,
        (response) => {
          if (response.razorpay_payment_id) {
            updateBookingAfterPayment(bookingRef, response);
          }
        }
      );
    } else {
      // WALLET FLOW
      updateBookingAfterPayment(bookingRef, "Wallet");
    }
  
    setLoding(false);
  };

  const updateBookingAfterPayment = async (bookingRef, paymentResponse) => {

    await HelperPost(
      booking_add_v2,
      {
        Booking_RefNo: bookingRef,
        status: "Success",
        amount_status: "Success",
        amount_res:
          typeof paymentResponse === "string"
            ? paymentResponse
            : JSON.stringify(paymentResponse),
      },
      true
    );
  
    toast.success("Ticket booked successfully");
    navigate("/user/my-bookings");
    window.location.reload();
  };

  const proceed_booking = async (paytype, amount, flight_id, rzres) => {
    let adult_info = [];
    let child_info = [];
    let infant_info = [];

    if (Adult > 0) {
      passengers
        .filter((p) => p.passenger_type === "0")
        .forEach((Adult_data, index) => {
          adult_info.push({
            title: Adult_data.title,
            first_name: Adult_data.firstName,
            last_name: Adult_data.lastName,
          });
        });
    }

    if (child > 0) {
      passengers
        .filter((p) => p.passenger_type === "1")
        .forEach((child_data, index) => {
          child_info.push({
            title: child_data.title,
            first_name: child_data.firstName,
            last_name: child_data.lastName,
          });
        });
    }
    if (infant > 0) {
      passengers
        .filter((p) => p.passenger_type === "2")
        .forEach((infant_data, index) => {
          const date = new Date(infant_data.dateOfBirth);
          const formattedDate = date
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "/");

          infant_info.push({
            title: infant_data.title,
            first_name: infant_data.firstName,
            last_name: infant_data.lastName,
            dob: formattedDate,
            travel_with: 1,
          });
        });
    }

    const payload = {
      api_c: "b",
      is_uat: isuat,
      ticket_id: flight_id.ticket_id,
      total_pax: passengers.length,
      adult: Adult,
      child: child,
      infant: infant,
      adult_info: adult_info,
      child_info: child_info,
      infant_info: infant_info,
    };

    const api_url = AIR_IQ + AIR_IQ_BOOKING;
    const response = await post(third_party, JSON.stringify(payload), api_url);
    const data = await response.json();
    if (data.status == true) {
      const formData = {
        user_id: userData.id,
        Booking_RefNo: data.data.booking_id,
        Agency_RefNo: "VT" + Math.floor(1000000 + Math.random() * 9000000),
        BookingFlightDetails: JSON.stringify(flight_id),
        PAX_Details: JSON.stringify(passengers),
        // amounTicket_Detailst_res: rzres,
        Ticket_Details: JSON.stringify(data.data),
        Amount: amount,
        paying_method: paytype,
        amount_res: rzres,
        type: 2,
        status: "Success",
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
                onSubmit={(e) => handleSubmit(e, data[0])}
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
                                        (passenger.passenger_type === "0"
                                          ? "0"
                                          : "1")
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
                                  name="firstName"
                                  value={passenger.firstName}
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
                                  name="lastName"
                                  value={passenger.lastName}
                                  onChange={(e) => handleInputChange(e, index)}
                                  placeholder="Last Name"
                                  className="form-control wizard-required"
                                  required
                                />
                              </div>

                              {passenger.passenger_type == 2 && (
                                <>
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
                                        maxDate={new Date()}
                                        showMonthDropdown={true}
                                        showYearDropdown={true}
                                        minDate={new Date(twoYearsAgo)}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
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
              </form>

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
                      {data[0].flight.departure_time}
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
                      {data[0].flight.arival_time}
                    </h5>
                    <h5 className="dark-gray">{data[0].flight.destination}</h5>
                  </div>
                </div>
                <div className="d-flex justify-content-around mb-20">
                  <div className="flight-departure">
                    <h6 className="dark-gray">Departure</h6>
                    <h5 className="color-black">
                      {formatDate(data[0].flight.departure_date)}
                    </h5>
                  </div>
                  <div className="vr-line"></div>
                  <div className="flight-departure">
                    <h6 className="dark-gray">Arrival</h6>
                    <h5 className="color-black">
                      {formatDate(data[0].flight.arival_date)}
                    </h5>
                  </div>
                </div>
                <hr className="bg-medium-gray mb-20" />
                <div className="text">
                  <h6 className="color-medium-gray">Tpm Line</h6>
                  <h6 className="color-medium-gray">
                    Operated by {data[0].flight.airline}
                  </h6>
                  <h6 className="color-medium-gray">
                    Flight {data[0].flight.flight_number}{" "}
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
                          {data[0].flight.price + Number(finalcharge)}) = ₹
                          {Adult_amount}
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
                          {data[0].flight.price + Number(finalcharge)}) = ₹
                          {child_amount}
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
                          {data[0].flight.infant_price + Number(finalcharge)}) =
                          ₹{Infantamount}
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
                        <p className="mb-0">₹{finalcharge}</p>
                      </div>
                    </div>
                  </div> */}

                <div className="additional-charges mb-2">
                  <h6 className="text-secondary fw-bold">Sub Total</h6>
                  <div className="ps-2">
                    <div className="d-flex justify-content-between">
                      <p className="mb-0 text-muted">Amount:</p>
                      <p className="mb-0">₹{payingamount}</p>
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

export default Series_flight_booking;

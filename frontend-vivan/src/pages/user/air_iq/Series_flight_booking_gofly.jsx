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

const Series_flight_booking_gofly = ({
  
  data,
  traveltype,
  tripinfo,
  onUpdate,
}) => {
  // 🔥 Detect supplier automatically
const sitType = data?.[0]?.flight?.sit_type;

console.log("SELECTED SIT TYPE:", sitType);

// 🔥 Map supplier endpoints
const supplierApiMap = {
  1: "third_party/etrav",
  2: "third_party/airiq",
  3: "third_party/gflight",
  4: "third_party/wingflight",
};

const bookingEndpoint = supplierApiMap[sitType];
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
  const [Infantamount, setInfantamount] = useState(0);
  const [Adult_amount, setAdult_amount] = useState(0);
  const [child_amount, setchild_amount] = useState(0);
  const [payingamount, setpayingamount] = useState(0);
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

    const feacfare = async () => {
      try {
        // console.log(data[0]);
        console.log("FULL FLIGHT OBJECT:", data[0].flight);
console.log("OTHER:", data[0].flight.other);
console.log("FLIGHT KEY:", data[0].flight.other?.key);
const response = await HelperPost(
  bookingEndpoint,
  {
    sit_type: sitType.toString(),
    type: "checkflight",
    data: JSON.stringify({
      query: {
        nAdt: adultcount,
        nChd: childcount,
        nInf: infantcount,
        legs: [
          {
            src: data[0].flight.origin,
            dst: data[0].flight.destination,
            dep: data[0].flight.departure_datetime
              .split(" ")[0]
              .split("-")
              .reverse()
              .join("/"),
          },
        ],
      },
      flight_keys: [data[0].flight.other?.key],
    }),
  },
  true
);
        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(`Error ${response.status}: ${errorMsg}`);
        }

        const dataree = await response.json();
        if (dataree.status) {

          console.log("CHECKFLIGHT RESPONSE FULL:", dataree);

          if (dataree.status && dataree.data && dataree.data._data) {
            const flightData = dataree.data._data;

            if (!flightData.flight.key) {
              toast.error("Flight key missing. Please search again.");
              return;
            }
            
            setdataree(flightData);
          } else {
            toast.error("Flight verification failed. Please search again.");
          }

          // setUData(data.data);

          if (data.length > 0) {
            const flightData = data[0].flight;
            const charges = Number(finalcharge);

            let infantAmount = 0,
              adultAmount = 0,
              childAmount = 0,
              totalAmount = 0;

            if (infantcount > 0) {
              infantAmount =
                (Number(flightData.other.infant_price) + charges) *
                Number(infantcount);
            }
            if (adultcount > 0) {
              adultAmount =
                (Number(flightData.other.adult_price) + charges) *
                Number(adultcount);
            }
            if (childcount > 0) {
              childAmount =
                (Number(flightData.other.child_price) + charges) *
                Number(childcount);
            }

            totalAmount = Number(flightData.price.isisnetfare);

            // Set the calculated amounts (assuming you have state variables for these)
            setInfantamount(infantAmount);
            setAdult_amount(adultAmount);
            setchild_amount(childAmount);
            setpayingamount(totalAmount);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    feacfare();
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
     // Add children
for (let i = 0; i < Number(childcount); i++) {
  passengersArray.push({
    ...initialPassengerData,
    passenger_type: "child",
  });
}

// Add infants
for (let i = 0; i < Number(infantcount); i++) {
  passengersArray.push({
    ...initialPassengerData,
    passenger_type: "infant",
  });
} 
      return passengersArray;
    };
    setPassengers(createPassengerArray());
  }, [data]); // Empty dependency array ensures it runs only once

 const [paymentMethod, setPaymentMethod] = useState("HDFC");
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
    title: "",
    nationality: "",
    passport_num: "",
  };

  const [passengers, setPassengers] = useState([initialPassengerData]);

  const [userData, setUserData] = useState(null);

  const [payment_id_forcheck, setpayment_id_forcheck] = useState(null);
  const [finaldatafor_payment, setfinaldatafor_payment] = useState(null);
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
  
    if (!dataree) {
      return toast.error("Flight data not ready. Please wait.");
    }
  
    setLoding(true);
  
    const refval = "VT" + Math.floor(1000000 + Math.random() * 9000000);
  
    try {
  
      // ✅ STEP 1 — Prepare Passenger Data
      const PAX_Details = passengers.map((passenger) => ({
        title: passenger.title,
        first_name: passenger.first_name,
        last_name: passenger.last_name,
        type: passenger.passenger_type,
        dob: passenger.dateOfBirth
          ? passenger.dateOfBirth.split("/").reverse().join("-")
          : "",
        nationality: passenger.nationality,
        passport_num: passenger.passport_num,
      }));
  
      // ✅ STEP 2 — Prepare GOFLY Payload (IMPORTANT)
      const payload = {
        query: {
          nAdt: adultcount,
          nInf: infantcount,
          nChd: childcount,
          legs: dataree.query.legs,
        },
        flight_keys: [
          dataree?.flight?.key || dataree?.flight?.other?.key
        ],
        total_price: payingamount,
        currency: "INR",
        paxes: PAX_Details,
        client_details: {
          email: userData.email,
          phone: userData.mobile_no,
        },
      };
  
      // ✅ STEP 3 — Save booking FIRST (Pending)
      const saveResponse = await HelperPost(
        booking_add_v2,
        {
          user_id: userData.id,
          sit_type: sitType, 
          Booking_RefNo: refval,
          Agency_RefNo: refval,
          BookingFlightDetails: JSON.stringify(payload),  // 🔥 CORRECT
          PAX_Details: JSON.stringify(passengers),
          Ticket_Details: "",
          Amount: payingamount,
          paying_method: paymentMethod,
          amount_res: "",
          type: 3,
          status: "Pending",
          amount_status: "Pending",
        },
        true
      );
      
      console.log("BOOKING KEY:", dataree.flight.key);
      if (!saveResponse.ok) {
        setLoding(false);
        return toast.error("Booking Save Failed");
      }
  
      console.log("🔥 PAYMENT FROM: GOFLY BOOKING", refval);
  
      // ✅ STEP 4 — Start HDFC Payment
      if (paymentMethod === "HDFC") {
        setpayment_id_forcheck(refval);

setfinaldatafor_payment([
  paymentMethod,
  payingamount,
  refval
]);

// FIRST BOOK FLIGHT
await updateAfterPayment(refval, "Hold");

// THEN PAYMENT
razarpaypayment(refval, payingamount, userData.email);
      } else {
        await updateAfterPayment(refval, "Wallet");
      }
  
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  
    setLoding(false);
  };


  const updateAfterPayment = async (bookingRef, paymentResponse) => {
    try {
      const PAX_Details = passengers.map((passenger) => ({
        title: passenger.title,
        first_name: passenger.first_name,
        last_name: passenger.last_name,
        type: passenger.passenger_type,
        dob: passenger.dateOfBirth
          ? passenger.dateOfBirth.split("/").reverse().join("-")
          : "",
        nationality: passenger.nationality,
        passport_num: passenger.passport_num,
      }));
      
      const payload = {
        query: {
          nAdt: adultcount,
          nInf: infantcount,
          nChd: childcount,
          legs: dataree.query.legs,
        },
        flight_keys: [
          dataree?.flight?.key
        ],
        total_price: payingamount,
        currency: "INR",
        paxes: PAX_Details,
        client_details: {
          email: userData.email,
          phone: userData.mobile_no,
        },
      };
      // const payload = {
      //   query: {
      //     nAdt: adultcount,
      //     nInf: infantcount,
      //     nChd: childcount,
      //     legs: dataree.query.legs,
      //   },
      //   flight_keys: [dataree.flight.key],
      //   total_price: payingamount,
      //   currency: "INR",
      //   paxes: PAX_Details,
      //   client_details: {
      //     email: userData.email,
      //     phone: userData.mobile_no,
      //   },
      // };
  
      const response = await HelperPost(
        bookingEndpoint,
        {
          sit_type: sitType.toString(),
          type: "booking",
          data: JSON.stringify(payload),
        },
        true
      );
  
      const data = await response.json();
  
      if (data.status && data.data.success) {
        // 🔥 UPDATE BOOKING AFTER SUCCESS
        await HelperPost(
          "booking/update",
          {
            Booking_RefNo: bookingRef,
            status: "Hold",
            amount_status: "Success",
            PNR: data.data["_data"]?.pnr || null,
            Ticket_Details: JSON.stringify(data.data["_data"]),
            amount_api_res: JSON.stringify(paymentResponse),
            
          },
          true
        );
  
        toast.success("Ticket booked successfully");
        navigate("/user/my-bookings");
      } else {
        toast.error("Flight booking failed after payment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Booking processing failed");
    }
  };

  const proceed_booking = async (paytype, amount, flight_id, rzres) => {
    const PAX_Details = passengers.map((passenger, index) => ({
      title: passenger.title,
      first_name: passenger.first_name,
      last_name: passenger.last_name,
      type: passenger.passenger_type,
      dob: passenger.dateOfBirth.split("/").reverse().join("-"),
      nationality: passenger.nationality?.value || passenger.nationality,
      passport_num: passenger.passport_num,
    }));
    const refval = "VT" + Math.floor(1000000 + Math.random() * 9000000);
    const payload = {
      query: {
        nAdt: adultcount,
        nInf: infantcount,
        nChd: childcount,
        legs: dataree.query.legs,
      },
      flight_keys: [dataree.flight.key],
      total_price: payingamount,
      currency: "INR",
      paxes: PAX_Details,
      client_details: {
        email: userData.email,
        phone: userData.mobile_no,
      },
    };

    // const api_url = AIR_IQ + AIR_IQ_BOOKING;
    // const response = await post(third_party, JSON.stringify(payload), api_url);
    const response = await HelperPost(
      bookingEndpoint,
      {
        sit_type: sitType.toString(),
        type: "booking",
        data: JSON.stringify(payload),
      },
      true
    );
    const data = await response.json();
    if (data.status == true && data.data.success == true) {
      const formData = {
        user_id: userData.id,
        Booking_RefNo: data.data["_data"].booking_reference,
        Agency_RefNo: refval,
        BookingFlightDetails: JSON.stringify(payload),
        PAX_Details: JSON.stringify(passengers),
        // amount_res: rzres,
        Ticket_Details: JSON.stringify(data.data["_data"]),
        Amount: amount,
        paying_method: paytype,
        amount_res: rzres,
        type: 3,
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
                onSubmit={handleSubmit}
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
                                  required={
                                    !!dataree?.input_requirements
                                      ?.passport_number?.required
                                  }
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
                                    value="HDFC"
                                    checked={paymentMethod === "HDFC"}
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
                
                  updateAfterPayment(payment_id_forcheck, "");
                
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
                  <h6 className="color-medium-gray">Tpm Line</h6>
                  <h6 className="color-medium-gray">
                    Operated by{" "}
                    {data?.[0]?.airlines?.find(
                      (airline) =>
                        airline.code === data?.[0]?.flight?.Airline_Code
                    )?.name || ""}
                  </h6>
                  <h6 className="color-medium-gray">
                    Flight {data[0].flight.flight_numbers}{" "}
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
                          {(dataree?.flight?.adult_price || 0) +
                            Number(finalcharge)}
                          ) = ₹{Adult_amount}
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
                          {(dataree?.flight?.child_price || 0) +
                            Number(finalcharge)}
                          ) = ₹{child_amount}
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
                          {(dataree?.flight?.infant_price || 0) +
                            Number(finalcharge)}
                          ) = ₹{Infantamount}
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

export default Series_flight_booking_gofly;

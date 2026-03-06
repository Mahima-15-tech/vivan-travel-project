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
import PaymentStatusPopup from "../check_payment";

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

const Series_flight_booking_4 = ({ data, traveltype, tripinfo, onUpdate }) => {
  const navigate = useNavigate();
  const adultcount = data[0].adultcount.adult;
  const childcount = data[0].adultcount.child;
  const infantcount = data[0].adultcount.infant;
  const finalcharge =
    data[0].uData.type === "2"
      ? data[0].uData.agents.flight_charges["2"] ?? 0
      : data[0].charges;
  // console.log("yogesh finalcharge", finalcharge);
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
  const [Infantamount, setInfantamount] = useState(0);
  const [Adult_amount, setAdult_amount] = useState(0);
  const [child_amount, setchild_amount] = useState(0);
  const [Infantamount2, setInfantamount2] = useState(0);
  const [Adult_amount2, setAdult_amount2] = useState(0);
  const [child_amount2, setchild_amount2] = useState(0);
  const [payingamount, setpayingamount] = useState(0);
  const [international_flight_staus, setinternational_flight_staus] = useState(
    data.length > 0 ? data[0].flight.other.international_flight_staus : 0
  );
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
        // console.log(
        //   "yogesh flight othwer",
        //   data[0].flight.other.international_flight_staus
        // );
        setinternational_flight_staus(
          data.length > 0 ? data[0].flight.other.international_flight_staus : 0
        );
        // console.log(data[0]);
        const response = await HelperPost(
          "third_party/gflight",
          {
            sit_type: "4",
            type: "checkflight",
            data: JSON.stringify({
              id: data[0].flight.other.id,
              adult_children:
                Number(data[0].adultcount.adult) +
                Number(data[0].adultcount.child),
              infant: Number(data[0].adultcount.infant),
              onward_date: data[0].flight.other.onward_date,
              static: data[0].flight.other.static,
            }),
          },
          true
        );
        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(`Error ${response.status}: ${errorMsg}`);
        }

        const datarees = await response.json();
        if (datarees.status && datarees.data.errorCode == 0) {
          setdataree(datarees.data.data);
          const priceamounttopay = Number(
            datarees.data.data.total_payable_price
          );
          // setUData(data.data);

          if (data.length > 0) {
            const flightData = data[0].flight;
            const charges = Number(finalcharge);

            let infantAmount = 0,
              adultAmount = 0,
              childAmount = 0,
              totalAmount = 0;
            if (infantcount > 0) {
              setInfantamount2(
                Number(flightData.other.per_infant_price) + charges
              );
              // priceamounttopay -
              // ;
              infantAmount =
                Number(Number(flightData.other.per_infant_price) + charges) *
                Number(infantcount);
            }

            const totalinfantpriceneedtopay =
              Number(flightData.other.per_infant_price) * Number(infantcount);
            const totalpending = priceamounttopay - totalinfantpriceneedtopay;
            const peradult =
              totalpending / (Number(adultcount) + Number(childcount)) +
              charges;
            setAdult_amount2(peradult);
            setchild_amount2(peradult);
            if (adultcount > 0) {
              adultAmount = peradult * Number(adultcount);
            }

            if (childcount > 0) {
              childAmount = peradult * Number(childcount);
            }
            totalAmount =
              Number(flightData.price.isisnetfare) + Number(charges) * count;

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
    title: "",
    nationality: "",
    passport_expiry: "",
    passport_num: "",
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

    const ordre_id = "VT" + Date.now();
    console.log("🟢 ORDER ID BEFORE PAYMENT:", ordre_id);
    if (paymentMethod === "razorpay") {
      setpayment_id_forcheck(ordre_id);
      setfinaldatafor_payment({
        1: ordre_id,
        2: payingamount,
        3: data[0].flight.key,
      });
      razarpaypayment(
        ordre_id,
        payingamount,
        "Ticket Transaction",
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
    console.log(birthDate);
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
    const PAX_Details = passengers.map((passenger) => {
      // Convert DD/MM/YYYY → YYYY-MM-DD safely
      // console.log("yogesh dob", passenger.dateOfBirth);
      const [month, day, year] = passenger.dateOfBirth.split("/");
      const formattedDate = `${year}-${month}-${day}`;
       let formattedDate2 = ""
      if (passenger.passport_expiry && passenger.passport_expiry.includes("/")) {
        const parts = passenger.passport_expiry.split("/");
        if (parts.length === 3) {
          const [month2, day2, year2] = parts;
          formattedDate2 = `${year2}-${month2}-${day2}`;
        }
      }
      return {
        gender: passenger.title, // Mr/Miss
        first_name: passenger.first_name,
        middle_name: passenger.middle_name || "",
        last_name: passenger.last_name,
        age: calculateAge(formattedDate),
        dob: formattedDate,
        passport_no: passenger.passport_num || "",
        passport_expire_date: formattedDate2,
      };
    });

    // console.log("yogesh pax", PAX_Details);

    // Creating the payload
    const payload = {
      id: data[0].flight.other.id, // Assuming this is a static ID; update dynamically if needed
      onward_date: data[0].flight.other.onward_date,
      return_date: "", // Assuming it's a one-way trip; update accordingly
      adult: adultcount,
      children: childcount,
      infant: infantcount,
      dep_city_code: data[0].flight.origin,
      arr_city_code: data[0].flight.destination,
      total_book_seats:
        Number(adultcount) + Number(childcount) + Number(infantcount),
      contact_name: "Sunil kumar", // Update dynamically if needed
      contact_email: "sunil.fareboutique@gmail.com",
      contact_number: "9632587418",
      flight_traveller_details: PAX_Details,
      partner_user_id: "0",
      booking_token_id: data[0].flight.key, // Assuming this is equivalent to token_id
      total_amount: payingamount,
      static: data[0].flight.other.static,
    };

    const api_url = AIR_IQ + AIR_IQ_BOOKING;
    // const response = await post(third_party, JSON.stringify(payload), api_url);
    const response = await HelperPost(
      "third_party/gflight",
      { sit_type: "4", type: "booking", data: JSON.stringify(payload) },
      true
    );
    const finaldata = await response.json();
    if (finaldata.status == true) {
      const formData = {
        user_id: userData.id,
        Booking_RefNo: finaldata.data.data["reference_id"],
        Agency_RefNo: refval,
        BookingFlightDetails: JSON.stringify(data[0]),
        PAX_Details: JSON.stringify(passengers),
        // amount_res: rzres,
        Ticket_Details: JSON.stringify(finaldata.data.data),
        Amount: amount,
        paying_method: paytype,
        amount_res: rzres,
        type: 4,
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
                              {international_flight_staus === 1 && (
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
                                    onChange={(e) =>
                                      handleInputChange(e, index)
                                    }
                                    placeholder="Passport Number"
                                    className="form-control wizard-required"
                                    required={
                                      !!dataree?.input_requirements
                                        ?.passport_number?.required
                                    }
                                  />
                                </div>
                              )}
                              {international_flight_staus === 1 && (
                                <div className="col-sm-6 col-md-6 mb-12">
                                  <div className="input-date-picker">
                                    <label
                                      htmlFor="passport_expiry"
                                      className="h6 color-medium-gray mb-1"
                                    >
                                      Passport Expiry
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
                                      dateFormat="dd-MMM-yyyy"
                                      className="sel-input date_from form-control wizard-required"
                                      placeholderText="Passport Expiry"
                                      style={{
                                        width: "100%",
                                        padding: "10px",
                                        cursor: "pointer",
                                      }}
                                      required
                                      showMonthDropdown={true} // Disable month dropdown
                                      showYearDropdown={true} // Disable year dropdown
                                      minDate={
                                        new Date(
                                          new Date(
                                            tripinfo[0].TravelDate
                                          ).getFullYear(),
                                          new Date(
                                            tripinfo[0].TravelDate
                                          ).getMonth() + 6,
                                          new Date(
                                            tripinfo[0].TravelDate
                                          ).getDate()
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              )}
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
                              {/* <div className="col-sm-6 mb-12">
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
                              </div> */}
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
                  <h6 className="color-medium-gray">Tpm Line</h6>
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
                        <p className="mb-0 text-muted">Adult(s) Amount :</p>
                        <p className="mb-0">
                          ({Adult} x {Adult_amount2 || 0}) = ₹{Adult_amount}
                        </p>
                      </div>
                    </>
                  )}

                  {child > 0 && (
                    <>
                      <div className="d-flex justify-content-between mb-1">
                        <p className="mb-0 text-muted">Child(s) Amount :</p>
                        <p className="mb-0">
                          ({child} x {child_amount2 || 0}) = ₹{child_amount}
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
                          {(Infantamount2 || 0) + Number(finalcharge)}) = ₹
                          {Infantamount}
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

export default Series_flight_booking_4;

import React, { useState, useEffect } from "react";
import "../flight-booking-main/flight-booking-main.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  AIR_2_URL,
  AIR_3_URL,
  AIR_REPRICE,
  AIR_GETSSR,
  AIR_BOOKING,
  AIR_TICKETING,
  AIR_REPRINT,
  third_party,
  booking_add,
  booking_update,
  wallet_add,
  users_profile,
  AIR_PAY,
  AIR_GETSEATMAP,
  siteconfig,
  api_logs,
} from "../../../API/endpoints";
import { post } from "../../../API/airline";
import { post as HelperPost, get } from "../../../API/apiHelper";
import PaymentStatusPopup from "../../user/check_payment";

import { razarpaypayment } from "../../../API/utils";
// import { hdfcPayment } from "../../../API/utils";

import { ToastContainer, toast } from "react-toastify";
import logo from "../../../assets/images/logo.png";
import Progress from "../../../component/Loading";
import country from "../../../widget/country";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiWallet } from "react-icons/ci";
import { SiRazorpay } from "react-icons/si";
import { format } from "date-fns";
import { Modal } from "react-bootstrap";
import FareChangePopup from "./FareChangePopup";

import {
  FaChair,
  FaUtensils,
  FaFastForward,
  FaLuggageCart,
  FaWheelchair,
  FaGift,
  FaUserTie,
  FaPlane,
  FaCocktail,
  FaSuitcase,
  FaDumbbell,
  FaEllipsisH,
} from "react-icons/fa";

const ServiceButton = ({ id, icon, label, selected, onToggleNew, ishow }) => {
  return (
    <button
      type="button"
      style={{
        ...styles.button,
        backgroundColor: selected ? "#ffa85d" : "#f9f9f9",
        color: selected ? "white" : "#333",
        border: selected ? "none" : "1px solid #ddd",
        display: ishow ? "block" : "none",
      }}
      onClick={onToggleNew}
    >
      {icon}
      <span style={styles.buttonLabel}>{label}</span>
    </button>
  );
};
// Styles
const styles = {
  container: {
    padding: "20px 0",
  },
  heading: {
    fontSize: "16px",
    marginBottom: "16px",
    color: "#333",
  },
  serviceGrid: {
    display: "flex",
    // justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontSize: "14px",
    gap: "5px",
  },
  buttonLabel: {
    fontWeight: "bold",
  },
  dropdownSection: {
    marginTop: "40px",
    textAlign: "center",
  },
  subHeading: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#ffa85d",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
  },
  dropdown: {
    marginLeft: "10px",
    padding: "16px 24px 16px 10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};

const safeFormatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return format(d, "yyyy-MM-dd");
};


const FlightBookingForm = ({
  data,
  traveltype,
  tripinfo,
  bookingamount,
  bookingamountwithcommission,
  onupdatessr,
  triptype,
  reprice,
  oldfare,
  isisnetfarefromback,
  agencycharge,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [Progressing, setLoding] = useState(null);
  const [repriceloading, setRepriceLoding] = useState(false);
  const [airrresponsedata, setairrresponsedata] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [uData, setUData] = useState(null);
  const [setting, setSettings] = useState(null);
  let isuat = "no";

  const Search_Key = data[0].Search_Key;
  const adultcount = data[0].adultcount.adult;
  const childcount = data[0].adultcount.child;
  const infantcount = data[0].adultcount.infant;

  const initialPassengerData = {
    passenger_type: "0",
    gender: "",
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    nationality: "",
    Age: "",
    Passenger_Mobile: "",
    WhatsAPP_Mobile: "",
    dateOfBirth: "",
    passport_Number: "",
    Passport_Issuing_Country: "",
    Passport_Expiry: "",
    pancard_Number: "",
    flightNumber: "",
  };
  const [passengers, setPassengers] = useState([]);
  // let PAX_Details = passengers.map((passenger, index) => {
  //   const calculateAge = (dateOfBirth) => {
  //     const today = new Date();
  //     const birthDate = new Date(dateOfBirth);
  //     let age = today.getFullYear() - birthDate.getFullYear();
  //     const monthDifference = today.getMonth() - birthDate.getMonth();

  //     if (
  //       monthDifference < 0 ||
  //       (monthDifference === 0 && today.getDate() < birthDate.getDate())
  //     ) {
  //       age--;
  //     }
  //     return age;
  //   };

  //   return {
  //     Pax_Id: index + 1,
  //     Pax_type: passenger.passenger_type,
  //     Title: passenger.title,
  //     First_Name: passenger.firstName,
  //     Last_Name: passenger.lastName,
  //     Gender: passenger.gender === "Male" || passenger.gender === "0" ? 0 : 1,
  //     Age: calculateAge(passenger.dateOfBirth), // Calculate age
  //     DOB: safeFormatDate(passenger.dateOfBirth),


  //     Passport_Number: passenger.passport_Number,
  //     Passport_Issuing_Country: passenger.Passport_Issuing_Country,
  //     Passport_Expiry: passenger.Passport_Expiry,
  //     Nationality: passenger.nationality,
  //     Pancard_Number: passenger.pancard_Number,
  //     FrequentFlyerDetails: {
  //       AirLineCode: "",
  //       FrequentFlyerNumber: "",
  //     },
  //   };
  // });

  const [isConfirmed, setIsConfirmed] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsConfirmed(e.target.checked);
  };
  const [SSRinfoop, setop] = useState([]);
  const [seats, setSeatdetails] = useState([]);
  const [ssrloading, setssrloading] = useState(false);

  const fetchSsrData = async (f_key) => {
    setssrloading(true);

    let settingFromSession = sessionStorage.getItem("settting");
    if (settingFromSession && settingFromSession != null) {
      const setting = JSON.parse(settingFromSession);
      if (setting.etrav_api_prod_on === 1) {
        isuat = "no";
      } else {
        isuat = "yes";
      }
    }

    try {
      let Ssrinfo = [];
      let Flight_Key = [];
      data.forEach((trip, index) => {
        Ssrinfo.push({
          Flight_Key: f_key[index],
        });
        Flight_Key.push(f_key[index]);
      });

      const payload = {
        // "Auth_Header": {
        //     "UserId": "viviantravelsuat",
        //     "Password": "3B96F16F32C9AEB30C4DF9B3FBABAE964E4E1033",
        //     "IP_Address": "12333333",
        //     "Request_Id": "5500833959053023879",
        //     "IMEI_Number": "9536615000"
        // },
        api_c: "a",
        is_uat: isuat,
        Search_Key: Search_Key,
        AirSSRRequestDetails: Ssrinfo,
      };
      const api_url = (await AIR_2_URL()) + AIR_GETSSR;
      const response = await post(
        third_party,
        JSON.stringify(payload),
        api_url
      );
      const SSRresponsedata = await response.json();

      const logs_response = await HelperPost(
        api_logs,
        {
          user_id: "",
          api_name: "AIR_GETSSR",
          api_url: api_url,
          api_payload: JSON.stringify(payload),
          api_response: JSON.stringify(SSRresponsedata),
        },
        true
      );

      const Seat_map_payload = {
        // "Auth_Header": {
        //     "UserId": "viviantravelsuat",
        //     "Password": "3B96F16F32C9AEB30C4DF9B3FBABAE964E4E1033",
        //     "IP_Address": "12333333",
        //     "Request_Id": "5500833959053023879",
        //     "IMEI_Number": "9536615000"
        // },
        api_c: "a",
        is_uat: isuat,
        Search_Key: Search_Key,
        Flight_Keys: Flight_Key,
        PAX_Details: buildPaxDetails(),
      };
      const api_url_seat_map = (await AIR_2_URL()) + AIR_GETSEATMAP;
      const seat_map_response = await post(
        third_party,
        JSON.stringify(Seat_map_payload),
        api_url_seat_map
      );
      const Seatmap_responsedata = await seat_map_response.json();

      const logs = await HelperPost(
        api_logs,
        {
          user_id: "",
          api_name: "AIR_GETSEATMAP",
          api_url: api_url_seat_map,
          api_payload: JSON.stringify(Seat_map_payload),
          api_response: JSON.stringify(Seatmap_responsedata),
        },
        true
      );

      let SSRData = SSRresponsedata.data.SSRFlightDetails;
      let Seats = [];
      if (Seatmap_responsedata.data.AirSeatMaps) {
        Seatmap_responsedata.data.AirSeatMaps.map((airSeatMaps, index) =>
          airSeatMaps.Seat_Segments.map(
            (seat_Segments, Seat_Segments_index) => Seats.push(seat_Segments)
            //     seat_Segments.Seat_Row.map((seat_Row, Seat_Row_index) => (
            //         seat_Row.Seat_Details.map((Seat_Details, index) => (
            //             Seats.push(Seat_Details)
            //         ))
            //     ))
          )
        );
        setSeatdetails(Seats);
      }
      try {
        const options = SSRData.flatMap((item) => {
          if (!item.SSRDetails) {
            return [];
          }
          return item.SSRDetails.map((detail) => {
            if (!detail.SSR_TypeDesc) {
              return null;
            }
            return {
              value: detail.SSR_Code,
              label: `${detail.SSR_TypeDesc} - ₹${detail.Total_Amount}`,
              currency: detail.Currency_Code,
              typeName: detail.SSR_TypeName,
              flightId: detail.Flight_ID,
              legIndex: detail.Leg_Index,
              SSR_Type: detail.SSR_Type,
              SSR_Key: detail.SSR_Key,
              SSR_TypeDesc: detail.SSR_TypeDesc,
              Total_Amount: detail.Total_Amount,
              Segment_Id: detail.Segment_Id,
            };
          });
        }).filter(Boolean);

        setop(options);
        setssrloading(false);
      } catch (error) {
        setssrloading(false);
        console.error("An error occurred while processing the data:", error);
      }
      setssrloading(false);
    } catch (error) {
      setssrloading(false);
      console.error("Failed to geting", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await get(users_profile, true);
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Error ${response.status}: ${errorMsg}`);
      }
      const data = await response.json();
      setUData(data.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  const fetchSettings = async () => {
    try {
      const res = await get(siteconfig, true);
      const response = await res.json();
      setSettings(response.data);
    } catch (error) {
      // console.log(error);
    }
  };
  const [showFarePopup, setShowFarePopup] = useState(false);
  const [showFarePopupnewprice, setShowFarePopupnewprice] = useState(0);
  const [
    showFarePopupnewpricewithoutcommison,
    setShowFarePopupnewpricewithoutcommison,
  ] = useState(0);
  const [oldshowFarePopupnewprice, setoldShowFarePopupnewprice] = useState(0);
  const [
    oldshowFarePopupnewpricewithoutcommison,
    setoldShowFarePopupnewpricewithoutcommison,
  ] = useState(0);

  const [payment_id_forcheck, setpayment_id_forcheck] = useState(null);
  const [finaldatafor_payment, setfinaldatafor_payment] = useState(null);
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
    let temp_passengers = createPassengerArray();
   

    temp_passengers.forEach((pass, index) => {
      const data = {
        ...pass,
        ssrOptions: [
          {
            icon: <FaLuggageCart />,
            id: `1_${index + 1}`,
            value: 0,
            label: "LUGGAGE",
            pindex: index + 1,
          },
          {
            icon: <FaCocktail />,
            id: `2_${index + 1}`,
            value: 1,
            label: "MEALS",
            pindex: index + 1,
          },
          // { icon: <FaUtensils />, id: 3, value: 2, label: 'COMPLIMENTORY_MEALS' },
          {
            icon: <FaWheelchair />,
            id: `11_${index + 1}`,
            value: 10,
            label: "WHEELCHAIR",
            pindex: index + 1,
          },

          {
            icon: <FaChair />,
            id: `4_${index + 1}`,
            value: 3,
            label: "SEAT",
            pindex: index + 1,
          },
          // { icon: <FaDumbbell />, id: 5, value: 4, label: 'SPORTS' },
          // { icon: <FaSuitcase />, id: 6, value: 5, label: 'BAGOUTFIRST' },
          // { icon: <FaPlane />, id: 7, value: 6, label: 'LOUNGE' },
          // { icon: <FaGift />, id: 8, value: 7, label: 'CELEBRATION' },
          // { icon: <FaSuitcase />, id: 9, value: 8, label: 'CARRYMORE' },
          // { icon: <FaFastForward />, id: 10, value: 9, label: 'FASTFORWARD' },
          // { icon: <FaUserTie />, id: 12, value: 11, label: 'FREQUENTFLYER' },
          // { icon: <FaEllipsisH />, id: 13, value: 15, label: 'OTHERS' }
        ],
      };
      temp_passengers[index] = data;
    });
    setPassengers(temp_passengers);
  }, []);
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    if (!dateOfBirth) return 0;

const birthDate = new Date(dateOfBirth);
if (isNaN(birthDate.getTime())) return 0;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };
  const validateEmail = (email) => {
    // Simple regex for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const handleInputChange = (eventOrOption, index) => {
    const updatedPassengers = [...passengers];
    if (eventOrOption.target) {
      const { name, value } = eventOrOption.target;
      updatedPassengers[index][name] = value;
      if ((name === "email" || name === "Passenger_Mobile") && index === 0) {
        for (let i = 0; i < updatedPassengers.length; i++) {
          // if (!validateEmail(updatedPassengers[i][name])) {
          updatedPassengers[i][name] = value;
          // }
        }
      } else if (name === "title") {
        updatedPassengers[index]["gender"] = selecttitle.find(
          (val) => val.label === value
        ).gender;
      }
    } else {
      const { name, value } = eventOrOption;
      if (name === "title") {
        updatedPassengers[index]["gender"] = selecttitle.find(
          (val) => val.label === value
        ).gender;
      }
      updatedPassengers[index][name] = value;
    }
    // console.log("updatedPassengers", JSON.stringify(updatedPassengers));

    setPassengers(updatedPassengers);
    // console.log(updatedPassengers);
  };
  let api_called = false;
  const calculateFareDifference = async ({ repriceResponses }) => {
    return new Promise((resolve) => {
      let oldsum = 0;
      let oldsumwithcommission = 0;
      let resum = 0;
      let resumwithcommission = 0;

      data.forEach((element, index) => {
        const agencyChargeval = Number(agencycharge["1"] ?? "0");

        const oldFareDetails = element.item.FareDetails;
        const oldfareAdult = Number(
          oldFareDetails.find((f) => f.PAX_Type === 0)?.Total_Amount || 0
        );
        const oldfareChild = Number(
          oldFareDetails.find((f) => f.PAX_Type === 1)?.Total_Amount || 0
        );
        const oldfareInfant = Number(
          oldFareDetails.find((f) => f.PAX_Type === 2)?.Total_Amount || 0
        );

        oldsum +=
          (oldfareAdult + agencyChargeval) * adultcount +
          (oldfareChild + agencyChargeval) * childcount +
          (oldfareInfant + agencyChargeval) * infantcount;

        oldsumwithcommission +=
          (oldfareAdult -
            Number(
              oldFareDetails.find((f) => f.PAX_Type === 0)?.Net_Commission || 0
            ) +
            agencyChargeval) *
            adultcount +
          (oldfareChild -
            Number(
              oldFareDetails.find((f) => f.PAX_Type === 1)?.Net_Commission || 0
            ) +
            agencyChargeval) *
            childcount +
          (oldfareInfant -
            Number(
              oldFareDetails.find((f) => f.PAX_Type === 2)?.Net_Commission || 0
            ) +
            agencyChargeval) *
            infantcount;

        const flight = repriceResponses[index]?.Flight;
        const FareDetails =
          flight?.Fares?.find((f) => f.Fare_Id === element.item.Fare_Id)
            ?.FareDetails ||
          flight?.Fares?.[0]?.FareDetails ||
          [];

        const fareAdult = Number(
          FareDetails.find((f) => f.PAX_Type === 0)?.Total_Amount || 0
        );
        const fareChild = Number(
          FareDetails.find((f) => f.PAX_Type === 1)?.Total_Amount || 0
        );
        const fareInfant = Number(
          FareDetails.find((f) => f.PAX_Type === 2)?.Total_Amount || 0
        );

        resum +=
          (fareAdult + agencyChargeval) * adultcount +
          (fareChild + agencyChargeval) * childcount +
          (fareInfant + agencyChargeval) * infantcount;

        resumwithcommission +=
          (fareAdult -
            Number(
              FareDetails.find((f) => f.PAX_Type === 0)?.Net_Commission || 0
            ) +
            agencyChargeval) *
            adultcount +
          (fareChild -
            Number(
              FareDetails.find((f) => f.PAX_Type === 1)?.Net_Commission || 0
            ) +
            agencyChargeval) *
            childcount +
          (fareInfant -
            Number(
              FareDetails.find((f) => f.PAX_Type === 2)?.Net_Commission || 0
            ) +
            agencyChargeval) *
            infantcount;
      });

      resolve({
        oldsum,
        oldsumwithcommission,
        resum,
        resumwithcommission,
      });
    });
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchUserData();
      await fetchSettings();
      if (!api_called) {
        api_called = true;
        await reprice_api();
      }
    };

    fetchAllData(); // Call the function

    const reprice_api = async () => {
      setRepriceLoding(true);

      // Step 2: Prepare Fareinfo
      const Fareinfo = data.map((trip) => ({
        Flight_Key: trip.flight.Flight_Key,
        Fare_Id: trip.fareid,
      }));

      // Step 3: Get environment flag
      const settingFromSession = sessionStorage.getItem("settting");
      let isuat = "yes"; // default
      if (settingFromSession) {
        const setting = JSON.parse(settingFromSession);
        isuat = setting.etrav_api_prod_on === 1 ? "no" : "yes";
      }

      // Step 4: Prepare and send API request
      const payload = {
        api_c: "a",
        is_uat: isuat,
        Search_Key: Search_Key,
        AirRepriceRequests: Fareinfo,
        Customer_Mobile: "9173456988",
        GST_Input: false,
        SinglePricing: true,
      };

      const api_url = (await AIR_2_URL()) + AIR_REPRICE;
      const response = await post(
        third_party,
        JSON.stringify(payload),
        api_url
      );
      const airrresponsedataval = await response.json();

      // Step 5: Check response
      const repriceResponses = airrresponsedataval?.data?.AirRepriceResponses;
      if (!repriceResponses) return;
      if (airrresponsedataval?.data?.AirRepriceResponses == null) {
        alert(
          "The requested fare / class is sold out. Can you please search again to get the updated fare from airline?\n\n" +
            // "Ref No: 5710402195448306121\n" +
            airrresponsedataval.data.Response_Header.Error_InnerException
        );
        window.location.reload();
      }

      // let resum = 0;
      // let resumwithcommission = 0;
      // let oldsum = 0;
      // let oldsumwithcommission = 0;

      // // Step 6: Calculate new sum from API response
      // data.forEach((element, index) => {
      //   const agencyChargeval = Number(agencycharge["1"] ?? "0");

      //   const oldfareAdult = Number(
      //     element.item.FareDetails.find((fare) => fare.PAX_Type === 0)
      //       ?.Total_Amount || 0
      //   );
      //   const oldfareChild = Number(
      //     element.item.FareDetails.find((fare) => fare.PAX_Type === 1)
      //       ?.Total_Amount || 0
      //   );
      //   const oldfareInfant = Number(
      //     element.item.FareDetails.find((fare) => fare.PAX_Type === 2)
      //       ?.Total_Amount || 0
      //   );

      //   oldsum +=
      //     (oldfareAdult + agencyChargeval) * adultcount +
      //     (oldfareChild + agencyChargeval) * childcount +
      //     (oldfareInfant + agencyChargeval) * infantcount;

      //   oldsumwithcommission +=
      //     (oldfareAdult -
      //       Number(
      //         element.item.FareDetails.find((f) => f.PAX_Type === 0)
      //           ?.Net_Commission || 0
      //       ) +
      //       agencyChargeval) *
      //       adultcount +
      //     (oldfareChild -
      //       Number(
      //         element.item.FareDetails.find((f) => f.PAX_Type === 1)
      //           ?.Net_Commission || 0
      //       ) +
      //       agencyChargeval) *
      //       childcount +
      //     (oldfareInfant -
      //       Number(
      //         element.item.FareDetails.find((f) => f.PAX_Type === 2)
      //           ?.Net_Commission || 0
      //       ) +
      //       agencyChargeval) *
      //       infantcount;

      //   const flight = repriceResponses[index]?.Flight;
      //   const FareDetails =
      //     flight?.Fares?.find((f) => f.Fare_Id === element.item.Fare_Id)
      //       ?.FareDetails ||
      //     flight?.Fares?.[0]?.FareDetails ||
      //     [];

      //   const fareAdult = Number(
      //     FareDetails.find((f) => f.PAX_Type === 0)?.Total_Amount || 0
      //   );
      //   const fareChild = Number(
      //     FareDetails.find((f) => f.PAX_Type === 1)?.Total_Amount || 0
      //   );
      //   const fareInfant = Number(
      //     FareDetails.find((f) => f.PAX_Type === 2)?.Total_Amount || 0
      //   );

      //   resum +=
      //     (fareAdult + agencyChargeval) * adultcount +
      //     (fareChild + agencyChargeval) * childcount +
      //     (fareInfant + agencyChargeval) * infantcount;

      //   resumwithcommission +=
      //     (fareAdult -
      //       Number(
      //         FareDetails.find((f) => f.PAX_Type === 0)?.Net_Commission || 0
      //       ) +
      //       agencyChargeval) *
      //       adultcount +
      //     (fareChild -
      //       Number(
      //         FareDetails.find((f) => f.PAX_Type === 1)?.Net_Commission || 0
      //       ) +
      //       agencyChargeval) *
      //       childcount +
      //     (fareInfant -
      //       Number(
      //         FareDetails.find((f) => f.PAX_Type === 2)?.Net_Commission || 0
      //       ) +
      //       agencyChargeval) *
      //       infantcount;
      // });

      // // Save old prices before reprice API
      // setoldShowFarePopupnewprice(oldsum);
      // setoldShowFarePopupnewpricewithoutcommison(oldsumwithcommission);

      // // Step 7: Set new fare prices
      // setShowFarePopupnewprice(resum);
      // setShowFarePopupnewpricewithoutcommison(resumwithcommission);

      // // Step 8: Compare and trigger popup if changed
      // if (resum !== oldsum) {
      //   setShowFarePopup(true);
      // }
      const result = await calculateFareDifference({
        repriceResponses: airrresponsedataval.data.AirRepriceResponses,
      });

      setoldShowFarePopupnewprice(result.oldsum);
      setoldShowFarePopupnewpricewithoutcommison(result.oldsumwithcommission);
      setShowFarePopupnewprice(result.resum);
      setShowFarePopupnewpricewithoutcommison(result.resumwithcommission);

      // Only show popup if prices changed
      if (result.resum !== result.oldsum) {
        setShowFarePopup(true);
      }
      // Step 9: Save response to state
      reprice({ AirRepriceResponses: repriceResponses });

      const logs_response = await HelperPost(
        api_logs,
        {
          user_id: "",
          api_name: "AIR_REPRICE",
          api_url: api_url,
          api_payload: JSON.stringify(payload),
          api_response: JSON.stringify(airrresponsedataval),
        },
        true
      );

      setairrresponsedata(airrresponsedataval);

      if (airrresponsedataval.data.AirRepriceResponses !== null) {
        const f_keylist = [];
        airrresponsedataval.data.AirRepriceResponses.forEach((element) => {
          f_keylist.push(element.Flight.Flight_Key);
        });
        // airrresponsedataval.data.AirRepriceResponses[0].Flight.Flight_Key;
        setRepriceLoding(false);

        fetchSsrData(f_keylist);
      } else {
        alert(
          "The requested fare / class is sold out. Can you please search again to get the updated fare from airline?\n\n" +
            // "Ref No: 5710402195448306121\n" +
            airrresponsedataval.data.Response_Header.Error_InnerException
        );
        window.location.reload();
      }
      //   setLoding(false);
      //   return alert(airrresponsedata.data.Response_Header.Error_Desc);
      // }
    };
  }, []);

  const [selectedssrOptions, setSelectedssrOptions] = useState([]);

  const buildPaxDetails = () => {
    return passengers.map((passenger, index) => ({
      Pax_Id: index + 1,
      Pax_type: passenger.passenger_type,
      Title: passenger.title,
      First_Name: passenger.firstName,
      Last_Name: passenger.lastName,
      Gender:
        passenger.gender === "Male" || passenger.gender === "0"
          ? 0
          : 1,
      Age: calculateAge(passenger.dateOfBirth),
      DOB: safeFormatDate(passenger.dateOfBirth),
  
      Passport_Number: passenger.passport_Number,
      Passport_Issuing_Country: passenger.Passport_Issuing_Country,
      Passport_Expiry: passenger.Passport_Expiry,
      Nationality: passenger.nationality,
      Pancard_Number: passenger.pancard_Number,
      FrequentFlyerDetails: {
        AirLineCode: "",
        FrequentFlyerNumber: "",
      },
    }));
  };
  

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (!isConfirmed) {
      return alert("Please Confirm By Checking The Box Before Booking.");
    }
    if (airrresponsedata.data.AirRepriceResponses === null) {
      alert(
        "The requested fare / class is sold out. Can you please search again to get the updated fare from airline?\n\n" +
          // "Ref No: 5710402195448306121\n" +
          airrresponsedata.data.Response_Header.Error_InnerException
      );
       window.location.reload();
      return;
    }

    setLoding(true);
    const f_key =
      airrresponsedata.data.AirRepriceResponses[0].Flight.Flight_Key;
    const g_c =
      airrresponsedata.data.AirRepriceResponses[0].Flight.Fares[0]
        .FareDetails[0].Gross_Commission;
    const n_c =
      airrresponsedata.data.AirRepriceResponses[0].Flight.Fares[0]
        .FareDetails[0].Net_Commission;

    let BookingSSRDetails = [];
    selectedssrOptions.forEach((SSRDetails, index) => {
      BookingSSRDetails.push({
        Pax_Id: SSRDetails.pindex,
        SSR_Key: SSRDetails.SSR_Key,
        flightId: SSRDetails.flightId,
      });
    });

    let Tempbookingflightdetails = [];
    airrresponsedata.data.AirRepriceResponses.forEach((Details, index) => {
      Tempbookingflightdetails.push({
        Search_Key: Search_Key,
        Flight_Key: Details.Flight.Flight_Key,
        BookingSSRDetails: BookingSSRDetails.filter(
          (item) => item.flightId == Details.Flight.Flight_Id
        ),
      });
    });
    // setLoding(false);
    let fix_amt = Number(n_c);
    //  - Number(g_c);

    const PAX_Details = buildPaxDetails(); 

    const bookingpayload = {
      
      // "Auth_Header": {
      //     "UserId": "viviantravelsuat",
      //     "Password": "3B96F16F32C9AEB30C4DF9B3FBABAE964E4E1033",
      //     "IP_Address": "12333333",
      //     "Request_Id": "5500833959053023879",
      //     "IMEI_Number": "9536615000"
      // },

      
      api_c: "a",
      is_uat: isuat,
      Customer_Mobile: passengers[0].Passenger_Mobile,
      Passenger_Mobile: passengers[0].Passenger_Mobile,
      WhatsAPP_Mobile: passengers[0].WhatsAPP_Mobile,
      Passenger_Email: passengers[0].email,
      PAX_Details: PAX_Details,
      GST: true,
      GST_Number: "22AAAAA0000A1Z5",
      GST_HolderName: "GST Holder Name",
      GST_Address: "GST Address",
      BookingFlightDetails: Tempbookingflightdetails,
      CostCenterId: 1,
      ProjectId: 1,
      BookingRemark:
        "vivan-travels-" + Math.floor(10000000 + Math.random() * 90000000),
      CorporateStatus: 0,
      CorporatePaymentMode: 0,
      MissedSavingReason: null,
      CorpTripType: null,
      CorpTripSubType: null,
      TripRequestId: null,
      BookingAlertIds: null,
    };
    const url = (await AIR_2_URL()) + AIR_BOOKING;
    const res = await post(third_party, JSON.stringify(bookingpayload), url);
    const booking_data = await res.json();
    // const PAX_Details = buildPaxDetails();
    // console.log("Final PAX_Details:", buildPaxDetails());


    const logs_response = await HelperPost(
      api_logs,
      {
        user_id: "",
        api_name: "AIR_BOOKING",
        api_url: url,
        api_payload: JSON.stringify(bookingpayload),
        api_response: JSON.stringify(booking_data),
      },
      true
    );

    if (booking_data.data.Booking_RefNo != null) {
      // setLoding(false);
      const RefNo = booking_data.data.Booking_RefNo;
      const formData = {
        user_id: userData.id,
        Booking_RefNo: RefNo,
        PAX_Details: JSON.stringify(PAX_Details),
        Agency_RefNo: "VT" + Math.floor(1000000 + Math.random() * 9000000),
      };
      const response = await HelperPost(booking_add, formData, true);
      const booking_add_data = await response.json();
      if (booking_add_data.status == false) {
        setLoding(false);
        return alert(booking_add_data.message);
      } else {
        if (booking_add_data.status == true) {
          let a_amount = "0";
          let finalAmount = bookingamount;
          if (uData.type === "2") {
            // a_amount = uData.agents ? uData.agents.flight_booking_c : "";
            finalAmount = bookingamountwithcommission;
            // Number(bookingamount) -
            // (Number(fix_amt) - Number(fix_amt) * (Number(a_amount) / 100));
          }

          const ordre_id = RefNo; 
          if (paymentMethod === "hdfc") {

            await razarpaypayment(
              ordre_id,
              finalAmount,
              passengers[0].email,
              (response) => {
                proceed_booking(
                  "HDFC",
                  finalAmount,
                  RefNo,
                  JSON.stringify(response)
                );
              }
            );
          
          }
          
           else {
            const userDataFromSessionup = sessionStorage.getItem("userData");
            if (userDataFromSessionup) {
              let userDataup = JSON.parse(userDataFromSessionup).model;

              if (Number(userDataup.wallet) >= finalAmount) {
              await  proceed_booking("Wallet", finalAmount, RefNo, "N/A");
              } else {
                setLoding(false);
                return toast.error("Your Wallet Balance is low");
              }
            }
          }
        } else {
          setLoding(false);
          return alert("Somthing Went Wrong");
        }
      }
    } else {
      setLoding(false);
      return alert(booking_data.data.Response_Header.Error_InnerException);
    }

    setLoding(false);
  };

  const proceed_booking = async (paytype, amount, RefNo, rzres) => {
    let paymentrecord;
    const amount_payload = {
      // "Auth_Header": {
      //     "UserId": "viviantravelsuat",
      //     "Password": "3B96F16F32C9AEB30C4DF9B3FBABAE964E4E1033",
      //     "IP_Address": "12333333",
      //     "Request_Id": "5500833959053023879",
      //     "IMEI_Number": "9536615000"
      // },
      api_c: "a",
      is_uat: isuat,
      ClientRefNo: "Testing Team",
      RefNo: RefNo + "_" + Date.now(),
      TransactionType: 0,
      ProductId: "1",
    };

    const addpayment_api_url = (await AIR_3_URL()) + AIR_PAY;
    const addpayment_res = await post(
      third_party,
      JSON.stringify(amount_payload),
      addpayment_api_url
    );
    paymentrecord = await addpayment_res.json();
    let is_sucess = true;

    const logs_response = await HelperPost(
      api_logs,
      {
        user_id: "",
        api_name: "AIR_PAY",
        api_url: addpayment_api_url,
        api_payload: JSON.stringify(amount_payload),
        api_response: JSON.stringify(paymentrecord),
      },
      true
    );

    if (
      addpayment_res.ok &&
      paymentrecord.data.Response_Header.Error_Desc !== "SUCCESS"
    ) {
      is_sucess = false;
      const ordre_id = Math.floor(10000000 + Math.random() * 90000000);
      const formData = {
        user_id: userData.id,
        order_id: ordre_id,
        transaction_type: "Amount refunded due to ticket failed",
        amount: amount,
        payment_getway: "",
        type: "1",
        status: "Success",
      };
      const wallet_addapiresponse = await HelperPost(
        wallet_add,
        formData,
        true
      );
      const wallet_adddata = await wallet_addapiresponse.json();
      if (wallet_adddata.status === false) {
        console.error("Error:", wallet_adddata.message);
      } else {
        let userDatares = sessionStorage.getItem("userData");
        userDatares = userDatares ? JSON.parse(userDatares) : {};
        userDatares.model.wallet = wallet_adddata.data.wallet;
        sessionStorage.setItem("userData", JSON.stringify(userDatares));
      }
      setLoding(false);
      return alert("Amount refunded due to ticket failed");
    }
    if (addpayment_res.ok) {
      const ticketingpayload = {
        // "Auth_Header": {
        //     "UserId": "viviantravelsuat",
        //     "Password": "3B96F16F32C9AEB30C4DF9B3FBABAE964E4E1033",
        //     "IP_Address": "12333333",
        //     "Request_Id": "5500833959053023879",
        //     "IMEI_Number": "9536615000"
        // },
        api_c: "a",
        is_uat: isuat,
        Booking_RefNo: RefNo,
        Ticketing_Type: "1",
      };
      const api_url = (await AIR_2_URL()) + AIR_TICKETING;
      const res = await post(
        third_party,
        JSON.stringify(ticketingpayload),
        api_url
      );
      const resdata = await res.json();

      const logs_response = await HelperPost(
        api_logs,
        {
          user_id: "",
          api_name: "AIR_TICKETING",
          api_url: api_url,
          api_payload: JSON.stringify(ticketingpayload),
          api_response: JSON.stringify(resdata),
        },
        true
      );

      let trecord = "";
      if (res.ok) {
        const rpayload = {
          // "Auth_Header": {
          //     "UserId": "viviantravelsuat",
          //     "Password": "3B96F16F32C9AEB30C4DF9B3FBABAE964E4E1033",
          //     "IP_Address": "12333333",
          //     "Request_Id": "5500833959053023879",
          //     "IMEI_Number": "9536615000"
          // },
          api_c: "a",
          is_uat: isuat,
          Booking_RefNo: RefNo,
          Airline_PNR: "",
        };
        const aurl = (await AIR_2_URL()) + AIR_REPRINT;
        const resp = await post(third_party, JSON.stringify(rpayload), aurl);

        trecord = await resp.json();
        if (resp.ok) {
          const formData = {
            Booking_RefNo: RefNo,
            Amount: amount,
            paying_method: paytype,
            amount_status: "paid",
            amount_res: rzres,
            Ticket_Details: JSON.stringify(trecord.data),
            amount_api_res: JSON.stringify(paymentrecord.data),
            status: is_sucess ? "Success" : "cancelled",
          };
          const apiresponse = await HelperPost(booking_update, formData, true);
          if (apiresponse.ok) {
            if (paytype == "Wallet") {
              const formData = {
                user_id: userData.id,
                order_id: RefNo,
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
            alert("Ticket book Successfully");
            navigate("/user/my-bookings");
            window.location.reload();
          } else {
            setLoding(false);
            return toast.error("Somthing Went Wrong");
          }
        } else {
          setLoding(false);
          return toast.error(trecord.data.Response_Header.Error_Desc);
        }
      } else {
        setLoding(false);
        return toast.error(resdata.data.Response_Header.Error_Desc);
      }
    } else {
      setLoding(false);
      return toast.error(paymentrecord.data.Response_Header.Error_Desc);
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
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

  const countryoptions = country.map((option) => ({
    value: option.code,
    label: option.name,
    currency: option.currency,
    name: option.name,
  }));
  const options = country.map((option) => ({
    value: option.name,
    label: option.name,
    currency: option.currency,
    name: option.name,
  }));
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
    { value: "MR", label: "MR", type: "0", gender: "0" },
    { value: "MS", label: "MS", type: "0", gender: "1" },
    { value: "MRS", label: "MRS", type: "0", gender: "1" },
    { value: "MSTR", label: "MSTR", type: "1", gender: "0" },
    { value: "MISS", label: "MISS", type: "1", gender: "1" },
  ];
  const genderMap = {
    MR: "Male",
    MRS: "Female",
    MS: "Female",
    MSTR: "Male",
    MISS: "Female",
  };
  const [selectedOptions, setSelectedOptions] = useState(
    tripinfo.map(() => [])
  );

  const handleChange = (
    selected,
    index,
    flightid,
    pindex,
    is_select,
    ssrtype,
    Segment_Id
  ) => {
    let updatedOptions = [...selectedOptions];
    updatedOptions[index] = selected || [];
    setSelectedOptions(updatedOptions);
    let templist = [...selectedssrOptions];
    // console.log(
    //   `selectedselectednew ${Segment_Id}::${flightid}:::${pindex} ::${ssrtype} ${is_select} ${JSON.stringify(
    //     templist
    //   )}`
    // );
    if (is_select) {
      templist = templist.filter(
        (item) =>
          !(
            item.pindex === pindex &&
            item.flightId === flightid &&
            item.SSR_Type === ssrtype &&
            item.Segment_Id === Segment_Id
          )
      );
    }
    // console.log(
    //   `selectedselectednew2  ${Segment_Id}  ${JSON.stringify(templist)}`
    // );
    setSelectedssrOptions(templist);

    onupdatessr({ list: templist });
  };

  const handlessrChange = (
    selectedSSR,
    optionvalue,
    pindex,
    flightid,
    Segment_Id
  ) => {
    const updatedSSR = {
      ...selectedSSR,
      pindex: pindex + 1,
    };
    // console.log(
    //   `updatedSSR  ${Segment_Id} ${optionvalue}  ${
    //     pindex + 1
    //   } ${flightid} ${JSON.stringify(updatedSSR)}`
    // );
    // Create a copy of the current options
    let updatedOptions = [...selectedssrOptions];
    // Find the index of the matching SSR
    const index = updatedOptions.findIndex(
      (item) =>
        item.SSR_Type === optionvalue &&
        item.flightId === flightid &&
        item.pindex === pindex + 1 &&
        item.Segment_Id === Segment_Id
    );

    if (index !== -1) {
      updatedOptions[index] = updatedSSR;
    } else {
      updatedOptions.push(updatedSSR);
    }

    setSelectedssrOptions(updatedOptions);
    onupdatessr({ list: updatedOptions });
  };

  const [selectedServicesNew, setSelectedServicesNew] = useState([]);

  const toggleService = (id) => {
    setSelectedServicesNew((prev) =>
      prev.includes(id)
        ? prev.filter((service) => service !== id)
        : [...prev, id]
    );
  };

  // const seats = [
  //     { id: "1A", occupied: false },
  //     { id: "1B", occupied: false },
  //     { id: "1C", occupied: true },
  //     { id: "1D", occupied: false },
  //     { id: "1E", occupied: false },
  //     { id: "1F", occupied: true },
  //     { id: "2A", occupied: false },
  //     { id: "2B", occupied: false },
  //     { id: "2C", occupied: false },
  //     { id: "2D", occupied: false },
  //     { id: "2E", occupied: false },
  //     { id: "2F", occupied: false },
  // ];
  const handleSeatSelection = (seat, tripIndex, index, segmentindex) => {
    // setSelectedSeat(seat.SSR_TypeName);
    const data = {
      value: seat.SSR_Code,
      label: `${seat.SSR_TypeDesc} - ₹${seat.Total_Amount}`,
      currency: seat.Currency_Code,
      typeName: seat.SSR_TypeName,
      flightId: seat.Flight_ID,
      legIndex: seat.Leg_Index,
      SSR_Type: seat.SSR_Type,
      SSR_Key: seat.SSR_Key,
      SSR_TypeDesc: seat.SSR_TypeDesc,
      Total_Amount: seat.Total_Amount,
      Segment_Id: segmentindex,
    };
    // setSeatPrice(seat.Total_Amount);
    handlessrChange(data, 3, index, seat.Flight_ID, segmentindex);
  };

  const [showModalcd, setShowModalcd] = useState(true);
  const [sheetindex, setsheetindex] = useState(0);
  const [sheetpindex, setsheetpindex] = useState(0);
  const [sheetpstopindex, setsheetpstopindex] = useState(0);
  const [sheetpstopindexwithtrip, setsheetpstopindexwithtrip] = useState(0);
  const handleClosecd = () => {
    setShowModalcd(false);
  };

  function formate(date) {
    const travelDate = new Date(date);
    const formattedDate = travelDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  }
  return (
    <div className="col-xl-8">
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
      <FareChangePopup
        show={showFarePopup}
        onClose={() => setShowFarePopup(false)}
        oldFare={
          uData && uData.type === "2" && isisnetfarefromback
            ? oldshowFarePopupnewpricewithoutcommison
            : oldshowFarePopupnewprice
        }
        newFare={
          uData && uData.type === "2" && isisnetfarefromback
            ? showFarePopupnewpricewithoutcommison
            : showFarePopupnewprice
        }
      />

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

          {repriceloading ? (
            <center>
              {" "}
              <div className="loading-text">
                <Progress />
                <p>Loading...</p>
                <p>Reconfirming Fare...</p>
              </div>
            </center>
          ) : (
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
                          <div className="col-sm-6 mb-2 sitdrpdwn">
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
                                    option.value === passenger.passenger_type
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

                          {/* {airrresponsedata != null &&
                            airrresponsedata.data?.AirRepriceResponses[0].Required_PAX_Details.find(
                              (data) => data.Pax_type == passenger.passenger_type
                            )?.Passport_Number == true && (
                              <div className="col-sm-6 col-md-6 mb-12 sitdrpdwn">
                                <div className="gender-select">
                                  <label
                                    htmlFor="gender"
                                    className="h6 color-medium-gray mb-1"
                                  >
                                    Select Gender
                                  </label>
                                  <Select
                                    options={selectgender}
                                    name="gender"
                                    id="gender"
                                    value={selectgender.find(
                                      (option) =>
                                        option.value === passenger.gender
                                    )}
                                    onChange={(selectedOption) =>
                                      handleInputChange(
                                        { ...selectedOption, name: "gender" },
                                        index
                                      )
                                    }
                                    classNamePrefix="react-select"
                                    placeholder="Select Gender"
                                    isSearchable
                                    required
                                  />
                                </div>
                              </div>
                            )} */}

                          {/* Title */}
                          <div className="col-sm-6 mb-2 sitdrpdwn">
                            <div className="gender-select">
                              <label
                                htmlFor="title"
                                className="h6 color-medium-gray mb-1"
                              >
                                Select Title
                              </label>
                              <Select
                                // options={selecttitle}
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
                                  (option) => option.value === passenger.title
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

                          {/* First Name */}
                          {airrresponsedata != null &&
                            airrresponsedata.data?.AirRepriceResponses[0].Required_PAX_Details.find(
                              (data) =>
                                data.Pax_type == passenger.passenger_type
                            )?.First_Name == true && (
                              <div className="col-sm-6 col-md-6 mb-12 pe-1">
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
                            )}

                          {/* Last Name */}
                          {airrresponsedata != null &&
                            airrresponsedata.data?.AirRepriceResponses[0].Required_PAX_Details.find(
                              (data) =>
                                data.Pax_type == passenger.passenger_type
                            )?.Last_Name == true && (
                              <div className="col-sm-6 col-md-6 mb-12">
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
                            )}

                          {/* Email */}
                          {index === 0 && (
                            <div className="col-sm-6 col-md-6 mb-12">
                              <label
                                htmlFor="email"
                                className="h6 color-medium-gray mb-1"
                              >
                                Email
                              </label>
                              <input
                                type="email"
                                className="form-control wizard-required"
                                id="email"
                                name="email"
                                value={passenger.email}
                                onChange={(e) => {
                                  handleInputChange(e, index);
                                }}
                                placeholder="Email"
                                required
                              />
                            </div>
                          )}

                          {/* Nationality */}
                          {airrresponsedata != null &&
                            airrresponsedata.data?.AirRepriceResponses[0].Required_PAX_Details.find(
                              (data) =>
                                data.Pax_type == passenger.passenger_type
                            )?.Nationality == true && (
                              <div className="col-sm-6 col-md-6 mb-12 sitdrpdwn">
                                <label
                                  htmlFor="nationality"
                                  className="h6 color-medium-gray mb-1"
                                >
                                  Select Nationality
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
                            )}

                          {/* Passenger Mobile Number */}
                          {index === 0 && (
                            <div className="col-sm-6 col-md-6 mb-12">
                              <label
                                htmlFor="Passenger_Mobile"
                                className="h6 color-medium-gray mb-1"
                              >
                                Passenger Mobile Number
                              </label>
                              <input
                                type="tel"
                                className="form-control wizard-required"
                                id="Passenger_Mobile"
                                name="Passenger_Mobile"
                                value={passenger.Passenger_Mobile}
                                onChange={(e) => handleInputChange(e, index)}
                                placeholder="Passenger Mobile Number"
                                required
                              />
                            </div>
                          )}

                          {/* Date of Birth */}
                          {airrresponsedata != null &&
                            airrresponsedata.data?.AirRepriceResponses[0].Required_PAX_Details.find(
                              (data) =>
                                data.Pax_type == passenger.passenger_type
                            )?.DOB == true && (
                              <div className="col-sm-6 col-md-6 mb-12">
                                <div className="input-date-picker">
                                  <label
                                    htmlFor="dateOfBirth"
                                    className="h6 color-medium-gray mb-1"
                                  >
                                    Date of Birth
                                  </label>
                                  <DatePicker
                                    selected={
                                      passenger.dateOfBirth
                                        ? new Date(passenger.dateOfBirth)
                                        : null
                                    }
                                    
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    onChange={(date) =>
                                      handleInputChange(
                                        {
                                          target: {
                                            name: "dateOfBirth",
                                            value: date,

                                          },
                                        },
                                        index
                                      )
                                    }
                                    dateFormat="dd-MMM-yyyy"
                                    className="sel-input date_from form-control wizard-required"
                                    placeholderText="dd-MM-yyyy"
                                    required
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    maxDate={
                                      passenger.passenger_type == 0
                                        ? new Date(eighteenYearsAgo)
                                        : passenger.passenger_type == 1
                                        ? new Date(twoYearsAgo)
                                        : new Date()
                                    }
                                    minDate={
                                      passenger.passenger_type == 0
                                        ? null
                                        : passenger.passenger_type == 1
                                        ? new Date(twelveYearsAgo)
                                        : new Date(twoYearsAgo)
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          {traveltype == 1 &&
                            airrresponsedata != null &&
                            airrresponsedata.data?.AirRepriceResponses[0].Required_PAX_Details.find(
                              (data) =>
                                data.Pax_type == passenger.passenger_type
                            )?.Passport_Number == true && (
                              <>
                                {/* Passport Number */}
                                <div className="col-sm-6 col-md-6 mb-12">
                                  <label
                                    htmlFor="passport_Number"
                                    className="h6 color-medium-gray mb-1"
                                  >
                                    Passport Number
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control wizard-required"
                                    id="passport_Number"
                                    name="passport_Number"
                                    value={passenger.passport_Number}
                                    onChange={(e) =>
                                      handleInputChange(e, index)
                                    }
                                    placeholder="Passport Number"
                                    required
                                  />
                                </div>

                                {/* Passport Issuing Country */}
                                {airrresponsedata != null &&
                                  airrresponsedata.data?.AirRepriceResponses[0].Required_PAX_Details.find(
                                    (data) =>
                                      data.Pax_type == passenger.passenger_type
                                  )?.Passport_Issuing_Country == true && (
                                    <div className="col-sm-6 col-md-6 mb-12 sitdrpdwn">
                                      <label
                                        htmlFor="Passport_Issuing_Country"
                                        className="h6 color-medium-gray mb-1"
                                      >
                                        Select Passport Issuing Country
                                      </label>
                                      <Select
                                        options={countryoptions}
                                        name="Passport_Issuing_Country"
                                        id="Passport_Issuing_Country"
                                        value={countryoptions.find(
                                          (option) =>
                                            option.value ===
                                            passenger.Passport_Issuing_Country
                                        )}
                                        onChange={(selectedOption) =>
                                          handleInputChange(
                                            {
                                              ...selectedOption,
                                              name: "Passport_Issuing_Country",
                                            },
                                            index
                                          )
                                        }
                                        classNamePrefix="react-select"
                                        placeholder="Select Passport Issuing Country"
                                        isSearchable
                                        required
                                      />
                                    </div>
                                  )}

                                {/* Passport Expiry */}
                                {airrresponsedata != null &&
                                  airrresponsedata.data?.AirRepriceResponses[0].Required_PAX_Details.find(
                                    (data) =>
                                      data.Pax_type == passenger.passenger_type
                                  )?.Passport_Expiry == true && (
                                    <div className="col-sm-6 col-md-6 mb-12">
                                      <div className="input-date-picker">
                                        <label
                                          htmlFor="Passport_Expiry"
                                          className="h6 color-medium-gray mb-1"
                                        >
                                          Passport Expiry
                                        </label>
                                        <DatePicker
                                          selected={passenger.Passport_Expiry}
                                          id="Passport_Expiry"
                                          name="Passport_Expiry"
                                          onChange={(date) =>
                                            handleInputChange(
                                              {
                                                target: {
                                                  name: "Passport_Expiry",
                                                  value: date ? format(date, "MM/dd/yyyy") : ""

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
                              </>
                            )}

                          {/* PAN Card Number */}
                          {passenger.passenger_type == 0 &&
                            airrresponsedata != null &&
                            airrresponsedata.data?.AirRepriceResponses[0].Required_PAX_Details.find(
                              (data) =>
                                data.Pax_type == passenger.passenger_type
                            )?.PanCard_No == true && (
                              <div className="col-sm-6 col-md-6 mb-12">
                                <label
                                  htmlFor="pancard_Number"
                                  className="h6 color-medium-gray mb-1"
                                >
                                  PAN Card Number
                                </label>
                                <input
                                  type="text"
                                  className="form-control wizard-required"
                                  id="pancard_Number"
                                  name="pancard_Number"
                                  value={passenger.pancard_Number}
                                  onChange={(e) => handleInputChange(e, index)}
                                  placeholder="PAN Card Number"
                                />
                              </div>
                            )}
                        </div>

                        {ssrloading ? (
                          <div className="loading-text">
                            <Progress />
                          </div>
                        ) : (
                          <div
                            className="row mb-12"
                            style={{
                              display:
                                SSRinfoop.length > 0 ||
                                seats.filter((seat, index) => index === 0)
                                  .length > 0
                                  ? "block"
                                  : "none",
                            }}
                          >
                            {passenger.passenger_type != 2 &&
                              (triptype == "3"
                                ? tripinfo.slice(0, 1)
                                : tripinfo
                              ).map((Details, tripIndex) => (
                                <div
                                  className="col-sm-6 col-md-6 mb-12 sitdrpdwn "
                                  style={
                                    data.length > tripIndex &&
                                    data[tripIndex].flight.Segments.length > 0
                                      ? { display: "block" }
                                      : { display: "none" }
                                  }
                                  key={tripIndex}
                                >
                                  <label
                                    htmlFor="ssr"
                                    className="h6 color-medium-gray mb-1"
                                  >
                                    Special Service Request For Trip{" "}
                                    <span className="text-success">
                                      {Details.Origin} - {Details.Destination}
                                    </span>
                                  </label>
                                  <br></br>
                                  {data.length > tripIndex &&
                                    data[tripIndex].flight.Segments.map(
                                      (segment, segmentindex) => (
                                        <>
                                          <span className="text-success pt-1">
                                            {segment.Origin_City} -{" "}
                                            {segment.Destination_City}
                                          </span>
                                          <div className="additional-srvc">
                                            <div style={styles.container}>
                                              <div style={styles.serviceGrid}>
                                                {passenger.ssrOptions.map(
                                                  (service, ssrindex) => (
                                                    <ServiceButton
                                                      key={service.id}
                                                      id={service.id}
                                                      icon={service.icon}
                                                      label={service.label}
                                                      selected={
                                                        (
                                                          selectedOptions[
                                                            tripIndex
                                                          ] || []
                                                        ).filter(
                                                          (currentssrselect) =>
                                                            currentssrselect.segmentindex ===
                                                              segmentindex &&
                                                            currentssrselect
                                                              .service.id ===
                                                              service.id
                                                        ).length !== 0
                                                      }
                                                      onToggleNew={() => {
                                                        const currentSelections =
                                                          selectedOptions[
                                                            tripIndex
                                                          ] || [];
                                                        const isSelected =
                                                          currentSelections.filter(
                                                            (
                                                              currentssrselect
                                                            ) =>
                                                              currentssrselect.segmentindex ===
                                                                segmentindex &&
                                                              currentssrselect
                                                                .service.id ===
                                                                service.id
                                                          ).length !== 0;
                                                        const updatedSelections =
                                                          isSelected
                                                            ? currentSelections.filter(
                                                                (
                                                                  currentssrselect
                                                                ) =>
                                                                  currentssrselect.segmentindex !==
                                                                    segmentindex &&
                                                                  currentssrselect
                                                                    .service
                                                                    .id ===
                                                                    service.id
                                                              )
                                                            : [
                                                                ...currentSelections,
                                                                {
                                                                  service,
                                                                  segmentindex,
                                                                },
                                                              ];
                                                        // console.log(
                                                        //   `updatedSelectionsupdatedSelections  ${JSON.stringify(
                                                        //     updatedSelections
                                                        //   )}`
                                                        // );
                                                        if (
                                                          isSelected &&
                                                          ssrindex == 3
                                                        ) {
                                                          // setSelectedSeat(null);
                                                          // setSeatPrice(0);
                                                        } else if (
                                                          !isSelected &&
                                                          ssrindex == 3
                                                        ) {
                                                          setShowModalcd(true);
                                                          setsheetindex(
                                                            tripIndex
                                                          );
                                                          setsheetpindex(index);
                                                          setsheetpstopindex(
                                                            segmentindex
                                                          );

                                                          const countSegments =
                                                            data
                                                              .filter(
                                                                (
                                                                  _,
                                                                  indexvaloftrip
                                                                ) =>
                                                                  indexvaloftrip <
                                                                  tripIndex
                                                              )
                                                              .reduce(
                                                                (total, trip) =>
                                                                  total +
                                                                  (trip.flight
                                                                    ?.Segments
                                                                    ?.length ||
                                                                    0),
                                                                0
                                                              );

                                                          setsheetpstopindexwithtrip(
                                                            segmentindex +
                                                              countSegments
                                                          );
                                                        }

                                                        handleChange(
                                                          updatedSelections,
                                                          tripIndex,
                                                          data[tripIndex].flight
                                                            .Flight_Id,
                                                          index + 1,
                                                          isSelected,
                                                          service.value,
                                                          segmentindex
                                                        );
                                                      }}
                                                      ishow={
                                                        ssrindex == 3
                                                          ? seats.filter(
                                                              (seat, index) =>
                                                                index === 0
                                                            ).length > 0
                                                          : SSRinfoop.filter(
                                                              (item) =>
                                                                item.SSR_Type ===
                                                                  ssrindex &&
                                                                item.flightId ===
                                                                  data[
                                                                    tripIndex
                                                                  ].flight
                                                                    .Flight_Id &&
                                                                item.Segment_Id ===
                                                                  0
                                                            ).length > 0
                                                      }
                                                    />
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Selected SSR Details */}
                                          <div>
                                            {selectedOptions[tripIndex].map(
                                              
                                              (option, indexssr) => (
                                                <div
                                                key={`${tripIndex}-${segmentindex}-${option.service.id}-${indexssr}`}
                                                  style={{
                                                    display:
                                                      option.service.pindex ==
                                                        index + 1 &&
                                                      option.segmentindex ===
                                                        segmentindex
                                                        ? "block"
                                                        : "none",
                                                  }}
                                                >
                                                  <label
                                                    htmlFor="Selected-services"
                                                    className="h6 color-medium-gray mb-1"
                                                  >
                                                    Selected{" "}
                                                    {option.service.label} for{" "}
                                                    {segment.Origin_City} -
                                                    {segment.Destination_City}
                                                  </label>

                                                  {/* Filtered SSR Info Dropdown */}
                                                  {option.service.value !==
                                                  3 ? (
                                                    <>
                                                      <Select
                                                        options={SSRinfoop.filter(
                                                          (item) =>
                                                            item.SSR_Type ===
                                                              option.service
                                                                .value &&
                                                            item.flightId ==
                                                              data[tripIndex]
                                                                .flight
                                                                .Flight_Id &&
                                                            item.Segment_Id ===
                                                              segmentindex
                                                        )}
                                                        value={
                                                          selectedssrOptions.find(
                                                            (ssr) =>
                                                              ssr.pindex ===
                                                                index + 1 &&
                                                              ssr.flightId ===
                                                                data[tripIndex]
                                                                  .flight
                                                                  .Flight_Id &&
                                                              ssr.SSR_Type ===
                                                                option.service
                                                                  .value &&
                                                              ssr.Segment_Id ===
                                                                segmentindex
                                                          )
                                                          // `${data[tripIndex].flight.Flight_Id}    ${index+1}`

                                                          // selectedssrOptions.filter((ssr)=>ssr.flightId===data[tripIndex].flight.Flight_Id&&(ssr.pindex===index+1)&&ssr.SSR_Type ===3)?.label||""

                                                          // selectedSeat !== null &&
                                                          //     selectedSeat !== undefined
                                                          //     ? `Seat ${selectedSeat} - ₹${seatPrice}`
                                                          //     : "" // Set empty value if selectedSeat is null/undefined
                                                        }
                                                        classNamePrefix="react-select"
                                                        onChange={(selected) =>
                                                          handlessrChange(
                                                            selected,
                                                            option.service
                                                              .value,
                                                            index,
                                                            data[tripIndex]
                                                              .flight.Flight_Id,
                                                            segmentindex
                                                          )
                                                        }
                                                        placeholder={`Select ${option.service.label}`}
                                                        isSearchable
                                                      />
                                                    </>
                                                  ) : (
                                                    <>
                                                      <input
                                                        type="text"
                                                        className="form-control wizard-required"
                                                        id="Seat"
                                                        name="pancard_Number"
                                                        value={
                                                          selectedssrOptions.find(
                                                            (ssr) =>
                                                              ssr.pindex ===
                                                                index + 1 &&
                                                              ssr.flightId ===
                                                                data[tripIndex]
                                                                  .flight
                                                                  .Flight_Id &&
                                                              ssr.SSR_Type ===
                                                                3 &&
                                                              ssr.Segment_Id ===
                                                                segmentindex
                                                          )?.label || ""
                                                          // `${data[tripIndex].flight.Flight_Id}    ${index+1}`

                                                          // selectedssrOptions.filter((ssr)=>ssr.flightId===data[tripIndex].flight.Flight_Id&&(ssr.pindex===index+1)&&ssr.SSR_Type ===3)?.label||""

                                                          // selectedSeat !== null &&
                                                          //     selectedSeat !== undefined
                                                          //     ? `Seat ${selectedSeat} - ₹${seatPrice}`
                                                          //     : "" // Set empty value if selectedSeat is null/undefined
                                                        }
                                                        onClick={() => {
                                                          setShowModalcd(true);
                                                          setsheetindex(
                                                            tripIndex
                                                          );
                                                          setsheetpindex(index);

                                                          setsheetpstopindex(
                                                            segmentindex
                                                          );
                                                          const countSegments =
                                                            data
                                                              .filter(
                                                                (
                                                                  _,
                                                                  indexvaloftrip
                                                                ) =>
                                                                  indexvaloftrip <
                                                                  tripIndex
                                                              )
                                                              .reduce(
                                                                (total, trip) =>
                                                                  total +
                                                                  (trip.flight
                                                                    ?.Segments
                                                                    ?.length ||
                                                                    0),
                                                                0
                                                              );

                                                          setsheetpstopindexwithtrip(
                                                            segmentindex +
                                                              countSegments
                                                          );
                                                        }}
                                                        placeholder="Seat"
                                                        readOnly
                                                      />

                                                      <Modal
                                                        show={showModalcd}
                                                        size="lg"
                                                        onHide={handleClosecd}
                                                        className="seatselectionpop p-0"
                                                      >
                                                        <Modal.Header
                                                          closeButton
                                                        >
                                                          <Modal.Title>
                                                            Select Seat for
                                                          </Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                          {/* <div className="container"> */}
                                                          {/* <div className="col-12"> */}
                                                          <div className="row modalaas">
                                                            <div className="col-12 col-lg-4 detailsss">
                                                              <h3>
                                                                {Details.Origin}{" "}
                                                                -{" "}
                                                                {
                                                                  Details.Destination
                                                                }
                                                              </h3>
                                                              <p>
                                                                {formate(
                                                                  Details.TravelDate
                                                                )}
                                                              </p>
                                                              <h5 className="mt-3">
                                                                Selected Seat
                                                              </h5>
                                                              <h2>
                                                                {
                                                                  selectedssrOptions.find(
                                                                    (ssr) =>
                                                                      ssr.Segment_Id ===
                                                                        sheetpstopindex &&
                                                                      ssr.pindex ===
                                                                        sheetpindex +
                                                                          1 &&
                                                                      ssr.flightId ===
                                                                        data[
                                                                          sheetindex
                                                                        ].flight
                                                                          .Flight_Id &&
                                                                      ssr.SSR_Type ===
                                                                        3
                                                                  )?.typeName
                                                                }
                                                                {/* {selectedSeat || "None"} */}
                                                              </h2>
                                                              {/* <button className="select-seat-btn"> Select Seat</button> */}
                                                              <div className="total">
                                                                Total: ₹
                                                                <span>
                                                                  {
                                                                    selectedssrOptions.find(
                                                                      (ssr) =>
                                                                        ssr.Segment_Id ===
                                                                          sheetpstopindex &&
                                                                        ssr.pindex ===
                                                                          sheetpindex +
                                                                            1 &&
                                                                        ssr.flightId ===
                                                                          data[
                                                                            sheetindex
                                                                          ]
                                                                            .flight
                                                                            .Flight_Id &&
                                                                        ssr.SSR_Type ===
                                                                          3 &&
                                                                        ssr.Segment_Id ===
                                                                          sheetpstopindex
                                                                    )
                                                                      ?.Total_Amount
                                                                  }

                                                                  {/* {selectedSeat
                                                                                                            ? seatPrice
                                                                                                            : 0} */}
                                                                </span>
                                                              </div>
                                                              <div className="pax">
                                                                <h4>
                                                                  Pax(s) Details
                                                                </h4>
                                                                <p>
                                                                  {
                                                                    passenger.title
                                                                  }{" "}
                                                                  {
                                                                    passenger.firstName
                                                                  }{" "}
                                                                  {
                                                                    passenger.lastName
                                                                  }
                                                                </p>
                                                              </div>
                                                              <div className="legend">
                                                                <span>
                                                                  <div className="box open"></div>{" "}
                                                                  Open Seat
                                                                </span>
                                                                <span>
                                                                  <div className="box selected"></div>{" "}
                                                                  Selected Seat
                                                                </span>
                                                                <span>
                                                                  <div className="box occupied"></div>{" "}
                                                                  Occupied Seat
                                                                </span>{" "}
                                                                <span>
                                                                  <div className="box block"></div>{" "}
                                                                  Block Seat
                                                                </span>
                                                                <span>
                                                                  <div className="box alreadyselected"></div>{" "}
                                                                  Selected for
                                                                  other
                                                                  passenger
                                                                </span>
                                                              </div>
                                                            </div>

                                                            {seats.length ===
                                                            0 ? (
                                                              <Progress />
                                                            ) : (
                                                              <div class="col-12 col-lg-8 seatlist">
                                                                {/* {
                                                        seats
                                                          .filter(
                                                            (seat, index) =>
                                                              index ===
                                                              segmentindex
                                                          )
                                                          .map(
                                                            (
                                                              dataval,
                                                              Seat_Row_index
                                                            ) => ( */}
                                                                <>
                                                                  {seats[
                                                                    sheetpstopindexwithtrip
                                                                  ].Seat_Row.map(
                                                                    (
                                                                      seat_Row,
                                                                      Seat_Row_index
                                                                    ) => (
                                                                      
                                                                      <>
                                                                        <div class="row">
                                                                          {seat_Row.Seat_Details.filter(
                                                                            (
                                                                              s
                                                                            ) =>
                                                                              s.Flight_ID ===
                                                                              data[
                                                                                sheetindex
                                                                              ]
                                                                                .flight
                                                                                .Flight_Id
                                                                          ).map(
                                                                            (
                                                                              seat
                                                                            ) => (
                                                                              <div
                                                                                key={
                                                                                  seat.SSR_TypeName
                                                                                }
                                                                                className={`seat ${
                                                                                  seat.SSR_TypeName ===
                                                                                    "" ||
                                                                                  seat.SSR_Status ==
                                                                                    0
                                                                                    ? "blank"
                                                                                    : ""
                                                                                } ${
                                                                                  seat.SSR_Status ==
                                                                                  3
                                                                                    ? "occupied"
                                                                                    : seat.SSR_Status ==
                                                                                      2
                                                                                    ? "block"
                                                                                    : ""
                                                                                } 
                                                                                                                                                ${
                                                                                                                                                  selectedssrOptions.find(
                                                                                                                                                    (
                                                                                                                                                      ssr
                                                                                                                                                    ) =>
                                                                                                                                                      ssr.Segment_Id ===
                                                                                                                                                        sheetpstopindex &&
                                                                                                                                                      ssr.pindex ===
                                                                                                                                                        sheetpindex +
                                                                                                                                                          1 &&
                                                                                                                                                      ssr.flightId ===
                                                                                                                                                        data[
                                                                                                                                                          sheetindex
                                                                                                                                                        ]
                                                                                                                                                          .flight
                                                                                                                                                          .Flight_Id &&
                                                                                                                                                      ssr.SSR_Type ===
                                                                                                                                                        3
                                                                                                                                                  )
                                                                                                                                                    ?.typeName ===
                                                                                                                                                  seat.SSR_TypeName
                                                                                                                                                    ? "selected"
                                                                                                                                                    : ""
                                                                                                                                                }
                                                                                                                                                ${
                                                                                                                                                  selectedssrOptions.filter(
                                                                                                                                                    (
                                                                                                                                                      ssr
                                                                                                                                                    ) =>
                                                                                                                                                      ssr.pindex !==
                                                                                                                                                        sheetpindex +
                                                                                                                                                          1 &&
                                                                                                                                                      ssr.flightId ===
                                                                                                                                                        data[
                                                                                                                                                          sheetindex
                                                                                                                                                        ]
                                                                                                                                                          .flight
                                                                                                                                                          .Flight_Id &&
                                                                                                                                                      ssr.SSR_Type ===
                                                                                                                                                        3 &&
                                                                                                                                                      ssr.typeName ===
                                                                                                                                                        seat.SSR_TypeName &&
                                                                                                                                                      ssr.Segment_Id ===
                                                                                                                                                        sheetpstopindex
                                                                                                                                                  )
                                                                                                                                                    .length >
                                                                                                                                                  0
                                                                                                                                                    ? "alreadyselected"
                                                                                                                                                    : ""
                                                                                                                                                }
                                                                                                                                                
                                                                                                                                                `}
                                                                                onClick={() =>
                                                                                  seat.SSR_Status !==
                                                                                    3 &&
                                                                                  seat.SSR_Status !==
                                                                                    2 &&
                                                                                  selectedssrOptions.filter(
                                                                                    (
                                                                                      ssr
                                                                                    ) =>
                                                                                      ssr.pindex !==
                                                                                        sheetpindex +
                                                                                          1 &&
                                                                                      ssr.flightId ===
                                                                                        data[
                                                                                          sheetindex
                                                                                        ]
                                                                                          .flight
                                                                                          .Flight_Id &&
                                                                                      ssr.SSR_Type ===
                                                                                        3 &&
                                                                                      ssr.typeName ===
                                                                                        seat.SSR_TypeName
                                                                                  )
                                                                                    .length ===
                                                                                    0
                                                                                    ? handleSeatSelection(
                                                                                        seat,
                                                                                        sheetindex,
                                                                                        sheetpindex,
                                                                                        sheetpstopindex
                                                                                      )
                                                                                    : null
                                                                                }
                                                                              >
                                                                                <p className="seat-label">
                                                                                  {
                                                                                    seat.SSR_TypeName
                                                                                  }
                                                                                </p>
                                                                              </div>
                                                                            )
                                                                          )}
                                                                        </div>
                                                                        {/* <br /> */}
                                                                      </>
                                                                    )
                                                                  )}{" "}
                                                                </>
                                                                {/* ) )} */}
                                                              </div>
                                                            )}
                                                          </div>
                                                          {/* </div> */}
                                                          {/* </div> */}
                                                        </Modal.Body>
                                                      </Modal>
                                                    </>
                                                  )}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </>
                                      )
                                    )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* <button type="button" onClick={addPassenger} className="btn btn-primary btn-sm mb-3">
                                    Add Another Passenger
                                </button> */}
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
                                value="hdfc"
                                checked={paymentMethod === "hdfc"}
                                
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
          )}
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
  );
};

export default FlightBookingForm;

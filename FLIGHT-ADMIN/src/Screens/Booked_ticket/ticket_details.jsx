import React, { useState, useEffect, useRef } from "react";
// import '../../pages/agent/wallet-history.css'
import html2pdf from "html2pdf.js"; // Import the library
import { QRCodeCanvas } from "qrcode.react";
import logo from "../../Assets/Images/logo.png";
// import Airlogo from "../widget/air_logo";
import {IMAGE_BASE_URL,
  AIR_2_URL,
  AIR_REPRINT,
  third_party,
  siteconfig,
  airline_code,
  ticket_details,
} from "../../API/endpoints";
import { post, get } from "../../API/airline";
import { post as HelperPost } from "../../API/apiHelper";

import route_plane from "../../Assets/Images/route-plan.png";
import Progress from "../Component/Loading";

import "./ticket_details.css";

function Ticket_Details({ reference_id }) {
  const [setting, setSettings] = useState(null);
  const [TicketRecord, setTicketRecord] = useState(null);
  const [TicketRecordqr, setTicketRecordqr] = useState(null);
  const [TicketRecordlocal, setticketDetails] = useState(null);

  let isuat = "no";


  const fetchTicketRecord = async () => {
    try {
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
        Booking_RefNo: reference_id,
        Airline_PNR: "",
      };
      const aurl = (await AIR_2_URL()) + AIR_REPRINT;
      const resp = await post(third_party, JSON.stringify(rpayload), aurl);
      const trecord = await resp.json();
      if (trecord.data != null) {
        setTicketRecord(trecord.data);
        setTicketRecordqr("https://barcode.tec-it.com/barcode.ashx?data=."+trecord.data.AirPNRDetails.at(0).Airline_PNR+"&code=PDF417");
        
      } else {
        setTicketRecord(null);
      }
    } catch (error) {
      console.error("Error fetching ticket record:", error);
    }
  };
  const fetchSettings = async () => {
    try {
      const res = await get(siteconfig, true);
      const response = await res.json();
      setSettings(response.data);
      if (response.data) {
        if (response.data.etrav_api_prod_on == 1) {
          isuat = "no";
        } else {
          isuat = "yes";
        }
      }
      fetchTicketRecord();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchllocalTicketRecord = async () => {
    try {
      const response = await HelperPost(
        ticket_details,
        { Booking_RefNo: reference_id },
        true
      );
      if (response.ok) {
        const data = await response.json();
        setticketDetails(data.data);
      } else {
        console.error("Failed To List");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchSettings();

    fetchllocalTicketRecord();
  }, [reference_id]);

  const getClassOfTravel = (classCode) => {
    switch (classCode) {
      case 0:
        return "ECONOMY";
      case 1:
        return "BUSINESS";
      case 2:
        return "FIRST";
      case 3:
        return "PREMIUM ECONOMY";
      default:
        return "UNKNOWN CLASS"; // or return an empty string
    }
  };

  const getpaxtype = (code) => {
    switch (code) {
      case 0:
        return "ADULT";
      case 1:
        return "CHILD";
      case 2:
        return "INFANT";
      default:
        return "UNKNOWN"; // or return an empty string
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const date = new Date(dateString);
    return date.toLocaleString("en-US", options);
  };

  const downloadPDF = () => {
    const element = document.getElementById("ticket-details"); // Reference the modal content by its ID

    // Options for the pdf generation
    const options = {
      margin: 1,
      filename: "vivantravels.com.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    // "Vivan_travels_" + TicketRecord.Booking_RefNo + ".pdf",
    // Generate PDF from the element
    html2pdf().from(element).set(options).save();
  };

  const ssrOptions = [
    { value: 0, label: "BAGGAGE" },
    { value: 1, label: "MEALS" },
    { value: 2, label: "COMPLIMENTORY_MEALS" },
    { value: 3, label: "SEAT" },
    { value: 4, label: "SPORTS" },
    { value: 5, label: "BAGOUTFIRST" },
    { value: 6, label: "LOUNGE" },
    { value: 7, label: "CELEBRATION" },
    { value: 8, label: "CARRYMORE" },
    { value: 9, label: "FASTFORWARD" },
    { value: 10, label: "WHEELCHAIR" },
    { value: 11, label: "FREQUENTFLYER" },
    { value: 15, label: "OTHERS" },
  ];

  const getLabelByValue = (value) => {
    const option = ssrOptions.find((item) => item.value === value);
    return option ? option.label : "Label not found";
  };
  const [data, setUserData] = useState(null);
  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    }
  }, []);

  return (
    <>
      {TicketRecord ? (
        <div
          id="ticket-details"
          className="p-3 ticketdwnld"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div className="">
              <img
                className="mb-20"
                src={
                  data && data.type == 2
                    ? IMAGE_BASE_URL+data.profile_photo
                    : logo
                }
                alt="Vivian Travels & Tourism"
                style={{ height: "50px" }}
              />
             <h6>Booking Reference No : {reference_id}</h6>
            </div>

            <div className="">
              {data && data.type == 2 ? (
                <>
                  {data?.email && <p>{data.email}</p>}
                  {data?.mobile_no && <p>{data.mobile_no}</p>}
                </>
              ) : (
                <>
                  <p>{`${window.location.protocol}//${window.location.host}`}</p>
                  {setting?.support_email && <p>{setting.support_email}</p>}
                  {setting?.support_no && <p>{setting.support_no}</p>}
                </>
              )}

              <img src={TicketRecordqr}></img>
            </div>
          </div>
          {TicketRecord.AirPNRDetails.map((airdetail, airindex) => (
            <>
              {TicketRecord.AirPNRDetails[airindex].Flights.map(
                (Details, index) => (
                  <>
                    <div className="bg-dark text-white px-3 py-1 d-flex flex-wrap justify-content-between align-items-center">
                      <h5 className="mt-0">
                        Your flight from {Details.Segments.at(0).Origin} →{" "}
                        {Details.Segments.at(-1).Destination}
                      </h5>
                      <h6 className="mt-0">
                        *Please Verify Flight Times With The Airlines Prior To
                        Departure
                      </h6>
                    </div>
                    <div className="row d-flex flex-wrap justify-content-between align-items-center mb-4 border border-secondary p-3">
                      <div className="col-12 col-xl-3 col-sm mb-3">
                        {/* <Airlogo airCode={airlinelogo} /> */}

                        <p>Airline code: {Details.Segments[0].Airline_Code}</p>
                        <p>Airline PNR: {airdetail.Airline_PNR}</p>
                        <p>
                          Stops :{" "}
                          {Details.Segments.length === 1
                            ? "Non Stop"
                            : Details.Segments.length === 2
                            ? "1 Stop"
                            : "2+ Stop"}{" "}
                        </p>
                        <p>
                          Fair Type :{" "}
                          {Details.Fares.at(0).Refundable
                            ? "Refundable"
                            : "Non-Refundable"}{" "}
                        </p>
                      </div>
                      <div className="col-12 col-xl-3 col-sm mb-3 text-center">
                        {Details.Segments.map((segment, index) => (
                          <>
                            <div className="d-flex justify-content-center align-items-center">
                              <div className="flex-fill mb-3 text-center">
                                <p>{segment.Origin}</p>
                                <p>
                                  <strong>
                                    {formatDate(segment.Departure_DateTime)}
                                  </strong>
                                </p>
                              </div>
                              <div className="mb-3">
                                <img
                                  className="f_icon_list"
                                  src={route_plane}
                                  alt="route-plan"
                                />
                              </div>
                              <div className="flex-fill mb-3 text-center">
                                <p>{segment.Destination}</p>
                                <p>
                                  <strong>
                                    {formatDate(segment.Arrival_DateTime)}
                                  </strong>
                                </p>
                              </div>
                            </div>
                          </>
                        ))}
                      </div>
                      <div className="col-12 col-xl-3 col-sm mb-3">
                        <p>
                          Stop Over:{" "}
                          {Details.Segments[0].Stop_Over == null
                            ? "Non Stop"
                            : Details.Segments[0].Stop_Over + " Stop"}
                        </p>
                        <p>Duration: {Details.Segments[0].Duration}</p>
                        <p>
                          Class:{" "}
                          {getClassOfTravel(TicketRecord.Class_of_Travel)}
                        </p>
                        <p>
                          Check In Baggage:{" "}
                          {
                            Details.Fares[0].FareDetails[0].Free_Baggage
                              .Check_In_Baggage
                          }
                        </p>
                        <p>
                          Hand Baggage:{" "}
                          {
                            Details.Fares[0].FareDetails[0].Free_Baggage
                              .Hand_Baggage
                          }
                        </p>
                        <p>
                          Ticket Status:{" "}
                          {TicketRecord.AirPNRDetails[0].Ticket_Status_Desc}
                        </p>
                      </div>
                    </div>
                  </>
                )
              )}
            </>
          ))}

          <div>
            <div className="bg-dark text-white px-3 py-1">
              <h5 className="mt-0">Passenger Details</h5>
            </div>
            {/* <h5>Passenger Details</h5> */}
            <table className="table table-bordered mb-4 mt-0">
              <thead className="table-light">
                <tr>
                  <th>Sr No.</th>
                  <th>Passenger Name</th>
                  <th>Passport No</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {TicketRecord.AirPNRDetails[0].PAXTicketDetails.map(
                  (details, index) => (
                    <>
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {details.Title} {details.First_Name}{" "}
                          {details.Last_Name}
                        </td>
                        <td>{details.Passport_Number}</td>
                        <td>{getpaxtype(details.Pax_type)}</td>
                      </tr>
                    </>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div>
            <div className="bg-dark text-white px-3 py-1">
              <h5 className="mt-0">Passenger SSR Details</h5>
            </div>

            {TicketRecord.AirPNRDetails[0].PAXTicketDetails.length > 0 && (
              <>
                <table className="table table-bordered mb-4 mt-0">
                  <thead className="table-light">
                    <tr>
                      <th>Sr No.</th>
                      <th>Passenger</th>
                      <th>Service Code</th>
                      <th>Service Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TicketRecord.AirPNRDetails[0].PAXTicketDetails.map(
                      (pass_obj, index) =>
                        pass_obj.SSRDetails.map((obj, ssrindex) => (
                          <>
                            <tr key={ssrindex}>
                              <td>{ssrindex + 1}</td>
                              <td>
                                {pass_obj.Title} {pass_obj.First_Name}{" "}
                                {pass_obj.Last_Name}
                              </td>
                              <td>{getLabelByValue(obj.SSR_Type)}</td>

                              <td>{obj.SSR_TypeDesc}</td>
                            </tr>
                          </>
                        ))
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
          <div className="tkt-instrctn">
            <h5>General Instructions:-</h5>
            <ul className="list-unstyled">
              <li>
                All Passengers including children and infants, must present
                valid Photo identity proof (Passport/Pan Card /Election Card or
                any Photo Identity Proof) at Check-In. It is your responsibility
                to ensure you have the appropriate travel documents at all
                times.
              </li>
              <li>
                For Infant Passengers, it is Mandatory to Carry the Date of
                Birth Certificate.
              </li>
              <li>
                Flight timings are subject to change without prior notice.
                Please recheck with carrier prior to departure.
              </li>
              <li>
                Changes/Cancellations to booking must be made at least 6 hours
                prior to scheduled departure time or else should be cancelled
                directly from the respective airlines.
              </li>
              <li>
                We are not responsible for any Flight delay/Cancellation from
                airline's end.
              </li>
              <li>
                The above-said is for informational purpose only, we strongly
                recommend you to check with respective airline for updated
                flight and terminal information details.
              </li>
              <li>
                Series Fares / Group Bookings are Non changeable and Non
                Refundable
              </li>
            </ul>
          </div>
          <span>Booking Date Time: {TicketRecord.Booking_DateTime}</span>
          <br />
        </div>
      ) : (
        <div>
          <Progress />
        </div>
      )}
      <div className="d-flex justify-content-end align-items-center m-4">
        <button className="cus-btn" onClick={downloadPDF}>
          Download
        </button>
      </div>
    </>
  );
}

export default Ticket_Details;

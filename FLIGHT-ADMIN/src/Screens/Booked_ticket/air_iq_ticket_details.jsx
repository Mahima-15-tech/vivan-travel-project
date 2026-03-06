import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import logo from "../../Assets/Images/logo.png";
import {
  third_party_2,
  AIR_IQ,
  IMAGE_BASE_URL,
} from "../../API/endpoints";
import { post} from "../../API/airline";
import route_plane from "../../Assets/Images/route-plan.png";
import Progress from "../Component/Loading";
import './ticket_details.css'


function Air_iq_ticket_details({ticket, reference_id }) {
// console.log(JSON.stringify(ticket));
    // const [setting, setSettings] = useState(null);
    let flight_numberval ='';
    try {
      
   flight_numberval = JSON.parse(ticket.BookingFlightDetails)["flight"][
     "flight_number"
   ];
    } catch (error) {
      
    }
    const [TicketRecord, setTicketRecord] = useState(null);
    const [TicketRecordlocal, setticketDetails] = useState(ticket);
  const [data, setUserData] = useState(null);

    useEffect(() => { const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    }
        fetchTicketRecord();
        // fetchllocalTicketRecord();
    }, []);
    let setting = null;
    

    const fetchTicketRecord = async () => {
        let settingFromSession = sessionStorage.getItem('settting');
    if (settingFromSession && settingFromSession != null) {
        setting = JSON.parse(settingFromSession);
    }
    let isuat = "";
    if (setting) {
        if (setting.airiq_api_prod_on == 1) {
            isuat = "no"
        } else {
            isuat = "yes"
        }
    }
        try {
            const aurl = AIR_IQ + `ticket?booking_id=${reference_id}`;
            const resp = await post(third_party_2, `{"api_c":"b","is_uat":"${isuat}"}`, aurl);
            const trecord = await resp.json();
            if (trecord.data != null) {
                setTicketRecord(trecord.data.data);
            } else {
                setTicketRecord(null);
            }
        } catch (error) {
            console.error("Error fetching ticket record:", error);
        }
    };

    // const fetchSettings = async () => {
    //     try {
    //         const res = await get(siteconfig, true);
    //         const response = await res.json();
    //         setSettings(response.data);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // };

    // const fetchllocalTicketRecord = async () => {
    //     try {
    //         const response = await HelperPost(Series_Booking_details, { booking_id: reference_id }, true);
    //         if (response.ok) {
    //             const data = await response.json();
    //             setticketDetails(data.data);
    //         } else {
    //             console.error('Failed To List');
    //         }
    //     } catch (error) {
    //         console.error(error.message);
    //     }
    // };


    const downloadPDF = () => {
        const element = document.getElementById('ticket-details'); // Reference the modal content by its ID

        // Options for the pdf generation
        const options = {
            margin: 1,
            filename: 'vivantravels.com.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
            // filename: "Vivan_travels_" + TicketRecord.Booking_RefNo + ".pdf",
              // Generate PDF from the element
              html2pdf().from(element).set(options).save();
    };

    return (
      <>
        {TicketRecord && reference_id !== null && TicketRecordlocal ? (
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
                      ? IMAGE_BASE_URL + data.profile_photo
                      : logo
                  }
                  alt="Vivian Travels & Tourism"
                  style={{ height: "50px" }}
                />
                <h6>
                  Booking Reference No :{" "}
                  {TicketRecordlocal.Agency_RefNo != null &&
                  TicketRecordlocal.Agency_RefNo
                    ? TicketRecordlocal.Agency_RefNo
                    : "N/A"}
                </h6>
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
              </div>
            </div>

            <div className="bg-dark text-white px-3 py-1 d-flex flex-wrap justify-content-between align-items-center">
              <h5 className="mt-0">Your flight from {TicketRecord.sector}</h5>
              <h6 className="mt-0">
                *Please Verify Flight Times With The Airlines Prior To Departure
              </h6>
            </div>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 border border-secondary p-3">
              <div className="col-2 mb-3">
                <p>Airline code: {flight_numberval}</p>
                <p>Airline PNR: {TicketRecord.pnr}</p>
                {/* <p>
                  Fair Type :{" "}
                  {Details.Refundable ? "Refundable" : "Non-Refundable"}{" "}
                </p> */}
              </div>
              <div className="col-5 mb-3 text-center">
                <div className="d-flex justify-content-center align-items-center">
                  <div className="flex-fill mb-3 text-center">
                    <p>{TicketRecord.sector.split(" // ")[0]}</p>
                    <p>
                      <strong>
                        {TicketRecord.departure_date}{" "}
                        {TicketRecord.departure_time}
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
                    <p>{TicketRecord.sector.split(" // ")[1]}</p>
                    <p>
                      <strong>
                        {TicketRecord.arrival_date} {TicketRecord.arrival_time}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
                    <th>PNR No</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(TicketRecord.passenger_details).map(
                    ([type, passengers], typeIndex) =>
                      passengers.map((passenger, index) => (
                        <tr key={`${typeIndex}-${index}`}>
                          <td>{typeIndex + index + 1}</td>
                          <td>{passenger.Name}</td>
                          <td>{TicketRecord.pnr || "N/A"}</td>
                          <td>{type}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="tkt-instrctn">
              <h5>General Instructions:-</h5>
              <ul className="list-unstyled">
                <li>
                  All Passengers including children and infants, must present
                  valid Photo identity proof (Passport/Pan Card /Election Card
                  or any Photo Identity Proof) at Check-In. It is your
                  responsibility to ensure you have the appropriate travel
                  documents at all times.
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
            <span>Booking Date Time: {TicketRecord.booking_date}</span>
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

export default Air_iq_ticket_details;
import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import logo from "../assets/images/logo.png";
import { IMAGE_BASE_URL } from "../API/endpoints";
import { post as HelperPost } from "../API/apiHelper";
import route_plane from "../assets/images/icon/route-plan.png";
import Progress from "../component/Loading";
import "./ticket_details.css";

function Offline_ticket_details({
  ticket_data,
  reference_id,
  pax_list,
  maindata,
}) {
  // console.log(ticket_data);
  // const [setting, setSettings] = useState(null);
  const TicketRecordlocal = ticket_data;
  const [data, setUserData] = useState(null);

  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    }
  }, []);
  let setting = null;

  const downloadPDF = () => {
    const element = document.getElementById("ticket-details"); // Reference the modal content by its ID

    // Options for the pdf generation
    const options = {
      margin: 1,
      filename: (TicketRecordlocal.pnr || "ticket") + "_vivantravels.com.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    // filename: "Vivan_travels_" + TicketRecordlocal.Booking_RefNo + ".pdf",
    // Generate PDF from the element
    html2pdf().from(element).set(options).save();
  };

  return (
    <>
      {TicketRecordlocal && reference_id !== null && TicketRecordlocal ? (
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
              <h6>Booking Reference No : {reference_id || "N/A"}</h6>
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
            <h5 className="mt-0">
              {/* Your flight from{" "} */}
              {/* {TicketRecordlocal.booking_items[0].name} */}
            </h5>
            <h6 className="mt-0">
              *Please Verify Flight Times With The Airlines Prior To Departure
            </h6>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 border border-secondary p-3">
            <div className="col-2 mb-3">
              <p>
                Airline code:{" "}
                {`${TicketRecordlocal.flight.flight_numbers.join(", ")}`}
              </p>
              <p>Airline PNR: {maindata.PNR || ""}</p>
            </div>
            <div className="col-5 mb-3 text-center">
              <div className="d-flex justify-content-center align-items-center">
                <div className="flex-fill mb-3 text-center">
                  <p>{TicketRecordlocal.flight.origin}</p>
                  <p>
                    <strong>{TicketRecordlocal.flight.departure_time}</strong>
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
                  <p>{TicketRecordlocal.flight.destination}</p>
                  <p>
                    <strong>{TicketRecordlocal.flight.arrival_time}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-dark text-white px-3 py-1">
              <h5 className="mt-0">Passenger Details</h5>
            </div>
            <table className="table table-bordered mb-4 mt-0">
              <thead className="table-light">
                <tr>
                  <th>Sr No.</th>
                  <th>Passenger Name</th>
                  <th>PNR No</th>
                  <th>Type</th>
                  <th>Baggage</th>
                </tr>
              </thead>
              <tbody>
                {pax_list.map((Passanger, index) => (
                  <tr key={`${index}`}>
                    <td>{index + 1}</td>
                    <td>
                      {Passanger.first_name.charAt(0).toUpperCase() +
                        Passanger.first_name.slice(1)}
                    </td>
                    <td>{maindata.PNR || ""}</td>
                    <td>
                      {Passanger.type.charAt(0).toUpperCase() +
                        Passanger.type.slice(1)}
                    </td>
                    <td>
                      <strong>Check-in:</strong>{" "}
                      {TicketRecordlocal.flight.baggage.Check_In_Baggage}
                      <br />
                      <strong>Cabin:</strong>{" "}
                      {TicketRecordlocal.flight.baggage.Hand_Baggage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          {/* <span>Booking Date Time: {TicketRecordlocal.booking_date}</span> */}
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

export default Offline_ticket_details;

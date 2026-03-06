import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { post, get } from "../../API/airline";
import { post as HelperPost } from "../../API/apiHelper";
import logo from "../../Assets/Images/logo.png";
import route from "../../Assets/Images/route-plan.png";
import Progress from "../Component/Loading";
import {
  AIR_3_URL,
  AIR_REPRINT,
  third_party_2,
  AIR_IQ,
  siteconfig,
  Series_Booking_details,
} from "../../API/endpoints";
import "../Visa/VisaDetails.css";
import html2pdf from "html2pdf.js";

function Series_details() {
  const navigate = useNavigate();
  const { id } = useParams();
  const reference_id = atob(id);
  const [TicketRecord, setTicketRecord] = useState(null);
  const [setting, setSettings] = useState(null);
  const [TicketRecordlocal, setticketDetails] = useState(null);

      let isuat = "";

      let URL = "https://omairiq.azurewebsites.net/";
  useEffect(() => {
    fetchSettings();
  }, [reference_id]);

  const fetchTicketRecord = async () => {
    try {

      

      const aurl = URL + `ticket?booking_id=${reference_id}`;
      const resp = await post(
        third_party_2,
        `{"api_c":"b","is_uat":"${isuat}"}`,
        aurl
      );
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
  const fetchSettings = async () => {
    try {
      let setting = null;
      let settingFromSession = sessionStorage.getItem("settting");
      if (settingFromSession && settingFromSession != null) {
        setting = JSON.parse(settingFromSession);
        if (setting) {
          if (setting.airiq_api_prod_on == "1") {
            isuat = "no";
            URL = setting.airiq_api_prod_url;
          } else {
            isuat = "yes";
            URL = setting.airiq_api_uat_url;
          }

    fetchTicketRecord();
    fetchllocalTicketRecord();
        }
      }
      setSettings(setting);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchllocalTicketRecord = async () => {
    try {
      const response = await HelperPost(
        Series_Booking_details,
        { booking_id: reference_id },
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

  const downloadPDF = () => {
    const element = document.getElementById("ticket-details");
    const options = {
      margin: 1,
      filename: "Vivan_travels_" + reference_id + ".pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <>
      <main id="content" role="main" className="main pointer-event">
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
                  src={logo}
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
                <p>{`${window.location.protocol}//${window.location.host}`}</p>
                {setting?.support_email && <p>{setting.support_email}</p>}
                {setting?.support_no && <p>{setting.support_no}</p>}
              </div>
            </div>

            <div className="bg-dark text-white px-3 py-1 d-flex flex-wrap justify-content-between align-items-center">
              <h5 className="my-2 text-white">
                Your flight from {TicketRecord.sector}
              </h5>
              <h6 className="my-2 text-white">
                *Please Verify Flight Times With The Airlines Prior To Departure
              </h6>
            </div>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 border border-secondary p-3">
              <div className="col-2 mb-3">
                <p>Airline code: {TicketRecord.flight_no}</p>
                <p>Airline PNR: {TicketRecord.pnr}</p>
              </div>
              <div className="col-5 mb-3 text-center">
                <div className="d-flex justify-content-center align-items-center">
                  <div className="flex-fill mb-3 text-center">
                    <p>{TicketRecord.sector.split(" // ")[0]}</p>
                    <p>
                      <strong>{TicketRecord.departure_time}</strong>
                    </p>
                  </div>
                  <div className="mb-3">
                    <img className="f_icon_list" src={route} alt="route-plan" />
                  </div>
                  <div className="flex-fill mb-3 text-center">
                    <p>{TicketRecord.sector.split(" // ")[1]}</p>
                    <p>
                      <strong>{TicketRecord.arrival_time}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-dark text-white px-3 py-1">
                <h5 className="my-2 text-white">Passenger Details</h5>
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

            <div className="">
              <h5>Important Information</h5>
              <ul className="list-unstyled">
                <li>This ticket is Non Refundable & Non Changeable.</li>
                <li>
                  International flights check-in opens 180 minutes before
                  departure.
                </li>
                <li>
                  All Passengers/Infants must carry their Passport which has to
                  be valid at least 6 months from the date of travel while
                  Check-in.
                </li>
                <li>Please contact airlines for Terminal Queries.</li>
                <li>
                  Charged fare is totally agreed between "BUYER & SELLER"; any
                  issues related to fares thereafter will not be entertained.
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

        {TicketRecord && reference_id !== null && TicketRecordlocal ? (
          <div className="d-flex justify-content-end align-items-center m-4">
            <button
              className="btn btn-success btn-sm cus-button"
              onClick={downloadPDF}
            >
              Download
            </button>
          </div>
        ) : (
          <div>
            <Progress />
          </div>
        )}
      </main>
    </>
  );
}

export default Series_details;

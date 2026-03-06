import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Progress from "../../../component/Loading";
import { post as HelperPost } from "../../../API/apiHelper";
import { s_ticket_Details, IMAGE_BASE_URL } from "../../../API/endpoints";
import Pdf417Barcode from "../../../widget/Pdf417Barcode";
import logo from "../../../assets/images/logo.png";
import html2pdf from "html2pdf.js";

const Ticket_details = () => {
  const navigate = useNavigate();
  const { id: reference_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [bookingmaindata, setbookingmaindata] = useState(null);
  const [pax_list, setpax_list] = useState([]);
  const [ssr_list, setssr_list] = useState([]);
  const [stops, setstops] = useState([]);
  const [support, setsupport] = useState(null);
  const [bookingdata, setbookingdata] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await HelperPost(
          s_ticket_Details,
          { reference_id: reference_id },
          true
        );
        const result = await res.json();

        if (result?.data) {
          const { data, pax_list, ssr, stops, support } = result;
          setsupport(support);
          setbookingmaindata(data);
          setpax_list(pax_list || []);
          setssr_list(ssr || []);
          setstops(stops || []);

          const ticketDetails = data?.Ticket_Details;
          if (typeof ticketDetails === "string") {
            try {
              const parsed = JSON.parse(ticketDetails);
              setbookingdata(Array.isArray(parsed) ? parsed : [parsed]);
            } catch {
              setbookingdata([]);
            }
          } else {
            setbookingdata(
              Array.isArray(ticketDetails) ? ticketDetails : [ticketDetails]
            );
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setLoading(false);
      }
    };

    getData();
  }, [reference_id]);
  const downloadPDF = () => {
    const element = document.getElementById("ticket-details"); // Reference the modal content by its ID

    const options = {
      margin: 0.5,
      filename: pax_list[0]?.pnr
        ? `${pax_list[0].pnr}.pdf`
        : "vivantravels.com.pdf",
      html2canvas: {
        scale: 6,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().set(options).from(element).save();
  };

  const formatTime = (datetimeStr) =>
    datetimeStr
      ? new Date(datetimeStr).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  if (loading) return <Progress />;
  if (!bookingmaindata)
    return <div className="text-center p-5">No booking data found</div>;

  return (
    <div className="container my-4" style={{ backgroundColor: "white" }}>
      <div
        className="card shadow-sm"
        id="ticket-details"
        style={{ backgroundColor: "white" }}
      >
        <div className="card-header bg-primary text-white text-center fs-5 fw-bold">
          E-Ticket
        </div>

        <div className="card-body p-4" style={{ backgroundColor: "white" }}>
          {/* Header Info */}
          <div className="row mb-3 align-items-center">
            <div className="col-md-8">
              {bookingmaindata?.user?.type === "2" ? (
                bookingmaindata?.user?.email && (
                  <p className="mb-1">
                    <strong>Email:</strong> {bookingmaindata.user.email}
                  </p>
                )
              ) : (
                <p className="mb-1">
                  <strong>Email:</strong> {support?.support_email || ""}
                </p>
              )}
              {bookingmaindata?.user?.mobile_no && (
                <p className="mb-1">
                  <strong>Phone:</strong> {bookingmaindata.user.mobile_no}
                </p>
              )}
              <p className="mb-1">
                <strong>Company:</strong>{" "}
                {bookingmaindata.user?.type === "2"
                  ? bookingmaindata.user?.agents?.company_name
                  : support?.support_no}
              </p>
              <p className="mb-1">
                <strong>Address:</strong>{" "}
                {bookingmaindata.user?.type === "2"
                  ? bookingmaindata.user?.agents?.office_Address
                  : support?.address}
              </p>
            </div>
            <div className="col-md-4 text-end">
              <img
                src={
                  bookingmaindata?.user?.type === "2"
                    ? IMAGE_BASE_URL +
                      (bookingmaindata.user.profile_photo || "")
                    : logo
                }
                alt="Logo"
                style={{ maxWidth: 100 }}
              />
              <p className="mt-2">
                <strong>Ref No:</strong> {bookingmaindata.Agency_RefNo}
              </p>
            </div>
          </div>
          {/* Flight Details */}
          {stops.length > 0 && (
            <div className="mb-4">
              <h5 className="fw-semibold">Flight Details</h5>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Flight</th>
                      <th>Departure</th>
                      <th>Arrival</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stops.map((stop, idx) => (
                      <tr key={idx}>
                        <td>
                          <img
                            src={IMAGE_BASE_URL + stop.airline_logo}
                            alt=""
                            style={{ width: 25, marginRight: 8 }}
                          />
                          <div>
                            {stop.airline_name} <br />
                            <small>{stop.flight_number}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            {stop.depeparture_city_code}
                            {stop.depeparture_city_name
                              ? ` (${stop.depeparture_city_name})`
                              : ""}
                          </div>

                          {stop.departure_terminal_no && (
                            <div>Terminal: {stop.departure_terminal_no}</div>
                          )}
                          <div>
                            {formatDate(stop.Departure_DateTime)}{" "}
                            {formatTime(stop.Departure_DateTime)}
                          </div>
                        </td>
                        <td>
                          <div>
                            {stop.arrival_city_code}
                            {stop.arrival_city_name
                              ? ` (${stop.arrival_city_name})`
                              : ""}
                          </div>

                          {stop.arrival_terminal_no && (
                            <div>Terminal: {stop.arrival_terminal_no}</div>
                          )}
                          <div>
                            {formatDate(stop.Arrival_DateTime)}{" "}
                            {formatTime(stop.Arrival_DateTime)}
                          </div>
                        </td>
                        <td>
                          <div>Status: {stop.status}</div>
                          {stop.hand_baggage && (
                            <div>Hand Baggage: {stop.hand_baggage}</div>
                          )}
                          {stop.check_in_baggage && (
                            <div>Check-in Baggage: {stop.check_in_baggage}</div>
                          )}
                          {/* <div>PNR: {stop.pnr || bookingmaindata.PNR}</div>
                          <div>
                            {stop.is_non_stop ? "Non-stop" : "With stops"}
                          </div> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Passenger List */}
          <div className="mb-4">
            <h5 className="fw-semibold">Passenger List</h5>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Sr No. </th>
                    <th>Name</th>
                    <th>PNR</th>
                    <th>Passport</th>
                    <th>2D Barcode</th>
                  </tr>
                </thead>
                <tbody>
                  {pax_list.length > 0 ? (
                    pax_list.map((pax, idx) => (
                      <tr key={idx}>
                        <td>{pax.id}</td>
                        <td>{pax.fullName}</td>
                        <td>{pax.pnr}</td>
                        <td>{pax.passportNumber}</td>
                        <td>
                          <Pdf417Barcode value={"." + pax.pnr} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No passengers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Passenger SSR Details */}
          <div className="mb-4">
            <h5 className="fw-semibold">Passenger SSR Details</h5>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Sr No. </th>
                    <th>Name</th>
                    <th>Service Code </th>
                    <th>Service Description</th>
                  </tr>
                </thead>
                <tbody>
                  {ssr_list.length > 0 ? (
                    ssr_list.map((pax, idx) => (
                      <tr key={idx}>
                        {" "}
                        <td>{pax.id}</td>
                        <td>{pax.fullName}</td>
                        <td>{pax.type_label}</td>
                        <td>{pax.description}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No passengers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* General Instructions */}
          <div className="flight-rules">
            <div className="bold-title">Important Flight Rules & Notices</div>
            <ul className="flight-rules-list">
              <li>Carry valid ID proof for all passengers.</li>
              <li>
                Infant passengers must carry a valid Date of Birth certificate.
              </li>
              <li>
                Flight timings are subject to change. Always verify with the
                airline at least 24 hours prior to departure.
              </li>
              <li>
                Please verify your terminal with the airline, as terminal
                assignments may change.
              </li>
              <li>
                Carry a printed copy or a digital copy of your e-ticket for
                airport access and check-in.
              </li>
              <li>
                Check-in starts 3 hours before departure for international
                flights and 2 hours before for domestic flights. Counters close
                60 minutes prior to departure.
              </li>
              <li>
                Web Check-in is <strong>mandatory</strong> and closes 60 minutes
                before departure. Charges may apply.
              </li>
              <li>Carry a valid passport and visa for international travel.</li>
              <li>
                Name changes are <strong>not allowed</strong> on any booking.
              </li>
              <li>
                Partial cancellation is <strong>not allowed</strong> for round
                trips or family fares.
              </li>
              <li>
                Passengers from Jammu & Srinagar are not allowed hand baggage
                due to security restrictions.
              </li>
              <li>
                Power banks and mobile chargers are allowed{" "}
                <strong>only in hand baggage</strong>. Baggage may be offloaded
                if found in check-in luggage.
              </li>
              <li>
                Carriage and services are subject to airline Terms & Conditions
                and Conditions of Carriage.
              </li>
              <li>
                All times shown are <strong>local</strong> and in{" "}
                <strong>24-hour format</strong>.
              </li>

              <li>Infants must carry a birth certificate as identification.</li>
              <li>
                Tickets are <strong>Non-Refundable & Non-Changeable</strong>{" "}
                unless specified otherwise.
              </li>
              <li>Service fees will apply for all amendments.</li>
              <li>Reconfirm flight terminal and gate before travel.</li>
              <li>
                Contact airline directly for changes or cancellations within 24
                hours of departure.
              </li>
              <li>
                Flight schedule changes by airline may involve additional
                charges.
              </li>
              <li>
                All guests must refer to the latest airline guidelines before
                departure.
              </li>
              <li>
                If a flight is canceled (IROP), full refund{" "}
                <strong>minus ₹250 per person</strong> service charge will be
                processed.
              </li>
              <li>
                Name correction for return flight must be requested at least 48
                hours before onward journey.
              </li>
              <li>
                Airline PNR is required for any communication or boarding
                assistance.
              </li>
              <li>
                Flight delays, cancellations, or changes are under airline
                control. Contact airline for alternate arrangements.
              </li>
              <li>
                International and domestic check-in counters close 60–90 minutes
                prior to departure depending on airline and class.
              </li>
              <li>
                All information is subject to change by airline without prior
                notice. Please recheck closer to travel date.
              </li>
              <li>
                Refunds follow airline policy and may be issued as travel
                vouchers in COVID-related cancellations.
              </li>
              <li>
                For international journeys, airline liability is limited under
                the Warsaw Convention and other applicable laws.
              </li>
            </ul>
          </div>
          {/* Footer */}
          <div className="mt-4 text-center">
            <p>Thank you for booking with us.</p>
            <p>We wish you a pleasant journey!</p>
          </div>
          <button onClick={downloadPDF} class="btn btn-primary">
            Download Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ticket_details;

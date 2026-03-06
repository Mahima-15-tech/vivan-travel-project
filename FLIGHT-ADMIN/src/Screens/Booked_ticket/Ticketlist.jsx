import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AIR_2_URL,
  AIR_PAY,
  tickets_update_status,
  third_party,
} from "../../API/endpoints";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { post } from "../../API/apiHelper";
import CircularProgressBar from "../Component/Loading";
import Ticket_Details from "./ticket_details";

import Air_iq_ticket_details from "./air_iq_ticket_details";
import Gofly_ticket_details from "./gofly_ticket_details";
import Winfly_ticket_details from "./winfly_ticket_details";
const Ticketlist = ({ data, onUpdate }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    const encodedData = btoa(data.Booking_RefNo);
    setShowModal(true);
    // navigate(`/TicketDetails/${encodedData}`);
  };

  let bookingdata = null;
  let Airline = null;
  let origananddestination = null;
  if (data.Ticket_Details) {
    try {
      bookingdata = JSON.parse(data.Ticket_Details);
    } catch (err) {
      console.log("Invalid Ticket_Details JSON:", data.Ticket_Details);
      bookingdata = null;
    }
  }
  let pax_list = [];
  // if (data.type == 1) {
  //   Airline = '';
  //   // `${bookingdata.AirPNRDetails[0].Flights[0].Segments[0].Airline_Name} (${bookingdata.AirPNRDetails[0].Flights[0].Segments[0].Airline_Code})`;
  //   origananddestination = '';
  //   // `${bookingdata.AirPNRDetails[0].Flights[0].Segments[0].Origin} /${bookingdata.AirPNRDetails[0].Flights[0].Segments[0].Destination}`;
  // } else
  if (data.type == 2) {
    //   // console.log(`hi yogesh your data${JSON.stringify(bookingdata)}`);
    //   Airline = bookingdata.airline_code;
    //   const tempdata = JSON.parse(data.BookingFlightDetails);
    //   origananddestination = `${tempdata.flight.origin || ""}/${
    //     tempdata.flight.destination
    //   }`;
    pax_list = JSON.parse(data.PAX_Details);
  }
  //  else if (data.type == 3) {
  //   Airline = bookingdata.booking_items[0].flight.legs[0].airline;
  //   origananddestination = `${
  //     bookingdata.booking_items[0].flight.legs[0].origin || ""
  //   } /${bookingdata.booking_items[0].flight.legs[0].destination}`;
  // } else if (data.type == 4) {
  //   const tempdata = JSON.parse(data.BookingFlightDetails);
  //   Airline = tempdata.flight.Airline_Code;
  //   origananddestination = `${tempdata.flight.origin || ""} /${
  //     tempdata.flight.destination
  //   }`;
  //   pax_list = JSON.parse(data.PAX_Details);
  // }

  const [showModal, setShowModal] = useState(false);
  const [viewdetailsval, setviewdetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [Loading, SetLoading] = useState(false);
  const [modalData, setModalData] = useState({
    status: "",
    id: "",
    pnr: "",
    type: "",
  });
  const toggleModal = () => setShowModal(!showModal);
  const viewdetailseModal = () => setviewdetailsModal(!viewdetailsval);

  const handleShowEdit = () => {
    setModalData({
      status: data.status,
      id: data.id,
      type: data.type,
      pnr: data.PNR,
    });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => setShowEditModal(false);

  const handleSave = async () => {
    try {
      SetLoading(true);
      const response = await post(
        tickets_update_status,
        modalData.type == 5
          ? {
              status: modalData.status,
              id: modalData.id,
              pnr: modalData.pnr,
              type: modalData.type,
            }
          : {
              status: modalData.status,
              id: modalData.id,
            },
        true
      );
      const data = await response.json();
      if (data.status == false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      SetLoading(false);
      handleCloseEdit();
      onUpdate();
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handlepay = async () => {
    const amount_payload = {
      Auth_Header: {
        UserId: "viviantravelsuat",
        Password: "3B96F16F32C9AEB30C4DF9B3FBABAE964E4E1033",
        IP_Address: "12333333",
        Request_Id: "5500833959053023879",
        IMEI_Number: "9536615000",
      },
      ClientRefNo: "Testing Team",
      RefNo: "",
      TransactionType: 0,
      ProductId: "1",
    };

    const addpayment_api_url = (await AIR_2_URL()) + AIR_PAY;
    const addpayment_res = await post(
      third_party,
      JSON.stringify(amount_payload),
      addpayment_api_url
    );
    const paymentrecord = await addpayment_res.json();
  };

  return (
    <tr>
      <td className="text-center">{data.id}</td>
      <td className="text-center">{data.bookings.name || "N/A"}</td>

      <td className="text-center">
        <div className="mb-1">
          <strong>
            <a
              className="title-color hover-c1"
              href={`mailto:${data.bookings.email}`}
            >
              {data.bookings.email}
            </a>
          </strong>
        </div>
        <a
          className="title-color hover-c1"
          href={`tel:${data.bookings.mobile_no}`}
        >
          {data.bookings.mobile_no}
        </a>
      </td>

      <td className="text-center">{data.Booking_RefNo || "N/A"}</td>
      <td className="text-center">
        {data.type == 1
          ? "Etrav"
          : data.type == 2
          ? "AirIQ"
          : data.type == 3
          ? "Gofly"
          : data.type == 4
          ? "Vinfly"
          : data.type == 5
          ? "Offline"
          : "" || "N/A"}
      </td>
      <td className="text-center">{data.Amount || "N/A"}</td>
      <td className="text-center">{data.paying_method || "N/A"}</td>

      <td>
        <div className="text-center">
          <div
            className={`badge ${
              data.status === "Confirmed"
                ? "badge-soft-success"
                : "badge-soft-danger"
            }`}
          >
            {data.status}
          </div>
        </div>
      </td>
      <td>
        <div className="d-flex justify-content-center gap-2">
          {/* View Ticket Button */}
          <button
            // onClick={handleViewClick}
            onClick={() =>
              window.open(
                "http://localhost:5173/#/ticket_details/" +
                data.Booking_RefNo,
                "_blank"
              )
            }
            className="btn btn-outline-info btn-sm square-btn delete"
            title="View Ticket"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            aria-label="View Ticket"
          >
            <i className="tio-invisible"></i>
          </button>
          {/* Edit Status Button */}
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleShowEdit}
            title="Edit Status"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            aria-label="Edit Status"
          >
            <i className="tio-edit"></i>
          </Button>
          {/* View Details Button */}
          {data.type === 5 && (
            <Button
              variant="outline-info"
              size="sm"
              onClick={viewdetailseModal}
              title="View Details"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              aria-label="View Details"
            >
              <i className="tio-info"></i>
            </Button>
          )}
          {/* Modal for View Ticket Button */}
          <Modal
            show={showModal}
            onHide={toggleModal}
            size="xl"
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title>Ticket Details</Modal.Title>
            </Modal.Header>
            {data.type === 1 && bookingdata != null ? (
              <Ticket_Details reference_id={bookingdata.Booking_RefNo} />
            ) : data.type === 2 ? (
              <Air_iq_ticket_details
                ticket={data}
                reference_id={data.Booking_RefNo}
              />
              ) : data.type === 3 && bookingdata ? (
                <Gofly_ticket_details
  ticket_data={bookingdata}
  reference_id={data.Booking_RefNo}
/>
            ) : data.type === 4 ? (
              <Winfly_ticket_details
                pax_list={pax_list}
                ticket_data={data}
                reference_id={bookingdata.reference_id || ""}
              />
            ) : (
              <div>
                <center>No Ticket</center>
              </div>
            )}
          </Modal>
          {/* Modal for Edit Status Button */}
          <Modal show={showEditModal} onHide={handleCloseEdit}>
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>Update Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="status">
                  <Form.Label>Status:</Form.Label>
                  <Form.Control
                    as="select"
                    value={modalData.status}
                    onChange={(e) =>
                      setModalData({ ...modalData, status: e.target.value })
                    }
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="Success">Success</option>
                  </Form.Control>
                  <Form.Control
                    type="hidden"
                    value={modalData.id}
                    onChange={(e) =>
                      setModalData({ ...modalData, id: e.target.value })
                    }
                  />
                </Form.Group>
                {(data.type == 5) & (modalData.status == "Success") ? (
                  <Form.Group controlId="pnr">
                    <Form.Label>PNR:</Form.Label>
                    <Form.Control
                      type="text"
                      value={modalData.pnr}
                      onChange={(e) =>
                        setModalData({ ...modalData, pnr: e.target.value })
                      }
                    />
                  </Form.Group>
                ) : (
                  <></>
                )}
              </Form>
            </Modal.Body>
            {Loading ? (
              <CircularProgressBar />
            ) : (
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEdit}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
              </Modal.Footer>
            )}
          </Modal>
          {/* Modal for View Details Button */}
          <Modal
            show={viewdetailsval}
            onHide={viewdetailseModal}
            size="lg"
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title>Offline Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p>
                  <strong>Ref No:</strong> {data.Booking_RefNo}
                </p>
                <p>
                  <strong>Agency Ref:</strong> {data.Agency_RefNo}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{data.Amount}
                </p>
                <p>
                  <strong>Payment:</strong> {data.paying_method}
                </p>
                <hr />
                {data.Ticket_Details &&
                  (() => {
                    try {
                      const ticket = JSON.parse(data.Ticket_Details);
                      const flight = ticket.flight || {};
                      const paxList = JSON.parse(data.PAX_Details) || [];
                      return (
                        <>
                          <h6>Flight Info:</h6>
                          <p>
                            <strong>From:</strong>{" "}
                            {flight.origin || "Not available"} →{" "}
                            <strong>To:</strong>{" "}
                            {flight.destination || "Not available"}
                          </p>
                          <p>
                            <strong>Airline:</strong>{" "}
                            {flight.Airline_Code || "Not available"}
                          </p>
                          <p>
                            <strong>Departure:</strong>{" "}
                            {flight.departure_datetime
                              ? new Date(
                                  flight.departure_datetime
                                ).toLocaleString()
                              : "Not available"}
                          </p>
                          <p>
                            <strong>Arrival:</strong>{" "}
                            {flight.arrival_datetime
                              ? new Date(
                                  flight.arrival_datetime
                                ).toLocaleString()
                              : "Not available"}
                          </p>
                          <p>
                            <strong>Fare:</strong> ₹
                            {flight?.price?.isisnetfare != null
                              ? flight.price.isisnetfare
                              : "Not available"}
                          </p>
                          <p>
                            <strong>Baggage:</strong>{" "}
                            {flight?.baggage?.Check_In_Baggage != null
                              ? `${flight.baggage.Check_In_Baggage}kg`
                              : "Not available"}{" "}
                            /{" "}
                            {flight?.baggage?.Hand_Baggage != null
                              ? `${flight.baggage.Hand_Baggage}kg`
                              : "Not available"}
                          </p>
                          <hr />
                          <h6>Passengers:</h6>
                          {paxList.length === 0 ? (
                            <p>No passenger details available.</p>
                          ) : (
                            paxList.map((pax, idx) => (
                              <div key={idx} style={{ marginBottom: "1rem" }}>
                                <p>
                                  <strong>Name:</strong>{" "}
                                  {pax.title || pax.Title || "Not available"}{" "}
                                  {pax.first_name ||
                                    pax.First_Name ||
                                    "Not available"}{" "}
                                  {pax.last_name ||
                                    pax.Last_Name ||
                                    "Not available"}
                                </p>
                                <p>
                                  <strong>Passenger Type:</strong>{" "}
                                  {pax.passenger_type ||
                                    pax.Pax_type ||
                                    pax.Pax_Type ||
                                    pax.type ||
                                    "Not available"}
                                </p>
                                <p>
                                  <strong>Gender:</strong>{" "}
                                  {pax.gender === 1 ||
                                  pax.Gender === 1 ||
                                  pax.gender === "Male" ||
                                  pax.Gender === "Male"
                                    ? "Male"
                                    : pax.gender === 2 ||
                                      pax.Gender === 2 ||
                                      pax.gender === "Female" ||
                                      pax.Gender === "Female"
                                    ? "Female"
                                    : "Not available"}
                                </p>
                                <p>
                                  <strong>Age:</strong>{" "}
                                  {pax.age || pax.Age || "Not available"}
                                </p>
                                <p>
                                  <strong>DOB:</strong>{" "}
                                  {pax.dob ||
                                    pax.DOB ||
                                    pax.dateOfBirth ||
                                    "Not available"}
                                </p>
                                <p>
                                  <strong>Passport No:</strong>{" "}
                                  {pax.passport_num ||
                                    pax.Passport_Number ||
                                    "Not available"}
                                </p>
                                <p>
                                  <strong>Passport Issuing Country:</strong>{" "}
                                  {pax.Passport_Issuing_Country ||
                                    pax.place_of_issue ||
                                    "Not available"}
                                </p>
                                <p>
                                  <strong>Passport Expiry:</strong>{" "}
                                  {pax.passport_expiry ||
                                    pax.Passport_Expiry ||
                                    "Not available"}
                                </p>
                                <p>
                                  <strong>Nationality:</strong>{" "}
                                  {pax.nationality ||
                                    pax.Nationality ||
                                    "Not available"}
                                </p>
                                <p>
                                  <strong>Pancard Number:</strong>{" "}
                                  {pax.Pancard_Number || "Not available"}
                                </p>
                                <p>
                                  <strong>Place of Birth:</strong>{" "}
                                  {pax.place_of_birth || "Not available"}
                                </p>
                                <p>
                                  <strong>Date of Issue:</strong>{" "}
                                  {pax.date_of_issue || "Not available"}
                                </p>
                                {idx !== paxList.length - 1 && <hr />}
                              </div>
                            ))
                          )}
                        </>
                      );
                    } catch (e) {
                      return <p>Error loading ticket details.</p>;
                    }
                  })()}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={viewdetailseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </td>
    </tr>
  );
};
export default Ticketlist;

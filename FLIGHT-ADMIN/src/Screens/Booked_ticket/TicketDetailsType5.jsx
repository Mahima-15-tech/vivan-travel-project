import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const TicketDetailsType5 = ({ data }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <td className="text-center">
      <Button variant="outline-info" size="sm" onClick={toggleModal}>
        View Details
      </Button>

      <Modal show={showModal} onHide={toggleModal} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Custom Ticket (Type 5)</Modal.Title>
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
                  const pax = (ticket.flight_traveller_details || [])[0] || {};
                  return (
                    <>
                      <h6>Flight Info:</h6>
                      <p>
                        <strong>From:</strong> {flight.origin} →{" "}
                        <strong>To:</strong> {flight.destination}
                      </p>
                      <p>
                        <strong>Airline:</strong> {flight.Airline_Code}
                      </p>
                      <p>
                        <strong>Departure:</strong>{" "}
                        {new Date(flight.departure_datetime).toLocaleString()}
                      </p>
                      <p>
                        <strong>Arrival:</strong>{" "}
                        {new Date(flight.arrival_datetime).toLocaleString()}
                      </p>
                      <p>
                        <strong>Fare:</strong> ₹{flight?.price?.isisnetfare}
                      </p>
                      <p>
                        <strong>Baggage:</strong>{" "}
                        {flight?.baggage?.Check_In_Baggage}kg /{" "}
                        {flight?.baggage?.Hand_Baggage}kg
                      </p>
                      <hr />
                      <h6>Passenger:</h6>
                      <p>
                        <strong>Name:</strong> {pax.title} {pax.first_name}{" "}
                        {pax.last_name}
                      </p>
                      <p>
                        <strong>Passport No:</strong> {pax.passport_num}
                      </p>
                      <p>
                        <strong>DOB:</strong> {pax.dob}
                      </p>
                      <p>
                        <strong>Nationality:</strong> {pax.nationality}
                      </p>
                    </>
                  );
                } catch (e) {
                  return <p>Error loading ticket details.</p>;
                }
              })()}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </td>
  );
};

export default TicketDetailsType5;

import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { post } from "../../API/apiHelper";
import { offline_ticket_update } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import { json } from "react-router-dom";

const OfflineTicketList = ({ data, airlineList, onUpdate, list }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({
    id: "",
    airline: "",
    from: "",
    to: "",
    adult_price: "",
    child_price: "",
    infant_price: "",
    seat: "",
    flight_code: "",
    check_in_bag: "",
    cabin_in_bag: "",
    departure_time: "",
    arrived_time: "",
    isrefundable: "",
    status: "",
  });

  const handleShowEdit = () => {
    setModalData({
      id: data.id,
      airline: data.airline,
      from: data.from,
      to: data.to,
      adult_price: data.adult_price,
      child_price: data.child_price,
      seat: data.seat,
      infant_price: data.infant_price,
      flight_code: data.flight_code,
      check_in_bag: data.check_in_bag,
      cabin_in_bag: data.cabin_in_bag,
      departure_time: formatUTCToDatetimeLocal(data.departure_time),
      arrived_time: formatUTCToDatetimeLocal(data.arrived_time),
      isrefundable: data.isrefundable,
      status: data.status,
    });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => setShowEditModal(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await post(
        offline_ticket_update,
        { ...modalData },
        true
      );
      const result = await response.json();
      if (result.status === false) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        handleCloseEdit();
        onUpdate();
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };
  const formatUTCDateTimeFull = (isoString) => {
    if (!isoString) return "N/A";

    const date = new Date(isoString);

    return date.toLocaleString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };
  const formatUTCToDatetimeLocal = (isoString) => {
    if (!isoString) return "";

    // Parse the date as UTC
    const date = new Date(isoString);

    // Get UTC components
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    // Format as required by datetime-local input
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  return (
    <tr>
      <td className="text-center">{data.id || "N/A"}</td>
      <td className="text-center">{data.airline_details.name || "N/A"}</td>
      <td className="text-center">
        {(data.from_airline.alpha_2 || "N/A") +
          "-" +
          (data.from_airline.country_code || "N/A")}
      </td>
      <td className="text-center">
        {(data.to_airline.alpha_2 || "N/A") +
          "-" +
          (data.to_airline.country_code || "N/A")}
      </td>
      <td className="text-center">{data.adult_price || 0}</td>
      <td className="text-center">{data.child_price || 0}</td>
      <td className="text-center">{data.infant_price || 0}</td>
      <td className="text-center">{data.seat || 0}</td>
      <td className="text-center">{data.flight_code || "N/A"}</td>
      <td className="text-center">{data.check_in_bag || "N/A"}</td>
      <td className="text-center">{data.cabin_in_bag || "N/A"}</td>
      <td className="text-center">
        {data.departure_time
          ? formatUTCDateTimeFull(data.departure_time)
          : "N/A"}
      </td>

      <td className="text-center">
        {data.arrived_time ? formatUTCDateTimeFull(data.arrived_time) : "N/A"}
      </td>

      <td className="text-center">{data.isrefundable || "N/A"}</td>
      <td className="text-center">
        <div
          className={`badge ${
            data.status === "Active"
              ? "badge-soft-success"
              : "badge-soft-danger"
          }`}
        >
          {data.status}
        </div>
      </td>
      <td>
        <div className="d-flex justify-content-center gap-2">
          <Button variant="danger" size="sm" onClick={handleShowEdit}>
            <i className="tio-edit"></i>
          </Button>
        </div>

        <Modal show={showEditModal} onHide={handleCloseEdit}>
          <Modal.Header closeButton className="customModalHeader">
            <Modal.Title>Edit Offline Ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="airline">
                <Form.Label>Airline</Form.Label>
                <Form.Control
                  as="select"
                  value={modalData.airline}
                  onChange={(e) =>
                    setModalData({ ...modalData, airline: e.target.value })
                  }
                >
                  <option value="">Select Airline</option>
                  {airlineList.map((air) => (
                    <option key={air.id} value={air.id}>
                      {air.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* <Form.Label>From</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalData.from}
                                onChange={(e) =>
                                    setModalData({ ...modalData, from: e.target.value })
                                }
                            /> */}
              <Form.Group controlId="from">
                <Form.Label>From</Form.Label>
                <Form.Control
                  as="select"
                  value={modalData.from}
                  onChange={(e) =>
                    setModalData({ ...modalData, from: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {Array.isArray(list) &&
                    list.map((country) => (
                      <option key={country.id} value={country.id}>
                        {(country.alpha_2 || "N/A") +
                          " -- " +
                          (country.country_code || "N/A")}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="to">
                <Form.Label>To</Form.Label>
                <Form.Control
                  as="select"
                  value={modalData.to}
                  onChange={(e) =>
                    setModalData({ ...modalData, to: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {Array.isArray(list) &&
                    list.map((country) => (
                      <option key={country.id} value={country.id}>
                        {(country.alpha_2 || "N/A") +
                          " -- " +
                          (country.country_code || "N/A")}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>

              <Form.Label>Adult Price</Form.Label>
              <Form.Control
                type="number"
                value={modalData.adult_price}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    adult_price: parseFloat(e.target.value),
                  })
                }
              />

              <Form.Label>Child Price</Form.Label>
              <Form.Control
                type="number"
                value={modalData.child_price}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    child_price: parseFloat(e.target.value),
                  })
                }
              />

              <Form.Label>Infant Price</Form.Label>
              <Form.Control
                type="number"
                value={modalData.infant_price}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    infant_price: parseFloat(e.target.value),
                  })
                }
              />
              <Form.Label>Seat</Form.Label>
              <Form.Control
                type="number"
                value={modalData.seat}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    seat: parseFloat(e.target.value),
                  })
                }
              />
              <Form.Group controlId="flight_code">
                <Form.Label>Flight Code</Form.Label>
                <Form.Control
                  type="text"
                  min="0"
                  value={modalData.flight_code}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      flight_code: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="check_in_bag">
                <Form.Label>Checkin Bag</Form.Label>
                <Form.Control
                  type="text"
                  min="0"
                  value={modalData.check_in_bag}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      check_in_bag: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="cabin_in_bag">
                <Form.Label>Cabin Bag</Form.Label>
                <Form.Control
                  type="text"
                  min="0"
                  value={modalData.cabin_in_bag}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      cabin_in_bag: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="departure_time">
                <Form.Label>Departure Date Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  value={modalData.departure_time}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      departure_time: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="arrived_time">
                <Form.Label>Arrived Date Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  value={modalData.arrived_time}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      arrived_time: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="isrefundable">
                <Form.Label>Is Refundable</Form.Label>
                <Form.Control
                  as="select"
                  value={modalData.isrefundable}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      isrefundable: e.target.value,
                    })
                  }
                  required
                >
                  <option value="" disabled>
                    Select Is Refundable
                  </option>
                  <option value="Yes">Yes</option>
                  <option value="No" selected>
                    No
                  </option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={modalData.status}
                  onChange={(e) =>
                    setModalData({ ...modalData, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          {loading ? (
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
      </td>
    </tr>
  );
};

export default OfflineTicketList;

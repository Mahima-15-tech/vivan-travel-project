import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {createOrUpdateAirlinePrice} from "../../API/endpoints";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { post } from "../../API/apiHelper";
import CircularProgressBar from "../Component/Loading";
import Default from "../../Assets/Images/user.webp";
const AirlineList = ({ data, onUpdate }) => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, SetLoading] = useState(false);

  const [modalData, setModalData] = useState({
    id: "",
    airlinename: "",
    countryname: "",
    amount: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setModalData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  const handleSave = async (val) => {
    try {SetLoading(true);
      const response = await post(
        createOrUpdateAirlinePrice,
        {
          airline_id: val.airline_id,
          country_id: val.country_id,
          price: modalData.amount,
          status: modalData.status,
        },
        true
      );
      const data = await response.json();SetLoading(false);
      onUpdate({
        ...data.data,
      });

      setShowEditModal(false);
      if (data.status == false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      setShowEditModal(false);

      toast.error("An error occurred");
    }
  };
  const handleShowEdit = () => {
    setModalData({
      id: data.id,
      airlinename: data.airlineDetails.name,
      amount: data.price,
      status: data.status,
      countryname: data.countryDetails.country_name,
    });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => setShowEditModal(false);

  return (
    <tr>
      <td className="text-center">{data.id || "N/A"}</td>
      <td className="text-center">{data.airlineDetails.name || "N/A"}</td>
      <td className="text-center">
        {data.countryDetails.country_name || "N/A"}
      </td>
      <td className="text-center">{data.price || "N/A"}</td>
      <td className="text-center">{data.status || "N/A"}</td>

      <td>
        <div className="d-flex justify-content-center gap-2">
          <Button variant="outline-danger" size="sm" onClick={handleShowEdit}>
            <i className="tio-edit"></i>
          </Button>
          <Modal show={showEditModal} onHide={handleCloseEdit}>
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>Update AirlinePrice</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="airline_id">
                  <Form.Label>Airline Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="airline_id"
                    value={modalData.airlinename}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="country_id">
                  <Form.Label>Country Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="country_id"
                    value={modalData.countryname}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="Amount">
                  <Form.Label>Amount:</Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    value={modalData.amount}
                    onChange={(e) =>
                      setModalData({ ...modalData, amount: e.target.value })
                    }
                  />
                </Form.Group>
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
                    <option value="Active">Active</option>
                    <option value="Deactive">Deactive</option>
                  </Form.Control>
                  <Form.Control
                    type="hidden"
                    value={modalData.id}
                    onChange={(e) =>
                      setModalData({ ...modalData, id: e.target.value })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            {loading?<CircularProgressBar/>: <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEdit}>
                Close
              </Button>
              <Button variant="primary" onClick={() => handleSave(data)}>
                Save
              </Button>
            </Modal.Footer>}
          </Modal>
        </div>
      </td>
    </tr>
  );
};
export default AirlineList;

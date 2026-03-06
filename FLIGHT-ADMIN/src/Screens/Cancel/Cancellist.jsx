import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancle_booking_update, IMAGE_BASE_URL } from "../../API/endpoints";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { post } from "../../API/apiHelper";
import Default from "../../Assets/Images/user.webp";

const Cancellist = ({ data, onUpdate }) => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const [modalData, setModalData] = useState({
    id: "",
    user_id: "",
    amount: "",
    status: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setModalData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await post(cancle_booking_update, modalData, true);
      const data = await response.json();

      setShowEditModal(false);
      if (data.status == false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      onUpdate();
    } catch (error) {
      setShowEditModal(false);

      toast.error("An error occurred");
    }

  };


  const handleShowEdit = () => {
    setModalData({
      id: data.id,
      user_id: data.cancelsusers.id,
      status: data.status,
      type: data.type,
    });
    setShowEditModal(true);
  };


  const handleCloseEdit = () => setShowEditModal(false);

  return (
    <tr>
      <td className="text-center">{data.id || "N/A"}</td>
      <td className="text-center">{data.cancelsusers.name || "N/A"}</td>
      <td className="text-center">₹{data.amount || "N/A"}</td>
      <td className="text-center">{data.Booking_RefNo || "N/A"}</td>
      <td className="text-center">{data.type || "N/A"}</td>
      <td className="text-center">{data.status || "N/A"}</td>

      <td>
        <div className="d-flex justify-content-center gap-2">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => {
              if (data.status === "Refund complete") {
                alert("This action is not allowed for completed refunds.");
              } else {
                handleShowEdit();
              }
            }}
          >
            <i className="tio-edit"></i>
          </Button>
          <Modal show={showEditModal} onHide={handleCloseEdit} size="xl"      >
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>Update Cancel Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formCategorySelect">
                  <Form.Label>Select Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={modalData.status}
                    name="status"
                    onChange={handleChange}
                  >
                    <option value="">Choose Status...</option>
                    <option value="Refund process">Refund process ...</option>
                    <option value="Refund complete">Refund complete...</option>

                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formCategoryName">
                  <Form.Label>Refund Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    id="amount"
                    placeholder="Enter Refund Amount"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="formCategorySelect">
                  <Form.Label>Select Refund Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="type"
                    value={modalData.type}
                    onChange={handleChange}
                  >
                    <option value="">Choose Status...</option>
                    <option value="Wallet">Wallet ...</option>
                    <option value="Online">Online ...</option>
                  </Form.Control>
                </Form.Group>




              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEdit}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </td>
    </tr>
  );
};

export default Cancellist;


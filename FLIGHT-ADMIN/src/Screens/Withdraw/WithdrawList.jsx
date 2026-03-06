import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { withdrawupdate, IMAGE_BASE_URL } from "../../API/endpoints";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { post } from "../../API/apiHelper";

import Default from "../../Assets/Images/user.webp";
const AirlineList = ({ data, onUpdate }) => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const [modalData, setModalData] = useState({
    id: "",
    name: "",
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
  const handleSave = async () => {
    try {
      const response = await post(withdrawupdate, modalData, true);
      const data = await response.json();
 onUpdate({
   ...data.data,
 });
      //  onUpdate(
      //    type == "allow_for_visa"
      //      ? {
      //          ...data,
      //          id: dataval.id,
      //          allow_for_visa: dataval.allow_for_visa === "Yes" ? "No" : "Yes",
      //          type: type,
      //        }
      //      : {
      //          ...dataval,
      //          id: dataval.id,
      //          allow_for_otb: dataval.allow_for_otb === "Yes" ? "No" : "Yes",
      //          type: type,
      //        }
      //  );
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
      name: data.wusers.name,
      amount: data.amount,
      status: data.status,
    });
    setShowEditModal(true);
  };


  const handleCloseEdit = () => setShowEditModal(false);

  return (
    <tr>
      <td className="text-center">{data.id || "N/A"}</td>
      <td className="text-center">{data.wusers.name || "N/A"}</td>
      <td className="text-center">{data.amount || "N/A"}</td>
      <td className="text-center">{data.status || "N/A"}</td>
      <td className="text-center">{data.type || "N/A"}</td>

      <td>
        <div className="d-flex justify-content-center gap-2">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleShowEdit}
            disabled={data.status !== "Pending"}
          >
            <i className="tio-edit"></i>
          </Button>
          <Modal show={showEditModal} onHide={handleCloseEdit}>
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>Update Withdraw Status</Modal.Title>
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
                    <option value="Reject">Reject</option>
                    <option value="Complete">Complete</option>
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
export default AirlineList;

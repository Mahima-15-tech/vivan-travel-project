import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { airlineaddupdate, IMAGE_BASE_URL } from "../../API/endpoints";
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
    name: "",
    code: "",
    airline_logo: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setModalData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  const handleSave = async (dataval, type) => {
    try {SetLoading(true);
      const response = await post(airlineaddupdate, modalData, true);
      const data = await response.json();
 onUpdate({
   ...data.data
 });
 SetLoading(false);
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
      name: data.name,
      code: data.code,
      airline_logo: null,
    });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => setShowEditModal(false);

  return (
    <tr>
      <td className="text-center">{data.id || "N/A"}</td>
      <td className="text-center">{data.name || "N/A"}</td>
      <td className="text-center">{data.code || "N/A"}</td>

      <td className="text-center">
        <img
          src={data.logo ? `${IMAGE_BASE_URL}${data.logo}` : Default}
          className="avatar rounded-circle"
          alt=""
          width="40"
        />
      </td>
      <td>
        <div className="d-flex justify-content-center gap-2">
          <Button variant="danger" size="sm" onClick={handleShowEdit}>
            <i className="tio-edit"></i>
          </Button>

          <Modal show={showEditModal} onHide={handleCloseEdit}>
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>Update Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={modalData.name}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      name: e.target.value,
                    })
                  }
                ></Form.Control>

                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  value={modalData.code}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      code: e.target.value,
                    })
                  }
                ></Form.Control>

                <Form.Group controlId="logo">
                  <Form.Label>Upload Airline Logo</Form.Label>
                  <Form.Control
                    type="file"
                    name="airline_logo"
                    accept="image/"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Control
                  type="hidden"
                  value={modalData.id}
                  onChange={(e) =>
                    setModalData({ ...modalData, id: e.target.value })
                  }
                />
              </Form>
            </Modal.Body>
             {loading ? (
                <CircularProgressBar />
              ) : (<Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEdit}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </Modal.Footer>)}
          </Modal>
        </div>
      </td>
    </tr>
  );
};
export default AirlineList;

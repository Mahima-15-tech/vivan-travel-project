import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { country_update } from "../../API/endpoints";
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { post } from '../../API/apiHelper';
import CircularProgressBar from "../Component/Loading";


const List = ({ data,list, onUpdate }) => {
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [modalData, setModalData] = useState({
      status: "",
      id: "",
      country_code: "",
      alpha_2: "",
      alpha_3: "",
      let: "",
      lng: "",
      country_id:""
    });

    const handleShowEdit = () => {
        setModalData({
          status: data.status,
          id: data.id,
          country_code: data.country_code,
          alpha_2: data.alpha_2,
          alpha_3: data.alpha_3,
          let: data.let,
          lng: data.lng,
          country_id: data.country_id,
        });
        setShowEditModal(true);
    };

    const handleCloseEdit = () => setShowEditModal(false);

    const handleSave = async () => {
        try {setLoading(true);
            const response = await post(
              country_update,
              {
                status: modalData.status,
                id: modalData.id,
                country_code: modalData.country_code,
                alpha_2: modalData.alpha_2,
                alpha_3: modalData.alpha_3,
                let: modalData.let,
                lng: modalData.lng,
                country_id: modalData.country_id,
              },
              true
            );
            const data = await response.json();
            if (data.status == false) {
                toast.error(data.message);
            } else {
                toast.success(data.message);
            }setLoading(false);
            handleCloseEdit();
            onUpdate();

        } catch (error) {
            toast.error('An error occurred');
        }
    };

    return (
      <tr>
        <td className="text-center">{data.id || "N/A"}</td>
        <td className="text-center">{data.country_code || "N/A"}</td>
        <td className="text-center">
          {data.country_Details
            ? data.country_Details.country_name || "N/A"
            : "N/A"}
        </td>
        <td className="text-center">{data.alpha_2 || "N/A"}</td>
        <td className="text-center">{data.alpha_3 || "N/A"}</td>
        <td className="text-center">{data.let || "N/A"}</td>
        <td className="text-center">{data.lng || "N/A"}</td>
        <td>
          <div className="text-center">
            <div
              className={`badge ${
                data.status === "Active"
                  ? "badge-soft-success"
                  : "badge-soft-danger"
              }`}
            >
              {" "}
              {data.status}{" "}
            </div>
          </div>
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
                    value={modalData.country_code}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        country_code: e.target.value,
                      })
                    }
                  ></Form.Control>
                  <Form.Group controlId="country_id">
                    <Form.Label>Country Name:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.country_id}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          country_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Country</option>
                      {list.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.country_name}
                          {/* Replace `name` with the appropriate property name from your `countryData` */}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Label>SHORT NAME 1</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.alpha_2}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        alpha_2: e.target.value,
                      })
                    }
                  ></Form.Control>
                  <Form.Label>SHORT NAME 2</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.alpha_3}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        alpha_3: e.target.value,
                      })
                    }
                  ></Form.Control>
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.let}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        let: e.target.value,
                      })
                    }
                  ></Form.Control>
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.lng}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        lng: e.target.value,
                      })
                    }
                  ></Form.Control>
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
                      <option value="Deactive">Deactive</option>
                      <option value="Active">Active</option>
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
              {Loading?<CircularProgressBar />: <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEdit}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
              </Modal.Footer>}
            </Modal>
          </div>
        </td>
      </tr>
    );
};
export default List;

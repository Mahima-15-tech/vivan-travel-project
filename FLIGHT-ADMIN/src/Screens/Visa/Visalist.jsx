import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { update_visas } from "../../API/endpoints";
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { post } from '../../API/apiHelper';
import CircularProgressBar from "../Component/Loading";


const Visatable = ({ data, onUpdate }) => {
    const navigate = useNavigate();

    const handleViewClick = () => {
        const encodedData = btoa(data.id);
        navigate(`/Visadetails/${encodedData}`);
    };

    const [showEditModal, setShowEditModal] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [modalData, setModalData] = useState({ status: '', id: '' });

    const handleShowEdit = () => {
        setModalData({ status: data.status, id: data.id });
        setShowEditModal(true);
    };

    const handleCloseEdit = () => setShowEditModal(false);

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await post(
                update_visas,
                {
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
            }setLoading(false);
            handleCloseEdit();
            onUpdate();

        } catch (error) {
            toast.error('An error occurred');
        }
    };

    return (
      <tr>
        <td>{data.id}</td>
        <td>{data.going_from + " - " + data.going_to}</td>
        <td>{data.about || "N/A"}</td>
        <td>
          {data.description
            ? data.description.split(" ").slice(0, 5).join(" ") +
              (data.description.split(" ").length > 5 ? "..." : "")
            : "N/A"}
        </td>
        <td>{data.entry || "N/A"}</td>
        <td className="text-center">{data.validity || "N/A"}</td>
        <td className="text-center">{data.processing_time || "N/A"}</td>
        <td className="text-center">
          {data.going_to === "United Arab Emirates"
            ? `₹${data.child_amount || "N/A"}`
            : "Not Applicable"}
        </td>
        <td className="text-center">₹{data.amount || "N/A"}</td>
        <td className="text-center">{data.absconding_fees || "N/A"}</td>
        <td>
          <div className="text-center">
            <div
              className={`badge ${
                data.status === "Active"
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
            <button
              onClick={handleViewClick}
              className="btn btn-outline-info btn-sm square-btn delete"
            >
              <i className="tio-invisible"></i>
            </button>
            <Button variant="outline-danger" size="sm" onClick={handleShowEdit}>
              <i className="tio-edit"></i>
            </Button>
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
          </div>
        </td>
      </tr>
    );
};
export default Visatable;

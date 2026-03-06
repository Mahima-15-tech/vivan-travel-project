import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { put } from '../../../API/apiHelper';
import { support_update } from '../../../API/endpoints';
import { toast } from 'react-toastify';
import '../../../Assets/css/CloseButton.css';
import CircularProgressBar from "../../Component/Loading";

const SupportTableRow = ({ support, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalData, setModalData] = useState({ support_status: '', support_id: '' });
  const [loading, SetLoading] = useState(false);

  const handleShowEdit = () => {
    setModalData({ support_status: support.status, support_id: support.id });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => setShowEditModal(false);

  const handleSave = async () => {
    try {
SetLoading(true);
      await put(
        support_update,
        {
          status: modalData.support_status,
          id: modalData.support_id,
        },
        true
      );
SetLoading(false);
      toast.success('Update Successfully');
      handleCloseEdit();
      onUpdate(); // Call the onUpdate callback to refresh data
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <tr>
      <td className="text-center">{support.support_id}</td>
      <td className="text-center">{support.name || "-"}</td>
      <td className="text-center">
        <div className="mb-1">
          <strong> {support.email}</strong>
        </div>
        {support.mobile_no}
      </td>
      <td className="text-center">
        <div className="text-center">
          {support.description ? support.description : "Empty"}
        </div>
      </td>
      <td className="text-center">
        <div className="text-center">
          <div className="badge badge-soft-version">
            {support.status ? support.status : "N/A"}
          </div>
        </div>
      </td>
      <td>
        <div className="d-flex justify-content-center gap-2">
          <Button variant="outline-danger" size="sm" onClick={handleShowEdit}>
            <i className="tio-edit"></i>
          </Button>
          <Modal show={showEditModal} onHide={handleCloseEdit}>
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>Update Support Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="status">
                  <Form.Label>Status:</Form.Label>
                  <Form.Control
                    as="select"
                    value={modalData.support_status}
                    onChange={(e) =>
                      setModalData({ ...modalData, support_status: e.target.value })
                    }
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Process">In Process</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                  </Form.Control>
                  <Form.Control
                    type="hidden"
                    value={modalData.support_id}
                    onChange={(e) =>
                      setModalData({ ...modalData, support_id: e.target.value })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            {loading?<CircularProgressBar/>: <Modal.Footer>
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

export default SupportTableRow;

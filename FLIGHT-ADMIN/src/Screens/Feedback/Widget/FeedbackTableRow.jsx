import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { post } from "../../../API/apiHelper";
import { deleteFeedback } from "../../../API/endpoints";
import { toast } from 'react-toastify';
import '../../../Assets/css/CloseButton.css';
import CircularProgressBar from "../../Component/Loading";

const SupportTableRow = ({ support, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({ support_status: '', support_id: '' });

  const handleShowEdit = () => {
    setModalData({ support_status: support.status, support_id: support.id });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => setShowEditModal(false);

  const handleSave = async () => {
    try {
setLoading(true);
      await post(
        deleteFeedback,
        {
          id: support.id,
        },
        true
      );
      toast.success("Feedback delete successfully");
setLoading(false);
      handleCloseEdit();
      onUpdate(); // Call the onUpdate callback to refresh data
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <tr>
      <td className="text-center">{support.id}</td>
      <td className="text-center">{support.name || "-"}</td>

      <td className="text-center">
        <div className="text-center">
          {support.designation ? support.designation : "Empty"}
        </div>
      </td>
      <td className="text-center">
        <div className="text-center">
          {support.message ? support.message : "Empty"}
        </div>
      </td>

      <td>
        <div className="d-flex justify-content-center gap-2">
          <Button variant="outline-danger" size="sm" onClick={handleShowEdit}>
            <i className="tio-delete"></i>
          </Button>
          <Modal show={showEditModal} onHide={handleCloseEdit}>
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>Are You Sure Want to delete?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="status">
                  <Form.Control
                    type="hidden"
                    value={modalData.id}
                    onChange={(e) =>
                      setModalData({ ...modalData, id: e.target.value })
                    }
                  />
                </Form.Group>
              </Form>
              <div class="row justify-content-center">
                <div class="col-auto d-flex gap-3">
                  {Loading?<CircularProgressBar/>:<>
                  <Button
                    variant="secondary"
                    onClick={handleCloseEdit}
                    style={{ width: "150px" }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleSave}
                    style={{ width: "150px" }}
                  >
                    Delete
                  </Button></>}
                </div>{" "}
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </td>
    </tr>
  );
};

export default SupportTableRow;

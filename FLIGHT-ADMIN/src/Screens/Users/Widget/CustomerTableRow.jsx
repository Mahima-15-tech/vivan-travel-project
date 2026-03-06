import React , { useState } from "react";
import { useNavigate } from "react-router-dom";
import Default from "../../../Assets/Images/user.webp";
import { IMAGE_BASE_URL , update_user_status} from "../../../API/endpoints";
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { post } from '../../../API/apiHelper';
import CircularProgressBar from "../../Component/Loading";


const CustomerTableRow = ({ customer, index,onUpdate }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/users/${customer.id}`);
  };
  const Profile = customer.profile
    ? `${IMAGE_BASE_URL}${customer.profile}`
    : Default;

  const [showEditModal, setShowEditModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({ status: "", id: "" });

  const handleShowEdit = () => {
    setModalData({ status: customer.status, id: customer.id });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => setShowEditModal(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await post(
        update_user_status,
        {
          status: modalData.status,
          id: modalData.id,
        },
        true
      );
      toast.success("Update Successfully");
      setLoading(false);
      handleCloseEdit();
      onUpdate();
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <tr>
      <td>{index}</td>
      <td>
        <a
          href={customer.viewLink}
          className="title-color hover-c1 d-flex align-items-center gap-10"
        >
          <img
            src={Profile}
            className="avatar rounded-circle"
            alt=""
            width="40"
          />
          {customer.name || "-"}
        </a>
      </td>
      <td>
        <div className="mb-1">
          <strong>
            <a
              className="title-color hover-c1"
              href={`mailto:${customer.email}`}
            >
              {customer.email}
            </a>
          </strong>
        </div>
        <a className="title-color hover-c1" href={`tel:${customer.mobile_no}`}>
          {customer.mobile_no}
        </a>
      </td>

      <td>{customer.country || "N/A"}</td>

      <td>{customer.language || "N/A"}</td>

      <td>
        <div className="text-center">
          <div className="badge badge-soft-version">
            {customer.status === "1" ? "Active" : "Block"}
          </div>
        </div>
      </td>
      <td>
        <div className="d-flex justify-content-center gap-2">
          {/* <button onClick={handleViewClick} className="btn btn-outline-info btn-sm square-btn delete">
            <i className="tio-invisible"></i>
          </button> */}

          <Button variant="outline-danger" size="sm" onClick={handleShowEdit}>
            <i className="tio-edit"></i>
          </Button>
          <Modal show={showEditModal} onHide={handleCloseEdit}>
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>Update User Status</Modal.Title>
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
                    <option value="2">Block</option>
                    <option value="1">Active</option>
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

export default CustomerTableRow;

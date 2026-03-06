import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { post } from '../../API/apiHelper';
import { IMAGE_BASE_URL, update_oktbs } from "../../API/endpoints";
import Default from "../../Assets/Images/user.webp";
import CircularProgressBar from "../Component/Loading";


const Otbtable = ({ data, onUpdate }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    const encodedData = btoa(data.id);
    navigate(`/Otbdetails/${encodedData}`);
  };

  const Profile = data.applieduser.profile_photo ? `${IMAGE_BASE_URL}${data.applieduser.profile_photo}` : Default;
  const [showEditModal, setShowEditModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({ status: '', id: '', created_file: null, });

  const handleShowEdit = () => {
    setModalData({ status: data.working_status, id: data.id });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => setShowEditModal(false);
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setModalData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  const handleSave = async () => {
    try {
      const response = await post(update_oktbs, modalData, true);
      const data = await response.json();
      if (data.status == false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      handleCloseEdit();
      onUpdate();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <tr>
      <td className="text-center">{data.id}</td>
      <td className="text-center">
        <img
          src={Profile}
          className="avatar rounded-circle"
          alt=""
          width="40"
        />{" "}
        <br />
        {data.applieduser.name || "-"}
      </td>

      <td className="text-center">
        <div className="mb-1">
          <strong>
            <a
              className="title-color hover-c1"
              href={`mailto:${data.applieduser.email}`}
            >
              {data.applieduser.email}
            </a>
          </strong>
        </div>
        <a
          className="title-color hover-c1"
          href={`tel:${data.applieduser.mobile_no}`}
        >
          {data.applieduser.mobile_no}
        </a>
      </td>
      <td className="text-center">{data.country || "N/A"}</td>
      <td className="text-center">{data.name || "N/A"}</td>
      <td className="text-center">{data.pnr || "N/A"}</td>
      <td className="text-center">{data.dob || "N/A"}</td>
      <td className="text-center">{data.airlinedata.code || "N/A"}</td>
      <td className="text-center">₹{data.amount || "N/A"}</td>
      <td>
        <div className="text-center">
          <div
            className={`badge ${data.working_status === "Under review"
              ? "badge-soft-success"
              : "badge-soft-danger"
              }`}
          >
            {data.working_status}   
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
              <Modal.Title>Update OTB Status</Modal.Title>
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
                    <option value="In Process">In Process</option>
                    <option value="Additional Document Required">
                      Additional Document Required
                    </option>
                    <option value="On hold">On Hold</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Control>
                  <Form.Control
                    type="hidden"
                    value={modalData.id}
                    onChange={(e) =>
                      setModalData({ ...modalData, id: e.target.value })
                    }
                  />
                </Form.Group>
                {modalData.status === "Approved" && (
                  <Form.Group>
                    <Form.Label>Upload OTB</Form.Label>
                    <Form.Control
                      type="file"
                      name="created_file"
                      accept="application/pdf, image/*"
                      onChange={handleChange}
                    />
                  </Form.Group>
                )}
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
export default Otbtable;

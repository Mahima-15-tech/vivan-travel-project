import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Series_update_status } from "../../API/endpoints";
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { post } from '../../API/apiHelper';


const Series_ticketlist = ({ data, onUpdate }) => {
    const navigate = useNavigate();
    const handleViewClick = () => {
        const encodedData = btoa(data.booking_id);
        navigate(`/Series_TicketDetails/${encodedData}`);
    };

    const [showEditModal, setShowEditModal] = useState(false);
    const [modalData, setModalData] = useState({ status: '', id: '' });

    const handleShowEdit = () => {
        setModalData({ status: data.status, id: data.id });
        setShowEditModal(true);
    };

    const handleCloseEdit = () => setShowEditModal(false);
    const handleSave = async () => {
        try {
            const response = await post(
                Series_update_status,
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
            <td className="text-center">{data.series_bookings.name || "N/A"}</td>
            <td className="text-center">
                <div className="mb-1">
                    <strong>
                        <a
                            className="title-color hover-c1"
                            href={`mailto:${data.series_bookings.email}`}
                        >
                            {data.series_bookings.email}
                        </a>
                    </strong>
                </div>
                <a className="title-color hover-c1" href={`tel:${data.series_bookings.mobile_no}`}>
                    {data.series_bookings.mobile_no}
                </a>
            </td>
            <td className="text-center">{data.booking_id || "N/A"}</td>
            <td className="text-center">₹{data.Amount || "N/A"}</td>
            <td className="text-center">{data.paying_method || "N/A"}</td>
            <td>
                <div className="text-center">
                    <div
                        className={`badge badge-soft-success`}
                    >
                        {data.status}
                    </div>
                </div>
            </td>
            <td>
                <div className="d-flex justify-content-center gap-2">
                    <button onClick={handleViewClick} className="btn btn-outline-info btn-sm square-btn delete">
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
                                        <option value="cancelled completed">Cancelled completed</option>
                                        <option value="Ticket confirmed">Ticket confirmed</option>
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
export default Series_ticketlist;

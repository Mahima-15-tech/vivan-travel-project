import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { update_user_status, update_account, country_status_list } from "../../API/endpoints";
import { Modal, Button, Form, Dropdown, DropdownButton, Col, Row } from "react-bootstrap";
import { toast } from 'react-toastify';
import { post } from '../../API/apiHelper';
import { } from "react-bootstrap";
import Select from "react-select";
import CircularProgressBar from "../Component/Loading";


const Agentlist = ({ index, data, onUpdate, list }) => {

  const navigate = useNavigate();
  const handleViewClick = () => {
    const encodedData = btoa(data.id);
    navigate(`/AgentDetails/${encodedData}`);
  };


  const handleVisaCharges = () => {
    const encodedData = btoa(data.id);
    navigate(`/AgentVisaCharges/${encodedData}`);
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [BlockVisaLoading, setBlockVisaLoading] = useState(false);
  const [UpdateDataLoading, setUpdateDataLoading] = useState(false);
  const [modalData, setModalData] = useState({ status: '', id: '' });

  const handleShowEdit = () => {
    setModalData({ status: data.status, id: data.id });
    setShowEditModal(true);
  };

  const [Showcountry, setCountry] = useState(list);

  const [showEditvisacountryModal, setShowEditvisacountryModal] = useState(false);
  const [modalDatavisacountry, setModalDatavisacountry] = useState({
    visa: [],
    id: "",
  });
  const [selectedOptions, setSelectedOptions] = useState(
    Showcountry.filter((country) =>
      (data.agents.block_visa_country || "")
        .split(",") // Split the string into an array
        .map((id) => id.trim()) // Trim any spaces
        .includes(country.country_id.toString())
    )
  );
  const handleShowEditvisacountry = () => {

    setModalDatavisacountry({
      visa: (data.agents.block_visa_country || "").split(","),
      id: data.id,
    });
    setShowEditvisacountryModal(true);
  };
  const handleCloseEdit = () => setShowEditModal(false);

  const handleSave = async () => {
    try {
      setUpdateDataLoading(true);
      const response = await post(
        update_user_status,
        {
          status: modalData.status,
          id: modalData.id,
        },
        true
      );
      const data = await response.json();
      if (data.status === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      setUpdateDataLoading(false);
      handleCloseEdit();
      onUpdate();

    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const closemodel = async () => { handleCloseEdit(); onUpdate(); }
  const handleSave_block_visa_country = async () => {
    try {
      setBlockVisaLoading(true);
      const countryIds = selectedOptions.map((country) => country.country_id)
        .join(",");

      const response = await post(
        update_account,
        {
          data: JSON.stringify({
            block_visa_country: countryIds,
          }),
          id: modalDatavisacountry.id,
        },
        true
      );
      const data = await response.json();
      if (data.status === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      } setBlockVisaLoading(false);
      handleCloseEdit();
      onUpdate();
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
  };


  return (
    <tr>
      <td className="text-center">{index}</td>
      <td className="text-center">{data.name || "N/A"}</td>

      <td className="text-center">
        <div className="mb-1">
          <strong>
            <a className="title-color hover-c1" href={`mailto:${data.email}`}>
              {data.email}
            </a>
          </strong>
        </div>
        <a className="title-color hover-c1" href={`tel:${data.mobile_no}`}>
          {data.mobile_no}
        </a>
      </td>

      <td className="text-center">{data.agents.company_name || "N/A"}</td>
      <td className="text-center">{data.agents.type_of_Ownership || "N/A"}</td>
      <td className="text-center">{data.agents.pan_no || "N/A"}</td>
      <td className="text-center" onClick={handleShowEditvisacountry}>
        {data.agents.block_visa_country == null ||
          data.agents.block_visa_country === ""
          ? "N/A"
          : Showcountry.filter(
            (country) =>
              (data.agents.block_visa_country || "")
                .split(",") // Split the string into an array
                .map((id) => id.trim()) // Trim any spaces
                .includes(country.country_id.toString()) // Ensure exact match
          )
            .map((country) => country.value)
            .slice(0, 4) // Take only the first 4 items
            .join(", ") +
          (Showcountry.filter((country) =>
            (data.agents.block_visa_country || "")
              .split(",")
              .map((id) => id.trim())
              .includes(country.country_id.toString())
          ).length > 4
            ? "..."
            : "")}

        <Modal show={showEditvisacountryModal} onHide={closemodel} size="xl">
          <Modal.Header closeButton className="customModalHeader">
            <Modal.Title>Block Visa Country</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* <Row>
                <Col md={6}>
                  <Form.Group controlId="status">
                    <Form.Group className="px-3">
                      {Showcountry.map((data, index) => (
                        <Form.Check
                          type="checkbox"
                          label={data.country_name}
                          value={data.id}
                          // checked={modalDatavisacountry.visa.includes(data.id)}
                          onChange={() => handleCheckboxChange(data.id)}
                        />
                      ))}
                    </Form.Group>
                    <Form.Control
                      type="hidden"
                      value={modalDatavisacountry.id}
                      onChange={(e) =>
                        setModalData({
                          ...modalDatavisacountry,
                          id: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row> */}

              <Select
                options={Showcountry}
                name="going_from"
                id="going_from"
                value={selectedOptions}
                className="form-control with-icon"
                classNamePrefix="react-select"
                placeholder="Citizen of"
                isSearchable
                isMulti
                required
                onChange={(e) => {
                  setSelectedOptions(e);
                  console.log(e);
                }}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    paddingLeft: "1.6rem",
                  }),
                }}
              />
            </Form>
          </Modal.Body>
          {BlockVisaLoading ? (
            <CircularProgressBar />
          ) : (
            <Modal.Footer>
              <Button variant="secondary" onClick={closemodel}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave_block_visa_country}>
                Save
              </Button>
            </Modal.Footer>
          )}
        </Modal>
      </td>

      {/* <td className="text-center">%{data.agents.flight_booking_c || "N/A"}</td>
      <td className="text-center">
        {data.agents.series_flight_booking_c || "N/A"}
      </td> */}
      <td className="text-center">₹{data.agents.visa_booking_c || "N/A"}</td>
      <td className="text-center">
        ₹{data.agents.visa_booking_child_c || "N/A"}
      </td>
      <td className="text-center">₹{data.agents.otb_booking_c || "N/A"}</td>

      <td>
        <div className="text-center">
          <div
            className={`badge ${data.status === "1" ? "badge-soft-success" : "badge-soft-danger"
              }`}
          >
            {data.status === "1" ? "Active" : "Block"}
          </div>
        </div>
      </td>

      <td className="text-center">
        <div className="text-center">
          <button
            onClick={handleVisaCharges}
            className="btn btn-info btn-sm delete"
          >
            <i className="tio-invisible"></i>
          </button>
        </div>
      </td>




      <td className="text-center">
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
                    <option value="2">Deactive</option>
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
            {UpdateDataLoading ? (
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

      {/* <td className="text-center">
          <button
            onClick=""
            className="btn btn-outline-info btn-sm square-btn delete"
          >
            <i className="tio-add-square"></i>
          </button>
        </td> */}
    </tr>
  );
};
export default Agentlist;

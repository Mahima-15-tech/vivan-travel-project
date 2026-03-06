import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { post } from "../../API/apiHelper";
import CircularProgressBar from "../Component/Loading";
import {
  agent_details,
  visa_agent_charge,
  visalist,
  visa_agent_charge_add,
} from "../../API/endpoints";
import adsettings from "../../Assets/Images/settings.png";
import {
  Form,
  Modal,
  FormControl,
  FormLabel,
  Button,
  Card,
  Col,
  Row,
  Image,
} from "react-bootstrap";
import "../Visa/VisaDetails.css";

function VisaCharges() {
  const navigate = useNavigate();
  const { id } = useParams();
  const agentid = atob(id);

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    mobile_no: "",
    email: "",
    gender: "",
    dob: "",
    company_name: "",
    type_of_Ownership: "",
    gst_no: "",
    office_Address: "",
    country: "",
    state: "",
    city_district: "",
    alt_mobile_number_1: "",
    alt_mobile_number_2: "",
    pan_no: "",
    proof_type: "",
    pincode: "",
    website: "",
    flight_booking_c: "",
    series_flight_booking_c: "",
    visa_booking_c: "",
    visa_booking_child_c: "",
    otb_booking_c: "",
    flightApiCharges: {},
    wallet: "",
  });
  const [visaChargesArray, setVisaChargesArray] = useState([]);
  const [VisalistArray, setVisalist] = useState([]);
  const [showApplyChargesModal, setShowApplyChargesModal] = useState(false);
  const [showUpdateChargesModal, setShowUpdateChargesModal] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");
  const [childchargeAmount, setchildChargeAmount] = useState("");
  const [selectedChargeId, setSelectedChargeId] = useState(null);

  const fetchSettingsData = async () => {
    setLoading(true);
    try {
      const res = await post(agent_details, { id: agentid }, true);
      const response = await res.json();
      const data = response.data;

      setFormData({
        name: data.name || "",
        mobile_no: data.mobile_no || "",
        email: data.email || "",
        gender: data.gender || "",
        dob: data.dob || "",
        wallet: data.wallet || "",
        company_name: data.agents.company_name || "",
        type_of_Ownership: data.agents.type_of_Ownership || "",
        gst_no: data.agents.gst_no || "",
        office_Address: data.agents.office_Address || "",
        country: data.country || "",
        state: data.agents.state || "",
        city_district: data.agents.city_district || "",
        alt_mobile_number_1: data.agents.alt_mobile_number_1 || "",
        alt_mobile_number_2: data.agents.alt_mobile_number_2 || "",
        pan_no: data.agents.pan_no || "",
        proof_type: data.agents.proof_type || "",
        pincode: data.agents.pincode || "",
        website: data.agents.website || "",
        flight_booking_c: data.agents.flight_booking_c || "",
        series_flight_booking_c: data.agents.series_flight_booking_c || "",
        visa_booking_c: data.agents.visa_booking_c || "",
        visa_booking_child_c: data.agents.visa_booking_child_c || "",
        otb_booking_c: data.agents.otb_booking_c || "",
        flightApiCharges: data.agents.flight_charges
          ? JSON.parse(data.agents.flight_charges)
          : {},
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyVisaCharges = async () => {
    if (!selectedVisa || !chargeAmount) {
      toast.warning("Please select visa and enter amount");
      return;
    }

    try {
      const payload = {
        visa_id: selectedVisa,
        agent_id: agentid,
        charge: chargeAmount,
        child_amount: childchargeAmount,
      };
      const res = await post(visa_agent_charge_add, payload, true);
      const response = await res.json();

      if (response.status) {
        toast.success("Visa charge applied successfully!");
        fetchChargesData();
        setShowApplyChargesModal(false);
        setSelectedVisa("");
        setChargeAmount("");
        setchildChargeAmount("");
      } else {
        // toast.errorInstall React and dependencies using a CDN response.message || "Failed to apply visa charge");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleUpdateVisaCharges = async () => {
    if (!selectedVisa || !chargeAmount || !selectedChargeId) {
      toast.warning("Please select visa and enter amount");
      return;
    }

    try {
      const payload = {
        id: selectedChargeId,
        visa_id: selectedVisa,
        agent_id: agentid,
        charge: chargeAmount,
        child_amount: childchargeAmount,
      };
      const res = await post(visa_agent_charge_add, payload, true);
      const response = await res.json();

      if (response.status) {
        toast.success("Visa charge updated successfully!");
        fetchChargesData();
        setShowUpdateChargesModal(false);
        setSelectedVisa("");
        setChargeAmount("");
        setchildChargeAmount("");
        setSelectedChargeId(null);
      } else {
        console.error(response.message);
        toast.error(response.message || "Failed to update visa charge");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleEditCharge = (charge) => {
    setSelectedChargeId(charge.id);
    setSelectedVisa(charge.visa_id);
    setChargeAmount(charge.price || "");
    setchildChargeAmount(charge.child_price || "");
    setShowUpdateChargesModal(true);
  };

  const fetchChargesData = async () => {
    setLoading(true);
    try {
      const res = await post(visa_agent_charge, { agent_id: agentid }, true);
      const response = await res.json();
      const data = response.data;
      setVisaChargesArray(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetch_visaList = async () => {
    setLoading(true);
    try {
      const response = await post(
        visalist,
        { page: 1, limit: 2000000000 },
        true
      );
      const data = await response.json();
      setVisalist(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsData();
    fetchChargesData();
    fetch_visaList();
  }, []);

  return (
    <main id="content" role="main" className="main pointer-event">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {loading ? (
        <div className="text-center my-5">
          <CircularProgressBar />
        </div>
      ) : (
        <div className="content container-fluid visadetails-page">
          <Card className="p-4 shadow">
            <h4 className="mb-4">Agent Details</h4>
            <hr />
            <Row>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Name:</strong> {formData.name ? formData.name : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Mobile No:</strong>{" "}
                  {formData.mobile_no ? formData.mobile_no : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Email:</strong>{" "}
                  {formData.email ? formData.email : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Gender:</strong>{" "}
                  {formData.gender ? formData.gender : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {formData.dob ? formData.dob : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Wallet:</strong> ₹
                  {formData.wallet ? formData.wallet : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Pan No:</strong>{" "}
                  {formData.pan_no ? formData.pan_no : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Proof Type: </strong>{" "}
                  {formData.proof_type ? formData.proof_type : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Company Name:</strong>{" "}
                  {formData.company_name ? formData.company_name : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Type of Ownership: </strong>{" "}
                  {formData.type_of_Ownership
                    ? formData.type_of_Ownership
                    : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>GST No:</strong>{" "}
                  {formData.gst_no ? formData.gst_no : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Office Address:</strong>{" "}
                  {formData.office_Address ? formData.office_Address : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Country:</strong>{" "}
                  {formData.country ? formData.country : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>State:</strong>{" "}
                  {formData.state ? formData.state : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>City/District: </strong>{" "}
                  {formData.city_district ? formData.city_district : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Pincode: </strong>{" "}
                  {formData.pincode ? formData.pincode : "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <p>
                  <strong>Website: </strong>{" "}
                  {formData.website ? formData.website : "N/A"}
                </p>
              </Col>
            </Row>
          </Card>

          <div className="mt-5">
            <Button
              variant="primary"
              className="mb-3"
              onClick={() => setShowApplyChargesModal(true)}
            >
              Apply Visa Charges
            </Button>
          </div>

          <Card className="p-4 shadow mt-4">
            <h4 className="mb-4">Applied Charges </h4>
            <hr />
            {visaChargesArray.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center">Sr No</th>
                      <th className="text-center">From</th>
                      <th className="text-center">To</th>
                      <th className="text-center">Description</th>
                      <th className="text-center">Entry</th>
                      <th className="text-center">Validity</th>
                      <th className="text-center">Duration</th>
                      <th className="text-center">Documents</th>
                      <th className="text-center">Processing Time</th>
                      <th className="text-center">Amount</th>
                      <th className="text-center">Child Amount</th>
                      <th className="text-center">Absconding Fees</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Applied Agent Charges</th>
                      <th className="text-center">Child Charges</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visaChargesArray.map((item, index) => (
                      <tr key={item.id}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">
                          {item.visa_agent_charges?.going_from
                            ? item.visa_agent_charges.going_from
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          {item.visa_agent_charges?.going_to
                            ? item.visa_agent_charges.going_to
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          {item.visa_agent_charges?.description
                            ? item.visa_agent_charges.description
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          {item.visa_agent_charges?.entry
                            ? item.visa_agent_charges.entry
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          {item.visa_agent_charges?.validity
                            ? item.visa_agent_charges.validity
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          {item.visa_agent_charges?.duration
                            ? item.visa_agent_charges.duration
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          {item.visa_agent_charges?.documents
                            ? item.visa_agent_charges.documents
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          {item.visa_agent_charges?.processing_time
                            ? item.visa_agent_charges.processing_time
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          ₹
                          {item.visa_agent_charges?.amount
                            ? item.visa_agent_charges.amount
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          ₹
                          {item.visa_agent_charges?.child_amount
                            ? item.visa_agent_charges.child_amount
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          {item.visa_agent_charges?.absconding_fees
                            ? item.visa_agent_charges.absconding_fees
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          {item.visa_agent_charges?.status
                            ? item.visa_agent_charges.status
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          ₹{item.price ? item.price : "N/A"}
                        </td>
                        <td className="text-center">
                          ₹{item.child_price ? item.child_price : "N/A"}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEditCharge(item)}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No charges found.</p>
            )}
          </Card>

          <Modal
            show={showApplyChargesModal}
            onHide={() => setShowApplyChargesModal(false)}
            size="lg"
          >
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>
                Apply Visa Charges For Agent{" "}
                {formData.name ? formData.name : "N/A"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Select Visa</Form.Label>
                  <Form.Select
                    className="form-control"
                    value={selectedVisa}
                    onChange={(e) => setSelectedVisa(e.target.value)}
                  >
                    <option value="">-- Select Visa --</option>
                    {VisalistArray.map((item) => (
                      <option key={item?.id} value={item?.id}>
                        {(item?.going_from ? item.going_from : "N/A") +
                          " → " +
                          (item?.going_to ? item.going_to : "N/A") +
                          " (" +
                          (item?.about ? item.about : "N/A") +
                          ")"}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Enter Charge Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(e.target.value)}
                  />
                </Form.Group>

                {(() => {
                  const selectedVisaObj = VisalistArray.find(
                    (item) =>
                      item.id === selectedVisa ||
                      item.id === parseInt(selectedVisa)
                  );
                  if (selectedVisaObj?.going_to === "United Arab Emirates") {
                    return (
                      <Form.Group className="mb-3">
                        <Form.Label>Child Amount</Form.Label>
                        <Form.Control
                          type="number"
                          name="child_amount"
                          placeholder="Enter Child amount"
                          required
                          value={childchargeAmount}
                          onChange={(e) => setchildChargeAmount(e.target.value)}
                        />
                      </Form.Group>
                    );
                  }
                  return null;
                })()}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowApplyChargesModal(false)}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleApplyVisaCharges}>
                Apply
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showUpdateChargesModal}
            onHide={() => setShowUpdateChargesModal(false)}
            size="lg"
          >
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>
                Update Visa Charges For Agent{" "}
                {formData.name ? formData.name : "N/A"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Select Visa</Form.Label>
                  <Form.Select
                    className="form-control"
                    value={selectedVisa}
                    onChange={(e) => setSelectedVisa(e.target.value)}
                  >
                    <option value="">-- Select Visa --</option>
                    {VisalistArray.map((item) => (
                      <option key={item?.id} value={item?.id}>
                        {(item?.going_from ? item.going_from : "N/A") +
                          " → " +
                          (item?.going_to ? item.going_to : "N/A") +
                          " (" +
                          (item?.about ? item.about : "N/A") +
                          ")"}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Enter Charge Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(e.target.value)}
                  />
                </Form.Group>

                {(() => {
                  const selectedVisaObj = VisalistArray.find(
                    (item) =>
                      item.id === selectedVisa ||
                      item.id === parseInt(selectedVisa)
                  );
                  if (selectedVisaObj?.going_to === "United Arab Emirates") {
                    return (
                      <Form.Group className="mb-3">
                        <Form.Label>Child Amount</Form.Label>
                        <Form.Control
                          type="number"
                          name="child_amount"
                          placeholder="Enter Child amount"
                          required
                          value={childchargeAmount}
                          onChange={(e) => setchildChargeAmount(e.target.value)}
                        />
                      </Form.Group>
                    );
                  }
                  return null;
                })()}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowUpdateChargesModal(false)}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleUpdateVisaCharges}>
                Update
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </main>
  );
}

export default VisaCharges;

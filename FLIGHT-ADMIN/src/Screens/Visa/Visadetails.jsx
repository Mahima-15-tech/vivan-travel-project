import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { post } from "../../API/apiHelper";
import CircularProgressBar from "../Component/Loading";
import { visa_add, visa_details } from "../../API/endpoints";
import adsettings from "../../Assets/Images/settings.png";
import { Form, FormGroup, FormControl, FormLabel, Button, Card, Col, Row } from "react-bootstrap";
import "./VisaDetails.css";

function Visadetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const visaid = atob(id);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
      going_from: "",
      going_to: "",
      description: "",
      about: "",
      spec: "",
      entry: "",
      validity: "",
      duration: "",
      documents: "",
      processing_time: "",
      amount: "",
      child_amount: "",
      absconding_fees: "",
    });


    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            formData.id = visaid;
            const response = await post(visa_add, formData, true);
            const data = await response.json();
            if (data.status == false) {
                toast.error(data.message);
            } else {
                toast.success(data.message);
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            toast.error("Failed to update settings");
        } finally {
            setLoading(false);
        }
    };


    const fetchSettingsData = async () => {
        setLoading(true);
        try {
            const res = await post(visa_details, { id: visaid }, true);
            const response = await res.json();
            const data = response.data;
            setFormData({
                going_from: data.going_from || "",
                going_to: data.going_to || "",
                description: data.description || "",
                about: data.about || "",
                spec: data.spec || "",
                entry: data.entry || "",
                validity: data.validity || "",
                duration: data.duration || "",
                documents: data.documents || "",
                processing_time: data.processing_time || "",
                amount: data.amount || "",
                child_amount: data.child_amount || "0",
                absconding_fees: data.absconding_fees || "",
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettingsData();
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

        <div className="content container-fluid visadetails-page">
          <Card className="mb-5 visa-details-card">
            <div className="border-bottom px-4 py-3 card-header-section">
              <h5 className="mb-0 text-capitalize d-flex align-items-center gap-2 text-white">
                <img width="20" src={adsettings} alt="settings icon" />
                Visa Details
              </h5>
            </div>
            <div className="card-body">
              {loading ? (
                <CircularProgressBar />
              ) : (
                // Editable form when in edit mode
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <FormLabel>Going From</FormLabel>
                        <FormControl
                          type="text"
                          name="going_from"
                          value={formData.going_from}
                          onChange={handleChange}
                          disabled
                          placeholder="Enter origin"
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <FormLabel>Going To</FormLabel>
                        <FormControl
                          type="text"
                          name="going_to"
                          value={formData.going_to}
                          onChange={handleChange}
                          disabled
                          placeholder="Enter destination"
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <FormLabel>Description</FormLabel>
                        <FormControl
                          as="textarea"
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Enter a detailed description" // Optional placeholder
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <FormLabel>About</FormLabel>
                        <FormControl
                          type="text"
                          name="about"
                          value={formData.about}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <FormLabel>Entry</FormLabel>
                        <FormControl
                          type="text"
                          name="entry"
                          value={formData.entry}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <FormLabel>Validity</FormLabel>
                        <FormControl
                          type="text"
                          name="validity"
                          value={formData.validity}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <FormLabel>Duration</FormLabel>
                        <FormControl
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <FormLabel>
                          Documents{" "}
                          <span style={{ color: "red" }}>
                            ( Submit with `-` )
                          </span>
                        </FormLabel>
                        <FormControl
                          type="text"
                          name="documents"
                          value={formData.documents}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <FormLabel>Processing Time</FormLabel>
                        <FormControl
                          type="text"
                          name="processing_time"
                          value={formData.processing_time}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <FormLabel>Amount</FormLabel>
                        <FormControl
                          type="text"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    {formData.going_to === "United Arab Emirates" && (
                      <Col md={6} className="mb-3">
                        <FormGroup>
                          <FormLabel>Child Amount</FormLabel>
                          <FormControl
                            type="text"
                            name="child_amount"
                            value={formData.child_amount}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    )}

                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <FormLabel>Absconding Fees</FormLabel>
                        <FormControl
                          type="text"
                          name="absconding_fees"
                          value={formData.absconding_fees}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="button-group">
                    <Button type="submit" className="mt-3 save-btn">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      className="mt-3 ml-2 save-btn"
                      onClick={() => navigate(-1)}
                    >
                      Go Back
                    </Button>
                  </div>
                </Form>
              )}
            </div>
          </Card>
        </div>
      </main>
    );
}

export default Visadetails;

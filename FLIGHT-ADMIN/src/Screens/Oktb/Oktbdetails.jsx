import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { post } from "../../API/apiHelper";
import CircularProgressBar from "../Component/Loading";
import { oktb_details, IMAGE_BASE_URL } from "../../API/endpoints";
import adsettings from "../../Assets/Images/travel-agent.png";
import { Form, FormGroup, FormControl, FormLabel, Button, Card, Col, Row } from "react-bootstrap";

function Oktbdetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const visaid = atob(id);
  const [loading, setLoading] = useState(true);
  const [otb_data, setData] = useState([]);

  const fetchSettingsData = async () => {
    setLoading(true);
    try {
      const res = await post(oktb_details, { id: visaid }, true);
      const response = await res.json();
      const data = response.data;

      console.log(data);
      setData(data)

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
      <div className="content container-fluid visadetails-page">
        <Card className="mb-5 visa-details-card">
          <div className="border-bottom px-4 py-3 card-header-section">
            <h5 className="mb-0 text-capitalize d-flex align-items-center gap-2 text-white">
              <img width="20" src={adsettings} alt="settings icon" />
              Applied OTB Details
            </h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center">
                <CircularProgressBar />
              </div>
            ) : (
              <Row>
                <Col md={6}>
                  <h6>Reference Number:</h6>
                  <p>{otb_data.refrense_no || "N/A"}</p>
                </Col>
                <Col md={6}>
                  <h6>Country:</h6>
                  <p>{otb_data.country || "N/A"}</p>
                </Col>
                <Col md={6}>
                  <h6>Name:</h6>
                  <p>{otb_data.name || "N/A"}</p>
                </Col>
                <Col md={6}>
                  <h6>PNR:</h6>
                  <p>{otb_data.pnr || "N/A"}</p>
                </Col>
                <Col md={6}>
                  <h6>Date of Birth:</h6>
                  <p>{otb_data.dob || "N/A"}</p>
                </Col>
                <Col md={6}>
                  <h6>Airlines:</h6>
                  <p>{otb_data.airlines || "N/A"}</p>
                </Col>
                <Col md={6}>
                  <h6>Amount:</h6>
                  <p>₹{otb_data.amount || "N/A"}</p>
                </Col>
                <Col md={6}>
                  <h6>Status:</h6>
                  <p>{otb_data.status || "N/A"}</p>
                </Col>
                <Col md={6}>
                  <h6>OTB Type:</h6>
                  <p>{otb_data.otb_type || "N/A"}</p>
                </Col>
                <Col md={6}>
                  <h6>Working Status:</h6>
                  <p>{otb_data.working_status || "N/A"}</p>
                </Col>
                <Col md={12} className="mt-3">
                  <h6>Passport Front Side:</h6>
                  {otb_data.passport_font_side ? (
                    <a
                      href={IMAGE_BASE_URL + otb_data.passport_font_side}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Passport Front
                    </a>
                  ) : (
                    <p>No file uploaded</p>
                  )}
                </Col>
                <Col md={12} className="mt-3">
                  <h6>Passport Back Side:</h6>
                  {otb_data.passport_back_side ? (
                    <a
                      href={IMAGE_BASE_URL + otb_data.passport_back_side}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Passport Back
                    </a>
                  ) : (
                    <p>No file uploaded</p>
                  )}
                </Col>
                <Col md={12} className="mt-3">
                  <h6>Visa:</h6>
                  {otb_data.visa ? (
                    <a
                      href={IMAGE_BASE_URL + otb_data.visa}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Visa
                    </a>
                  ) : (
                    <p>No file uploaded</p>
                  )}
                </Col>
                <Col md={12} className="mt-3">
                  <h6>From Ticket:</h6>
                  {otb_data.from_ticket ? (
                    <a
                      href={IMAGE_BASE_URL + otb_data.from_ticket}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download From Ticket
                    </a>
                  ) : (
                    <p>No file uploaded</p>
                  )}
                </Col>
                <Col md={12} className="mt-3">
                  <h6>To Ticket:</h6>
                  {otb_data.to_ticket ? (
                    <a
                      href={IMAGE_BASE_URL + otb_data.to_ticket}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download To Ticket
                    </a>
                  ) : (
                    <p>No file uploaded</p>
                  )}
                </Col>
                <Col md={12} className="mt-3">
                  <h6>Created File:</h6>
                  {otb_data.created_file ? (
                    <a
                      href={IMAGE_BASE_URL + otb_data.created_file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Created File
                    </a>
                  ) : (
                    <p>No file uploaded</p>
                  )}
                </Col>
              </Row>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}

export default Oktbdetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { post, get } from "../../API/apiHelper";
import CircularProgressBar from "../Component/Loading";
import { update_update_account, agent_details, IMAGE_BASE_URL, flight_apis } from "../../API/endpoints";
import adsettings from "../../Assets/Images/settings.png";
import { Form, FormGroup, FormControl, FormLabel, Button, Card, Col, Row, Image } from "react-bootstrap";
import "../Visa/VisaDetails.css";

function Visadetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const agentid = atob(id);
  const [loading, setLoading] = useState(true);
  const [flightApis, setFlightApis] = useState([]);

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

  const [ImageData, setImageData] = useState({
    gst_certificate_photo: null,
    Office_address_proof_photo: null,
    pan_no_photo: null,
    proof_photo_font: null,
    proof_photo_back: null,
  });

  const [previews, setPreviews] = useState({
    pan_no_photo_preview: null,
    gst_certificate_photo_preview: null,
    Office_address_proof_photo_preview: null,
    proof_photo_font_preview: null,
    proof_photo_back_preview: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setImageData({
      ...formData,
      [name]: file,
    });
    const previewUrl = URL.createObjectURL(file);
    setPreviews({
      ...previews,
      [`${name}_preview`]: previewUrl,
    });
  };

  const handleFlightApiChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      flightApiCharges: {
        ...prev.flightApiCharges,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form data:", formData);
    try {
      formData.id = agentid;
      const jsonData = JSON.stringify(formData);
      const response = await post(update_update_account, {
        id: agentid,
        data: jsonData,
        pan_no_photo_preview: ImageData.pan_no_photo_preview,
        gst_certificate_photo: ImageData.gst_certificate_photo,
        Office_address_proof_photo_preview: ImageData.Office_address_proof_photo_preview,
        proof_photo_font_preview: ImageData.proof_photo_font_preview,
        proof_photo_back_preview: ImageData.proof_photo_back_preview,
      }, true);

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

  const fetchFlightApi = async () => {
    setLoading(true);
    try {
      const res = await get(flight_apis);
      const response = await res.json();
      const data = response.data;
      setFlightApis(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettingsData = async () => {
    setLoading(true);
    try {
      const res = await post(agent_details, { id: agentid }, true);
      const response = await res.json();
      const data = response.data;

      setPreviews({
        ...previews,
        pan_no_photo_preview: IMAGE_BASE_URL + data.agents.pan_no_photo,
        gst_certificate_photo_preview: IMAGE_BASE_URL + data.agents.gst_certificate_photo,
        Office_address_proof_photo_preview: IMAGE_BASE_URL + data.agents.Office_address_proof_photo,
        proof_photo_font_preview: IMAGE_BASE_URL + data.agents.proof_photo_font,
        proof_photo_back_preview: IMAGE_BASE_URL + data.agents.proof_photo_back,

      });

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
          : {}
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsData();
    fetchFlightApi();
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
              Agent Details
            </h5>
          </div>
          <div className="card-body">
            {loading ? (
              <CircularProgressBar />
            ) : (
              // Editable form when in edit mode
              <Form onSubmit={handleSubmit}>
                <h4>Ownership Details :-</h4>
                <hr />
                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Name</FormLabel>
                      <FormControl
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter origin"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Mobile No</FormLabel>
                      <FormControl
                        type="number"
                        name="mobile_no"
                        value={formData.mobile_no}
                        onChange={handleChange}
                        placeholder="Enter destination"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Email</FormLabel>
                      <FormControl
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>gender</FormLabel>
                      <FormControl
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>DOB</FormLabel>
                      <FormControl
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <br />

                <h4>Company Details :-</h4>
                <hr />
                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Type Of Company</FormLabel>
                      <FormControl
                        type="text"
                        name="type_of_Ownership"
                        value={formData.type_of_Ownership}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Gst No.</FormLabel>
                      <FormControl
                        type="text"
                        name="gst_no"
                        value={formData.gst_no}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Gst Certificate Photo</FormLabel>
                      <FormControl
                        type="file"
                        name="gst_certificate_photo"
                        onChange={handleFileChange}
                      />
                      { }
                      {previews.gst_certificate_photo_preview !==
                        "https://api.vivantravels.com/public/null" ? (
                        <>
                          {previews.gst_certificate_photo_preview.endsWith(
                            ".pdf"
                          ) ? (
                            <a
                              href={previews.gst_certificate_photo_preview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary mt-2"
                            >
                              View GST Crtificate PDF
                            </a>
                          ) : (
                            <Image
                              src={previews.gst_certificate_photo_preview} // Show preview of the selected image
                              alt="Proof GST Crtificate Image Preview"
                              thumbnail
                              fluid
                              className="mt-2"
                              style={{ width: "200px", height: "100px" }}

                            />
                          )}
                        </>
                      ) : (
                        <span className="text-danger mt-2">
                          GST Certificate Not Uploaded
                        </span>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <br />
                <h4>Wallet Details :-</h4>
                <hr />
                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Wallet</FormLabel>
                      <FormControl
                        type="number"
                        name="wallet"
                        value={formData.wallet}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>


                <h4>Communication Details :-</h4>
                <hr />
                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Document Verification</FormLabel>
                      <FormControl
                        type="text"
                        name="proof_type"
                        value={formData.proof_type}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Verification Image font</FormLabel>
                      <FormControl
                        type="file"
                        name="proof_photo_font"
                        onChange={handleFileChange}
                      />
                      {previews.proof_photo_font_preview && (
                        <>
                          {previews.proof_photo_font_preview.endsWith(
                            ".pdf"
                          ) ? (
                            <a
                              href={previews.proof_photo_font_preview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary mt-2"
                            >
                              View Proof Photo Front PDF
                            </a>
                          ) : (
                            <Image
                              src={previews.proof_photo_font_preview} // Show preview of the selected image
                              alt="Proof Photo Front Image Preview"
                              thumbnail
                              fluid
                              className="mt-2"
                              style={{ width: "200px", height: "100px" }}
                            />
                          )}
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Verification Image 2</FormLabel>
                      <FormControl
                        type="file"
                        name="proof_photo_back"
                        onChange={handleFileChange}
                      />
                      {previews.proof_photo_back_preview && (
                        <>
                          {previews.proof_photo_back_preview.endsWith(
                            ".pdf"
                          ) ? (
                            <a
                              href={previews.proof_photo_back_preview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary mt-2"
                            >
                              View Proof Photo back PDF
                            </a>
                          ) : (
                            <Image
                              src={previews.proof_photo_back_preview} // Show preview of the selected image
                              alt="Proof Photo back Image Preview"
                              thumbnail
                              fluid
                              className="mt-2"
                              style={{ width: "200px", height: "100px" }}
                            />
                          )}
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Pen Number</FormLabel>
                      <FormControl
                        type="text"
                        name="pan_no"
                        value={formData.pan_no}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Pan Image</FormLabel>
                      <FormControl
                        type="file"
                        name="pan_no_photo"
                        onChange={handleFileChange}
                      />
                      {previews.pan_no_photo_preview && (
                        <>
                          {previews.pan_no_photo_preview.endsWith(".pdf") ? (
                            <a
                              href={previews.pan_no_photo_preview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary mt-2"
                            >
                              View Pan PDF
                            </a>
                          ) : (
                            <Image
                              src={previews.pan_no_photo_preview} // Show preview of the selected image
                              alt="Proof Pan Image Preview"
                              thumbnail
                              fluid
                              className="mt-2"
                              style={{ width: "200px", height: "100px" }}
                            />
                          )}
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Office Address</FormLabel>
                      <FormControl
                        type="text"
                        name="office_Address"
                        value={formData.office_Address}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Office Address Proof Photo</FormLabel>
                      <FormControl
                        type="file"
                        name="Office_address_proof_photo"
                        onChange={handleFileChange}
                      />
                      {previews.Office_address_proof_photo_preview && (
                        <>
                          {previews.Office_address_proof_photo_preview.endsWith(
                            ".pdf"
                          ) ? (
                            <a
                              href={
                                previews.Office_address_proof_photo_preview
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary mt-2"
                            >
                              View Office Address Proof PDF
                            </a>
                          ) : (
                            <Image
                              src={
                                previews.Office_address_proof_photo_preview
                              } // Show preview of the selected image
                              alt="Proof Office Address Proof Image Preview"
                              thumbnail
                              fluid
                              className="mt-2"
                              style={{ width: "200px", height: "100px" }}
                            />
                          )}
                        </>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl
                        type="number"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Country</FormLabel>
                      <FormControl
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>State</FormLabel>
                      <FormControl
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>City/district</FormLabel>
                      <FormControl
                        type="text"
                        name="city_district"
                        value={formData.city_district}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Alt Mobile No 1.</FormLabel>
                      <FormControl
                        type="number"
                        name="alt_mobile_number_1"
                        value={formData.alt_mobile_number_1}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Alt Mobile No 2.</FormLabel>
                      <FormControl
                        type="number"
                        name="alt_mobile_number_2"
                        value={formData.alt_mobile_number_2}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Website</FormLabel>
                      <FormControl
                        type="link"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  {/* <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Flight Commission (%)</FormLabel>
                      <FormControl
                        type="number"
                        name="flight_booking_c"
                        value={formData.flight_booking_c}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Series Flight charge</FormLabel>
                      <FormControl
                        type="number"
                        name="series_flight_booking_c"
                        value={formData.series_flight_booking_c}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col> */}
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Visa Commission</FormLabel>
                      <FormControl
                        type="number"
                        name="visa_booking_c"
                        value={formData.visa_booking_c}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Visa Child Price</FormLabel>
                      <FormControl
                        type="number"
                        name="visa_booking_child_c"
                        value={formData.visa_booking_child_c}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <FormLabel>Otb Commission</FormLabel>
                      <FormControl
                        type="number"
                        name="otb_booking_c"
                        value={formData.otb_booking_c}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>

                  {flightApis.map((flightApi) => (
                    <Col md={3} className="mb-3" key={flightApi.id}>
                      <FormGroup>
                        <FormLabel>{flightApi.name}</FormLabel>
                        <FormControl
                          type="number"
                          name={flightApi.id}
                          value={formData.flightApiCharges[flightApi.id] || ""}
                          onChange={handleFlightApiChange}
                          placeholder={`Enter ${flightApi.name} flight API charges`}
                        />
                      </FormGroup>
                    </Col>
                  ))}

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

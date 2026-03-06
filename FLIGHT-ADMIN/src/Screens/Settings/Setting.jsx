import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { get, post } from "../../API/apiHelper";
import { toast, ToastContainer } from "react-toastify";
import { settings, updateSettings, flight_apis } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import {
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
} from "react-bootstrap";
import supportimage from "../../Assets/Images/support.png";
import appsettings from "../../Assets/Images/phone-setup.png";
import adsettings from "../../Assets/Images/settings.png";

function Settings() {
  // const navigate = useNavigate();
  const [flightApis, setFlightApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    admin_name: "",
    admin_logo: null,
    firebase_file: null,
    // admin_version: "",
    par_page_limit: "",
    server_key: "",
    razorpay_key: "",
    razorpay_prod_key: "",
    // otp_length: "",
    //   password_length: "",
    app_name: "",
    app_logo: null,
    app_version: "",
    app_primary_color: "#000000",
    app_secondary_color: "#000000",
    app_other_color: "#000000",
    support_no: "",
    support_whatsapp_no: "",
    address: "",
    support_email: "",
    support_start_time: "",
    support_end_time: "",
    flight_agency_charge: "",
    visa_agency_charge: "",
    otb_agency_charge: "",
    etrav_api_uat_url: "",
    etrav_api_prod_url: "",
    airiq_api_uat_url: "",
    airiq_api_prod_url: "",
    aitool_url: "",
    aitool_username: "",
    aitool_password: "",
    razorpay_prod_on: 1,
    etrav_api_prod_on: 1,
    airiq_api_prod_on: 1,
    insurance_prize: "",
    child_visa_prize: "",
    etrav_api_uat_username: "",
    etrav_api_uat_password: "",
    etrav_api_prod_username: "",
    etrav_api_prod_password: "",
    airiq_api_uat_username: "",
    airiq_api_uat_password: "",
    airiq_api_prod_username: "",
    airiq_api_prod_password: "",
    flight_charges: {},
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleFlightApiChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      flight_charges: {
        ...prev.flight_charges,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        flight_charges: JSON.stringify(formData.flight_charges),
      };
      const response = await post(updateSettings, payload, true);
      if (response.ok) {
        toast.success("Settings updated successfully");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (name, val) => {
    console.log(`${name}   ${val}    ${formData.razorpay_prod_on}`);
    setFormData((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };
  const fetchSettingsData = async () => {
    setLoading(true);
    try {
      const res = await get(settings, true);
      const response = await res.json();
      const data = response.data;
      setFormData({
        admin_name: data.admin_name || "",
        admin_logo: data.admin_logo || null,
        firebase_file: data.firebase_file || null,
        // admin_version: data.admin_version || "",
        par_page_limit: data.par_page_limit || "",
        server_key: data.server_key || "",
        razorpay_key: data.razorpay_key || "",
        razorpay_prod_key: data.razorpay_prod_key || "",
        // otp_length: data.otp_length || "",
        //   password_length: data.password_length || "",
        app_name: data.app_name || "",
        app_logo: data.app_logo || null,
        app_version: data.app_version || "",
        app_primary_color: data.app_primary_color || "#000000",
        app_secondary_color: data.app_secondary_color || "#000000",
        app_other_color: data.app_other_color || "#000000",
        support_no: data.support_no || "",
        support_whatsapp_no: data.support_whatsapp_no || "",
        address: data.address || "",
        support_email: data.support_email || "",
        support_start_time: data.support_start_time || "",
        support_end_time: data.support_end_time || "",
        flight_agency_charge: data.flight_agency_charge || "0",
        visa_agency_charge: data.visa_agency_charge || "",
        otb_agency_charge: data.otb_agency_charge || "",
        etrav_api_uat_url: data.etrav_api_uat_url || "",
        etrav_api_prod_url: data.etrav_api_prod_url || "",
        airiq_api_uat_url: data.airiq_api_uat_url || "",
        airiq_api_prod_url: data.airiq_api_prod_url || "",
        aitool_url: data.aitool_url || "",
        aitool_username: data.aitool_username || "",
        aitool_password: data.aitool_password || "",
        razorpay_prod_on: data.razorpay_prod_on || 1,
        etrav_api_prod_on: data.etrav_api_prod_on || 1,
        airiq_api_prod_on: data.airiq_api_prod_on || 1,
        insurance_prize: data.insurance_prize || 0,
        child_visa_prize: data.child_visa_prize || 0,

        etrav_api_uat_username: data.etrav_api_uat_username,
        etrav_api_uat_password: data.etrav_api_uat_password,
        etrav_api_prod_username: data.etrav_api_prod_username,
        etrav_api_prod_password: data.etrav_api_prod_password,
        airiq_api_uat_username: data.airiq_api_uat_username,
        airiq_api_uat_password: data.airiq_api_uat_password,
        airiq_api_prod_username: data.airiq_api_prod_username,
        airiq_api_prod_password: data.airiq_api_prod_password,

        flight_charges: data.flight_charges
          ? JSON.parse(data.flight_charges)
          : {}
      });
    } catch (error) {
      console.error("Error fetching data:", error);
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
      <div className="content container-fluid">
        <div className="mb-4 pb-2">
          <h6 className="h1 mb-0 text-capitalize d-flex align-items-center gap-2">
            {/* <img
              src="https://ovogoscan.com/public/assets/back-end/img/system-setting.png"
              alt=""
            /> */}
            System Settings
          </h6>
        </div>

        <div className="row">
          <div className="col-12 mr-5 mb-5">
            <div className="card">
              <div className="border-bottom px-4 py-3">
                <h5 className="mb-0 text-capitalize d-flex align-items-center gap-2">
                  <img width="20" src={adsettings} alt="" />
                  Admin settings
                </h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <CircularProgressBar />
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <div className="row">
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>ADMIN NAME</FormLabel>
                        <FormControl
                          type="text"
                          name="admin_name"
                          value={formData.admin_name}
                          onChange={handleChange}
                          placeholder="Enter admin name"
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>ADMIN LOGO</FormLabel>
                        <FormControl
                          type="file"
                          name="admin_logo"
                          onChange={handleChange}
                        />
                      </FormGroup>
                      {/* <FormGroup className="col-md-4 col-12 mb-3">
                                                <FormLabel>ADMIN VERSION</FormLabel>
                                                <FormControl type="text" name="admin_version" value={formData.admin_version} onChange={handleChange} placeholder="Enter admin version" />
                                            </FormGroup> 
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>SERVER KEY</FormLabel>
                        <FormControl
                          type="text"
                          name="server_key"
                          value={formData.server_key}
                          onChange={handleChange}
                        />
                      </FormGroup>*/}
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>RAZORPAY KEY TEST</FormLabel>
                        <FormControl
                          type="text"
                          name="razorpay_key"
                          value={formData.razorpay_key}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>RAZORPAY KEY PROD</FormLabel>
                        <FormControl
                          type="text"
                          name="razorpay_prod_key"
                          value={formData.razorpay_prod_key}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>ETRAV URL PROD</FormLabel>
                        <FormControl
                          type="text"
                          name="etrav_api_prod_url"
                          value={formData.etrav_api_prod_url}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>ETRAV URL UAT</FormLabel>
                        <FormControl
                          type="text"
                          name="etrav_api_uat_url"
                          value={formData.etrav_api_uat_url}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>AIRIQ URL UAT</FormLabel>
                        <FormControl
                          type="text"
                          name="airiq_api_uat_url"
                          value={formData.airiq_api_uat_url}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>AIRIQ URL PROD</FormLabel>
                        <FormControl
                          type="text"
                          name="airiq_api_prod_url"
                          value={formData.airiq_api_prod_url}
                          onChange={handleChange}
                        />
                      </FormGroup>

                      {/* <FormGroup className="col-md-4 col-12 mb-3">
                                                <FormLabel>OTP LENGTH</FormLabel>
                                                <FormControl type="number" name="otp_length" value={formData.otp_length} onChange={handleChange} />
                                            </FormGroup> */}
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>FLIGHT BOOKING AGENCY CHARGE</FormLabel>
                        <FormControl
                          type="number"
                          name="flight_agency_charge"
                          value={formData.flight_agency_charge}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>VISA BOOKING AGENCY CHARGE</FormLabel>
                        <FormControl
                          type="number"
                          name="visa_agency_charge"
                          value={formData.visa_agency_charge}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>OTB BOOKING AGENCY CHARGE</FormLabel>
                        <FormControl
                          type="number"
                          name="otb_agency_charge"
                          value={formData.otb_agency_charge}
                          onChange={handleChange}
                        />
                      </FormGroup>

                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>
                          CHILD VISA PRICE (United Arab Emirates)
                        </FormLabel>
                        <FormControl
                          type="number"
                          name="child_visa_prize"
                          value={formData.child_visa_prize}
                          onChange={handleChange}
                        />
                      </FormGroup>

                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>
                          INSURANCE PRICE (United Arab Emirates)
                        </FormLabel>
                        <FormControl
                          type="number"
                          name="insurance_prize"
                          value={formData.insurance_prize}
                          onChange={handleChange}
                        />
                      </FormGroup>

                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>AI Tool URL</FormLabel>
                        <FormControl
                          type="text"
                          name="aitool_url"
                          value={formData.aitool_url}
                          onChange={handleChange}
                        />
                      </FormGroup>

                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>AI Tool UserName</FormLabel>
                        <FormControl
                          type="text"
                          name="aitool_username"
                          value={formData.aitool_username}
                          onChange={handleChange}
                        />
                      </FormGroup>

                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>AI Tool Password</FormLabel>
                        <FormControl
                          type="text"
                          name="aitool_password"
                          value={formData.aitool_password}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>ETRAV UAT UserName</FormLabel>
                        <FormControl
                          type="text"
                          name="etrav_api_uat_username"
                          value={formData.etrav_api_uat_username}
                          onChange={handleChange}
                        />
                      </FormGroup>

                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>ETRAV UAT Password</FormLabel>
                        <FormControl
                          type="text"
                          name="etrav_api_uat_password"
                          value={formData.etrav_api_uat_password}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>ETRAV PROD UserName</FormLabel>
                        <FormControl
                          type="text"
                          name="etrav_api_prod_username"
                          value={formData.etrav_api_prod_username}
                          onChange={handleChange}
                        />
                      </FormGroup>

                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>ETRAV PROD Password</FormLabel>
                        <FormControl
                          type="text"
                          name="etrav_api_prod_password"
                          value={formData.etrav_api_prod_password}
                          onChange={handleChange}
                        />
                      </FormGroup>

                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>AirIQ UAT UserName</FormLabel>
                        <FormControl
                          type="text"
                          name="airiq_api_uat_username"
                          value={formData.airiq_api_uat_username}
                          onChange={handleChange}
                        />
                      </FormGroup>

                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>AirIQ UAT Password</FormLabel>
                        <FormControl
                          type="text"
                          name="airiq_api_uat_password"
                          value={formData.airiq_api_uat_password}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>AirIQ PROD UserName</FormLabel>
                        <FormControl
                          type="text"
                          name="airiq_api_prod_username"
                          value={formData.airiq_api_prod_username}
                          onChange={handleChange}
                        />
                      </FormGroup>

                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>AirIQ PROD Password</FormLabel>
                        <FormControl
                          type="text"
                          name="airiq_api_prod_password"
                          value={formData.airiq_api_prod_password}
                          onChange={handleChange}
                        />
                      </FormGroup>


                      {flightApis.map((flightApi) => (
                        <FormGroup className="col-md-4 col-12 mb-3">
                          <FormLabel>{flightApi.name}</FormLabel>
                          <FormControl
                            type="number"
                            name={flightApi.id}
                            value={formData.flight_charges[flightApi.id] || ""}
                            onChange={handleFlightApiChange}
                            placeholder={`Enter ${flightApi.name} flight API charges`}
                          />
                        </FormGroup>
                      ))}

                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>RAZORPAY ENABLE</FormLabel>
                        <div className="toggle-container">
                          <span className="toggle-label">UAT</span>
                          <div
                            className={`toggle-switch ${formData.razorpay_prod_on === 1 ? "on" : "off"
                              }`}
                            onClick={() =>
                              handleToggle(
                                "razorpay_prod_on",
                                formData.razorpay_prod_on === 1 ? 2 : 1
                              )
                            }
                          >
                            <div className="toggle-circle"></div>
                          </div>
                          <span className="toggle-label">PROD</span>
                        </div>
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>ETRAV ENABLE</FormLabel>
                        <div className="toggle-container">
                          <span className="toggle-label">UAT</span>
                          <div
                            className={`toggle-switch ${formData.etrav_api_prod_on === 1 ? "on" : "off"
                              }`}
                            onClick={() =>
                              handleToggle(
                                "etrav_api_prod_on",
                                formData.etrav_api_prod_on === 1 ? 2 : 1
                              )
                            }
                          >
                            <div className="toggle-circle"></div>
                          </div>
                          <span className="toggle-label">PROD</span>
                        </div>
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>AIRIQ ENABLE</FormLabel>

                        <div className="toggle-container">
                          <span className="toggle-label">UAT</span>
                          <div
                            className={`toggle-switch ${formData.airiq_api_prod_on === 1 ? "on" : "off"
                              }`}
                            onClick={() =>
                              handleToggle(
                                "airiq_api_prod_on",
                                formData.airiq_api_prod_on === 1 ? 2 : 1
                              )
                            }
                          >
                            <div className="toggle-circle"></div>
                          </div>
                          <span className="toggle-label">PROD</span>
                        </div>
                      </FormGroup>
                    </div>
                    <Button type="submit" className="mt-3">
                      Update Admin Settings
                    </Button>
                  </Form>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 mr-5 mb-5">
            <div className="card">
              <div className="border-bottom px-4 py-3">
                <h5 className="mb-0 text-capitalize d-flex align-items-center gap-2">
                  <img width="20" src={appsettings} alt="" />
                  App settings
                </h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <CircularProgressBar />
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <div className="row">
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>APP NAME</FormLabel>
                        <FormControl
                          type="text"
                          name="app_name"
                          value={formData.app_name}
                          onChange={handleChange}
                          placeholder="Enter app name"
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>APP LOGO</FormLabel>
                        <FormControl
                          type="file"
                          name="app_logo"
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>APP VERSION</FormLabel>
                        <FormControl
                          type="text"
                          name="app_version"
                          value={formData.app_version}
                          onChange={handleChange}
                          placeholder="Enter app version"
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>FIREBASE</FormLabel>
                        <FormControl
                          type="file"
                          name="firebase_file"
                          onChange={handleChange}
                          placeholder="Enter file"
                        />
                      </FormGroup>
                    </div>
                    <Button type="submit" className="mt-3">
                      Update App Settings
                    </Button>
                  </Form>
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="border-bottom px-4 py-3">
                <h5 className="mb-0 text-capitalize d-flex align-items-center gap-2">
                  <img width="20" src={supportimage} alt="" />
                  Support settings
                </h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <CircularProgressBar />
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <div className="row">
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>SUPPORT MOBILE NO</FormLabel>
                        <FormControl
                          type="text"
                          name="support_no"
                          value={formData.support_no}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>WHATSAPP SUPPORT NO</FormLabel>
                        <FormControl
                          type="text"
                          name="support_whatsapp_no"
                          value={formData.support_whatsapp_no}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>Addresss</FormLabel>
                        <FormControl
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>SUPPORT EMAIL</FormLabel>
                        <FormControl
                          type="email"
                          name="support_email"
                          value={formData.support_email}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>SUPPORT START TIME</FormLabel>
                        <FormControl
                          type="time"
                          name="support_start_time"
                          value={formData.support_start_time}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4 col-12 mb-3">
                        <FormLabel>SUPPORT END TIME</FormLabel>
                        <FormControl
                          type="time"
                          name="support_end_time"
                          value={formData.support_end_time}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </div>
                    <Button type="submit" className="mt-3">
                      Update Support Settings
                    </Button>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Settings;

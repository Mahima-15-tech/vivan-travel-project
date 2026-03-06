import React, { useState } from 'react';
import '../../pages/flight-booking/flight-booking-main/flight-booking-main.css'
import '../login-signin/login-sign.css'
import { Link, useNavigate } from 'react-router-dom';
import { post } from "../../API/apiHelper";
import { create_account } from "../../API/endpoints";
import { toast, ToastContainer } from 'react-toastify';
import sign_up_image from "../../assets/images/login.jpg";
import country from '../../widget/country';
import Select from 'react-select';
import { FaRegUser } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import Progress from "../../component/Loading";

const Signup = () => {


    const [selectedOptionDR, setSelectedOptionDR] = useState("agentdr");
    const [currencyCode, setCurrencyCode] = useState('');

    const handleOptionChange = (e) => {
        setSelectedOptionDR(e.target.value);
        setFormData({
            ...formData,
            type: (e.target.value == 'agentdr') ? '2' : '1',
        });
    };
  const [isModalOpen, setIsModalOpen] = useState(false);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        password: '',
        confirm_password: '',
        mobile_no: '',
        company_name: '',
        type_of_Ownership: '',
        gst_checked: false,
        gst_no: '',
        office_Address: '',
        country: '',
        currency_code: '',
        state: '',
        city_district: '',
        alt_mobile_number_1: '',
        alt_mobile_number_2: '',
        email: '',
        pan_no: '',
        proof_type: '',
        pincode: '',
        website: '',
        country_code: '+91',
        type: '2',
    });

    const [pen, set_pen] = useState('');
    const [gst, set_gst] = useState('');
    const [proof_front, set_proof_front] = useState('');
    const [proof_back, set_proof_back] = useState('');
    const [office_proof, set_office_proof] = useState('');
    const [showPasswordre, setShowPasswordre] = useState(false);
    const [showPasswordcp, setShowPasswordcp] = useState(false);
    const [isloading, setisloading] = useState(false);

    const togglePasswordVisibilityre = () => {
        setShowPasswordre(prevShowPassword => !prevShowPassword);
    };
    const togglePasswordVisibilitycp = () => {
        setShowPasswordcp(prevShowPassword => !prevShowPassword);
    };

    const handleNextStep = (e) => {
        e.preventDefault();

        if (step < 4) {
            if (step == 1 && !formData.name) {
                toast.error('Name required')
            }
            else if (step == 1 && !formData.mobile_no) {
                toast.error('Mobile_no required')
            } else if (step == 1 && !formData.email) {
                toast.error('Email required')
            } else if (step == 1 && !formData.gender) {
                toast.error('Gender required')
            } else if (step == 1 && !formData.password) {
                toast.error('Password required')
            } else if (step == 1 && !formData.confirm_password) {
                toast.error('Confirm password required')
            } else if (step == 1 && !formData.country) {
                toast.error('Country required')
            } else if (step == 1 && formData.confirm_password !== formData.password) {
                toast.error('Password And Confirm Password Does not match')
            } else if (step == 2 && !formData.company_name) {
                toast.error('Company name required')
            } else if (step == 2 && !formData.type_of_Ownership) {
                toast.error('Type of company required')
            } else if (formData.gst_checked) {
                if (step == 2 && !formData.gst_no) {
                    toast.error('Gst No. required')
                } else if (step == 2 && !gst) {
                    toast.error('Gst Image required')
                }else{
                    setStep(step + 1);
                }
            } else if (step == 3 && !formData.office_Address) {
                toast.error('Office Address required')
            } else if (step == 3 && !formData.state) {
                toast.error('State required')
            } else if (step == 3 && !formData.city_district) {
                toast.error('District required')
            } else if (step == 3 && !formData.pan_no) {
                toast.error('Pen Card No required')
            } else if (step == 3 && !pen) {
                toast.error('Pen Card image required')
            } else if (step == 3 && !formData.proof_type) {
                toast.error('Proof type required')
            } else if (step == 3 && !proof_front) {
                toast.error('Proof front image required')
            } else if (step == 3 && !proof_back) {
                toast.error('Proof back image required')
            } else if (step == 3 && !office_proof) {
                toast.error('Office address proof required')
            } else if (step == 3 && !formData.pincode) {
                toast.error('Pincode required')
            } else {
                setStep(step + 1)
            }
        };
    };

    const handlePrevStep = (e) => {
        e.preventDefault();
        if (step > 1) setStep(step - 1);
    };

    const handleChange = (e) => {

        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else {

            if (name === 'mobile_no') {
                const numericValue = value.replace(/[^0-9]/g, '');
                if (numericValue.length <= 10) {
                    setFormData({
                        ...formData,
                        [name]: numericValue,
                    });
                }
            } else {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
        }
        if (name === "pincode") {
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue.length <= 6) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: numericValue,
                }));
            }
        } else {
            // Handle other fields
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handlecountryChange = (selectedOption) => {
        setCurrencyCode(selectedOption.currency);
        setFormData({
            ...formData,
            currency_code: selectedOption.currency,
            country: selectedOption.name,
        });
    };

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.gender) {
            setErrorMessage('Please fill all the fields');
            return;
        }
        setisloading(true);
        setErrorMessage('');
        const jsonData = JSON.stringify(formData);
        const response = await post(
            create_account, {
            data: jsonData,
            pan_no_photo: (pen) ? (pen) : null,
            gst_certificate_photo: (gst) ? (gst) : null,
            proof_photo_font: (proof_front) ? (proof_front) : null,
            proof_photo_back: (proof_back) ? (proof_back) : null,
            Office_address_proof_photo: (office_proof) ? (office_proof) : null,
        }, true);

        const data = await response.json();
        if (data.status == false) {
            toast.error(data.message);
        } else {
          if (selectedOptionDR === "agentdr") {
            alert(
              "Registration Successful!\nOur team will contact you shortly."
            );
            navigate("/");
          } else {
            localStorage.setItem("authtoken", JSON.stringify(data.data.token));
            sessionStorage.setItem("userData", JSON.stringify(data.data));
            navigate("/");
            toast.success(data.message);
            window.location.reload();
          }
        }
        setisloading(false);
    };

    const renderWizardSteps = () => (
        <div className="flight-booking sign-wizard">
            <div className="form-wizard-header">
                <ul className="nav list-unstyled form-wizard-steps clearfix">
                    <li className={`nav-item ${step >= 1 ? 'activated' : ''} ${step === 1 ? 'active' : ''}`}>
                        <button className="nav-link">
                            <span className="number">1</span><i className="fal fa-check"></i>
                        </button>
                        <h5 className="color-black">Ownership Details</h5>
                    </li>
                    <li className={`nav-item ${step >= 2 ? 'activated' : ''} ${step === 2 ? 'active' : ''}`}>
                        <button className="nav-link">
                            <span className="number">2</span><i className="fal fa-check"></i>
                        </button>
                        <h5 className="color-black">Company Information</h5>
                    </li>
                    <li className={`nav-item ${step >= 3 ? 'activated' : ''} ${step === 3 ? 'active' : ''}`}>
                        <button className="nav-link">
                            <span className="number">3</span><i className="fal fa-check"></i>
                        </button>
                        <h5 className="color-black">Communication Details</h5>
                    </li>
                </ul>
            </div>
        </div>
    );

    const options = country.map(option => ({
        value: option.name,
        label: `${option.name} (${option.currency})`,
        currency: option.currency,
        name: option.name,
    }));

    return (
      <section className="signup v2 bg-white">
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
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-7 col-md-9 col-sm-10 p-lg-0">
            <div className="container-fluid">
              <div className="form-block card shadow border-0 p-4">
                <Link to="/" className="color-primary h6 mb-30">
                  <i className="fal fa-chevron-left"></i>&nbsp;&nbsp;Back To
                  Home
                </Link>
                <h2 className="mb-30 light-black">Create an account</h2>
                <h3 className="mb-24 text-center">Sign up with your Email</h3>
                <div className="form-container">
                  <form
                    onSubmit={handleSubmit}
                    className="form-group contact-form"
                  >
                    <div className="row">
                      {step === 1 && (
                        <>
                          <div className="col-sm-12 mb-3">
                            <div className="radio-group-sit lgin">
                              <h5 className="mb-2">You're?</h5>
                              <div className="radio-container">
                                <label
                                  className={
                                    selectedOptionDR === "agentdr"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <input
                                    type="radio"
                                    name="option"
                                    value="agentdr"
                                    checked={selectedOptionDR === "agentdr"}
                                    onChange={handleOptionChange}
                                  />
                                  <FaUserTie />
                                  <p className="textrr">Agent</p>
                                </label>
                                <label
                                  className={
                                    selectedOptionDR === "userdr"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <input
                                    type="radio"
                                    name="option"
                                    value="userdr"
                                    checked={selectedOptionDR === "userdr"}
                                    onChange={handleOptionChange}
                                  />
                                  <FaRegUser />
                                  <p className="textrr">User</p>
                                </label>
                              </div>
                            </div>
                          </div>
                          {selectedOptionDR === "agentdr" ? (
                            <>{renderWizardSteps()}</>
                          ) : (
                            ""
                          )}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Full Name<span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-user left-start-icon"></i>
                              <input
                                type="text"
                                className="form-control with-icon"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="First Name"
                              />
                            </div>
                          </div>
                          {/* Phone Number */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Phone Number<span className="text-danger">*</span>
                            </label>
                            <div className="d-flex gap-2 position-relative">
                              {/* <span className="input-group-text">+91</span> */}
                              <input
                                type="text"
                                className="form-control prefix-input"
                                name="country_code"
                                value={formData.country_code}
                                onChange={handleChange}
                                maxLength="4"
                                placeholder="+91"
                                required
                              />
                              {/* <i className="fas fa-flag left-start-icon"></i> */}
                              <input
                                type="tel"
                                className="form-control"
                                name="mobile_no"
                                value={formData.mobile_no}
                                onChange={handleChange}
                                placeholder="10-digit Phone Number"
                                maxLength="10"
                                required
                              />
                            </div>
                          </div>

                          {/* Email Address */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Email Address
                              <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-envelope left-start-icon"></i>
                              <input
                                type="email"
                                className="form-control with-icon"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Email Address"
                              />
                            </div>
                          </div>

                          {/* Gender */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Gender<span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-venus-mars left-start-icon"></i>
                              <select
                                className="form-control with-icon"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>
                          {/* Password */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Password<span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-lock left-start-icon"></i>
                              <input
                                type={showPasswordre ? "text" : "password"}
                                className="form-control with-icon"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Password"
                              />
                              <i
                                className={`fas ${
                                  showPasswordre ? "fa-eye-slash" : "fa-eye"
                                } position-absolute toggle-password-icon`}
                                onClick={togglePasswordVisibilityre}
                              ></i>
                            </div>
                          </div>

                          {/* Confirm Password */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Confirm Password
                              <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-lock left-start-icon"></i>
                              <input
                                type={showPasswordcp ? "text" : "password"} // Corrected type from 'confirm_password' to 'password'
                                className="form-control with-icon"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                                placeholder="Confirm Password"
                              />
                              <i
                                className={`fas ${
                                  showPasswordcp ? "fa-eye-slash" : "fa-eye"
                                } position-absolute toggle-password-icon`}
                                onClick={togglePasswordVisibilitycp}
                              ></i>
                            </div>
                            {formData.password !== formData.confirm_password &&
                              formData.confirm_password.length > 0 && (
                                <div className="text-danger mt-1">
                                  Passwords do not match.
                                </div>
                              )}
                          </div>

                          <div className="col-sm-6 mb-3 sitdrpdwn">
                            <label className="form-label">
                              Country<span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-globe left-start-icon"></i>
                              <Select
                                options={options}
                                name="country"
                                id="country"
                                className="form-control"
                                classNamePrefix="react-select"
                                placeholder="Select Country"
                                isSearchable
                                value={options.find(
                                  (option) => option.value == formData.country
                                )}
                                onChange={handlecountryChange}
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    paddingLeft: "1.6rem",
                                  }),
                                }}
                              />
                            </div>
                          </div>

                          <input
                            type="hidden"
                            name="currency_code"
                            id="currency_code"
                            className="form-control"
                            value={currencyCode}
                            readOnly
                          />
                        </>
                      )}
                      {step === 2 && (
                        <>
                          {selectedOptionDR === "agentdr" ? (
                            <>{renderWizardSteps()}</>
                          ) : (
                            ""
                          )}

                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Company Name<span className="text-danger">*</span>
                            </label>
                            <div className="mb-24 position-relative">
                              <i className="fas fa-briefcase left-start-icon"></i>
                              <input
                                type="text"
                                className="form-control with-icon"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                required
                                placeholder="Company Name"
                              />
                            </div>
                          </div>

                          {/* Type of Ownership */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Type of Company
                              <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-building position-absolute left-start-icon"></i>
                              <select
                                className="form-control with-icon"
                                name="type_of_Ownership"
                                value={formData.type_of_Ownership}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Select Company Type</option>
                                <option value="Companies Limited by Shares.">
                                  Companies Limited by Shares.
                                </option>
                                <option value="Companies Limited by Guarantee.">
                                  Companies Limited by Guarantee.
                                </option>
                                <option value="Unlimited Companies.">
                                  Unlimited Companies.
                                </option>
                                <option value="One Person Companies (OPC)">
                                  One Person Companies (OPC)
                                </option>
                                <option value="Private Companies.">
                                  Private Companies.
                                </option>
                                <option value="Public Companies.">
                                  Public Companies.
                                </option>
                                <option value="Partnership Companies">
                                  Partnership Companies
                                </option>
                                <option value="Holding and Subsidiary Companies.">
                                  Holding and Subsidiary Companies.
                                </option>
                                <option value="Associate Companies.">
                                  Associate Companies.
                                </option>
                              </select>
                            </div>
                          </div>

                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Registered for GST?
                            </label>
                            <div className="filter-checkbox mb-24">
                              <div className="form-check p-0">
                                <input
                                  type="checkbox"
                                  id="savegst"
                                  name="gst_checked"
                                  className="wizard-required form-check-input"
                                  checked={formData.gst_checked}
                                  onChange={(e) => {
                                    setFormData((prevData) => ({
                                      ...prevData,
                                      gst_checked: e.target.checked,
                                    }));
                                  }}
                                />
                                <label
                                  htmlFor="savegst"
                                  className="form-label form-check-label"
                                >
                                  Yes
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6 mb-3"></div>

                          {/* Conditionally render GST Number and Upload GST Certificate */}
                          {formData.gst_checked && (
                            <>
                              {/* GST Number */}
                              <div className="col-sm-6 mb-3">
                                <label className="form-label">
                                  GST Number
                                  <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="gst_no"
                                  value={formData.gst_no}
                                  onChange={handleChange}
                                  required
                                  placeholder="GST Number"
                                  disabled={!formData.gst_checked}
                                />
                              </div>

                              {/* Upload GST Certificate */}
                              <div className="col-sm-6 mb-3">
                                <label className="form-label">
                                  Upload GST Certificate
                                  <span className="text-danger">*</span>
                                </label>
                                {gst ? (
                                  <div className="mb-2">
                                    <span>Selected File: {gst.name}</span>
                                    <button
                                      type="button"
                                      className="btn btn-link text-danger ms-2"
                                      onClick={() => set_gst(null)}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ) : (
                                  <input
                                    type="file"
                                    className="form-control"
                                    name="gst_certificate_photo"
                                    onChange={(e) => set_gst(e.target.files[0])}
                                    required
                                    accept=".pdf, .jpg, .jpeg, .png"
                                    disabled={!formData.gst_checked}
                                  />
                                )}
                              </div>
                            </>
                          )}
                        </>
                      )}
                      {step === 3 && (
                        <>
                          {selectedOptionDR === "agentdr" ? (
                            <>{renderWizardSteps()}</>
                          ) : (
                            ""
                          )}

                          {/* Office Address */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Office Address
                              <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-map-marker-alt left-start-icon"></i>
                              <input
                                type="text"
                                className="form-control with-icon"
                                name="office_Address"
                                value={formData.office_Address}
                                onChange={handleChange}
                                required
                                placeholder="Office Address"
                              />
                            </div>
                          </div>

                          {/* Country */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Country<span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-globe left-start-icon"></i>
                              <input
                                type="text"
                                className="form-control with-icon"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                placeholder="Country"
                                readOnly
                              />
                            </div>
                          </div>

                          {/* State */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              State<span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-map-marker-alt left-start-icon"></i>
                              <input
                                type="text"
                                className="form-control with-icon"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                placeholder="State"
                              />
                            </div>
                          </div>

                          {/* City / District */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              City / District
                              <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-city left-start-icon"></i>
                              <input
                                type="text"
                                className="form-control with-icon"
                                name="city_district"
                                value={formData.city_district}
                                onChange={handleChange}
                                required
                                placeholder="City / District"
                              />
                            </div>
                          </div>

                          {/* Mobile Number */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Mobile Number
                              <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-phone-alt left-start-icon"></i>
                              <input
                                type="tel"
                                className="form-control with-icon"
                                name="alt_mobile_number_1"
                                value={formData.mobile_no}
                                onChange={handleChange}
                                required
                                placeholder="Mobile Number"
                                maxLength="10"
                                readOnly
                              />
                            </div>
                          </div>

                          {/* Alternative Mobile Number */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Alternative Mobile Number
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-phone-alt left-start-icon"></i>
                              <input
                                type="tel"
                                className="form-control with-icon"
                                name="alt_mobile_number_2"
                                value={formData.alt_mobile_number_2}
                                onChange={handleChange}
                                placeholder="Alternative Mobile Number"
                                maxLength="10" // Ensure only 10 digits are allowed
                              />
                            </div>
                          </div>

                          {/* PAN Number */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              PAN Number<span className="text-danger">*</span>
                              <i
                                className="fas fa-info-circle"
                                data-bs-toggle="tooltip"
                                data-bs-placement="right"
                                title="Enter your PAN Number in the format: ABCDE1234F"
                              ></i>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-id-card left-start-icon"></i>
                              <input
                                type="text"
                                className="form-control with-icon"
                                name="pan_no"
                                value={formData.pan_no}
                                onChange={handleChange}
                                required
                                placeholder="PAN Number"
                                pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                                maxLength="10"
                              />
                              {/* <div className="invalid-feedback">
                                                            Please enter a valid PAN Number (format: ABCDE1234F).
                                                        </div> */}
                            </div>
                          </div>

                          {/* PAN Card Upload */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Upload PAN Card
                              <span className="text-danger">*</span>
                            </label>
                            {pen ? (
                              <div className="mb-2">
                                <span>Selected File: {pen.name}</span>
                                <button
                                  type="button"
                                  className="btn btn-link text-danger ms-2"
                                  onClick={() => set_pen(null)}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <input
                                type="file"
                                className="form-control"
                                name="pan_card"
                                onChange={(e) => set_pen(e.target.files[0])}
                                required
                                accept=".pdf, .jpg, .jpeg, .png"
                              />
                            )}
                          </div>

                          {/* Address Proof Type */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Address Proof Type
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-control"
                              name="proof_type"
                              value={formData.proof_type}
                              onChange={handleChange}
                              required
                            >
                              <option value="">
                                Select Address Proof Type
                              </option>
                              <option value="Aadhaar card">Aadhaar card</option>
                              <option value="passport">passport</option>
                              <option value="NEGRA card">NEGRA card</option>
                              <option value="driving license">
                                driving license
                              </option>
                              <option value="voter's ID">voter's ID</option>
                            </select>
                          </div>

                          {/* Address Proof Front Upload */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Upload Address Proof (Front)
                              <span className="text-danger">*</span>
                            </label>
                            {proof_front ? (
                              <div className="mb-2">
                                <span>Selected File: {proof_front.name}</span>
                                <button
                                  type="button"
                                  className="btn btn-link text-danger ms-2"
                                  onClick={() => set_proof_front(null)}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <input
                                type="file"
                                className="form-control"
                                name="address_proof_front"
                                onChange={(e) =>
                                  set_proof_front(e.target.files[0])
                                }
                                required
                                accept=".pdf, .jpg, .jpeg, .png"
                              />
                            )}
                          </div>

                          {/* Address Proof Back Upload */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Upload Address Proof (Back)
                              <span className="text-danger">*</span>
                            </label>
                            {proof_back ? (
                              <div className="mb-2">
                                <span>Selected File: {proof_back.name}</span>
                                <button
                                  type="button"
                                  className="btn btn-link text-danger ms-2"
                                  onClick={() => set_proof_back(null)}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <input
                                type="file"
                                className="form-control"
                                name="address_proof_back"
                                onChange={(e) =>
                                  set_proof_back(e.target.files[0])
                                }
                                required
                                accept=".pdf, .jpg, .jpeg, .png"
                              />
                            )}
                          </div>

                          {/* Office Address Proof Upload */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Upload Office Address Proof
                              <span className="text-danger">*</span>
                            </label>

                            {office_proof ? (
                              <div className="mb-2">
                                <span>Selected File: {office_proof.name}</span>
                                <button
                                  type="button"
                                  className="btn btn-link text-danger ms-2"
                                  onClick={() => set_office_proof(null)}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <input
                                type="file"
                                className="form-control"
                                name="office_address_proof"
                                onChange={(e) =>
                                  set_office_proof(e.target.files[0])
                                }
                                required
                                accept=".pdf, .jpg, .jpeg, .png"
                              />
                            )}
                          </div>

                          {/* Pincode */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">
                              Pincode<span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <i className="fas fa-map-pin left-start-icon"></i>
                              <input
                                type="text"
                                className="form-control with-icon"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                                placeholder="Pincode"
                                maxLength="6" // Restrict to 6 digits
                              />
                              {formData.pincode.length > 0 &&
                                formData.pincode.length < 6 && (
                                  <div className="text-danger mt-1">
                                    Pincode must be exactly 6 digits.
                                  </div>
                                )}
                            </div>
                          </div>

                          {/* Website */}
                          <div className="col-sm-6 mb-3">
                            <label className="form-label">Website</label>
                            <div className="position-relative">
                              <i className="fas fa-globe left-start-icon"></i>
                              <input
                                type="url"
                                className="form-control with-icon"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="Website URL"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {step === 4 && (
                        <>
                          {selectedOptionDR === "agentdr" ? (
                            <>{renderWizardSteps()}</>
                          ) : (
                            ""
                          )}
                          <div className="col-sm-12 mb-3">
                            <label className="form-label">
                              <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                required
                              />{" "}
                              I agree to the terms and conditions
                            </label>
                          </div>

                          <div className="col-sm-12 mb-3">
                            <h5>Review your information:</h5>
                            <ul>
                              <li>
                                <strong>First Name:</strong> {formData.name}
                              </li>
                              <li>
                                <strong>Phone Number:</strong>{" "}
                                {formData.mobile_no}
                              </li>
                              <li>
                                <strong>Email:</strong> {formData.email}
                              </li>
                              <li>
                                <strong>Password:</strong> {formData.password}
                              </li>
                              <li>
                                <strong>Country:</strong> {formData.country}
                              </li>
                            </ul>
                          </div>
                        </>
                      )}

                      <div className="d-flex justify-content-between w-100">
                        {isloading?<Progress></Progress>: selectedOptionDR === "agentdr" ? (
                          <>
                            {step > 1 && (
                              <button
                                className="cus-btn-outline"
                                onClick={handlePrevStep}
                              >
                                Previous
                              </button>
                            )}
                            {step < 4 ? (
                              <button
                                className="cus-btn"
                                onClick={handleNextStep}
                              >
                                Next
                              </button>
                            ) : (
                              <button className="cus-btn" type="submit">
                                Submit
                              </button>
                            )}
                          </>
                        ) : (
                          <button className="cus-btn" type="submit">
                            Submit
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>

                {errorMessage && (
                  <div className="alert-msg">{errorMessage}</div>
                )}
              </div>
              <div className="botm-p mx-5 mt-5">
                <p className="text-center">
                  Already have an account? <Link to="/login">Log In</Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-5 p-0">
            <div className="img-block">
              <img src={sign_up_image} alt="Signup Visual" />
            </div>
          </div>
        </div>
      </section>
    );
};

export default Signup;
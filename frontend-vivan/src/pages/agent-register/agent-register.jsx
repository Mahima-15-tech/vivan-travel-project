import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './agent-register.css'
import logo from "../../assets/images/logo.png"

const AgentRegister = () => {
    const [formData, setFormData] = useState({
        fname: '',
        email: '',
        pass: '',
        password: '',
        company: ''
    });

    const [progress, setProgress] = useState(0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'password') {
            updateProgressBar(value);
        }
    };

    const updateProgressBar = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        setProgress(strength);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };








    return (
        <>
            <div className="ugf-main-wrap ugf-bg">
                <div className="ugf-header container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-3 w-100">
                        <div className="logo">
                            <a href={logo}>
                                <img src={logo} className="img-fluid" alt="Logo" />
                            </a>
                        </div>
                        <ul className="steps list-inline d-flex mb-0">
                            <li className="step list-inline-item me-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinejoin="round" className="feather feather-check me-1">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span className="fw-bold">01. Create Account</span>
                            </li>
                            <li className="step list-inline-item me-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinejoin="round" className="feather feather-check me-1">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>02. Select Plan</span>
                            </li>
                            <li className="step list-inline-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinejoin="round" className="feather feather-check me-1">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>03. Payment Details</span>
                            </li>
                        </ul>
                        <div className="alternet-access">
                            <p>Already have an account? <Link to='/agent-login' className='cu-btn'>&nbsp; Log In now!</Link></p>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="ugf-container">
                                <div className="content-wrap">
                                    <div className="ugf-form-block-header">
                                        <h2 className='mb-2'>Register Your Account</h2>
                                        <p>Enter your valid email address and password <br /> to register your account</p>
                                    </div>



                                    <div className="ugf-input-block">
                                        <div className="col-lg-8 offset-lg-2">
                                            <form onSubmit={handleSubmit} id="commentForm">
                                                <div className="row">

                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            First Name<span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            placeholder="Enter Your First Name"
                                                            name="fname"
                                                            className="form-control"
                                                            value={formData.fname}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Last Name<span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            placeholder="Enter Your Last Name"
                                                            name="lname"
                                                            className="form-control"
                                                            value={formData.lname}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Date of Birth<span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            name="dob"
                                                            className="form-control"
                                                            value={formData.dob}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Mobile Number<span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            placeholder="Enter your mobile number"
                                                            name="mobile_no"
                                                            className="form-control"
                                                            value={formData.mobile_no}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Email Address<span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="email"
                                                            placeholder="Enter your email address"
                                                            name="email"
                                                            className="form-control"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Address<span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            placeholder="Enter your address"
                                                            name="address"
                                                            className="form-control"
                                                            value={formData.address}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-12 mb-3">
                                                        <label className="form-label">
                                                            Password<span className="text-danger">*</span>
                                                        </label>
                                                        {/* <div className="form-group pass-block mb-3"> */}
                                                        <input type="password" name="password" className="form-control" id="inputPass" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
                                                        {/* </div> */}
                                                    </div>
                                                    <div className="form-group m-0">
                                                        <div id="progress-bar" className="progress">
                                                            <div id="progress" className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" ></div>
                                                        </div>
                                                    </div>
                                                    <div id="suggestions">
                                                        <p className="suggestion">
                                                            Minimum 8 characters long and containing at least one numeric, uppercase, lowercase, and special character.
                                                        </p>
                                                    </div>



                                                    <button type="submit" className="cus-btn w-100 mt-5">Register Account</button>
                                                    <p className="terms">
                                                        By clicking here and continuing, <br />
                                                        I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                                                    </p>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="alternet-access">
                                        <p>Already have an account? <Link to='/agent-login' className='cus-btn'>&nbsp; Register now!</Link></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AgentRegister;

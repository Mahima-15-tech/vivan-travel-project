import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../component/nav-profile/nav-profile.css'
import './agent-profile.css'
import ProfileSidebarWidget from '../profile-sidebar'
import { ToastContainer, toast } from "react-toastify";
import { get, post } from "../../../API/apiHelper";
import {  update_password, IMAGE_BASE_URL } from "../../../API/endpoints";
import profileimage from "../../../assets/images/profile.png";
import MenuIcons from '../menu-icons';


const ProfileMain = () => {
    const navigate = useNavigate();
    const [profilePreview, setProfilePreview] = useState(profileimage); // Image preview state
    const [userData, setUserData] = useState(null);
    // get user session data
    useEffect(() => {
        const userDataFromSession = sessionStorage.getItem('userData');
        if (userDataFromSession && userDataFromSession != null) {
            const userData = JSON.parse(userDataFromSession);
            setUserData(userData.model);
        } else {
            navigate("/login");
        }
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile_no: '',
        country: '',
        dob: '',
        gender: '',
        address: '',
        profile_photo: '',
        company_name: '',
        type_of_Ownership: '',
        gst_no: '',
        gst_certificate_photo: '',
        office_Address: '',
        country: '',
        currency_code: '',
        state: '',
        city_district: '',
        alt_mobile_number_1: '',
        alt_mobile_number_2: '',
        pan_no: '',
        pan_no_photo: '',
        proof_type: '',
        proof_photo_font: '',
        proof_photo_back: '',
        Office_address_proof_photo: '',
        pincode: '',
        website: '',
    });

    // fetch user details
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await post('',{id:userData.id}, true);
                if (!response.ok) {
                    const errorMsg = await response.text();
                    throw new Error(`Error ${response.status}: ${errorMsg}`);
                }
                const data = await response.json();

                setFormData(prev => ({
                    ...prev,
                    name: data.data.name,
                    email: data.data.email,
                    mobile_no: data.data.mobile_no,
                    country: data.data.country,
                    dob: data.data.dob,
                    gender: data.data.gender,
                    address: data.data.address,
                    profile_photo: data.data.profile_photo,
                }));

                setProfilePreview(`${IMAGE_BASE_URL}${data.data.profile_photo}` || profileimage);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchUserData();
    }, [userData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const [imageData, setImageData] = useState({
        profile_photo: '',
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageData({
            ...imageData,
            profile_photo: file
        });

        // For image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedata = JSON.stringify(formData)
            const response = await post('', { data: updatedata, user_profile: imageData.profile_photo }, true);
            const data = await response.json();
            if (data.status == false) {
                toast.error(data.message);
            } else {
                toast.success(data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating profile. Please try again.');
        }
    };




    const [oldpass, setoldpass] = useState('');
    const [newpass, setnewpass] = useState('');
    const [confnewpass, setconfnewpass] = useState('');

    // password update 
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {

            const formData = {
                'oldpass': oldpass,
                'newpass': newpass
            }
            const response = await post(update_password, formData, true);
            const data = await response.json();
            if (data.status == false) {
                toast.error(data.message);
            } else {
                toast.success(data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating profile. Please try again.');
        }
    };



    return (
        <section className="pt-3 pb-5">
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
            <div className="container">

                <div className="row">
                    <ProfileSidebarWidget />
                    <div className="col-xl-9 col-lg-8">
                        < MenuIcons />


                        <div className="vstack gap-4">

                            {/* Personal Information Card */}
                            <div className="border card">
                                <div className="border-bottom card-header">
                                    <h3 className="card-header-title">Personal Information</h3>
                                </div>
                                <div className="card-body">
                                    <form className="row g-3" onSubmit={handleSubmit}>
                                        <div className="col-12">
                                            <label className="form-label">Upload your profile photo<span className="text-danger">*</span></label>
                                            <div className="d-flex align-items-center">
                                                <label className="position-relative me-4" htmlFor="uploadfile-1" title="Replace this pic">
                                                    <span className="avatar avatar-xl">
                                                        <img id="uploadfile-1-preview" src={profilePreview} className="avatar-img rounded-circle border border-white border-3 shadow" alt="profile" />
                                                    </span>
                                                </label>
                                                <label className="btn btn-sm btn-primary-soft mb-0" htmlFor="uploadfile-1">Change</label>
                                                <input id="uploadfile-1" name='user_profile' accept=".jpg,.jpeg,.png" className="form-control d-none" type="file" onChange={handleFileChange} />
                                            </div>
                                        </div>

                                        <div className="col-sm-6 mb-3">
                                            <label className="form-label">
                                                First Name<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="first_name_id"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                placeholder="First Name"
                                            />
                                        </div>

                                        <div className="col-sm-6 mb-3">
                                            <label className="form-label">
                                                Last Name<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="last_name_id"
                                                name="lastName"
                                                value={formData.lastNameg}
                                                onChange={handleChange}
                                                required
                                                placeholder="Last Name"
                                            />
                                        </div>

                                        <div className="col-sm-6 mb-3">
                                            <label className="form-label">
                                                Gender<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className="form-control"
                                                id="gender_id"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        {/* <div className="col-sm-6 mb-3">
                                            <label className="form-label">
                                                Password<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password_id"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                placeholder="Password"
                                            />
                                        </div>

                                        <div className="col-sm-6 mb-3">
                                            <label className="form-label">
                                                Confirm Password<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="confirm_password_id"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                                placeholder="Confirm Password"
                                            />
                                        </div> */}
                                    </form>
                                </div>
                            </div>

                            {/* Company Details Card */}

                            <div className="border card">
                                <div className="border-bottom card-header">
                                    <h4 className="card-header-title">Company Details</h4>
                                </div>
                                <form className="card-body row" onSubmit={handlePasswordSubmit} >
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">
                                            Company Name<span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="company_name"
                                            value={formData.company_name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Company Name"
                                        />
                                    </div>

                                    {/* Type of Ownership */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">
                                            Type of Ownership<span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-control"
                                            name="ownership_type"
                                            value={formData.ownership_type}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Ownership Type</option>
                                            <option value="sole_proprietorship">Sole Proprietorship</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="llc">LLC</option>
                                            <option value="corporation">Corporation</option>
                                        </select>
                                    </div>

                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">
                                            Registered for GST?<span className="text-danger">*</span>
                                        </label>
                                        <div className="filter-checkbox mb-24">
                                            <div className="form-check p-0">
                                                <input
                                                    type="checkbox"
                                                    id="save"
                                                    name="gst_checked"
                                                    className="wizard-required form-check-input"
                                                    checked={formData.gst_checked}
                                                    onChange={handleChange}
                                                />
                                                <label htmlFor="save" className="form-label form-check-label">
                                                    Yes
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* GST Number */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">
                                            GST Number<span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="gst_number"
                                            value={formData.gst_number}
                                            onChange={handleChange}
                                            required
                                            placeholder="GST Number"
                                            disabled={!formData.gst_checked}  // Disable if not checked
                                        />
                                    </div>

                                    {/* Upload GST Certificate */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">
                                            Upload GST Certificate<span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="gst_certificate"
                                            onChange={handleChange}
                                            required
                                            accept=".pdf, .jpg, .jpeg, .png"  // Specify allowed file types
                                            disabled={!formData.gst_checked}  // Disable if not checked
                                        />
                                    </div>
                                </form>
                            </div>
                            {/* Company Details Card */}

                            <div className="border card">
                                <div className="border-bottom card-header">
                                    <h4 className="card-header-title">Company Details</h4>
                                </div>
                                <form className="card-body row" onSubmit={handlePasswordSubmit} >
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Office Address<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="office_address"
                                            value={formData.office_address}
                                            onChange={handleChange}
                                            required
                                            placeholder="Office Address"
                                        />
                                    </div>

                                    {/* Country */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Country<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            required
                                            placeholder="Country"
                                        />
                                    </div>

                                    {/* State */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">State<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                            placeholder="State"
                                        />
                                    </div>

                                    {/* City / District */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">City / District<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            placeholder="City / District"
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                        />
                                    </div>

                                    {/* Mobile Number */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Mobile Number<span className="text-danger">*</span></label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="mobile_number"
                                            value={formData.mobile_number}
                                            onChange={handleChange}
                                            required
                                            placeholder="Mobile Number"
                                        />
                                    </div>

                                    {/* Alternative Mobile Number */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Alternative Mobile Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="alt_mobile_number"
                                            value={formData.alt_mobile_number}
                                            onChange={handleChange}
                                            placeholder="Alternative Mobile Number"
                                        />
                                    </div>

                                    {/* Email Address */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Email Address<span className="text-danger">*</span></label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Email Address"
                                        />
                                    </div>

                                    {/* PAN Number */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">PAN Number<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="pan_number"
                                            value={formData.pan_number}
                                            onChange={handleChange}
                                            required
                                            placeholder="PAN Number"
                                        />
                                    </div>

                                    {/* PAN Card Upload */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Upload PAN Card<span className="text-danger">*</span></label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="pan_card"
                                            onChange={handleChange}
                                            required
                                            accept=".pdf, .jpg, .jpeg, .png"
                                        />
                                    </div>

                                    {/* Address Proof Type */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Address Proof Type<span className="text-danger">*</span></label>
                                        <select
                                            className="form-control"
                                            name="address_proof_type"
                                            value={formData.address_proof_type}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Address Proof Type</option>
                                            <option value="aadhaar">Aadhaar</option>
                                            <option value="driving_license">Driving License</option>
                                            <option value="passport">Passport</option>
                                        </select>
                                    </div>

                                    {/* Address Proof Front Upload */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Upload Address Proof (Front)<span className="text-danger">*</span></label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="address_proof_front"
                                            onChange={handleChange}
                                            required
                                            accept=".pdf, .jpg, .jpeg, .png"
                                        />
                                    </div>

                                    {/* Address Proof Back Upload */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Upload Address Proof (Back)<span className="text-danger">*</span></label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="address_proof_back"
                                            onChange={handleChange}
                                            required
                                            accept=".pdf, .jpg, .jpeg, .png"
                                        />
                                    </div>

                                    {/* Office Address Proof Upload */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Upload Office Address Proof<span className="text-danger">*</span></label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="office_address_proof"
                                            onChange={handleChange}
                                            required
                                            accept=".pdf, .jpg, .jpeg, .png"
                                        />
                                    </div>

                                    {/* Pincode */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Pincode<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            required
                                            placeholder="Pincode"
                                        />
                                    </div>

                                    {/* Website */}
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Website</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            placeholder="Website URL"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Update Password Card */}


                            <div className="border card">
                                <div className="border-bottom card-header">
                                    <h4 className="card-header-title">Update Password</h4>
                                </div>
                                <form className="card-body" onSubmit={handlePasswordSubmit} >
                                    <div className="position-relative mb-3" >
                                        <label className="form-label">Current password</label>
                                        <input placeholder="Enter current password" name="oldpass" type="password" className="form-control" onChange={(e) => setoldpass(e.target.value)} required />
                                    </div>
                                    <div className="position-relative mb-3">
                                        <label className="form-label"> Enter new password </label>
                                        <input placeholder="Enter new password" name="newpass" type="password" onChange={(e) => setnewpass(e.target.value)} className="form-control" required />
                                    </div>
                                    <div className="position-relative mb-3">
                                        <label className="form-label"> Confirm new password </label>
                                        <input placeholder="Confirm new password" name="confnewpass" type="password" onChange={(e) => setconfnewpass(e.target.value)} className="form-control" required />
                                    </div>
                                    <div className="text-end">
                                        <button type="submit" className="mb-0 cus-btn">Change Password</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileMain;

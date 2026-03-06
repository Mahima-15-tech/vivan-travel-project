import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../component/nav-profile/nav-profile.css'
import '../profile-main/profile-main.css'
import ProfileSidebarWidget from '../profile-sidebar'
import { ToastContainer, toast } from "react-toastify";
import { get, post } from "../../../API/apiHelper";
import { users_profile, update_account, update_password, IMAGE_BASE_URL } from "../../../API/endpoints";
import profileimage from "../../../assets/images/profile.png";
import MenuIcons from '../menu-icons';
import country from '../../../widget/country';
import Select from 'react-select';

const ProfileMain = () => {
    const navigate = useNavigate();
    const [profilePreview, setProfilePreview] = useState(profileimage); // Image preview state
    const [Usertype, setUsertype] = useState(null);
    const [Userid, setUserid] = useState(null);

    useEffect(() => {
        const userDataFromSession = sessionStorage.getItem('userData');
        if (userDataFromSession && userDataFromSession != null) {
            JSON.parse(userDataFromSession);
        } else {
            navigate("/login");
        }
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile_no: '',
        country: '',
        currency_code: '',
        dob: '',
        gender: '',
        address: '',
        company_name: '',
        type_of_Ownership: '',
        gst_no: '',
        gst_certificate_photo: '',
        office_Address: '',
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
        commission: '',
        logo: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await get(users_profile, true);
                if (!response.ok) {
                    const errorMsg = await response.text();
                    throw new Error(`Error ${response.status}: ${errorMsg}`);
                }
                const data = await response.json();
                setUserid(data.data.id)

                setFormData(prev => ({
                    ...prev,
                    name: data.data.name,
                    email: data.data.email,
                    mobile_no: data.data.mobile_no,
                    country: data.data.country,
                    currency_code: data.data.currency_code,
                    dob: data.data.dob,
                    gender: data.data.gender,
                    address: data.data.address,
                    profile_photo: data.data.profile_photo,

                    company_name: data.data.agents ? data.data.agents.company_name : '',
                    type_of_Ownership: data.data.agents ? data.data.agents.type_of_Ownership : '',
                    gst_no: data.data.agents ? data.data.agents.gst_no : '',
                    gst_certificate_photo: data.data.agents ? data.data.agents.gst_certificate_photo : '',
                    office_Address: data.data.agents ? data.data.agents.office_Address : '',
                    state: data.data.agents ? data.data.agents.state : '',
                    city_district: data.data.agents ? data.data.agents.city_district : '',
                    alt_mobile_number_1: data.data.agents ? data.data.agents.alt_mobile_number_1 : '',
                    alt_mobile_number_2: data.data.agents ? data.data.agents.alt_mobile_number_2 : '',
                    pan_no: data.data.agents ? data.data.agents.pan_no : '',
                    pan_no_photo: data.data.agents ? data.data.agents.pan_no_photo : '',
                    proof_type: data.data.agents ? data.data.agents.proof_type : '',
                    proof_photo_font: data.data.agents ? data.data.agents.proof_photo_font : '',
                    proof_photo_back: data.data.agents ? data.data.agents.proof_photo_back : '',
                    Office_address_proof_photo: data.data.agents ? data.data.agents.Office_address_proof_photo : '',
                    pincode: data.data.agents ? data.data.agents.pincode : '',
                    website: data.data.agents ? data.data.agents.website : '',
                    commission: data.data.agents ? data.data.agents.commission : '',
                    logo: data.data.agents ? data.data.agents.logo : ''
                }));

                {
                    (data.data.profile_photo == null) ?
                        (setProfilePreview(profileimage)) :
                        (setProfilePreview(`${IMAGE_BASE_URL}${data.data.profile_photo}` || profileimage))
                }



                setUsertype(data.data.type)
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchUserData();
    }, []);

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
            const response = await post(update_account, { id: Userid, data: updatedata, user_profile: imageData.profile_photo }, true);
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
            toast.error('Error updating profile. Please try again.');
        }
    };

    const handlecountryChange = (selectedOption) => {
        setFormData({
            ...formData,
            'country': selectedOption.value,
            'currency_code': selectedOption.currency
        });
    };

    const [oldpass, setoldpass] = useState('');
    const [newpass, setnewpass] = useState('');
    const [confnewpass, setconfnewpass] = useState('');

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
            toast.error('Error updating profile. Please try again.');
        }
    };

    const options = country.map(option => ({
        value: option.name,
        label: option.name,
        currency: option.currency,
    }));

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

                                        <div className="col-md-6">
                                            <label className="form-label">Full Name*</label>
                                            <input placeholder="Enter your full name" name="name" className="form-control" value={formData?.name || ''} onChange={handleChange} />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Email address*</label>
                                            <input placeholder="Enter your email id" name="email" type="email" className="form-control" value={formData?.email || ''} onChange={handleChange} />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Mobile number*</label>
                                            <input placeholder="Enter your mobile number" name="mobile_no" className="form-control" value={formData?.mobile_no || ''} onChange={handleChange} />
                                        </div>

                                        <div className="col-md-6 sitdrpdwn" >
                                            <label className="form-label">Nationality<span className="text-danger">*</span></label>

                                            <Select
                                                options={options}
                                                name="country"
                                                id="country"
                                                value={options.find(option => option.value === formData.country)}
                                                className="form-control"
                                                classNamePrefix="react-select"
                                                placeholder="Select Country"
                                                isSearchable
                                                onChange={handlecountryChange}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Date of Birth<span className="text-danger">*</span></label>
                                            <input type="date" className="form-control" name="dob" placeholder="Enter Date of Birth" value={formData?.dob} onChange={handleChange} />

                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Select Gender<span className="text-danger">*</span></label>
                                            <div className="d-flex gap-4">
                                                <div className="form-check radio-bg-light">
                                                    <input className="form-check-input" type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} />
                                                    <label className="form-check-label">Male</label>
                                                </div>
                                                <div className="form-check radio-bg-light">
                                                    <input className="form-check-input" type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} />
                                                    <label className="form-check-label">Female</label>
                                                </div>
                                                <div className="form-check radio-bg-light">
                                                    <input className="form-check-input" type="radio" name="gender" value="Others" checked={formData.gender === 'Others'} onChange={handleChange} />
                                                    <label className="form-check-label">Others</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label">Address</label>
                                            <textarea rows="3" spellCheck="false" name="address" className="form-control" value={formData.address} onChange={handleChange}></textarea>
                                        </div>

                                        <div className="text-end col-12">
                                            <button type="submit" className="mb-0 cus-btn">Save Changes</button>
                                        </div>

                                    </form>
                                </div>
                            </div>

                            {Usertype == '2' && (
                                <>
                                    {/* Other details update */}
                                    <div className="border card">
                                        <div className="border-bottom card-header">
                                            <h4 className="card-header-title">Company Details</h4>
                                        </div>
                                        <form className="card-body row" onSubmit={handleSubmit} >
                                            {/* company name */}
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
                                                    className="form-control with-icon"
                                                    name="type_of_Ownership"
                                                    value={formData.type_of_Ownership}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select Company Type</option>
                                                    <option value="Companies Limited by Shares.">Companies Limited by Shares.</option>
                                                    <option value="Companies Limited by Guarantee.">Companies Limited by Guarantee.</option>
                                                    <option value="Unlimited Companies.">Unlimited Companies.</option>
                                                    <option value="One Person Companies (OPC)">One Person Companies (OPC)</option>
                                                    <option value="Private Companies.">Private Companies.</option>
                                                    <option value="Public Companies.">Public Companies.</option>
                                                    <option value="Holding and Subsidiary Companies.">Holding and Subsidiary Companies.</option>
                                                    <option value="Associate Companies.">Associate Companies.</option>
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
                                                    Upload GST Certificate<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    name="gst_certificate"
                                                    onChange={handleChange}
                                                    required
                                                    accept=".pdf, .jpg, .jpeg, .png"
                                                    disabled={!formData.gst_checked}
                                                />
                                            </div>

                                            <div className="text-end">
                                                <button type="submit" className="mb-0 cus-btn">Save Changes</button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Company Details Card */}
                                    <div className="border card">
                                        <div className="border-bottom card-header">
                                            <h4 className="card-header-title">Company Details</h4>
                                        </div>
                                        <form className="card-body row" onSubmit={handleSubmit} >
                                            <div className="col-sm-6 mb-3">
                                                <label className="form-label">Office Address<span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="office_address"
                                                    value={formData.office_Address}
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
                                                    value={formData.city_district}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="City / District"
                                                />
                                            </div>



                                            {/* Alternative Mobile Number 1 */}
                                            <div className="col-sm-6 mb-3">
                                                <label className="form-label">Alternative Mobile Number 1</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="alt_mobile_number_1"
                                                    value={formData.alt_mobile_number_1}
                                                    onChange={handleChange}
                                                    placeholder="Alternative Mobile Number First"
                                                />
                                            </div>

                                            {/* Alternative Mobile Number */}
                                            <div className="col-sm-6 mb-3">
                                                <label className="form-label">Alternative Mobile Number 2</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="alt_mobile_number_2"
                                                    value={formData.alt_mobile_number_2}
                                                    onChange={handleChange}
                                                    placeholder="Alternative Mobile Number Second"
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
                                                    value={formData.pan_no}
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

                                            <div className="text-end">
                                                <button type="submit" className="mb-0 cus-btn">Save Changes</button>
                                            </div>

                                        </form>
                                    </div>
                                </>
                            )
                            }

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

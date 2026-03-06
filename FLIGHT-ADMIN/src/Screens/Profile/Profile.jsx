import React from "react";
import { useState, useEffect } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { isValidEmail } from "../../validatation/validation";
import { put, get } from "../../API/apiHelper";
import {
  admin_profile,
  admin_profile_update,
  admin_password_update,
} from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import verifyaccount from "../../Assets/Images/verified-account.png";

function Profile() {
  const backgroundImage =
    "https://newgrocery.readytouse.in/public/assets/back-end/img/1920x400/img2.jpg";
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [conpassword, setConpassword] = useState("");
  const [errorusername, setErrorUserName] = useState("");
  const [loading, SetLoading] = useState(true);
  const [basicloading, SetBasicloading] = useState(false);
  const [passloading, Setpassloading] = useState(false);

  useEffect(() => {
    gteprofile();
  }, []);

  // passing array 

  const handelpass = (event) => {
    setPassword(event.target.value);
  };
  const handelconpass = (event) => {
    setConpassword(event.target.value);
  };
  const handelemail = (event) => {
    setEmail(event.target.value);
    if (!isValidEmail.test(event.target.value)) {
      setErrorUserName("Enter vaild Email");
    } else {
      setErrorUserName("");
    }
  };
  const handelnumber = (event) => {
    setNumber(event.target.value);
  };
  const handelname = (event) => {
    setUserName(event.target.value);
  };
  const handlebasicSubmit = async (e) => {
    e.preventDefault();
    try {
      SetBasicloading(true);
      const postData = {
        data: JSON.stringify({ email: email, number: number, name: username }),
      };
      const response = await put(admin_profile_update, postData, true);
      const data = await response.json();
      SetBasicloading(false);
      if (response.status === 200) {
        toast.success(data.message);
      } else if (response.status === 403) {
        data.errors.forEach((error) => {
          toast.error(error.msg);
        });
      } else {
      }
    } catch (error) { }
  };
  const handlePassSubmit = async (e) => {
    if (password === "") {
      toast.error("Password Required");
    } else if (conpassword === "") {
      toast.error("Confirm Password Required");
    } else if (password === conpassword) {
      e.preventDefault();
      try {
        Setpassloading(true);
        const postData = {
          newpass: password,
          conpassword: conpassword,
        }; // Combining slug key with additional data
        const response = await put(admin_password_update, postData, true);
        const data = await response.json();
        Setpassloading(false);
        if (response.status === 200) {
          setPassword("");
          setConpassword("");
          toast.success(data.message);
        } else if (response.status === 403) {
          data.errors.forEach((error) => {
            toast.error(error.msg);
          });
        } else {
          // toast.error('error.msg');
        }
      } catch (error) { }
    } else {
      toast.error("Password does not match");
    }
  };
  async function gteprofile() {
    SetLoading(true);
    const response = await get(admin_profile, true);
    const data = await response.json();

    if (response.status === 200) {
      setUserName(data.data.name);
      setEmail(data.data.email);
      setNumber(data.data.mobile_no);
      SetLoading(false);
    } else if (response.status === 403) {
      data.errors.forEach((error) => {
        toast.error(error.msg);
      });
    } else if (response.status === 401) {
      sessionStorage.setItem("authtoken", null);
      navigate("/");
      toast.error("Session Expire");
    } else {
      toast.error("Somthing Went Wrong");
    }
  }
  return (
    <main id="content" role="main" className="main pointer-event" >
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
        <div className="page-header">
          <div className="row align-items-end">
            <h6 className="col-sm mb-2 mb-sm-0 h1 mb-0 text-capitalize d-flex align-items-center gap-2 col-6">
              <img
                width="30"
                src={verifyaccount}
                alt=""
              />
              Profile
            </h6>
            <div className="col-sm-auto col-6">
              <a className="btn btn--primary" href="/">
                <i className="tio-home mr-1"></i> Dashboard
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          {loading ? (
            <center>
              <CircularProgressBar />
            </center>
          ) : (
            <div className="col-lg-12">
              <form onSubmit={handlebasicSubmit} id="admin-profile-form">
                {/* <div className="card mb-3 mb-lg-5" id="general-div">
                <div className="profile-cover">
                  <div
                    className="profile-cover-img-wrapper profile-bg"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                    // style="background-image: url(https://newgrocery.readytouse.in/public/assets/back-end/img/1920x400/img2.jpg)"
                  ></div>
                </div>
                <div className="avatar avatar-xxl avatar-circle avatar-border-lg avatar-uploader profile-cover-avatar">
                  <img
                    id="viewer"
                    className="avatar-img"
                    src="https://newgrocery.readytouse.in/storage/app/public/admin/2024-03-21-65fc0950c5bf8.webp"
                    alt="Image"
                  />
                  <label
                    className="change-profile-image-icon"
                    for="custom-file-upload"
                  >
                    <img
                      src="https://newgrocery.readytouse.in/public/assets/back-end/img/add-photo.png"
                      alt=""
                    />
                  </label>
                </div>
              </div> */}
                <div className="card mb-3 mb-lg-5">
                  <div className="card-header">
                    <h2 className="card-title h4 text-capitalize">
                      Basic information
                    </h2>
                  </div>
                  <div className="card-body">
                    <div className="row form-group">
                      <label
                        for="firstNameLabel"
                        className="col-sm-3 col-form-label input-label"
                      >
                        Full name
                        <i
                          className="tio-help-outlined text-body ml-1"
                          data-toggle="tooltip"
                          data-placement="right"
                          title=""
                          data-original-title="Admin"
                        ></i>
                      </label>

                      <div className="col-sm-9">
                        <div className="input-group input-group-sm-down-break">
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            id="firstNameLabel"
                            placeholder="Your first name"
                            aria-label="Your first name"
                            value={username}
                            onChange={handelname}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row form-group">
                      <label
                        for="phoneLabel"
                        className="col-sm-3 col-form-label input-label"
                      >
                        Phone
                        {/* <span className="input-label-secondary">(Optional)</span> */}
                      </label>
                      <div className="col-sm-9">
                        <div className="">
                          <input
                            type="text"
                            className="form-control"
                            value={number}
                            name="phone"
                            hidden=""
                            onChange={handelnumber}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row form-group">
                      <label
                        for="newEmailLabel"
                        className="col-sm-3 col-form-label input-label"
                      >
                        Email
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          id="newEmailLabel"
                          value={email}
                          placeholder="Enter new email address"
                          onChange={handelemail}
                        />
                      </div>
                    </div>
                    {basicloading ? (
                      <CircularProgressBar />
                    ) : (
                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          data-id="admin-profile-form"
                          data-message="Want to update admin info?"
                          className="btn btn--primary form-alert"
                        >
                          Save changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
              <div id="password-div" className="card mb-3 mb-lg-5">
                <div className="card-header">
                  <h4 className="card-title">Change your password</h4>
                </div>
                <div className="card-body">
                  <div className="row form-group">
                    <label
                      for="newPassword"
                      className="col-sm-3 col-form-label input-label d-flex align-items-center"
                    >
                      New password
                    </label>
                    <div className="col-sm-9">
                      <div className="input-group input-group-merge">
                        <input
                          type="password"
                          className="js-toggle-password form-control password-check"
                          id="newPassword"
                          name="password"
                          required
                          minLength="8"
                          placeholder="Password minimum 8 characters"
                          onChange={handelpass}
                        />
                      </div>
                      {/* <span className="text-danger mx-1 password-error"></span> */}
                    </div>
                  </div>
                  <div className="row form-group">
                    <label
                      for="confirmNewPasswordLabel"
                      className="col-sm-3 col-form-label input-label"
                    >
                      Confirm password
                    </label>
                    <div className="col-sm-9">
                      <div className="mb-3">
                        <div className="input-group input-group-merge">
                          <input
                            type="password"
                            className="js-toggle-password form-control password-check"
                            name="confirm_password"
                            required
                            id="confirmNewPasswordLabel"
                            placeholder="Confirm password"
                            onChange={handelconpass}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    {passloading ? (
                      <CircularProgressBar />
                    ) : (
                      <button
                        className="btn btn--primary form-alert"
                        onClick={handlePassSubmit}
                      >
                        Update Password
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Profile;

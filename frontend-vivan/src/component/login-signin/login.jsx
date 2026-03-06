import React, { useState } from "react";
import "../../component/login-signin/login-sign.css";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../API/apiHelper";
import { account_login, forget_password } from "../../API/endpoints";
import { toast, ToastContainer } from "react-toastify";
import login_image from "../../assets/images/login.jpg";
import { FaRegUser } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { Modal } from "react-bootstrap";

const Login = () => {
  const [selectedOption, setSelectedOption] = useState("user");
  const [rememberMe, setRememberMe] = useState(false);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await post(
      account_login,
      {
        email: mobileNumber,
        password: password,
        type: selectedOption == "agent" ? "2" : "1",
      },
      true
    );
    const data = await response.json();
    if (data.status == false) {
      toast.error(data.message);
    } else {
      localStorage.setItem("authtoken", JSON.stringify(data.data.token));
      localStorage.setItem("userDatamain", JSON.stringify(data.data));
      sessionStorage.setItem("userData", JSON.stringify(data.data));
      const currentTime = Date.now();
      localStorage.setItem("lastActivityTime", currentTime);
      navigate("/");
      toast.success(data.message);
      window.location.reload();
    }
  };

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const response = await post(
        forget_password,
      { email: resetEmail },
      true
    );
    const data = await response.json();
    if (data.status === false) {
      toast.error(data.message);
    } else {
      toast.success(data.message);
      setShowModal(false); // Close the modal after successful request
    }
  };

  return (
    <section className="signup bg-white">
      <div className="container-flui">
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
          <div className="col-lg-6 col-md-9 col-sm-10 p-0">
            <div className="container-fluid">
              <div className="form-block card shadow border-0 p-4">
                <Link to="/" className="color-primary h6 mb-30">
                  <i className="fal fa-chevron-left"></i>&nbsp;&nbsp;Back To
                  Home
                </Link>
                <h2 className="light-black">Sign in</h2>
                <h6 className="mb-24">Sign in with your Registered Email</h6>
                <form
                  onSubmit={handleSubmit}
                  className="form-group contact-form"
                >
                  <div className="row">
                    <div className="col-sm-12 mb-3">
                      <div className="radio-group-sit lgin">
                        <h5 className="mb-2">You're?</h5>
                        <div className="radio-container">
                          <label
                            className={
                              selectedOption === "user" ? "active" : ""
                            }
                          >
                            <input
                              type="radio"
                              name="option"
                              value="user"
                              checked={selectedOption === "user"}
                              onChange={handleOptionChange}
                            />
                            <FaRegUser />
                            <p className="textrr">User</p>
                          </label>

                          <label
                            className={
                              selectedOption === "agent" ? "active" : ""
                            }
                          >
                            <input
                              type="radio"
                              name="option"
                              value="agent"
                              checked={selectedOption === "agent"}
                              onChange={handleOptionChange}
                            />
                            <FaUserTie />
                            <p className="textrr">Agent</p>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-xxl-10">
                      <div className="mb-24 position-relative">
                        <input
                          type="email"
                          className="form-control with-icon"
                          id="email"
                          name="mnumber"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          required
                          placeholder="Email"
                        />
                        <i className="fas fa-envelope position-absolute left-start-icon"></i>
                      </div>
                    </div>

                    <div className="col-12 col-xxl-10">
                      <div className="mb-24 position-relative">
                        <i className="fas fa-lock position-absolute left-start-icon"></i>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control with-icon"
                          id="create-password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Password"
                        />
                        <i
                          className={`fas ${
                            showPassword ? "fa-eye-slash" : "fa-eye"
                          } position-absolute toggle-password-icon`}
                          onClick={togglePasswordVisibility}
                        ></i>
                      </div>
                    </div>

                    {/* <div className="col-12 col-xxl-10">
                                            <div className="mb-24">
                                                <input type="password" className="form-control" id="create-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
                                            </div>
                                        </div> */}
                    <div className="col-12 col-xxl-10">
                      <label>
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Remember me
                      </label>
                    </div>
                    {/* <div className="col-12 col-xxl-10 d-flex justify-content-end mt-4"> */}
                    <div className="col-12 col-xxl-10 d-flex justify-content-between mt-4">
                      <span
                        className="text-primary cursor-pointer"
                        onClick={toggleModal}
                      >
                        Forgot Password?
                      </span>

                      <button type="submit" className="cus-btn small-pad mb-24">
                        Login
                      </button>
                    </div>
                  </div>
                </form>
                {errorMessage && (
                  <div className="alert-msg">{errorMessage}</div>
                )}
              </div>
              <div className="botm-p mx-5 mt-5">
                <p className="text-center">
                  Don’t have an account? <Link to="/signin">Sign Up</Link>
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 p-0">
            <div className="img-block">
              <img src={login_image} alt="Login" />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-contentlogin">
            <h4>Reset Password</h4>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                className="form-control mb-3"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
              />
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn cus-btn">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Login;

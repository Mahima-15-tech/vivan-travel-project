import React from "react";
import { useState, useEffect } from "react";
import "./login.css";
import { isValidEmail } from "../../validatation/validation";
import { post } from "../../API/apiHelper";
import { login } from "../../API/endpoints";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import CircularProgressBar from "../Component/Loading";

function Login() {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorusername, setErrorUserName] = useState("");
  const [loading, SetLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      SetLoading(true);
      const postData = { email: username, password: password }; // Combining slug key with additional data
      const response = await post(login, postData);
      const data = await response.json();
      SetLoading(false);
      if (response.status === 200) {
        sessionStorage.setItem("authtoken", JSON.stringify(data.data));
        navigate("/");
        toast.success("Login Sucessfully");
      } else if (response.status === 403) {
        data.errors.forEach((error) => {
          toast.error(error.msg);
        });
      } else if (response.status === 502) {

        toast.error(data.message);

      } else {
        // toast.error('error.msg');
      }
    } catch (error) { }
  };

  const handelemail = (event) => {
    // filltervalue()

    setUserName(event.target.value);
    if (!isValidEmail.test(event.target.value)) {
      setErrorUserName("Enter vaild Email");
    } else {
      setErrorUserName("");
    }
  };


  const handelpass = (event) => {
    setPassword(event.target.value);
  };
  return (
    <main id="content" role="main" className="main">
      {" "}
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
      <div className="position-fixed top-0 right-0 left-0 bg-img-hero __inline-1">
        <figure className="position-absolute right-0 bottom-0 left-0">
          <svg
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 1921 273"
          >
            <polygon fill="#fff" points="0,273 1921,273 1921,0 "></polygon>
          </svg>
        </figure>
      </div>
      <div className="container py-5 py-sm-7">
        {/* <a
          className="d-flex justify-content-center mb-5"
          href="https://newgrocery.readytouse.in"
        >
          <img
            className="z-index-2 onerror-logo"
            height="80"
            src={logo}
            alt="Logo"
          />
        </a> */}

        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="card card-lg mb-5">
              <div className="card-body">
                <form id="form-id" onSubmit={handleSubmit}>
                  <div className="text-center">
                    <div className="mb-5">
                      <h1 className="display-4">Sign in</h1>
                    </div>
                  </div>
                  <input
                    type="hidden"
                    className="form-control mb-3"
                    name="role"
                    id="role"
                    value="admin"
                  />
                  <div className="js-form-message form-group">
                    <label className="input-label" htmlFor="signingAdminEmail">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      name="email"
                      id="signingAdminEmail"
                      tabIndex="1"
                      placeholder="email@address.com"
                      aria-label="email@address.com"
                      onChange={handelemail}
                      required
                      data-msg="Please enter a valid email address."
                    />
                  </div>
                  <div className="js-form-message form-group">
                    <label
                      className="input-label"
                      htmlFor="signingAdminPassword"
                      // tabIndex="0"
                    >
                      <span className="d-flex justify-content-between align-items-center">
                        Password
                      </span>
                    </label>

                    <div className="input-group input-group-merge">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        className="js-toggle-password form-control form-control-lg"
                        name="password"
                        id="signingAdminPassword"
                        placeholder="8+ characters required"
                        aria-label="8+ characters required"
                        onChange={handelpass}
                        required
                      />
                      <div id="changePassTarget" className="input-group-append">
                        <button className="input-group-text"
                          type="button"
                          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                          <i
                            id="changePassIcon"
                            className={isPasswordVisible ? "tio-visible-outlined" : "tio-hidden-outlined"}
                          ></i>
                        </button>
                      </div>



                    </div>





                  </div>
                  <div className="form-group">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="termsCheckbox"
                        name="remember"
                      />
                      <label
                        className="custom-control-label text-muted"
                        htmlFor="termsCheckbox"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  {loading ? (
                    <CircularProgressBar />
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-lg btn-block btn--primary"
                    >
                      Sign in
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;

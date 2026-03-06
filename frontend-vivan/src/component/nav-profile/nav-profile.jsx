import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "../nav-profile/nav-profile.css";
import { toast } from "react-toastify";
import { post, get } from "../../API/apiHelper";
import {
  account_logout,
  users_profile,
  IMAGE_BASE_URL,
} from "../../API/endpoints";
import profileimage from "../../assets/images/profile.png";

const ProfileDropdownWidget = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [profilePreview, setProfilePreview] = useState(profileimage); // Image preview state

  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    // console.log(`hi yogesh  ${userDataFromSession}`);
    if (userDataFromSession && userDataFromSession != null) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    }
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are You Sure You Want to Sign Out?");
    if (confirmLogout) {
      try {
        const response = await post(account_logout, true);
        const data = await response.json();

        if (data.status === false) {
          toast.error(data.message);
        } else {
          localStorage.removeItem("authtoken");
          localStorage.removeItem("userDatamain");
          localStorage.removeItem("lastActivityTime");
          sessionStorage.removeItem("userData");
          toast.success(data.message);
          navigate("/");
          window.location.reload();
        }
      } catch (error) {
        toast.error("Sign Out Failed. Please Try Again.");
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await get(users_profile, true);
        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(`Error ${response.status}: ${errorMsg}`);
        }
        const data = await response.json();
        const userDataFromSession = sessionStorage.getItem("userData");
        if (userDataFromSession) {
          const userData = JSON.parse(userDataFromSession); // Parse session storage data
          userData.model = data.data; // Update the model with fetched data
          sessionStorage.setItem("userData", JSON.stringify(userData)); // Save updated data
        }
        setUserData(data.data);
        setFormData(data.data);

        {
          data.data.profile_photo == null
            ? setProfilePreview(profileimage)
            : setProfilePreview(
                `${IMAGE_BASE_URL}${data.data.profile_photo}` || profileimage
              );
        }
        // setProfilePreview(`${IMAGE_BASE_URL}${data.data.profile_photo}` || profileimage);
      } catch (error) {
        console.error("Failed to Fetch User Data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      {userData ? (
        <Dropdown>
          <Dropdown.Toggle
            className="avatar avatar-xs p-0"
            id="profileDropdown"
          >
            <img
              className="avatar-img rounded-circle"
              src={profilePreview}
              alt="avatar"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropdown-menu-end shadow pt-3 px-2 py-3"
            style={{ minWidth: "230px" }}
          >
            {userData ? (
              <Dropdown.Item as={Link} to="/user/profile-main">
                <div className="d-flex align-items-center">
                  <div className="avatar me-3">
                    <img
                      src={profilePreview}
                      alt="avatar"
                      className="avatar-img rounded-circle shadow"
                    />
                  </div>
                  <div className="username-mail">
                    <h6 className="h6 mt-2 mt-sm-0">{formData?.name || ""}</h6>
                    <p className="small m-0">{formData?.email || ""}</p>
                  </div>
                </div>
              </Dropdown.Item>
            ) : (
              ""
            )}
            {userData ? <Dropdown.Divider /> : ""}
            {userData ? (
              <Dropdown.Item
                onClick={handleLogout}
                className="bg-danger-soft-hover mychouc"
              >
                <i className="me-2 far fa-power-off"></i>
                Sign Out
              </Dropdown.Item>
            ) : (
              ""
            )}
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <div className="nav-pills-primary-soft theme-icon-active d-flex justify-content-around align-items-center p-2 pb-0">
          <NavLink to="/login" className="main-menu__logi">
            <button
              type="button"
              className="btn btn-link nav-link text-primary-hover mb-0 p-0"
            >
              Sign in / Sign up
            </button>
          </NavLink>
        </div>
      )}
    </>
  );
};

export default ProfileDropdownWidget;

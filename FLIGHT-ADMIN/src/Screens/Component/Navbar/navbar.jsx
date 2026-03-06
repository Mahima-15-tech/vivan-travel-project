import React, { useState, useEffect } from "react";
import "./navbar.css";
import { useNavigate, useHistory } from "react-router-dom";
import Footer from "../Footer";
import MenuIItem from "./Widget/MenuIItem";
import MenuItemwithSub from "./Widget/MenuItemwithSub";
import { get } from "../../../API/apiHelper";
import { IMAGE_BASE_URL, siteconfig } from "../../../API/endpoints";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userimage from "../../../Assets/Images/user.webp";
import logoutimage from "../../../Assets/Images/logout.png";
import logo from "../../../Assets/Images/logo.png";
function Navbar({ pagename, page }) {

  const navigate = useNavigate();
  const [isToggled, setIsToggled] = useState(false);
  const [isTogglednew, setIsTogglednew] = useState(false);
  useEffect(() => {
    function checklogin() {
      const authtoken = sessionStorage.getItem("authtoken");
      if (!authtoken || authtoken === "null") {
        navigate("/login");
      } else {
      }
    }
    checklogin();
  }, [navigate]);


  // function handleClick(e) {
  //   setIsmenuhide(!ismenuhide);
  //   console.log(ismenuhide);
  // }

  function logout(e) {
    sessionStorage.setItem("authtoken", "null");
    toast.success("Logout Sucessfully");
    navigate("/login");
  }
  // const Navbar = () => {
  const [ismenuhide, setIsmenuhide] = useState(false);

  const [settings, setSettings] = useState(true);
  const [loading, SetLoading] = useState(true);
  // Fetch settings data on mount
  // useEffect(() => {
  //   const fetchSettings = async () => {
  //     SetLoading(true);
  //     try {
  //       const res = await get(siteconfig, true);
  //       const response = await res.json();
  //       setSettings(response.data);
  //     } catch (error) {
  //       toast.error("Failed to fetch settings");
  //     } finally {
  //       SetLoading(false);
  //     }
  //   };

  //   fetchSettings();
  // }, []);


  // State to track class toggle

  const handleToggle = () => {
    setIsToggled(!isToggled); // Toggle the state between true and false
  };
  const handleTogglenew = () => {
    setIsTogglednew(!isTogglednew); // Toggle the state between true and false
  };





  return (
    <body
      className={
        isToggled
          ? "footer-offset footer-offset has-navbar-vertical-aside navbar-vertical-aside-show-xl mycsschinti"
          : "footer-offset footer-offset has-navbar-vertical-aside navbar-vertical-aside-show-xl"
      }
      data-new-gr-c-s-check-loaded="14.1186.0"
      data-gr-ext-installed=""
    >
      <header
        id="header"
        className="navbar navbar-expand-lg navbar-fixed navbar-height navbar-flush navbar-container shadow"
      >
        <div className="navbar-nav-wrap mycustomchint">
          <div className="navbar-brand-wrapper d-none d-sm-block d-xl-none">
            <a className="navbar-brand" href="/" aria-label="">
              {settings.admin_name}
              <img className="navbar-brand-logo" src={logo} alt="Logo" />
              <img className="navbar-brand-logo-mini" src={logo} alt="Logo" />
            </a>
          </div>
          <div className="navbar-nav-wrap-content-left">
            <button
              type="button"
              className="js-navbar-vertical-aside-toggle-invoker close mr-3 d-xl-none"
              onClick={handleTogglenew}
            >
              <i className="tio-first-page navbar-vertical-aside-toggle-short-align"></i>
              <i
                className="tio-last-page navbar-vertical-aside-toggle-full-align"
                data-template='<div className="tooltip d-none d-sm-block" role="tooltip">
                    <div className="arrow"></div><div className="tooltip-inner"></div>
                    </div>'
                data-toggle="tooltip"
                data-placement="right"
                title=""
                data-original-title="Expand"
              ></i>
            </button>
          </div>
          <div
            className="navbar-nav-wrap-content-right"
          // style="margin-right:unset; margin-left: auto">
          >
            {" "}
            <ul className="navbar-nav align-items-center flex-row gap-xl-16px">
              <div className="topbar-text dropdown disable-autohide m-1 text-capitalize">
                <a
                  className="topbar-link dropdown-toggle d-flex align-items-center title-color"
                  href="javascript:"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    className="mr-2 avatar rounded-circle"
                    width="20"
                    src={userimage}
                    alt="Name"
                  />

                  {/* <span className="d-none d-sm-block">Name</span> */}
                </a>
                <ul className="dropdown-menu position-absolute">
                  <li
                    className="change-language"
                    data-action="https://newgrocery.readytouse.in/change-language"
                    data-language-code="en"
                  >
                    <a className="dropdown-item py-1" href="/profile">
                      <img
                        className="mr-2"
                        width="20"
                        src={userimage}
                        alt="Name"
                      />
                      <span className="text-capitalize">Profile</span>
                    </a>
                  </li>
                  <li
                    className="change-language"
                    data-action="https://newgrocery.readytouse.in/change-language"
                    data-language-code="en"
                  >
                    <a className="dropdown-item py-1" href="#" onClick={logout}>
                      <img
                        className="mr-2"
                        width="20"
                        src={logoutimage}
                        alt="Name"
                      />
                      <span className="text-capitalize">Logout</span>
                    </a>
                  </li>
                </ul>
              </div>
            </ul>
          </div>
        </div>
        <div id="website_info" className="bg-secondary w-100 d-none">
          <div className="p-3">
            <div className="bg-white p-1 rounded">
              <div className="topbar-text dropdown disable-autohide m-1 text-capitalize">
                <a
                  className="topbar-link dropdown-toggle title-color d-flex align-items-center"
                  href="#"
                  data-toggle="dropdown"
                >
                  {/* <img
                    className="mr-2"
                    width="20"
                    src="https://newgrocery.readytouse.in/public/assets/front-end/img/flags/en.png"
                    alt="english"
                  /> */}
                  english
                </a>
                <ul className="dropdown-menu">
                  <li
                    className="change-language"
                    data-action="https://newgrocery.readytouse.in/change-language"
                    data-language-code="en"
                  >
                    <a className="dropdown-item pb-1" href="javascript:">
                      {/* <img
                        className="mr-2"
                        width="20"
                        src="https://newgrocery.readytouse.in/public/assets/front-end/img/flags/en.png"
                        alt="english"
                      /> */}
                      <span className="text-capitalize">english</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white p-1 rounded mt-2">
              <a
                title="Website home"
                className="p-2 title-color"
                href="https://newgrocery.readytouse.in"
                target="_blank"
              >
                <i className="tio-globe"></i>
                View website
              </a>
            </div>
            <div className="bg-white p-1 rounded mt-2">
              <a
                className="p-2  title-color"
                href="https://newgrocery.readytouse.in/admin/contact/list"
              >
                <i className="tio-email"></i>
                Message
              </a>
            </div>
            <div className="bg-white p-1 rounded mt-2">
              <a
                className="p-2  title-color"
                href="https://newgrocery.readytouse.in/admin/orders/list/pending"
              >
                <i className="tio-shopping-cart-outlined" />
                Order list
              </a>
            </div>
          </div>
        </div>
      </header>

      <aside
        className={
          isTogglednew
            ? "bg-white js-navbar-vertical-aside navbar navbar-vertical-aside navbar-vertical navbar-vertical-fixed navbar-expand-xl navbar-bordered text-start default navbar-vertical-aside-initialized mycssvishu"
            : "bg-white js-navbar-vertical-aside navbar navbar-vertical-aside navbar-vertical navbar-vertical-fixed navbar-expand-xl navbar-bordered text-start default navbar-vertical-aside-initialized"
        }
      >
        <div className="navbar-vertical-container">
          <div className="navbar-vertical-footer-offset pb-0">
            <div className="navbar-brand-wrapper justify-content-between side-logo">
              <a className="navbar-brand" href="/" aria-label="Front">
                <img className="for-web-logo max-h-30" src={logo} alt="Logo" />
              </a>
              <h2>{settings.admin_name}</h2>
              <button
                type="button"
                className="d-none js-navbar-vertical-aside-toggle-invoker navbar-vertical-aside-toggle btn btn-icon btn-xs btn-ghost-dark"
              >
                <i className="tio-clear tio-lg"></i>
              </button>

              <button
                type="button"
                className="js-navbar-vertical-aside-toggle-invoker close"
                onClick={handleToggle}
              >
                <i className="tio-first-page navbar-vertical-aside-toggle-short-align"></i>
                <i
                  className="tio-last-page navbar-vertical-aside-toggle-full-align"
                  data-template='<div className="tooltip d-none d-sm-block" role="tooltip"><div className="arrow"></div><div className="tooltip-inner"></div></div>'
                ></i>
              </button>
            </div>
            <div className="navbar-vertical-content">
              <ul className="navbar-nav navbar-nav-lg nav-tabs">
                <br />
                <MenuIItem name={"Dashboard"} link={"/"} />
                <MenuIItem
                  name={"Users"}
                  link={"/users"}
                  icon={"tio-user nav-icon"}
                />
                <MenuIItem
                  name={"Agents"}
                  link={"/agent"}
                  icon={"tio-group-senior nav-icon"}
                />
                {/* <MenuIItem
                  name={"Profile"}
                  link={"/profile"}
                  icon={"tio-user-switch nav-icon"}
                /> */}
                <MenuIItem
                  name={"Visas List"}
                  link={"/Visa"}
                  icon={"tio-visa nav-icon"}
                />
                <MenuIItem
                  name={"Applied Tickets"}
                  link={"/applied_tickets"}
                  icon={"tio-ticket nav-icon"}
                />
                <MenuIItem
                  name={"Series Tickets"}
                  link={"/applied_Series_tickets"}
                  icon={"tio-ticket nav-icon"}
                />
                <MenuIItem
                  name={"Cancel Tickets"}
                  link={"/cancel_record"}
                  icon={"tio-ticket nav-icon"}
                />
                <MenuIItem
                  name={"Offline Tickets"}
                  link={"/offline_ticket"}
                  icon={"tio-ticket nav-icon"}
                />
                <MenuIItem
                  name={"Applied visas"}
                  link={"/Applied_visas"}
                  icon={"tio-visa nav-icon"}
                />
                <MenuIItem
                  name={"Applied OTB"}
                  link={"/otb"}
                  icon={"tio-receipt-outlined nav-icon"}
                />
                <MenuIItem
                  name={"Wallet history"}
                  link={"/Wallet"}
                  icon={"tio-wallet nav-icon"}
                />
                {/* <MenuIItem
                  name={"Language"}
                  link={"/Language"}
                  icon={"tio-drag nav-icon"}
                /> */}
                <MenuIItem
                  name={"Airport"}
                  link={"/airport"}
                  icon={"tio-city nav-icon"}
                />
                <MenuIItem
                  name={"Countries"}
                  link={"/country"}
                  icon={"tio-flag nav-icon"}
                />
                <MenuIItem
                  name={"Airlines"}
                  link={"/airlines"}
                  icon={"tio-file nav-icon"}
                />
                <MenuIItem
                  name={"OTB Price"}
                  link={"/airlinesprice"}
                  icon={"tio-folder nav-icon"}
                />
                {/* <MenuIItem
                  name={"Withdraw"}
                  link={"/withdraw"}
                  icon={"tio-wallet nav-icon"}
                /> */}
                <MenuIItem
                  name={"Support"}
                  link={"/support"}
                  icon={"tio-support nav-icon"}
                />
                <MenuIItem
                  name={"Settings"}
                  link={"/Setting"}
                  icon={"tio-settings nav-icon"}
                />{" "}
                <MenuIItem
                  name={"Feedback"}
                  link={"/Feedback"}
                  icon={"tio-feed nav-icon"}
                />
                {/* <MenuItemwithSub
                  name={"FAQ"}
                  link={"/"}
                  icon={"tio-category-outlined nav-icon"}
                  submenu={[
                    { name: "Category", link: "/Faqcategory" },
                    { name: "FAQ List", link: "/Faq" },
                  ]}
                /> */}
              </ul>
            </div>
          </div>
        </div>
      </aside>
      {page}
      <Footer />
    </body>
  );
}

export default Navbar;

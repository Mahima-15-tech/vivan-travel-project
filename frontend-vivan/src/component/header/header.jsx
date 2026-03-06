import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "../header/header.css";
import Footer from "../footer/footer";
import PreLoader from "../../component/preloader/preloader";
import BackToTop from "../backtootop/backtootop";
import WhatsappSupport from "../whatsapp-support/whatsapp-support";
// import HeaderRightIcon from '../header/header-right';
import ProfileDropdown from "../nav-profile/nav-profile";
import logo from "../../assets/images/logo.png";
import { Modal } from "react-bootstrap";
import { post as HelperPost, get } from "../../API/apiHelper";
import { wallet_add, siteconfig } from "../../API/endpoints";
import { razarpaypayment } from "../../API/utils";
// import { hdfcPayment } from "../../API/utils";

import { users_profile, IMAGE_BASE_URL } from "../../API/endpoints";
import SuggestionForm from "../suggestion-form/suggestion-form";
import SearchPopup from "../search-popup/search-popup";
import SideNavbar from "../sidebar-menu/sidebarmenu";
import { TfiReload } from "react-icons/tfi";

import { IoWalletOutline } from "react-icons/io5";
import {
  FaHome,
  FaPlane,
  FaPassport,
  FaClipboardCheck,
  FaInfoCircle,
  FaPhoneAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const Logo = () => (
  <div className="main-menu__logo">
    <Link to="/">
      <img src={logo} alt="Vivan Travels Logo" />
    </Link>
  </div>
);

const WalletButtons = ({
  data,
  toggleModal,
  showModal,
  onSubmit,
  handleReload,
  loading,
  currency_code,
}) => (
  <div>
    <div>
      <label className="font-medium hover:cursor-pointer">
        <div className="d-flex align-items-center gap-2 wallet-hbtn">
          <button
            onClick={toggleModal}
            className="wallet-hbtn border-0 bg-transparent p-0"
          >
            {" "}
            <IoWalletOutline className="me-1" />
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: currency_code,
              minimumFractionDigits: 2,
            }).format(data)}
          </button>
          <button
            onClick={handleReload}
            className="wallet-hbtn border-0 bg-transparent p-0"
          >
            <TfiReload
              className={`text-2xl cursor-pointer pe-1${
                loading ? "rotate-animation" : ""
              }`}
            />
          </button>
        </div>
      </label>
    </div>

    <Modal show={showModal} onHide={toggleModal} size="M" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Recharge Wallet</Modal.Title>
      </Modal.Header>
      <form onSubmit={onSubmit}>
        <Modal.Body>
          <label htmlFor="amount">
            Recharge Amount <span>*</span>{" "}
          </label>
          <input
            className="form-control"
            name="amount"
            type="number"
            placeholder="Enter Amount"
            required
          />
          <br />

          <label htmlFor="description">Description</label>
          <input
            className="form-control"
            name="description"
            type="text"
            placeholder="Enter description"
            value="Wallet Recharge"
          />
        </Modal.Body>
        <Modal.Footer>
          <button type="Submit" className="btn btn-success">
            Recharge Now
          </button>
          <button className="btn btn-secondary" onClick={toggleModal}>
            Close
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  </div>
);

// const NavMenu = ({ data }) => (
//     <ul className="main-menu__list">
//         <li><NavLink exact to="/" activeClassName="active">Home</NavLink></li>
//         <li><NavLink to={data ? "/flight-listing" : "/login"} activeClassName="active">Flights</NavLink></li>
//         <li><NavLink to={data ? "/visa" : "/login"} activeClassName="active">Visa</NavLink></li>
//         <li><NavLink to={data ? "/oktb" : "/login"} activeClassName="active">OTB</NavLink></li>
//         <li><NavLink to="/about-us" activeClassName="active">About</NavLink></li>
//         <li><NavLink to="/Contact-us" activeClassName="active">Contact Us</NavLink></li>
//     </ul>
// );

const NavMenu = () => {
  // { data }
  const [data, setUserData] = useState(null);
  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    }
  }, []);
  return (
    <ul className="main-menu__list">
      <li>
        <NavLink exact to="/" activeClassName="active">
          <FaHome />
          HOME
        </NavLink>
      </li>
      <li>
        <NavLink
          to={data ? "/flight-listing" : "/login"}
          activeClassName="active"
        >
          <FaPlane />
          FLIGHTS
        </NavLink>
      </li>

      {/* {
                data && data.type == 2 && (
                    <>
                        <li><NavLink to={data ? "/Series-flight-listing" : "/login"} activeClassName="active">
                            <FaPlane />
                            SERIES FLIGHTS
                        </NavLink>
                        </li>
                    </>
                )
            } */}

      <li>
        <NavLink to={data ? "/visa" : "/login"} activeClassName="active">
          <FaPassport />
          VISA
        </NavLink>
      </li>
      <li>
        <NavLink to={data ? "/oktb" : "/login"} activeClassName="active">
          <FaClipboardCheck />
          OK TO BOARD
        </NavLink>
      </li>

      <li>
        <NavLink to="/about-us" activeClassName="active">
          <FaInfoCircle />
          ABOUT
        </NavLink>
      </li>
      <li>
        <NavLink to="/Contact-us" activeClassName="active">
          <FaPhoneAlt />
          CONTACT US
        </NavLink>
      </li>
    </ul>
  );
};

function Header({ setting, pagename, page }) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const [isSNavbarVisible, setIsSNavbarVisible] = useState(false);
  const toggleSNavbar = () => {
    setIsSNavbarVisible(!isSNavbarVisible);
  };
  const closeSNavbar = () => {
    setIsSNavbarVisible(false);
  };

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    }
  }, []);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // Create a FormData object from the form
    const amount = formData.get("amount"); // Get the amount
    const description = formData.get("description"); // Get the description
    const ordre_id = Math.floor(Date.now() / 1000);
    setShowModal(toggleModal);
    razarpaypayment(
      ordre_id,
      amount,
      "wallet_" + description,
      "",
      async (response) => {
        // alert(`payment data is ${JSON.stringify(response)}`);
        if (
          response.razorpay_payment_id &&
          response.razorpay_payment_id != null
        ) {
          handleReload();
          // const formData = {
          //   user_id: userData.id,
          //   order_id: ordre_id,
          //   transaction_type: description,
          //   amount: amount,
          //   payment_getway: "Rezorpay",
          //   details: JSON.stringify(response),
          //   type: "1",
          //   status: "Success",
          // };
          // const apiresponse = await HelperPost(wallet_add, formData, true);
          // const data = await apiresponse.json();
          // if (data.status == false) {
          //   console.error("Error:", data.message);
          // } else {
          //   let userData = sessionStorage.getItem("userData");
          //   userData = userData ? JSON.parse(userData) : {};
          //   userData.model.wallet = data.data.wallet;
          //   sessionStorage.setItem("userData", JSON.stringify(userData));
          //   setUserData((prevData) => ({
          //     ...prevData,
          //     wallet: data.data.wallet,
          //   }));
          // }
        }
      }
    );
  };

  const [loading, setLoading] = useState(false);

  const handleReload = async () => {
    try {
      setLoading(true);
      const response = await get(users_profile, true);
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Error ${response.status}: ${errorMsg}`);
      }
      const data = await response.json();

      const userDataFromSession = sessionStorage.getItem("userData");
      if (userDataFromSession) {
        const userData = JSON.parse(userDataFromSession);
        userData.model.wallet = data.data.wallet;
        sessionStorage.setItem("userData", JSON.stringify(userData)); // Save updated data

        setUserData(userData.model);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
    }
  };

  return (
    <>
      <PreLoader />
      <header>
        <nav className="main-menu">
          <div className="container">
            <div className="main-menu__block">
              <div className="main-menu__left">
                <Logo />
                <div className="main-menu__nav">
                  <NavMenu />
                  {/* data={userData}  */}
                </div>
              </div>
              <div className="main-menu__right d-flex">
                <div className="main-menu-signup__login d-flex">
                  {userData && (
                    <WalletButtons
                      data={userData.wallet}
                      toggleModal={toggleModal}
                      showModal={showModal}
                      onSubmit={handleSubmit}
                      handleReload={handleReload}
                      loading={loading}
                      currency_code={userData.currency_code}
                    />
                  )}
                  <div className="main-menu-signup__login d-xl-block d-none">
                    <ProfileDropdown />
                  </div>
                </div>
                {/* <button className="main-menu__toggler mobile-nav__toggler" onClick={toggleSNavbar} >
                                    <i className="fa fa-bars"></i>
                                </button> */}

                {/* <AuthButtons /> */}

                <button
                  className="main-menu__toggler mobile-nav__toggler"
                  onClick={toggleSNavbar}
                  style={{ color: isSNavbarVisible ? "red" : "" }}
                >
                  <i
                    className={`fa ${
                      isSNavbarVisible ? "fa-times" : "fa-bars"
                    }`}
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
      {page}
      {setting && <WhatsappSupport number={setting.support_whatsapp_no} />}
      <BackToTop />
      {setting && <Footer data={setting} />}

      <SearchPopup isActive={isPopupVisible} closePopup={closePopup} />

      <SideNavbar
        isSNavbarActive={isSNavbarVisible}
        setting={setting}
        closeSNavbar={toggleSNavbar}
      />
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
      <SuggestionForm />
    </>
  );
}

export default Header;

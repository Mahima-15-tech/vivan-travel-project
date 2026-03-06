import "./assets/css/bootstrap.min.css";
import "./assets/css/font-awesome.css";
import "./assets/css/slick-theme.css";
import "./assets/css/slick.css";
import "./App.css";
import React, { useState, useEffect } from "react";

import Header from "./component/header/header";
import Home from "./pages/home/home";
import Contactus from "./pages/contact-us/contact-us";
import AboutUs from "./pages/about-us/about-us";
import FlightListing from "./pages/flight-listing/flight-listing";
import FlightBooking from "./pages/flight-booking/flight-booking";
import SeriesFlightListing from "./pages/user/air_iq/Series_flights";
import Seriesbooking_list from "./pages/user/air_iq/Series_booking_list";

import Login from "./component/login-signin/login";
import Signin from "./component/login-signin/signin";
import Privacy_Policy from "./pages/privacy-policy/privacy-policy";
import TermsAndCondition from "./pages/termsandcondition/termsandcondition";
import Refund_Policy from "./pages/refundpolicy/refundpolicy";
import ProfileMain from "./pages/user/profile-main/profile-main";
import MyBookings from "./pages/user/my-bookings/my-bookings";
import WalletHistory from "./pages/user/wallet-history/wallet-history";
import Visa from "./pages/user/visa/visa";
import VisaVerification from "./pages/user/visa/visa-verification/visa-verification";
import OKTB from "./pages/user/oktb/oktb";
import VisaStatus from "./pages/user/visa/visa-status/visa-status";
import OTBStatus from "./pages/user/oktb/otb-status/otb-status";
// import AgentRegister from './pages/agent-register/agent-register'
// import AgentLogin from './pages/agent-register/agent-login'
import AgentProfile from "../src/pages/agent/agent-profile/agent-profile";
import Test from "../src/component/test";
import Ticket from "../src/pages/user/my-bookings/ticket";
import Ticket_details from "../src/pages/user/my-bookings/ticket_details";

import { get } from "./API/apiHelper";
import { siteconfig } from "./API/endpoints";

import { HashRouter, Route, Routes, useLocation } from "react-router-dom";

// Replace these URLs with your actual images
import SuccessImage from "./assets/images/success.gif";
import FailedImage from "./assets/images/failed.gif";
import { Alert } from "react-bootstrap";

function SuccessPage() {
  const location = useLocation();
  const [statusMessage, setStatusMessage] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // 'success' or 'failed'
  const [image, setImage] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const udf1 = queryParams.get("udf1");
    const statusParam = queryParams.get("status");
    const fullUrl = window.location.href;
    localStorage.setItem("lastPaymentUrl", fullUrl);

    if (statusParam && statusParam.toLowerCase() === "success") {
      setStatus("success");
      setStatusMessage("Success");
      setImage(SuccessImage);

      if (udf1 && udf1.startsWith("wallet_")) {
        setMessage(
          "✅ Payment Successful! Kindly close this tab. Your wallet balance will update automatically.\nIf it doesn’t show the updated amount, please refresh your wallet."
        );

        if (window.opener) {
          try {
            window.opener.location.reload();
          } catch (e) {
            console.warn("Could not refresh opener:", e);
          }
        }

        setTimeout(() => {
          if (window.history.length > 1) {
          } else {
            window.close(); // close if popup
          }
        }, 2000);
      } else {
        setMessage(
          "✅ Payment Successful! Please close this tab and return to the app."
        );
        setTimeout(() => {
          if (window.history.length > 1) {
          } else {
            window.close(); // close if popup
          }
        }, 3000);
      }
    } else {
      setStatus("failed");
      setStatusMessage("Failed");
      setImage(FailedImage);
      setMessage(
        "❌ Payment Failed or not completed. Please check your payment and close this tab."
      );
      setTimeout(() => {
        if (window.history.length > 1) {
        } else {
          window.close(); // close if popup
        }
      }, 5000);
    }
  }, [location.search]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Payment Status</h1>
      {image && (
        <img
          src={image}
          alt={statusMessage}
          style={{ width: "120px", height: "120px", marginBottom: "20px" }}
        />
      )}
      {statusMessage && (
        <h2
          style={{
            color: status === "success" ? "#2e7d32" : "#d32f2f",
            marginBottom: "15px",
          }}
        >
          {statusMessage}
        </h2>
      )}
      {message && (
        <p style={{ fontSize: "18px", color: "#333", whiteSpace: "pre-line" }}>
          {message}
        </p>
      )}
    </div>
  );
}

function App() {
  const [setting, setSettings] = useState(null);
  const INACTIVITY_LIMIT = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
  const lastActivityTime =
    parseInt(localStorage.getItem("lastActivityTime"), 10) || 0;
  const currentTime = Date.now();

  if (lastActivityTime && currentTime - lastActivityTime > INACTIVITY_LIMIT) {
    localStorage.removeItem("authtoken");
    localStorage.removeItem("userDatamain");
    localStorage.removeItem("lastActivityTime");
    sessionStorage.removeItem("userData");
  } else {
    if (!sessionStorage.getItem("userData")) {
      const userData = localStorage.getItem("userDatamain");
      if (userData) {
        sessionStorage.setItem("userData", userData);
      } else {
        localStorage.removeItem("authtoken");
        localStorage.removeItem("userDatamain");
        localStorage.removeItem("lastActivityTime");
        sessionStorage.removeItem("userData");
      }
    }
  }
  // Function to update last activity time

  function updateLastActivity() {
    if (localStorage.getItem("userDatamain")) {
      const currentTime = Date.now();
      localStorage.setItem("lastActivityTime", currentTime);
    }
  }
  document.addEventListener("click", updateLastActivity);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await get(siteconfig, false);
        const response = await res.json();
        setSettings(response.data);
        sessionStorage.setItem("settting", JSON.stringify(response.data));
      } catch (error) {}
    };
    fetchSettings();
    // document.addEventListener("mousemove", updateLastActivity);
  }, []);

  // Event listeners to update activity on user interaction
  // document.addEventListener("keydown", updateLastActivity);

  return (
    <HashRouter>
      <Routes>
        {/* <Route
          path="/test"
          element={<Header setting={setting} pagename={"test"} page={<Test />} />}
        /> */}
        <Route
          path="/"
          element={
            <Header
              setting={setting}
              pagename={""}
              page={<Home setting={setting} />}
            />
          }
        />
        <Route path="/success" element={<SuccessPage />} />

        <Route
          path="/Contact-us"
          element={
            <Header
              setting={setting}
              pagename={"Contact-us"}
              page={<Contactus />}
            />
          }
        />
        <Route
          path="/about-us"
          element={
            <Header
              setting={setting}
              pagename={"about-us"}
              page={<AboutUs setting={setting} />}
            />
          }
        />
        {/* <Route
          path="/login"
          element={<Header setting={setting} pagename={"log-in"} page={<Login />} />}
        /> */}
        <Route path="/login" element={<Login />} />

        {/* <Route
          path="/signin"
          element={<Header setting={setting} pagename={"sign-in"} page={<Signin />} />}
        /> */}
        <Route path="/signin" element={<Signin />} />

        <Route
          path="/flight-listing"
          element={
            <Header
              setting={setting}
              pagename={"flight-listing"}
              page={<FlightListing />}
            />
          }
        />
        <Route
          path="/flight-booking"
          element={
            <Header
              setting={setting}
              pagename={"flight-booking"}
              page={<FlightBooking />}
            />
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <Header
              setting={setting}
              pagename={"privacy-policy"}
              page={<Privacy_Policy />}
            />
          }
        />
        <Route
          path="/terms-and-condition"
          element={
            <Header
              setting={setting}
              pagename={"terms-and-condition"}
              page={<TermsAndCondition />}
            />
          }
        />
        <Route
          path="/refund-policy"
          element={
            <Header
              setting={setting}
              pagename={"refund-policy"}
              page={<Refund_Policy />}
            />
          }
        />
        <Route
          path="/user/profile-main"
          element={
            <Header
              setting={setting}
              pagename={"personal-information"}
              page={<ProfileMain />}
            />
          }
        />
        <Route
          path="/user/my-bookings"
          element={
            <Header
              setting={setting}
              pagename={"my-bookings"}
              page={<MyBookings />}
            />
          }
        />
        <Route
          path="/user/wallet-history"
          element={
            <Header
              setting={setting}
              pagename={"wallet-history"}
              page={<WalletHistory />}
            />
          }
        />
        <Route
          path="/user/commision-history"
          element={
            <Header
              setting={setting}
              pagename={"commision-history"}
              page={<commision_History />}
            />
          }
        />
        <Route
          path="/visa"
          element={
            <Header setting={setting} pagename={"visa"} page={<Visa />} />
          }
        />
        <Route
          path="/visa-verification"
          element={
            <Header
              setting={setting}
              pagename={"visa"}
              page={<VisaVerification />}
            />
          }
        />
        <Route
          path="/oktb"
          element={
            <Header setting={setting} pagename={"oktb"} page={<OKTB />} />
          }
        />
        <Route
          path="/visa-status"
          element={
            <Header
              setting={setting}
              pagename={"visa-status"}
              page={<VisaStatus />}
            />
          }
        />
        <Route
          path="/otb-status"
          element={
            <Header
              setting={setting}
              pagename={"otb-status"}
              page={<OTBStatus />}
            />
          }
        />
        {/* <Route path="/agent-register" element={<AgentRegister />} />
        <Route path="/agent-login" element={<AgentLogin />} /> */}

        <Route
          path="/agent-profile"
          element={
            <Header
              setting={setting}
              pagename={"otb-status"}
              page={<AgentProfile />}
            />
          }
        />

        <Route path="/Download_ticket/:id" element={<Ticket />} />
        <Route path="/ticket_details/:id" element={<Ticket_details />} />

        <Route
          path="/Series-flight-listing"
          element={
            <Header
              setting={setting}
              pagename={"Series-flight-listing"}
              page={<SeriesFlightListing />}
            />
          }
        />

        <Route
          path="/user/series-Tickets"
          element={
            <Header
              setting={setting}
              pagename={"series-Tickets"}
              page={<Seriesbooking_list />}
            />
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;

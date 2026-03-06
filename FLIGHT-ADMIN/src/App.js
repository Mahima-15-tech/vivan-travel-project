import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import './Assets/css/icon-set/style.css';
import './Assets/css/bootstrap.min.css';
import Navbar from "../src/Screens/Component/Navbar/navbar";
import Login from "./Screens/Auth/Login";
import Dashboard from "./Screens/Dashboard/Dashboard";
import Users from "./Screens/Users/Users";
import UsersDetails from "./Screens/Users/UserDetails";
import Profile from "./Screens/Profile/Profile";
import Support from "./Screens/Support/support";
import Report from "./Screens/Reports/report";
import Faqcategory from "./Screens/Faq/Faqcategory";
import Faq from "./Screens/Faqs/Faqlist";
import Language from "./Screens/Language/Language";
import Setting from "./Screens/Settings/Setting";
import Feedback from "./Screens/Feedback/Feedback";
import Notification from "./Screens/Notification/Notification";
import Visa from "./Screens/Visa/Visa";
import Applied_visas from "./Screens/Applied_visas/Applied_visas";
import Applied_visa_details from "./Screens/Applied_visas/Applied_visa_details";
import Visadetails from "./Screens/Visa/Visadetails";
import TicketDetails from "./Screens/Booked_ticket/TicketDetails";
import Appliedotb from "./Screens/Oktb/Oktb";
import Otbdetails from "./Screens/Oktb/Oktbdetails";
import Agent from "./Screens/Agent/Agent";
import AgentDetails from "./Screens/Agent/AgentDetails";
import AgentVisaCharges from "./Screens/Agent/VisaCharges";
import Airport from "./Screens/Country/Country";
import Country from "./Screens/CountryStatus/CountryStatus";
import Airline from "./Screens/Airline/Airline";
import Wallet from "./Screens/Wallet/Wallet";
import Withdraw from "./Screens/Withdraw/Withdraw";
import AirlinePrice from "./Screens/AirlinePrice/AirlinePrice";
import Ticket from "./Screens/Booked_ticket/Tickets";
import Cancel from "./Screens/Cancel/Cancel";
import Offline_ticket from "./Screens/Offline_ticket/offline_tickets";

import Series_tickets from "./Screens/Series_booked_ticket/Series_tickets";
import Series_Details from "./Screens/Series_booked_ticket/Series_details";

import { get } from "./API/apiHelper";
import { siteconfig } from "./API/endpoints";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {



  const [setting, setSettings] = useState(null);
  useEffect(() => {

    const fetchSettings = async () => {
      try {
        const res = await get(siteconfig, false);
        const response = await res.json();
        setSettings(response.data);
        sessionStorage.setItem('settting', JSON.stringify(response.data));
      } catch (error) {
        console.log(error)
      }
    };
    fetchSettings();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navbar pagename={"Dashboard"} page={<Dashboard />} />}
        />

        <Route
          path="/country"
          element={<Navbar pagename={"Country"} page={<Country />} />}
        />
        <Route
          path="/airport"
          element={<Navbar pagename={"Country"} page={<Airport />} />}
        />

        <Route
          path="/users"
          element={<Navbar pagename={"Users"} page={<Users />} />}
        />
        <Route
          path="/users/:userId"
          element={<Navbar pagename={"UsersDetails"} page={<UsersDetails />} />}
        />

        <Route
          path="/profile"
          element={<Navbar pagename={"Profile"} page={<Profile />} />}
        />

        <Route
          path="/support"
          element={<Navbar pagename={"Support"} page={<Support />} />}
        />

        <Route
          path="/Report"
          element={<Navbar pagename={"Report"} page={<Report />} />}
        />

        <Route
          path="/Faqcategory"
          element={<Navbar pagename={"Faqcategory"} page={<Faqcategory />} />}
        />

        <Route
          path="/Faq"
          element={<Navbar pagename={"Faq"} page={<Faq />} />}
        />

        <Route
          path="/Language"
          element={<Navbar pagename={"Language"} page={<Language />} />}
        />

        <Route
          path="/Setting"
          element={<Navbar pagename={"Setting"} page={<Setting />} />}
        />
        <Route
          path="/Feedback"
          element={<Navbar pagename={"Feedback"} page={<Feedback />} />}
        />
        <Route
          path="/Notification"
          element={<Navbar pagename={"Notification"} page={<Notification />} />}
        />

        <Route
          path="/Visa"
          element={<Navbar pagename={"Visa"} page={<Visa />} />}
        />

        <Route
          path="/Wallet"
          element={<Navbar pagename={"Wallet"} page={<Wallet />} />}
        />

        <Route
          path="/Applied_visas"
          element={
            <Navbar pagename={"Applied_visas"} page={<Applied_visas />} />
          }
        />
        <Route
          path="/Applied_visa_details/:id"
          element={<Navbar pagename={"Applied_visa_details"} page={<Applied_visa_details />} />}
        />


        <Route
          path="/Visadetails/:id"
          element={<Navbar pagename={"Visadetails"} page={<Visadetails />} />}
        />

        <Route
          path="/otb"
          element={<Navbar pagename={"Otb"} page={<Appliedotb />} />}
        />
        <Route
          path="/Otbdetails/:id"
          element={<Navbar pagename={"Otbdetails"} page={<Otbdetails />} />}
        />

        <Route
          path="/agent"
          element={<Navbar pagename={"Agent"} page={<Agent />} />}
        />
        <Route
          path="/AgentDetails/:id"
          element={<Navbar pagename={"AgentDetails"} page={<AgentDetails />} />}
        />

        <Route
          path="/AgentVisaCharges/:id"
          element={<Navbar pagename={"AgentVisaCharges"} page={<AgentVisaCharges />} />}
        />


        <Route
          path="/airlines"
          element={<Navbar pagename={"Airlines"} page={<Airline />} />}
        />
        <Route
          path="/withdraw"
          element={<Navbar pagename={"Withdraw"} page={<Withdraw />} />}
        />
        <Route
          path="/airlinesprice"
          element={<Navbar pagename={"AirlinePrice"} page={<AirlinePrice />} />}
        />
        <Route
          path="/applied_tickets"
          element={<Navbar pagename={"Ticket"} page={<Ticket />} />}
        />
        <Route
          path="/applied_Series_tickets"
          element={<Navbar pagename={"Series_tickets"} page={<Series_tickets />} />}
        />
        <Route
          path="/TicketDetails/:id"
          element={<Navbar pagename={"TicketDetails"} page={<TicketDetails />} />}
        />
        <Route
          path="/Series_TicketDetails/:id"
          element={<Navbar pagename={"Series_TicketDetails"} page={<Series_Details />} />}
        />

        <Route
          path="/cancel_record"
          element={<Navbar pagename={"Cancel"} page={<Cancel />} />}
        />


        <Route
          path="/offline_ticket"
          element={<Navbar pagename={"Offline_ticket"} page={<Offline_ticket />} />}
        />

        <Route
          path="/22"
          element={
            <Navbar
              pagename={"N/A"}
              page={
                <div className="container">
                  <div className="card">
                    <div className="card-header">
                      <h1>Welcome back Jim</h1>
                    </div>
                    <div className="card-body">
                      <p>Your account type is: Administrator</p>
                    </div>
                  </div>
                </div>
              }
            />
          }
        />
        <Route path="login" element={<Login></Login>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

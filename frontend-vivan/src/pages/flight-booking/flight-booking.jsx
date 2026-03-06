import React, { useState } from 'react';
import '../flight-listing/flight-listing.css'
import TitleBanner from '../flight-booking/title-ban'
import FlightBookingMain from '../flight-booking/flight-booking-main/flight-booking-main'
import { Link, useNavigate } from "react-router-dom";


const Flight_Booking = ({
  uData,
  data,
  traveltype,
  tripinfo,
  onUpdate,
  airlines,
  triptype,
  isisnetfarefromback,
}) => {
  const navigate = useNavigate();

  const userDataFromSession = sessionStorage.getItem("userData");
  if (!userDataFromSession) {
    navigate("/login");
  }
  return (
    <div className="flight-bookingss">
      <FlightBookingMain
        uData={uData}
        data={data}
        traveltype={traveltype}
        tripinfo={tripinfo}
        onUpdate={(updatedItem) => {
          onUpdate({});
        }}
        airlines={airlines}
        triptype={triptype}
        isisnetfarefromback={isisnetfarefromback}
      />
    </div>
  );
};

export default Flight_Booking
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Progress from "../Component/Loading";
import Ticket_Details from "./ticket_details";
import { useNavigate } from "react-router-dom";
import { post as HelperPost } from "../../API/apiHelper";
import { searchbooking } from "../../API/endpoints";

import Air_iq_ticket_details from "./air_iq_ticket_details";
import Gofly_ticket_details from "./gofly_ticket_details";
import Winfly_ticket_details from "./winfly_ticket_details";
const Ticketdetails = () => {
  const navigate = useNavigate();
  // const userDataFromSession = sessionStorage.getItem("userData");
  // if (userDataFromSession && userDataFromSession != null) {
  //   const userData = JSON.parse(userDataFromSession);
  // } else {
  //   navigate("/login");
  // }
  const { id } = useParams();
  const reference_id = id;
  const [dataticket, setdataticket] = useState(1);
  const [pax_list, setpax_list] = useState([1]);
  const [bookingdata, setbookingdata] = useState(null);

  //    console.log(reference_id);
  useEffect(() => {
    // Fetch booking data
    const getdata = async () => {
      try {
        const apiresponse = await HelperPost(
          searchbooking,
          { id: reference_id },
          true
        );
        const booking_add_data = await apiresponse.json();

        if (booking_add_data?.data) {
          setdataticket(booking_add_data.data);
          setpax_list(JSON.parse(booking_add_data.data.PAX_Details));

          // Ensure Ticket_Details is an object before parsing
          const ticketDetails = booking_add_data.data.Ticket_Details;
          setbookingdata(
            typeof ticketDetails === "string"
              ? JSON.parse(ticketDetails)
              : ticketDetails
          );
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    getdata();
  }, [reference_id, navigate]);

  return (
    <div className="border mb-4 card">
      {bookingdata && dataticket?.type === 1 ? (
        <Ticket_Details reference_id={bookingdata.Booking_RefNo} />
      ) : bookingdata && dataticket?.type === 2 ? (
        <Air_iq_ticket_details reference_id={bookingdata.Booking_RefNo} />
      ) : bookingdata && dataticket?.type === 3 ? (
        <Gofly_ticket_details
          ticket_data={dataticket}
          reference_id={dataticket.Booking_RefNo}
        />
      ) : bookingdata && dataticket && pax_list.length > 0 ? (
        <Winfly_ticket_details
          pax_list={pax_list}
          ticket_data={dataticket}
          reference_id={bookingdata.reference_id}
        />
      ) : (
        <p>No ticket details available</p>
      )}
    </div>
  );
};

export default Ticketdetails;

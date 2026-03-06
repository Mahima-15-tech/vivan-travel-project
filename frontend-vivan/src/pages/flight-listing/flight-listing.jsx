import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../flight-booking/flight-booking-main/flight-booking-main.css";
import "../flight-listing/flight-listing.css";
import "../flight-listing/flight-listing-main.css";
import "../flight-listing/booking-area-listing.css";
import TitleBanner from "../flight-listing/title-ban";
import icon2 from "../../assets/images/flight_icon/icon-2.png";
import route_plane from "../../assets/images/icon/route-plan.png";
import { Box, Typography, Container } from "@mui/material";
import { FaPlaneSlash } from "react-icons/fa";
import NoFlightsSVG from "../../assets/images/plane.png";
import { post } from "../../API/airline";
import Airlogo from "../../widget/air_logo";
import Series_flight_booking from "../user/air_iq/Series_flight_booking.jsx";
import Series_flight_booking_gofly from "../user/air_iq/Series_flight_booking_gofly.jsx";
import Series_flight_booking_4 from "../user/air_iq/Series_flight_booking_4.jsx";
import Series_flight_booking_offline from "../user/air_iq/Series_flight_booking_offline.jsx";
import { FiFilter } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";

import {
  get,
  post as apipost,
  formatDatetime,
  formatDate,
} from "../../API/apiHelper";
import {
  AIR_SEARCH,
  third_party,
  AIR_2_URL,
  country_list,
  siteconfig,
  AIR_FARERULE,
  users_profile,
  airline_code,
  api_logs,
} from "../../API/endpoints";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AutoCompleteDropdown from "../../widget/custom-dropdown/custom-dropdown";
import Progress from "../../component/Loading";
import { MdOutlineDelete } from "react-icons/md";
import FlightBooking from "../flight-booking/flight-booking";
import { Modal } from "react-bootstrap";
import { a } from "@react-spring/web";

const FlightItem = ({
  flight,
  index,
  toggleExpand,
  expanded,
  searchkey,
  othercharges,
  adultcount,
  currenttab,
  onUpdate,
  onUpdatenew,
  airlinelist,
  selectedlist,
  uData,
  isisnetfare,
  flightType,
}) => {
  const departureDateTime = flight.Segments[0].Departure_DateTime;
  const dtime = new Date(departureDateTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const arrivalDateTime = flight.Segments.at(-1)?.Arrival_DateTime;
  const aTime = new Date(arrivalDateTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  // console.log(`selectedlist ${JSON.stringify(selectedlist)}`);
  // const [checkedStatesPerTab, setCheckedStatesPerTab] = useState({});
  const handleCheckboxChange = (e, tabIndex, selectedIndex, fareId, item) => {
    // let updatedCheckedStates = { ...checkedStatesPerTab };
    // updatedCheckedStates[tabIndex] = new Array(flight.Fares.length).fill(false);
    // if(checkedStatesPerTab[currenttab]?.[index];)
    // checkedStatesPerTab[currenttab] = checkedStatesPerTab[currenttab]?.map(
    //   () => false
    // );
    // for (let index = 0; index < updatedCheckedStates.length; index++) {
    //   for (let i = 0; i < updatedCheckedStates[index].length; i++) {
    //     updatedCheckedStates[index][i] = false;
    //   }
    // }
    // updatedCheckedStates[tabIndex][selectedIndex] = true;
    // setCheckedStatesPerTab(updatedCheckedStates);

    onUpdatenew({
      ischecked: e.target.checked,
      fareid: fareId,
      item: item,
      flight: flight,
      Search_Key: searchkey,
      charges: othercharges,
      currenttab: currenttab,
      adultcount: adultcount,
      agencycharge: agencycharge,
      uData: uData,
    });
  };
  const [showTooltip, setShowTooltip] = useState(false);
  let agencycharge = {};
  const settingFromSessionup = sessionStorage.getItem("settings");
  if (settingFromSessionup) {
    // console.log("settingFromSessionup", settingFromSessionup);
    let settings = JSON.parse(settingFromSessionup);
    // agencycharge = settings.flight_agency_charge || 0;
    // Handle flight_charges if present and not null
    if (settings.flight_charges) {
      try {
        agencycharge = JSON.parse(settings.flight_charges);
      } catch (e) {
        agencycharge = {};
      }
    }
  }
  const calculateTotalJourneyTime = (flights) => {
    // let totalFlightTime = 0; // Total time spent in flights (in minutes)
    // let totalLayoverTime = 0; // Total time spent in layovers (in minutes)

    // for (let i = 0; i < flights.length; i++) {
    //   // Parse flight duration
    //   const [flightHours, flightMinutes] =
    //     flights[i].Duration.split(":").map(Number);
    //   totalFlightTime += flightHours * 60 + flightMinutes;

    //   // Calculate layover time (skip for the last flight)
    //   if (i < flights.length - 1) {
    //     const arrivalTime = new Date(flights[i].Arrival_DateTime);
    //     const nextDepartureTime = new Date(flights[i + 1].Departure_DateTime);
    //     const layoverMinutes = (nextDepartureTime - arrivalTime) / (1000 * 60);
    //     totalLayoverTime += layoverMinutes;
    //   }
    // }

    // // Convert total flight and layover time to hours and minutes
    // const totalMinutes = totalFlightTime + totalLayoverTime;
    // const hours = Math.floor(totalMinutes / 60);
    // const minutes = totalMinutes % 60;

    // return `${hours}h:${minutes}m`;
    if (!flights || flights.length === 0) return "0h 0m";

    // Group flights by Leg_Index
    const groupedByTrip = flights.reduce((acc, flight) => {
      if (!acc[flight.Leg_Index]) acc[flight.Leg_Index] = [];
      acc[flight.Leg_Index].push(flight);
      return acc;
    }, {});

    let totalMinutesAllTrips = 0;

    Object.values(groupedByTrip).forEach((tripFlights) => {
      const sorted = tripFlights.sort(
        (a, b) =>
          new Date(a.Departure_DateTime) - new Date(b.Departure_DateTime)
      );

      let totalFlightMinutes = 0;
      let totalLayoverMinutes = 0;

      for (let i = 0; i < sorted.length; i++) {
        const duration = sorted[i].Duration;

        // Extract hours and minutes using regex
        let hours = 0,
          minutes = 0;

        const matchH = duration.match(/(\d+)\s*h/i); // matches 3H or 3h
        const matchM = duration.match(/(\d+)\s*m/i); // matches 25M or 25m
        if (matchH) hours = parseInt(matchH[1], 10);
        if (matchM) minutes = parseInt(matchM[1], 10);

        // If format is like "03:25"
        if (!matchH && !matchM && duration.includes(":")) {
          const parts = duration.split(":").map(Number);
          hours = parts[0] || 0;
          minutes = parts[1] || 0;
        }

        totalFlightMinutes += hours * 60 + minutes;

        // Layover time
        if (i < sorted.length - 1) {
          const arrival = new Date(sorted[i].Arrival_DateTime);
          const nextDep = new Date(sorted[i + 1].Departure_DateTime);
          const layoverMinutes = (nextDep - arrival) / (1000 * 60);
          if (layoverMinutes > 0) totalLayoverMinutes += layoverMinutes;
        }
      }

      totalMinutesAllTrips += totalFlightMinutes + totalLayoverMinutes;
    });

    const totalHours = Math.floor(totalMinutesAllTrips / 60);
    const totalMins = Math.round(totalMinutesAllTrips % 60);

    return `${totalHours}h ${totalMins}m`;
  };
  const segments =
    flightType === "2" || flightType === "3"
      ? flight?.Segments?.filter(
          (segment) => segment?.Leg_Index === currenttab
        ) || []
      : flight?.Segments || [];
  const stops = segments.length - 1;
  const handleCopy = (flight, refund, seats, price) => {
    try {
      if (!flight) throw new Error("Flight data is missing");

      const segments = flight?.segments || flight?.Segments || [];
      const firstSegment = segments[0];
      const lastSegment = segments[segments.length - 1];
      if (!firstSegment || !lastSegment)
        throw new Error("Flight segment data is unavailable");

      const airlineName =
        airlinelist.find(
          (data) =>
            data.code === flight.Airline_Code || data.name === flight.airline
        )?.name ||
        flight.airline ||
        "Unknown Airline";

      const flightNumbers = segments
        .map((seg) => `${seg.Airline_Code} ${seg.Flight_Number}`)
        .join(", ");

      const stopovers = segments.length - 1;

      const text = `✈️${airlineName} (${flightNumbers})
  Date: ${formatDatetime(firstSegment.Departure_DateTime)}
  From: ${firstSegment.origin || "N/A"} at ${formatDatetime(
        firstSegment.Departure_DateTime || ""
      )}
  To: ${lastSegment.destination || "N/A"} at ${formatDatetime(
        lastSegment.Arrival_DateTime || ""
      )}
  Flight Type: ${
    stopovers === 0
      ? "Non Stop"
      : stopovers === 1
      ? "1 Stop"
      : `${stopovers}+ Stops`
  }
  Refundable: ${refund}
  Seats Available: ${seats}
  Price: ₹${price}`;

      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success("✈️ Flight details copied!");
        })
        .catch((err) => {
          console.error("Clipboard error:", err);
          toast.error("❌ Failed to copy flight details.");
        });
    } catch (err) {
      console.error("Copy error:", err);
      toast.error("❌ Error while copying flight details.");
    }
  };

  return (
    <div className="meri_marji" key={index}>
      <div className="flight-block bg-white light-shadow p-16 br-10 mb-16">
        <div className="flight-area">
          <div className="airline-name">
            <Airlogo
              airCode={flight.Airline_Code}
              type={flight.airline == null ? 0 : 3}
              airlinelist={airlinelist}
            />
            <div>
              <h5 className="lightest-black mb-8">
                {/* {flight?.Segments.at(0).Airline_Name} */}
                {airlinelist.find(
                  (data) =>
                    data.code === flight.Airline_Code ||
                    data.name === flight.airline
                )?.name || ""}
              </h5>
              <h6 className="dark-gray">
                {flight.Segments.map((flightNumber, index, array) => (
                  <>
                    {flightNumber.Airline_Code} {flightNumber.Flight_Number}
                    {index !== array.length - 1 ? ", " : ""}
                  </>
                ))}
              </h6>
            </div>
          </div>
          <div className="flight-detail">
            <div className="flight-departure">
              <h5 className="color-black">{dtime}</h5>
              <h5 className="dark-gray text-end">
                {flight?.Segments?.filter(
                  (segment) => segment?.Leg_Index === currenttab
                )?.at(0)?.Origin_City || ""}
              </h5>
            </div>
            <div className="d-inline-flex align-items-center gap-8">
              <span className="color-black">To</span>
              <div className="from-to text-center">
                <h5 className="dark-gray">
                  {/* {getTimeDifference(
                    flight?.Segments.at(0).Departure_DateTime || "",
                    flight?.Segments?.filter(
                      (segment) => segment.Leg_Index === currenttab
                    )?.at(-1)?.Arrival_DateTime || ""
                  )} */}
                  {calculateTotalJourneyTime(flight?.Segments)}
                </h5>
                <img
                  className="f_icon_list"
                  src={route_plane}
                  alt="route-plan"
                />
                <h6 className="color-black">
                  {stops === 0 ? "Non Stop" : `${stops} Stop`}
                </h6>
              </div>
              <span className="color-black">From</span>
            </div>
            <div className="flight-departure">
              <h5 className="color-black">{aTime}</h5>
              <h5 className="dark-gray">
                {flight?.Segments?.filter(
                  (segment) => segment.Leg_Index === currenttab
                )?.at(-1)?.Destination_City || ""}
              </h5>
            </div>
          </div>
          <div className="flight-button"></div>
        </div>
        <hr className="bg-light-gray mt-16 mb-16" />
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="color-black">{formatDate(flight.TravelDate)}</h5>
          <div>
            <button
              className="accordion-button color-primary h5 collapsed"
              onClick={() => toggleExpand(index)}
            >
              <i
                className={`fal fa-chevron-${
                  expanded ? "up" : "down"
                } color-primary`}
              ></i>
              &nbsp; View Fares ({flight.Fares.length})
            </button>
          </div>
        </div>
      </div>
      {expanded &&
        flight.Fares.map((item, index) => {
          const showFullText = (text) => {
            alert(text); // Show the full text in an alert
          };

          const truncateText = (text, length = 5) => {
            return text.trim().length > length
              ? text.substring(0, length) + "... "
              : text;
          };

          return (
            <>
              <div className="sub-listing flight-block bg-white light-shadow p-16 br-10 mb-16">
                <div className="d-flex justify-content-between align-items-center p-8 highlight-section">
                  <div>
                    <h6
                      className={`color-white mb-2 ${
                        item.Refundable ? "refundsit" : "nonrefundsit"
                      }`}
                      style={{ background: "#ffa85d" }}
                    >
                      Class: {item.ProductClass}
                    </h6>
                    <h6
                      className={`color-black mb-2 ${
                        item.Refundable ? "refundsit" : "nonrefundsit"
                      }`}
                    >
                      {item.Refundable ? "Refundable" : "Non-Refundable"}
                    </h6>
                    <h6
                      className={`color-white ${
                        item.Refundable ? "refundsit" : "nonrefundsit"
                      }`}
                      style={{ background: "#5353e1" }}
                    >
                      {(() => {
  const grouped = flight.Segments.reduce((acc, seg) => {
    acc[seg.Leg_Index] = acc[seg.Leg_Index] || [];
    acc[seg.Leg_Index].push(seg);
    return acc;
  }, {});

  // Calculate stops per leg
  const tripStops = Object.values(grouped).map((trip) => trip.length - 1);

  // Apply priority logic:
  if (tripStops.some((s) => s >= 2)) return "2+ Stop"; // Any leg has 2+ stops
  if (tripStops.some((s) => s === 1)) return "1 Stop"; // Any leg has 1 stop
  return "Non Stop"; // All legs non-stop
})()}

                    </h6>
                  </div>
                  <div>
                    <h6 className="color-black">
                      Seats Available: {item.Seats_Available}
                    </h6>{" "}
                    <h6 className="color-black">
                      Check In Baggage:{" "}
                      {item?.FareDetails?.[0]?.Free_Baggage?.Check_In_Baggage
                        ? truncateText(
                            item.FareDetails[0].Free_Baggage.Check_In_Baggage
                          )
                        : "N/A"}
                      {item?.FareDetails?.[0]?.Free_Baggage?.Check_In_Baggage?.trim()
                        ?.length > 5 && (
                        <span
                          style={{ color: "blue", cursor: "pointer" }}
                          onClick={() =>
                            showFullText(
                              item.FareDetails[0].Free_Baggage.Check_In_Baggage
                            )
                          }
                        >
                          {" "}
                          View More
                        </span>
                      )}
                    </h6>
                    <h6 className="color-black">
                      Hand Baggage:{" "}
                      {item?.FareDetails?.[0]?.Free_Baggage?.Hand_Baggage
                        ? truncateText(
                            item.FareDetails[0].Free_Baggage.Hand_Baggage
                          )
                        : "N/A"}
                      {item?.FareDetails?.[0]?.Free_Baggage?.Hand_Baggage
                        ?.length > 5 && (
                        <span
                          style={{ color: "blue", cursor: "pointer" }}
                          onClick={() =>
                            showFullText(
                              item.FareDetails[0].Free_Baggage.Hand_Baggage
                            )
                          }
                        >
                          {" "}
                          View More
                        </span>
                      )}
                    </h6>
                    {/* {item.FareDetails[0].Free_Baggage.Hand_Baggage}
                    </h6> */}
                  </div>
                  <div className="d-flex justify-content-end">
                    <p className="mb-0 text-muted">
                      {item.FareDetails[0].FareClasses[0].Class_Desc} (
                      {item.FareDetails[0].FareClasses[0].Class_Code}):
                    </p>
                    <p className="mb-0">
                      {item.FareDetails[0].FareClasses[0].FareBasis}
                    </p>
                  </div>
                  {/* <div>
                  <h6 className="color-black">Class: {item.ProductClass}</h6>
                </div> */}
                </div>
                <hr className="bg-light-gray mt-8 mb-8" />
                <div className="flight-area">
                  {/* <div className="airline-name">
                    <div>
                      <h5 className="lightest-black mb-8">
                        {flight.Segments[0].Airline_Name}
                      </h5>
                      <h6 className="dark-gray">
                       

                        {flight.Segments.map((flightNumber, index, array) => (
                          <>
                            {flightNumber.Airline_Code}{" "}
                            {flightNumber.Flight_Number}
                            {index !== array.length - 1 ? ", " : ""}
                          </>
                        ))}
                      </h6>
                    </div>
                  </div> */}
                  {/* <div className=""> */}
                  <div className="row  mx-2">
                    {(flightType === "3" || flightType === "2"
                      ? flight.Segments // no filter
                      : flight.Segments.filter(
                          (segment) => segment.Leg_Index === currenttab
                        )
                    ) // filter
                      .map((segment, index) => (
                        <>
                          <div className="row">
                            <div className="flight-departure mt-2 col-12 col-md-2">
                              <center>
                                <h5 className="color-black">
                                  {segment.Airline_Name}
                                </h5>
                                <h5
                                  className="dark-gray"
                                  style={{ "font-size": "12px" }}
                                >
                                  {`${segment.Airline_Code || ""} ${
                                    segment.Flight_Number || ""
                                  }`}
                                </h5>
                              </center>
                            </div>
                            <div className="flight-detail mt-2 col-12 col-md-10">
                              <div className="flight-departure">
                                <h6 className="color-black">
                                  {formatDatetime(
                                    segment.Departure_DateTime || ""
                                  )}
                                </h6>
                                <h6 className="dark-gray text-end">
                                  {segment.Origin_City || ""}
                                </h6>
                              </div>
                              <div className="d-inline-flex align-items-center gap-8">
                                <span>To</span>
                                <div className="from-to text-center">
                                  <h6 className="dark-gray">
                                    {segment.Duration || ""}
                                  </h6>
                                  <img
                                    className="f_icon_list"
                                    src={route_plane}
                                    alt="route-plane"
                                  />
                                  <h6 className="color-black">
                                    {segment.Stop_Over || ""} Stop
                                  </h6>
                                </div>
                                <span>From</span>
                              </div>
                              <div className="flight-departure">
                                <h6 className="color-black">
                                  {formatDatetime(
                                    segment.Arrival_DateTime || ""
                                  )}
                                </h6>
                                <h6 className="dark-gray">
                                  {segment.Destination_City || ""}
                                </h6>
                              </div>
                            </div>
                          </div>
                          {index !=
                            (flightType === "3" || flightType === "2"
                              ? flight.Segments // no filter
                              : flight.Segments.filter(
                                  (segment) => segment.Leg_Index === currenttab
                                )
                            ).length -
                              1 && (
                            <hr
                              style={{
                                border: "none",
                                borderTop: "2px dotted #000",
                                margin: "20px 0",
                              }}
                            />
                          )}
                        </>
                      ))}
                    {/* </div> */}
                  </div>

                  <div className="flight-button d-flex">
                    <div
                      key={index}
                      className="amount amountsss"
                      onMouseEnter={() => setShowTooltip(index)} // Set the current index
                      onMouseLeave={() => setShowTooltip(null)} // Clear the tooltip
                      style={{ cursor: "pointer" }}
                    >
                      <h5 className="color-black">
                        ₹
                        {(() => {
                          const fareDetails = item.FareDetails;

                          const getFareAmount = (paxType) => {
                            const fare = fareDetails.find(
                              (f) => f.PAX_Type === paxType
                            );
                            const total = Number(fare?.Total_Amount || 0);
                            const commission = Number(
                              fare?.Net_Commission || 0
                            );
                            // Remove commission only if isisnetfare and user type is "2"
                            return isisnetfare && uData?.type === "2"
                              ? total - commission
                              : total;
                          };

                          const getCharge = () => {
                            return Number(
                              isisnetfare && uData?.type === "2"
                                ? uData.agents.flight_charges["1"] ?? "0"
                                : agencycharge["1"] ?? "0"
                            );
                          };
                          const adultAmount =
                            (getFareAmount(0) + getCharge()) *
                            Number(adultcount.adult || 0);
                          const childAmount =
                            (getFareAmount(1) + getCharge()) *
                            Number(adultcount.child || 0);
                          const infantAmount =
                            (getFareAmount(2) + getCharge()) *
                            Number(adultcount.infant || 0);
                          return adultAmount + childAmount + infantAmount;
                        })().toFixed(2)}
                        {/* {item.FareDetails.reduce(
                        (acc, fare) => acc + Number(fare.Total_Amount),
                        0
                      )} */}
                        {/* {(
                          (Number(
                            item.FareDetails.find((fare) => fare.PAX_Type === 0)
                              ?.Total_Amount || 0
                          ) -
                            Number(
                              item.FareDetails.find(
                                (fare) => fare.PAX_Type === 0
                              )?.Net_Commission || 0
                            ) +
                            Number(
                              isisnetfare && uData && uData.type === "2"
                                ? uData.agents.flight_charges['1'] ?? "0"
                                : agencycharge['1'] ?? '0'
                            )) *
                          Number(adultcount.adult || 0) +
                          // Number(Details.charges) +
                          (Number(
                            item.FareDetails.find((fare) => fare.PAX_Type === 1)
                              ?.Total_Amount || 0
                          ) -
                            Number(
                              item.FareDetails.find(
                                (fare) => fare.PAX_Type === 1
                              )?.Net_Commission || 0
                            ) +
                            Number(
                              isisnetfare && uData && uData.type === "2"
                                ? uData.agents.flight_charges['1'] ?? "0"
                                : agencycharge['1'] ?? '0'
                            )) *
                          Number(adultcount.child || 0) +
                          (Number(
                            item.FareDetails.find((fare) => fare.PAX_Type === 2)
                              ?.Total_Amount || 0
                          ) -
                            Number(
                              item.FareDetails.find(
                                (fare) => fare.PAX_Type === 2
                              )?.Net_Commission || 0
                            ) +
                            Number(
                              isisnetfare && uData && uData.type === "2"
                                ? uData.agents.flight_charges['1'] ?? "0"
                                : agencycharge['1'] ?? '0'
                            )) *
                          Number(adultcount.infant || 0)
                        ).toFixed(2)} */}
                      </h5>
                      <h6 className="dark-gray text-end">Price</h6>
                    </div>
                    <div className="booknowcheckbox">
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={
                            selectedlist.find(
                              (sitem) => sitem.fareid === item.Fare_Id
                            )
                            // checkedStatesPerTab[currenttab]?.[index] || false
                          }
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              currenttab,
                              index,
                              item.Fare_Id,
                              item
                            )
                          }
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    {uData?.type === "2" && (
                      <MdOutlineContentCopy
                        className="ms-2"
                        onClick={() =>
                          handleCopy(
                            flight,
                            item.Refundable ? "Yes" : "No",
                            item.Seats_Available,
                            (() => {
                              const fareDetails = item.FareDetails;

                              const getFareAmount = (paxType) => {
                                const fare = fareDetails.find(
                                  (f) => f.PAX_Type === paxType
                                );
                                const total = Number(fare?.Total_Amount || 0);
                                const commission = Number(
                                  fare?.Net_Commission || 0
                                );
                                // Remove commission only if isisnetfare and user type is "2"
                                return isisnetfare && uData?.type === "2"
                                  ? total - commission
                                  : total;
                              };

                              const getCharge = () => {
                                return Number(
                                  isisnetfare && uData?.type === "2"
                                    ? uData.agents.flight_charges["1"] ?? "0"
                                    : agencycharge["1"] ?? "0"
                                );
                              };
                              const adultAmount =
                                (getFareAmount(0) + getCharge()) *
                                Number(adultcount.adult || 0);
                              const childAmount =
                                (getFareAmount(1) + getCharge()) *
                                Number(adultcount.child || 0);
                              const infantAmount =
                                (getFareAmount(2) + getCharge()) *
                                Number(adultcount.infant || 0);
                              return adultAmount + childAmount + infantAmount;
                            })().toFixed(2)
                          )
                        }
                      />
                    )}
                  </div>
                </div>
                <hr className="bg-light-gray mt-16 mb-16" />{" "}
                <span
                  className="checkmark"
                  dangerouslySetInnerHTML={{ __html: item.Warning || "" }}
                ></span>
              </div>
              <hr style={{ border: "none", height: "20px" }} />
            </>
          );
        })}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container mt-8">
      <ul className="pagination d-flex align-items-center justify-content-center list-unstyled m-0">
        {/* Previous Button */}
        <li className="pagination-item">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="pagination-btn"
            disabled={currentPage === 1}
          >
            <i className="far fa-chevron-left"></i>
          </button>
        </li>

        {/* Page Numbers */}
        <li className="pagination-item">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`pagination-page ${
                currentPage === page ? "active" : ""
              }`}
            >
              {page}
            </button>
          ))}
        </li>

        {/* Next Button */}
        <li className="pagination-item">
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="pagination-btn"
            disabled={currentPage === totalPages}
          >
            <i className="far fa-chevron-right"></i>
          </button>
        </li>
      </ul>
    </div>
  );
};

const FlightList = ({
  flights,
  skey,
  flightsPerPage,
  adult,
  selectedTab,
  onUpdate,
  onUpdatenew,
  airlinelist,
  selectedlist,
  uData,
  isisnetfare,
  flightType,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [configdata, setSettings] = useState("0");

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await get(siteconfig, true);
        const response = await res.json();
        setSettings(response.data.flight_agency_charge);
      } catch (error) {
        // console.log(error);
      }
    };

    fetchSettings();
  }, []);

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(flights.length / flightsPerPage);

  return (
    <div>
      {currentFlights.map((flight, index) => (
        <FlightItem
          key={index}
          flight={flight}
          index={index}
          toggleExpand={toggleExpand}
          expanded={expandedIndex === index}
          searchkey={skey}
          othercharges={configdata ? configdata : "0"}
          adultcount={adult}
          currenttab={selectedTab}
          onUpdate={(updatedItem) => {
            onUpdate({
              ...updatedItem,
            });
          }}
          onUpdatenew={(data) => {
            onUpdatenew({
              ...data,
            });
          }}
          selectedlist={selectedlist}
          airlinelist={airlinelist}
          uData={uData}
          isisnetfare={isisnetfare}
          flightType={flightType}
        />
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

const Flight_listing = () => {
  const navigate = useNavigate();

  const userDataFromSession = sessionStorage.getItem("userData");
  if (!userDataFromSession) {
    navigate("/login");
  }
  const [loading, setLoding] = useState(null);
  const [loadingforlist, setLodingforlist] = useState(null);
  const [lastName, setLastName] = useState("");
  const [returnDate, setReturnDate] = useState(null);
  const [multiCities, setMultiCities] = useState([
    { from: "", to: "", date: null },
  ]);
  const [activeTabStatus, setActiveTabStatus] = useState("byRoute");
  const [tripinfodetails, setTripinfo] = useState([]);
  const [currenttab, setTab] = useState(0);
  const [tripinfodata, setTripdata] = useState([]);
  const [setting, setSettings] = useState(null);

  let isuat = "";
  if (setting) {
    if (setting.etrav_api_prod_on == 1) {
      isuat = "no";
    } else {
      isuat = "yes";
    }
  }

  const handleTabClickStatus = (tabId) => {
    setActiveTabStatus(tabId);
  };

  const [depDate, setDepDate] = useState(null);
  const [passengers, setPassengers] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });

  const [activeTab, setActiveTab] = useState("flight");
  const [flightType, setFlightType] = useState("0");
  const [viewMore, setviewMore] = useState("");
  const [viewMoreindex, setviewMoreindex] = useState(null);
  const [agencycharge, setAgencycharge] = useState({});
  const [bookingDetails, setBookingDetails] = useState({
    depFrom: "",
    arrivalTo: "",
    depDate: "",
    returnDate: "",
    promoCode: "",
  });
  const [arrivalTo, setArrivalTo] = useState("");
  const [departureFrom, setDepartureFrom] = useState("");
  const [showError, setShowError] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab == "status") {
      handleTabClickStatus("byRoute");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  const handleFlightTypeChange = (e) => {
    setFlightType(e.target.value);
    setTab(0);
    setflightitem(null);
    setTripdata([]);
    setarraydata([]);
    setarraydatanew([]);
    setarraydata3([]);
    Setselectedlistbooking([]);
    Setselectedlisttype(null);
    Setselectedlist([]);
    Setselectedlistnew([]);
    Setsearchflightlist([]);
  };
  const [selectedDate, setSelectedDate] = useState(null);

  const getNextDay = (date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  };

  const [flightsdata, setarraydata] = useState(null);
  const [flightsdatanew, setarraydatanew] = useState(null);
  const [flightsdata2, setarraydata2] = useState(null);
  const [flightsitem, setflightitem] = useState(null);
  const [searchlabel, setSearchlabel] = useState("Search Flight");
  const [tempflightData, setarraydata3] = useState(null);
  const [tempflightData_rouund, setarraydata3_rouund] = useState([]);
  const [tempflightData2, settempflightData2] = useState([]);
  const [searchkey, setsearchkey] = useState(null);
  const [selectedAirline, setSelectedAirline] = useState("");
  const [selectedRefundable, setSelectedRefundable] = useState("");
  const [selectedstop, setSelectedstop] = useState("");
  const [refundnonrefund, setRefundnonrefund] = useState("");
  const [airpostlist, setAirpostlist] = useState([]);
  const [traveltype, settraveltype] = useState(0);
  const [airlines, setairlines] = useState([]);
  const [uData, setUData] = useState(null);

  useEffect(() => {
    fetchCountry();
    fetchSettings();
    get_airlines();
    fetchUserData();
    const settingFromSessionup = sessionStorage.getItem("settings");
    if (settingFromSessionup) {
      let settings = JSON.parse(settingFromSessionup);
      // setAgencycharge(settting.flight_agency_charge || 0);
      if (settings.flight_charges) {
        try {
          setAgencycharge(JSON.parse(settings.flight_charges));
        } catch (e) {
          setAgencycharge({});
        }
      }
    }
  }, []);
  const fetchUserData = async () => {
    try {
      const response = await get(users_profile, true);
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Error ${response.status}: ${errorMsg}`);
      }
      const data = await response.json();
      // Parse flight_charges if present and not null, else set to empty object
      try {
        if (data.data && data.data.agents && data.data.agents.flight_charges) {
          if (typeof data.data.agents.flight_charges === "string") {
            data.data.agents.flight_charges = JSON.parse(
              data.data.agents.flight_charges
            );
          }
        } else if (data.data && data.data.agents) {
          data.data.agents.flight_charges = {};
        }
      } catch (e) {
        data.data.agents.flight_charges = {};
      }
      setUData(data.data);
      Setisnetfare(data.data.type === "2");
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  const fetchCountry = async () => {
    try {
      const response = await apipost(
        country_list,
        { page: "0", limit: "50000" },
        true
      );
  
      const data = await response.json();
  
      console.log("Country API response:", data);
  
      const res = data.data.map((country) => ({
        code: country.alpha_2,              // IATA code
        name: country.country_code,        // airport name
        // country_id: country.country_id,    // optional
        display: `${country.alpha_2} - ${country.country_code}`,
      }));
      
  
      console.log("Mapped country list:", res);
  
      setAirpostlist(res);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  

  const fetchSettings = async () => {
    try {
      const res = await get(siteconfig, true);
      const response = await res.json();
      setSettings(response.data);
      setconfigdatamain(JSON.parse(response.data.flight_charges || "{}"));
    } catch (error) {
      // console.log(error);
    }
  };

  async function get_airlines() {
    try {
      const response = await post(airline_code, {}, true);
      const res = await response.json();
      setairlines(res.data.rows);
    } catch (error) {
      // console.log(error);
    }
  }

  const handleClear = () => {
    setSelectedAirline("");
    setSelectedRefundable("");
    setSelectedstop("");

    setarraydata(tempflightData);
    setarraydatanew(tempflightData);
    setarraydata2(tempflightData_rouund);
    handleFilter("", "");
  };

  const handleFilter = (event, type) => {
    let Shortdata =
      flightType == "0" ? [...tempflightData2] : [...tempflightData]; // Initialize Shortdata to a copy of tempflightData
    let airline = selectedAirline;
    let refund = selectedRefundable;
    let stop = selectedstop;
    if (type === "airline") {
      airline = event.target.value;
      setSelectedAirline(event.target.value);
    } else if (type === "refund") {
      refund = event.target.value;

      setSelectedRefundable(event.target.value);
    } else if (type === "stop") {
      stop = event.target.value;
      setSelectedstop(event.target.value);
    }
    // setTimeout(() => {
    if (airline !== "") {
      if (flightType == "0") {
        Shortdata = Shortdata.filter((flight) =>
          flight.Airline_Code
            ? (flight.Airline_Code || "").toLowerCase() ===
              airline.toLowerCase()
            : (flight.airline || "").toLowerCase() ===
              (
                airlines.find(
                  (data) => data.code.toLowerCase() === airline.toLowerCase()
                )?.name || ""
              ).toLowerCase()
        );
      } else {
        Shortdata = Shortdata.filter(
          (flight) =>
            flight.Airline_Code.toLowerCase() === airline.toLowerCase()
          // flight.Segments[0].Airline_Name.toLowerCase()===
          //   airline.toLowerCase()
        );
      }
    }

    if (refund !== "") {
      if (flightType == "0") {
        Shortdata = Shortdata.filter(
          (flight) =>
            flight.refundable == null ||
            flight.refundable === (refund === "yes")
        );
      } else {
        Shortdata = Shortdata.filter((flight) =>
          flight.Fares.some((fare) => fare.Refundable === (refund === "yes"))
        );
      }
    }

    if (stop !== "") {
      if (flightType == "0") {
        if (stop === "nonstop") {
          Shortdata = Shortdata.filter(
            (flight) => flight.segments.length === 1
          );
        } else if (stop === "1stop") {
          Shortdata = Shortdata.filter(
            (flight) => flight.segments.length === 2
          );
        } else if (stop === "2stop") {
          Shortdata = Shortdata.filter((flight) => flight.segments.length > 2);
        }
      } else {
         Shortdata = Shortdata.filter((flight) => {
      const grouped = flight.Segments.reduce((acc, seg) => {
        acc[seg.Leg_Index] = acc[seg.Leg_Index] || [];
        acc[seg.Leg_Index].push(seg);
        return acc;
      }, {});

      const tripStops = Object.values(grouped).map(
        (trip) => trip.length - 1 // stops = segments - 1
      );

      if (stop === "nonstop") {
        return tripStops.every((stops) => stops === 0);
      } else if (stop === "1stop") {
        return tripStops.some((stops) => stops === 1);
      } else if (stop === "2stop") {
        return tripStops.some((stops) => stops >= 2);
      }
    });
      }
    }

    // if (type === "stop") {
    //   Shortdata = tempflightData.filter(
    //     (flight) =>
    //       event.target.value === "Non-Stop"
    //         ? flight.Segments[0].Stop_Over === null // Checking for Non-Stop flights
    //         : flight.Segments[0].Stop_Over !== null // Checking for flights with stopovers
    //   );
    // }

    // If no filter matches, return the original data
    // if (Shortdata.length === 0) {
    //     Shortdata = [...tempflightData];  // Reset to the original data
    // }
    if (flightType == "0") {
      Setsearchflightlist(Shortdata);
    } else {
      const sortedDataval = Shortdata.sort((a, b) => {
        const totalA = a.Fares[0].FareDetails[0].Total_Amount;
        const totalB = b.Fares[0].FareDetails[0].Total_Amount;
        return totalA - totalB; // Ascending order
      });
      setarraydata(sortedDataval);
      setarraydatanew(sortedDataval);
    }

    if (flightType == "1") {
      let Shortdata_round = [];
      try {
        Shortdata_round = [...tempflightData_rouund]; // Initialize Shortdata_round to a copy of tempflightData
      } catch (error) {}
      if (type === "airline") {
        airline = event.target.value;
        setSelectedAirline(event.target.value);
      } else if (type === "refund") {
        refund = event.target.value;

        setSelectedRefundable(event.target.value);
      } else if (type === "stop") {
        stop = event.target.value;
        setSelectedstop(event.target.value);
      }
      // setTimeout(() => {
      if (airline !== "") {
        Shortdata_round = Shortdata_round.filter(
          (flight) =>
            flight.Airline_Code.toLowerCase() === airline.toLowerCase()
          // flight.Segments[0].Airline_Name.toLowerCase()===
          //   airline.toLowerCase()
        );
      }

      if (refund !== "") {
        Shortdata_round = Shortdata_round.filter((flight) =>
          flight.Fares.some((fare) => fare.Refundable === (refund === "yes"))
        );
      }

      if (stop !== "") {
        if (stop === "nonstop") {
          Shortdata_round = Shortdata_round.filter(
            (flight) => flight.Segments.length === 1
          );
        } else if (stop === "1stop") {
          Shortdata_round = Shortdata_round.filter(
            (flight) => flight.Segments.length === 2
          );
        } else if (stop === "2stop") {
          Shortdata_round = Shortdata_round.filter(
            (flight) => flight.Segments.length > 2
          );
        }
      }

      const sortedDataval_round = Shortdata_round.sort((a, b) => {
        const totalA = a.Fares[0].FareDetails[0].Total_Amount;
        const totalB = b.Fares[0].FareDetails[0].Total_Amount;
        return totalA - totalB; // Ascending order
      });
      setarraydata2(sortedDataval_round);
    }
  };

  let airlineCounts = [];
  if (flightType == "0") {
    if (tempflightData2) {
      airlineCounts = tempflightData2.reduce((acc, flight) => {
        if (flight.Airline_Code) {
          const airlineName = flight.Airline_Code;

          // Segments[0].Airline_Name;
          acc[airlineName] = (acc[airlineName] || 0) + 1;
          return acc;
        } else {
          const airlineName = airlines.find(
            (data) => data.name.toLowerCase() === flight.airline.toLowerCase()
          )?.code;
          //  console.log(
          //    `hi yogesh data is for code ${tempflightData2.length}   ${flight.airline}`
          //  );
          if (airlineName) {
            acc[airlineName] = (acc[airlineName] || 0) + 1;
          }
          return acc;
        }
      }, {});
    }
  } else {
    if (tempflightData) {
      airlineCounts = tempflightData.reduce((acc, flight) => {
        const airlineName = flight.Airline_Code;
        // Segments[0].Airline_Name;
        acc[airlineName] = (acc[airlineName] || 0) + 1;
        return acc;
      }, {});
    }

    // console.log(airlineCounts)
  }
  const [selectedOption, setSelectedOption] = useState(0);

  const options = ["ECONOMY", "BUSINESS", "FIRST", "PREMIUM_ECONOMY"];
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setTab(0);
    setflightitem(null);
    setTripdata([]);
    setarraydata([]);
    setarraydatanew([]);
    setarraydata2([]);
    setarraydata3([]);
    setarraydata3_rouund([]);
    Setselectedlistbooking([]);
    Setselectedlisttype(null);
    Setselectedlist([]);
    Setselectedlistnew([]);
    const currentTotal =
      passengers.adult + passengers.child + passengers.infant;
    if (currentTotal == 0) {
      setLoding(false);
      setLodingforlist(false);
      return alert("Select Passengers First..");
    } else if (passengers.adult == 0) {
      setLoding(false);
      setLodingforlist(false);
      return alert("Select one adult please..");
    } else if (departureFrom === arrivalTo) {
      setLoding(false);
      setLodingforlist(false);
      return alert("Select diffrent city to travel..");
    }
    setLoding(true);
    setLodingforlist(true);
    setflightitem(null);
    setTripdata([]);
    setarraydata([]);
    setarraydata2([]);
    setarraydata3([]);
    setarraydata3_rouund([]);
    Setselectedlistbooking([]);
    Setselectedlisttype(null);
    Setselectedlist([]);
    Setselectedlistnew([]);
    Setsearchflightlist([]);
    let Trip_Info = [];
    const now = new Date();

    // Combine depDate's date with current time
    const combined = new Date(
      depDate.getFullYear(),
      depDate.getMonth(),
      depDate.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    // Helper to pad values like 06, 09, etc.
    const pad = (n) => n.toString().padStart(2, "0");

    const formatted = `${combined.getFullYear()}-${pad(
      combined.getMonth() + 1
    )}-${pad(combined.getDate())} ${pad(combined.getHours())}:${pad(
      combined.getMinutes()
    )}:${pad(combined.getSeconds())}`;

    // console.log(formatted);
    if (flightType == 0) {
      Trip_Info = [
        {
          Origin: departureFrom,
          Destination: arrivalTo,
          TravelDate: depDate
            ? depDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : null,
          Trip_Id: 0,
        },
      ];
    } else if (flightType == 1 || flightType == 2) {
      Trip_Info = [
        {
          Origin: departureFrom,
          Destination: arrivalTo,
          TravelDate: depDate
            ? depDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : null,
          Trip_Id: 0,
        },
        {
          Origin: arrivalTo,
          Destination: departureFrom,
          TravelDate: returnDate
            ? returnDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : null,
          Trip_Id: 1,
        },
      ];
    } else {
      Trip_Info = [
        {
          Origin: departureFrom,
          Destination: arrivalTo,
          TravelDate: depDate
            ? depDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : null,
          Trip_Id: 0,
        },
      ];

      // Loop over each new trip and push it to Trip_Info in the specified format
      multiCities.forEach((trip, index) => {
        Trip_Info.push({
          Origin: trip.from,
          Destination: trip.to,
          TravelDate: trip.date
            ? `${String(trip.date.getMonth() + 1).padStart(2, "0")}/${String(
                trip.date.getDate()
              ).padStart(2, "0")}/${trip.date.getFullYear()}`
            : null,
          Trip_Id: index + 1, // Assuming Trip_Id starts from 1 for each new trip
        });
      });
    }

    const departureFromdata = airpostlist.find(
      (item) => item.code === departureFrom
    );
    const arrivalTodata = airpostlist.find((item) => item.code === arrivalTo);
    handleClear();
    if (!departureFromdata) {
      setLoding(false);
      setLodingforlist(false);
      return alert("Select vaild From");
    }
    if (!arrivalTodata) {
      setLoding(false);
      setLodingforlist(false);
      return alert("Select vaild To");
    }
    let traveltypevalue = 0;
    if (flightType == "3") {
      for (const trip of Trip_Info) {
        const departureFromdataval = airpostlist.find(
          (item) => item.code === trip.Origin
        );
        const arrivalTodataval = airpostlist.find(
          (item) => item.code === trip.Destination
        );

        if (departureFromdataval && arrivalTodataval) {
          if (departureFromdataval.country_id !== arrivalTodataval.country_id) {
            traveltypevalue = 1; // International

            break;
          }
        }
      }
    } else {
      traveltypevalue =
        departureFromdata.country_id === arrivalTodata.country_id ? 0 : 1;
    }

    settraveltype(traveltypevalue);
    const payload = {
      // Auth_Header: {
      //   UserId: "viviantravelsuat",
      //   Password: "3B96F16F32C9AEB30C4DF9B3FBABAE964E4E1033",
      //   IP_Address: "0000000000000",
      //   Request_Id: "5500887959052",
      //   IMEI_Number: "2232323232323",
      // },
      api_c: "a",
      is_uat: isuat,
      datetime: formatted,
      Travel_Type: traveltypevalue,
      Booking_Type: Number(flightType),
      TripInfo: Trip_Info,
      Adult_Count: passengers.adult,
      Child_Count: passengers.child,
      Infant_Count: passengers.infant,
      Class_Of_Travel: selectedOption,
      InventoryType: 0,
      Filtered_Airline: [
        {
          Airline_Code: "",
        },
      ],
    };
    if (flightType == "0") {
      payload.charges = {
        a_c: Number(configdatamain), //agency charge
        m_c: Number(
          uData && uData.type === "2"
            ? uData.agents.flight_charges["1"] ?? "0"
            : "0"
        ), //agent commission
        s_a_c: Number(
          uData && uData.type === "2"
            ? uData.agents.series_flight_booking_c || "0"
            : "0"
        ), //agency series charge
      };
    }
    const api_url = (await AIR_2_URL()) + AIR_SEARCH;
    let response;
    handleClear();
    if (flightType == "0") {

      const searchEndpoints = [
        "third_party/search1", // GOFLY
        "third_party/search2", // ETRAV
        "third_party/search3", // WINGFLY
        "third_party/search4", // AIRIQ
      ];
    
      let allFlights = [];
      let firstResponseReceived = false;
    
      const apiPromises = searchEndpoints.map((endpoint) =>
        post(endpoint, JSON.stringify(payload), api_url)
          .then((res) => res.json())
          .then(async (data) => {
    
            if (!data || data.status === false || !data.data) {
              console.log(endpoint, "No flights");
              return;
            }
    
            if (!firstResponseReceived) {
              firstResponseReceived = true;
              setLodingforlist(false);
            }
    
            // Merge all supplier flights
            allFlights = [...allFlights, ...data.data];
    
            // Simple price sort
            const sortedData = [...allFlights].sort(
              (a, b) =>
                (a.price?.isisnetfare ?? Infinity) -
                (b.price?.isisnetfare ?? Infinity)
            );
    
            setTripinfo(Trip_Info);
            Setsearchflightlist(sortedData);
            settempflightData2(sortedData);
            Setsearchflightlistindex(null);
    
            // Log API
            if (uData?.id) {
              await apipost(api_logs, {
                user_id: uData.id,
                api_name: "AIR_SEARCH",
                api_url: api_url + endpoint,
                api_payload: JSON.stringify(payload),
                api_response: JSON.stringify(data),
              }, true);
            }
    
          })
          .catch((error) => {
            console.error(`Error calling ${endpoint}:`, error);
          })
      );
    
      Promise.allSettled(apiPromises).then(() => {
        setLoding(false);
      });
    
    } else {
      response = await post(third_party, JSON.stringify(payload), api_url);
      const data = await response.json();
      if (data.status == false) {
        alert(data.message);
      } else {
        if (data.data.TripDetails) {
          setTripinfo(Trip_Info);

          setSearchlabel("Modified Search");

          setTripdata(data.data.TripDetails);
          setsearchkey(data.data.Search_Key);
          const sortedData = data.data.TripDetails[0].Flights.sort((a, b) => {
            const totalA = a.Fares[0].FareDetails[0].Total_Amount;
            const totalB = b.Fares[0].FareDetails[0].Total_Amount;
            return totalA - totalB; // Ascending order
          });
          setarraydata(sortedData);
          setarraydatanew(sortedData);
          setarraydata3(sortedData);
          if (data.data.TripDetails.length > 1) {
            const sortedData2 = data.data.TripDetails[1].Flights.sort(
              (a, b) => {
                const totalA = a.Fares[0].FareDetails[0].Total_Amount;
                const totalB = b.Fares[0].FareDetails[0].Total_Amount;
                return totalA - totalB; // Ascending order
              }
            );
            setarraydata2(sortedData2);
            setarraydata3_rouund(sortedData2);
          }
        } else {
          alert(`No flights for this trip segment`);
          setTripinfo([]);
        }

        setLoding(false);
        setLodingforlist(false);
      }
    }
  };

  const handlePassengerChange = (type, action) => {
    setPassengers((prevPassengers) => {
      const currentTotal = prevPassengers.adult + prevPassengers.child; // Total of adult and child

      // Calculate the new count for the type (e.g., adult, child, infant)
      const count = prevPassengers[type];
      const updatedCount = action === "increment" ? count + 1 : count - 1;

      // Ensure total adult and child does not exceed 9
      if (action === "increment" && type !== "infant" && currentTotal >= 9) {
        return prevPassengers; // Do nothing if the total of adult and child is 9 or more
      }

      // Ensure infants cannot exceed the number of adults
      if (
        action === "increment" &&
        type === "infant" &&
        prevPassengers.infant >= prevPassengers.adult
      ) {
        return prevPassengers; // Do nothing if infants exceed the number of adults
      }

      // If decrementing the adult count, set infants to 0
      if (
        action === "decrement" &&
        type === "adult" &&
        updatedCount < prevPassengers.adult
      ) {
        return {
          ...prevPassengers,
          adult: Math.max(0, updatedCount),
          infant:
            prevPassengers.adult > prevPassengers.infant
              ? prevPassengers.infant
              : 0, // Prevent negative infants
        };
      }

      // Update the passenger count for the selected type
      return {
        ...prevPassengers,
        [type]: Math.max(0, updatedCount), // Ensure the count doesn't go below 0
      };
    });
  };

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleClickOutside = (event) => {
    // Check if the clicked area is outside the popup
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    // Add event listener when the popup is open
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const [isFundsExpanded, setFundsExpanded] = useState(true);
  const [isStopsExpanded, setStopsExpanded] = useState(true);
  const [isAirlinesExpanded, setAirlinesExpanded] = useState(true);
  const [isisnetfare, Setisnetfare] = useState(true);
  const [isRefundableExpanded, setRefundableExpanded] = useState(true);
  const [isStopExpanded, setStopExpanded] = useState(true);
  const [showMoreAirlines, setShowMoreAirlines] = useState(false);
  const [classType, setClassType] = useState("economy");

  // const addCity = () => {
  //     setMultiCities([...multiCities, { from: "", to: "", date: null }]);
  // };

  const removeCity = (index) => {
    setMultiCities(multiCities.filter((_, i) => i !== index));
  };

  const handleCityChange = (index, field, value) => {
    let updatedCities = [...multiCities];
    if (updatedCities[index]) {
      updatedCities[index][field] = value;
      if (field == "to" && updatedCities.length > index + 1) {
        updatedCities[index + 1]["from"] = value;
      }
      updatedCities[index]["from"] =
        index == 0 ? arrivalTo : multiCities[index - 1]?.to || "";
      setMultiCities(updatedCities);
    }
  };

  const addCity = () => {
    const lastCity = multiCities[multiCities.length - 1]; // Get the last city
    const newCity = {
      from: lastCity ? lastCity.from : "", // If there's no last city, set to empty
      to: lastCity ? lastCity.to : "", // Same for "To"
      date: lastCity ? lastCity.date : null, // Use the same date or null if there is no last city
    };
    setMultiCities([...multiCities, newCity]); // Add the new city
  };

  const today = new Date();
  const [reference, setReference] = useState("");
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  function openTab(index) {
    if (index === 0 || selectedlist.length >= index) {
      if (tripinfodata.length > index) {
        // setarraydata(tripinfodata[index].Flights);
        // handleFilter("","");
        let Shortdata = tripinfodata[index].Flights; // Initialize Shortdata to a copy of tempflightData
        let airline = selectedAirline;
        let refund = selectedRefundable;
        let stop = selectedstop;

        // setTimeout(() => {
        if (airline !== "") {
          Shortdata = Shortdata.filter((flight) =>
            flight.Segments[0].Airline_Name.toLowerCase().includes(
              airline.toLowerCase()
            )
          );
        }

        if (refund !== "") {
          Shortdata = Shortdata.filter((flight) =>
            flight.Fares.some((fare) => fare.Refundable === (refund === "yes"))
          );
        }

        if (stop !== "") {
          if (stop === "nonstop") {
            Shortdata = Shortdata.filter(
              (flight) => flight.Segments.length === 1
            );
          } else if (stop === "1stop") {
            Shortdata = Shortdata.filter(
              (flight) => flight.Segments.length === 2
            );
          } else if (stop === "2stop") {
            Shortdata = Shortdata.filter(
              (flight) => flight.Segments.length > 2
            );
          }
        }
        const sortedData = Shortdata.sort((a, b) => {
          const totalA = a.Fares[0].FareDetails[0].Total_Amount;
          const totalB = b.Fares[0].FareDetails[0].Total_Amount;
          return totalA - totalB; // Ascending order
        });
        setarraydata(sortedData);
        const sortedDataval = tripinfodata[index].Flights.sort((a, b) => {
          const totalA = a.Fares[0].FareDetails[0].Total_Amount;
          const totalB = b.Fares[0].FareDetails[0].Total_Amount;
          return totalA - totalB; // Ascending order
        });
        setarraydata3(sortedDataval);
      } else {
        setarraydata([]);
        setarraydata3([]);
      }
      // if (window.innerWidth <= 768) {
      setTab(index);
      // }
    } else {
      const msg = `Select Fair for ${tripinfodetails[index - 1].Origin} - ${
        tripinfodetails[index - 1].Destination
      }`;
      alert(msg);
    }
  }

  const [selectedlist, Setselectedlist] = useState([]);
  const [selectedlistnew, Setselectedlistnew] = useState([]);
  const [searchflightlist, Setsearchflightlist] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const [searchflightlistindex, Setsearchflightlistindex] = useState(null);
  const [selectedlistbooking, Setselectedlistbooking] = useState([]);
  const [selectedlisttype, Setselectedlisttype] = useState(null);
  const [selectedlistloading, Setselectedlistloading] = useState(false);
  const [configdatamain, setconfigdatamain] = useState({});
  function setselectedlistin(params) {
    Setselectedlistloading(true);

    Setselectedlist((prevList) => {
      const index = params.currenttab;
      // 🚨 Check if all previous tabs are filled
      for (let i = 0; i < index; i++) {
        if (!prevList[i]) {
          alert(
            `Please select fare for tab ${i + 1} before selecting this one.`
          );
          Setselectedlistloading(false);
          return prevList; // No changes
        }
      }

      // ✅ Clone and update the list
      const updatedList = [...prevList];
      updatedList[index] = params;

      Setselectedlistloading(false);
      return updatedList;
    });
  }

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [fareDetails, setFareDetails] = useState(null);
  const [isfiltter1Active, setIsfiltter1Active] = useState(false);

  const handleClickfiltter1 = () => {
    setIsfiltter1Active(!isfiltter1Active);
  };
  const [fareloding, Setfareloading] = useState(false);
  const openModal = async (fareId, flightkey, searchkey) => {
    try {
      Setfareloading(true);
      const payload = {
        // Auth_Header: {
        //   UserId: "viviantravelsuat",
        //   Password: "3B96F16F32C9AEB30C4DF9B3FBABAE964E4E1033",
        //   IP_Address: "12333333",
        //   Request_Id: "5500887959052",
        //   IMEI_Number: "9536615000",
        // },
        api_c: "a",
        is_uat: isuat,
        Search_Key: searchkey,
        Flight_Key: flightkey,
        Fare_Id: fareId,
      };
      const api_url = (await AIR_2_URL()) + AIR_FARERULE;
      const response = await post(
        third_party,
        JSON.stringify(payload),
        api_url
      );
      const resp = await response.json();

      const logs_response = await apipost(
        api_logs,
        {
          user_id: "",
          api_name: "AIR_FARERULE",
          api_url: api_url,
          api_payload: JSON.stringify(payload),
          api_response: JSON.stringify(resp),
        },
        true
      );

      setFareDetails(resp.data.FareRules[0].FareRuleDesc);
      setModalIsOpen(true);
      Setfareloading(false);
    } catch (error) {
      Setfareloading(false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFareDetails(null);
  };

  const [showTooltip, setShowTooltip] = useState(false);

  const calculateTotalJourneyTime = (flights) => {
    // let totalFlightTime = 0; // Total time spent in flights (in minutes)
    // let totalLayoverTime = 0; // Total time spent in layovers (in minutes)

    // for (let i = 0; i < flights.length; i++) {
    //   // Parse flight duration
    //   const [flightHours, flightMinutes] =
    //     flights[i].Duration.split(":").map(Number);
    //   totalFlightTime += flightHours * 60 + flightMinutes;

    //   // Calculate layover time (skip for the last flight)
    //   if (i < flights.length - 1) {
    //     const arrivalTime = new Date(flights[i].Arrival_DateTime);
    //     const nextDepartureTime = new Date(flights[i + 1].Departure_DateTime);
    //     const layoverMinutes = (nextDepartureTime - arrivalTime) / (1000 * 60);
    //     totalLayoverTime += layoverMinutes;
    //   }
    // }

    // // Convert total flight and layover time to hours and minutes
    // const totalMinutes = totalFlightTime + totalLayoverTime;
    // const hours = Math.floor(totalMinutes / 60);
    // const minutes = totalMinutes % 60;

    // return `${hours}h:${minutes}m`;
    if (!flights || flights.length === 0) return "0h 0m";

    // Group flights by Leg_Index
    const groupedByTrip = flights.reduce((acc, flight) => {
      if (!acc[flight.Leg_Index]) acc[flight.Leg_Index] = [];
      acc[flight.Leg_Index].push(flight);
      return acc;
    }, {});

    let totalMinutesAllTrips = 0;

    Object.values(groupedByTrip).forEach((tripFlights) => {
      const sorted = tripFlights.sort(
        (a, b) =>
          new Date(a.departure_datetime.replace(/-/g, "/")) -
          new Date(b.departure_datetime.replace(/-/g, "/"))
      );

      let totalFlightMinutes = 0;
      let totalLayoverMinutes = 0;

      for (let i = 0; i < sorted.length; i++) {
        if (typeof sorted[i].duration === "number") {
          totalFlightMinutes += sorted[i].duration;
        } else {
          const duration = String(sorted[i].duration || "").trim();

          // Extract hours and minutes using regex
          let hours = 0,
            minutes = 0;

          const matchH = duration.match(/(\d+)\s*h/i); // matches 3H or 3h
          const matchM = duration.match(/(\d+)\s*m/i); // matches 25M or 25m
          if (matchH) hours = parseInt(matchH[1], 10);
          if (matchM) minutes = parseInt(matchM[1], 10);

          // If format is like "03:25"
          if (!matchH && !matchM && duration.includes(":")) {
            const parts = duration.split(":").map(Number);
            if (parts.length === 2) {
              hours = parts[0] || 0;
              minutes = parts[1] || 0;
            } else {
              hours = 0;
              minutes = parts[0] || 0;
            }
          }

          totalFlightMinutes += hours * 60 + minutes;

          // Layover time
          if (i < sorted.length - 1) {
            const arrival = new Date(
              sorted[i].arrival_datetime.replace(/-/g, "/")
            );
            const nextDep = new Date(
              sorted[i + 1].departure_datetime.replace(/-/g, "/")
            );
            const layoverMinutes = (nextDep - arrival) / (1000 * 60);
            if (layoverMinutes > 0) totalLayoverMinutes += layoverMinutes;
          }
        }
      }

      totalMinutesAllTrips += totalFlightMinutes + totalLayoverMinutes;
    });

    const totalHours = Math.floor(totalMinutesAllTrips / 60);
    const totalMins = Math.round(totalMinutesAllTrips % 60);

    return `${totalHours}h ${totalMins}m`;
  };
  const handleCopy = (flight) => {
    console.log(flight);
    const fromtime = new Date(
      flight?.segments?.at(0)?.departure_datetime
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    });
    const totime = new Date(
      flight?.segments?.at(-1)?.arrival_datetime
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    });

    const text = `✈️ ${
      airlines.find(
        (data) =>
          data.code === flight.Airline_Code || data.name === flight.airline
      )?.name ||
      flight.airline ||
      ""
    } (${flight.flight_numbers.join(", ")})
    Date: ${formatDatetime(flight?.segments?.at(0)?.departure_datetime)}
    From: ${flight.segments.at(-1)?.origin} at ${fromtime}
    To: ${flight.segments.at(-1)?.destination} at ${totime}
    Flight Type: ${
      flight.stopovers === 0
        ? "Non Stop"
        : flight.stopovers === 1
        ? "1 Stop"
        : "2+ Stop"
    }
    Refundable: ${flight.refundable ? "Yes" : "No"}
    Seats Available: ${flight.seats_available}
    Price: ₹${Number(
      (isisnetfare
        ? flight.price.isisnetfare
        : flight.price.Without_Net_Fare) || 0
    ).toFixed(2)}`;

    navigator.clipboard.writeText(text);
    alert("Flight details copied!");
  };
  return (
    <div className="flight-listing">
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
      <TitleBanner />

      <section className="booking mb-60">
        <div className="container">
          <div className="content">
            <div className="card">
              <div className="card-header"></div>
              <div className="card-body tab-content">
                {activeTab === "flight" && (
                  <form onSubmit={handleSubmit}>
                    <div className="custom-control mb-16">
                      <div className="radio-button">
                        <input
                          type="radio"
                          name="way"
                          className="custom-control-input"
                          id="one"
                          value="0"
                          checked={flightType === "0"}
                          onChange={handleFlightTypeChange}
                        />
                        <label className="custom-control-label" htmlFor="one">
                          One way
                        </label>
                      </div>
                      <div className="radio-button">
                        <input
                          type="radio"
                          name="way"
                          className="custom-control-input"
                          id="round"
                          value="1"
                          checked={flightType === "1"}
                          onChange={handleFlightTypeChange}
                        />
                        <label className="custom-control-label" htmlFor="round">
                          Round-trip
                        </label>
                      </div>
                      <div className="radio-button">
                        <input
                          type="radio"
                          name="way"
                          className="custom-control-input"
                          id="spround"
                          value="2"
                          checked={flightType === "2"}
                          onChange={handleFlightTypeChange}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="spround"
                        >
                          Special Round-trip
                        </label>
                      </div>
                      <div className="radio-button">
                        <input
                          type="radio"
                          name="way"
                          className="custom-control-input"
                          id="multi"
                          value="3"
                          checked={flightType === "3"}
                          onChange={handleFlightTypeChange}
                        />
                        <label className="custom-control-label" htmlFor="multi">
                          Multi-City
                        </label>
                      </div>
                    </div>

                    {/* One-way and Round-trip Fields */}
                    {flightType !== "3" && (
                      <div className="row booking-info mb-16">
                        <div className="col-12 d-xl-flex align-items-center justify-content-between gap-16 d-block p-0">
                          <div className="custom-sel-input-block sitdrpdwn">
                            <label className="h6 color-medium-gray">From</label>
                            <AutoCompleteDropdown
                              placeholder="From"
                              value={departureFrom}
                              onChange={(inputValue) => {
                                setDepartureFrom(inputValue);
                              }}
                              showError={showError}
                            />
                          </div>
                          <div
                            className="arrows"
                            onClick={() => {
                              const temp = departureFrom;
                              setDepartureFrom(arrivalTo);
                              setArrivalTo(temp);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <g clipPath="url(#clip0_518_2277)">
                                <path
                                  d="M23.6804 6.07409L18.2259 0.619583C17.7999 0.193537 17.1092 0.193537 16.6831 0.619583C16.2571 1.04563 16.2571 1.73628 16.6831 2.16233L20.2754 5.75464H1.09096C0.488472 5.75464 3.51626e-05 6.24307 3.51626e-05 6.84556C3.51626e-05 7.44804 0.488472 7.93648 1.09096 7.93648H20.2754L16.6832 11.5287C16.2571 11.9548 16.2571 12.6455 16.6832 13.0715C16.8961 13.2845 17.1753 13.391 17.4545 13.391C17.7337 13.391 18.0129 13.2845 18.2258 13.0714L23.6804 7.61688C24.1064 7.19084 24.1064 6.50013 23.6804 6.07409Z"
                                  fill="#ffa85d"
                                />
                                <path
                                  d="M22.9091 16.6637H3.72462L7.31683 13.0714C7.74288 12.6453 7.74288 11.9547 7.31683 11.5286C6.89088 11.1026 6.20013 11.1026 5.77409 11.5286L0.319535 16.9831C-0.106512 17.4092 -0.106512 18.0998 0.319535 18.5259L5.77404 23.9804C5.98713 24.1935 6.26627 24.3 6.54546 24.3C6.82465 24.3 7.10388 24.1935 7.31679 23.9804C7.74283 23.5544 7.74283 22.8637 7.31679 22.4377L3.72457 18.8455H22.9091C23.5116 18.8455 24 18.357 24 17.7546C24 17.1521 23.5116 16.6637 22.9091 16.6637Z"
                                  fill="#ffa85d"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_518_2277">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          <div className="custom-sel-input-block">
                            <label className="h6 color-medium-gray">To</label>
                            <AutoCompleteDropdown
                              placeholder="To"
                              value={arrivalTo}
                              onChange={(inputValue) => {
                                setArrivalTo(inputValue);
                              }}
                              showError={showError}
                            />
                          </div>

                          <div className="col-12 col-xl-3 d-xl-flex align-items-center gap-16">
                            <div className="input-date-picker">
                              <label
                                htmlFor="dep"
                                className="h6 color-medium-gray"
                              >
                                Departure
                              </label>
                              <DatePicker
                                selected={depDate}
                                onChange={(date) => setDepDate(date)}
                                placeholderText="dd-MM-yyyy"
                                dateFormat="dd-MMM-yyyy"
                                className="sel-input date_from"
                                style={{
                                  width: "100%",
                                  padding: "10px",
                                  cursor: "pointer",
                                }}
                                required
                                minDate={new Date(today)}
                                showMonthDropdown={false} // Disable month dropdown
                                showYearDropdown={false} // Disable year dropdown
                                maxDate={
                                  new Date(
                                    new Date().setFullYear(
                                      new Date().getFullYear() + 10
                                    )
                                  )
                                }
                                disabledKeyboardNavigation={true}
                              />
                            </div>
                            {flightType === "1" || flightType === "2" ? (
                              <div className="input-date-picker">
                                <label
                                  htmlFor="ret"
                                  className="h6 color-medium-gray"
                                >
                                  Return Date
                                </label>
                                <DatePicker
                                  selected={returnDate}
                                  onChange={(date) => setReturnDate(date)}
                                  placeholderText="dd-MM-yyyy"
                                  dateFormat="dd-MMM-yyyy"
                                  className="sel-input date_from"
                                  style={{
                                    width: "100%",
                                    padding: "10px",
                                    cursor: "pointer",
                                  }}
                                  required
                                  minDate={
                                    depDate
                                      ? new Date(depDate.getTime())
                                      : new Date()
                                  }
                                  showMonthDropdown={false} // Disable month dropdown
                                  showYearDropdown={false} // Disable year dropdown
                                  maxDate={
                                    new Date(
                                      new Date().setFullYear(
                                        new Date().getFullYear() + 10
                                      )
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className="col-12 col-xl-4 d-xl-flex align-items-center gap-16">
                            <div className="custom-sel-input-block">
                              <div className="h6 color-medium-gray">
                                Passengers No.
                              </div>
                              <div
                                className="seat-booking color-black"
                                onClick={togglePopup}
                              >
                                <span className="total-passenger">
                                  {passengers.adult +
                                    passengers.child +
                                    passengers.infant}{" "}
                                  Passengers
                                </span>
                              </div>

                              {showPopup && (
                                <div
                                  ref={popupRef}
                                  className="passenger-area pessenger-box bg-white light-shadow br-5 p-24"
                                  style={{ display: "block" }}
                                >
                                  <h4 className="color-black mb-32">
                                    Passengers
                                  </h4>
                                  <div className="passenger-box mb-24">
                                    <div className="row">
                                      <div className="col-md-7 col-sm-6 col-6">
                                        <div className="content-box">
                                          <h5 className="lightest-black">
                                            Adult
                                          </h5>
                                          <p className="color-medium-gray light">
                                            {" "}
                                            Above 12 years.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="col-md-5 col-sm-6 col-6">
                                        <div className="quantity quantity-wrap">
                                          <button
                                            className="decrement"
                                            type="button"
                                            onClick={() =>
                                              handlePassengerChange(
                                                "adult",
                                                "decrement"
                                              )
                                            }
                                          >
                                            -
                                          </button>
                                          <input
                                            className="number"
                                            type="text"
                                            value={passengers.adult}
                                            readOnly
                                            required
                                          />
                                          <button
                                            className="increment"
                                            type="button"
                                            onClick={() =>
                                              handlePassengerChange(
                                                "adult",
                                                "increment"
                                              )
                                            }
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="passenger-box mb-24">
                                    <div className="row">
                                      <div className="col-md-7 col-sm-6 col-6">
                                        <div className="content-box">
                                          <h5 className="lightest-black">
                                            Child
                                          </h5>
                                          <p className="color-medium-gray light">
                                            {" "}
                                            2-12 years on travel date.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="col-md-5 col-sm-6 col-6">
                                        <div className="quantity quantity-wrap">
                                          <button
                                            className="decrement"
                                            type="button"
                                            onClick={() =>
                                              handlePassengerChange(
                                                "child",
                                                "decrement"
                                              )
                                            }
                                          >
                                            -
                                          </button>
                                          <input
                                            className="number"
                                            type="text"
                                            value={passengers.child}
                                            readOnly
                                          />
                                          <button
                                            className="increment"
                                            type="button"
                                            onClick={() =>
                                              handlePassengerChange(
                                                "child",
                                                "increment"
                                              )
                                            }
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="passenger-box mb-24">
                                    <div className="row">
                                      <div className="col-md-7 col-sm-6 col-6">
                                        <div className="content-box">
                                          <h5 className="lightest-black">
                                            Infant
                                          </h5>
                                          <p className="color-medium-gray light">
                                            {" "}
                                            Below 2 years.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="col-md-5 col-sm-6 col-6">
                                        <div className="quantity quantity-wrap">
                                          <button
                                            className="decrement"
                                            type="button"
                                            onClick={() =>
                                              handlePassengerChange(
                                                "infant",
                                                "decrement"
                                              )
                                            }
                                          >
                                            -
                                          </button>
                                          <input
                                            className="number"
                                            type="text"
                                            value={passengers.infant}
                                            readOnly
                                          />
                                          <button
                                            className="increment"
                                            type="button"
                                            onClick={() =>
                                              handlePassengerChange(
                                                "infant",
                                                "increment"
                                              )
                                            }
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="color-medium-gray light mb-32">
                                    Please note: You can book for a maximum of
                                    nine passengers.
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="custom-sel-input-block">
                              <div className="h6 color-medium-gray">
                                Class Type
                              </div>
                              <select
                                className="sel-input"
                                value={selectedOption}
                                onChange={(e) =>
                                  handleOptionClick(e.target.value)
                                }
                                style={{
                                  width: "100%",
                                  cursor: "pointer",
                                }}
                              >
                                {options.map((option, index) => (
                                  <option key={index} value={index}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {flightType === "3" && (
                      <div>
                        <div className="row booking-info mb-8">
                          <div className="col-12 d-xl-flex align-items-center justify-content-between gap-16 d-block p-0">
                            <div className="col-12 col-xl-5 d-xl-flex align-items-center gap-16">
                              <div className="custom-sel-input-block">
                                <label className="h6 color-medium-gray">
                                  From
                                </label>
                                <AutoCompleteDropdown
                                  placeholder="From"
                                  value={departureFrom}
                                  onChange={(inputValue) => {
                                    setDepartureFrom(inputValue);
                                  }}
                                  showError={showError}
                                />
                              </div>
                              <div className="arrows">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <g clipPath="url(#clip0_518_2277)">
                                    <path
                                      d="M23.6804 6.07409L18.2259 0.619583C17.7999 0.193537 17.1092 0.193537 16.6831 0.619583C16.2571 1.04563 16.2571 1.73628 16.6831 2.16233L20.2754 5.75464H1.09096C0.488472 5.75464 3.51626e-05 6.24307 3.51626e-05 6.84556C3.51626e-05 7.44804 0.488472 7.93648 1.09096 7.93648H20.2754L16.6832 11.5287C16.2571 11.9548 16.2571 12.6455 16.6832 13.0715C16.8961 13.2845 17.1753 13.391 17.4545 13.391C17.7337 13.391 18.0129 13.2845 18.2258 13.0714L23.6804 7.61688C24.1064 7.19084 24.1064 6.50013 23.6804 6.07409Z"
                                      fill="#ffa85d"
                                    />
                                    <path
                                      d="M22.9091 16.6637H3.72462L7.31683 13.0714C7.74288 12.6453 7.74288 11.9547 7.31683 11.5286C6.89088 11.1026 6.20013 11.1026 5.77409 11.5286L0.319535 16.9831C-0.106512 17.4092 -0.106512 18.0998 0.319535 18.5259L5.77404 23.9804C5.98713 24.1935 6.26627 24.3 6.54546 24.3C6.82465 24.3 7.10388 24.1935 7.31679 23.9804C7.74283 23.5544 7.74283 22.8637 7.31679 22.4377L3.72457 18.8455H22.9091C23.5116 18.8455 24 18.357 24 17.7546C24 17.1521 23.5116 16.6637 22.9091 16.6637Z"
                                      fill="#ffa85d"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_518_2277">
                                      <rect
                                        width="24"
                                        height="24"
                                        fill="white"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </div>
                              <div className="custom-sel-input-block">
                                <label className="h6 color-medium-gray">
                                  To
                                </label>
                                <AutoCompleteDropdown
                                  placeholder="To"
                                  value={arrivalTo}
                                  onChange={(inputValue) => {
                                    setArrivalTo(inputValue);
                                    let updatedCities = [...multiCities];

                                    if (updatedCities.length != 0) {
                                      updatedCities[0]["from"] = inputValue;
                                    }
                                    setMultiCities(updatedCities);
                                  }}
                                  showError={showError}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-xl-3 d-xl-flex align-items-center gap-16">
                              <div className="input-date-picker">
                                <label
                                  htmlFor="dep"
                                  className="h6 color-medium-gray"
                                >
                                  Departure
                                </label>
                                <DatePicker
                                  selected={depDate}
                                  onChange={(date) => setDepDate(date)}
                                  placeholderText="MM/DD/YYYY"
                                  dateFormat="dd-MMM-yyyy"
                                  className="sel-input date_from"
                                  style={{
                                    width: "100%",
                                    padding: "10px",
                                    cursor: "pointer",
                                  }}
                                  required
                                  minDate={new Date(today)}
                                  showMonthDropdown={false} // Disable month dropdown
                                  showYearDropdown={false} // Disable year dropdown
                                  maxDate={
                                    new Date(
                                      new Date().setFullYear(
                                        new Date().getFullYear() + 10
                                      )
                                    )
                                  } // Maximum date is 10 years from today
                                />
                              </div>
                              {flightType === "1" ||
                                (flightType === "2" && (
                                  <div className="input-date-picker">
                                    <label
                                      htmlFor="ret"
                                      className="h6 color-medium-gray"
                                    >
                                      Return Date
                                    </label>
                                    {/* <DatePicker selected={returnDate} onChange={(date) => setReturnDate(date)} /> */}
                                    <DatePicker
                                      selected={returnDate}
                                      onChange={(date) => setReturnDate(date)}
                                      placeholderText="MM/DD/YYYY"
                                      dateFormat="MM/dd/yyyy"
                                      className="sel-input date_from"
                                      style={{
                                        width: "100%",
                                        padding: "10px",
                                        cursor: "pointer",
                                      }}
                                      required
                                      minDate={
                                        depDate
                                          ? new Date(
                                              depDate.getTime() + 86400000
                                            )
                                          : new Date()
                                      }
                                      showMonthDropdown={false} // Disable month dropdown
                                      showYearDropdown={false} // Disable year dropdown
                                      maxDate={
                                        new Date(
                                          new Date().setFullYear(
                                            new Date().getFullYear() + 10
                                          )
                                        )
                                      }
                                    />
                                  </div>
                                ))}
                            </div>
                            <div className="col-12 col-xl-3 d-xl-flex align-items-center gap-16">
                              <div className="custom-sel-input-block">
                                <div className="h6 color-medium-gray">
                                  Passengers No.
                                </div>
                                <div
                                  className="seat-booking color-black"
                                  onClick={togglePopup}
                                >
                                  <span className="total-passenger">
                                    {passengers.adult +
                                      passengers.child +
                                      passengers.infant}{" "}
                                    Passengers
                                  </span>
                                </div>

                                {showPopup && (
                                  <div
                                    ref={popupRef}
                                    className="passenger-area pessenger-box bg-white light-shadow br-5 p-24"
                                    style={{ display: "block" }}
                                  >
                                    <h4 className="color-black mb-32">
                                      Passengers
                                    </h4>
                                    <div className="passenger-box mb-24">
                                      <div className="row">
                                        <div className="col-md-7 col-sm-6 col-6">
                                          <div className="content-box">
                                            <h5 className="lightest-black">
                                              Adult
                                            </h5>
                                            <p className="color-medium-gray light">
                                              {" "}
                                              Above 12 years.
                                            </p>
                                          </div>
                                        </div>
                                        <div className="col-md-5 col-sm-6 col-6">
                                          <div className="quantity quantity-wrap">
                                            <button
                                              className="decrement"
                                              type="button"
                                              onClick={() =>
                                                handlePassengerChange(
                                                  "adult",
                                                  "decrement"
                                                )
                                              }
                                            >
                                              -
                                            </button>
                                            <input
                                              className="number"
                                              type="text"
                                              value={passengers.adult}
                                              readOnly
                                              required
                                            />
                                            <button
                                              className="increment"
                                              type="button"
                                              onClick={() =>
                                                handlePassengerChange(
                                                  "adult",
                                                  "increment"
                                                )
                                              }
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="passenger-box mb-24">
                                      <div className="row">
                                        <div className="col-md-7 col-sm-6 col-6">
                                          <div className="content-box">
                                            <h5 className="lightest-black">
                                              Child
                                            </h5>
                                            <p className="color-medium-gray light">
                                              {" "}
                                              2-12 years on travel date.
                                            </p>
                                          </div>
                                        </div>
                                        <div className="col-md-5 col-sm-6 col-6">
                                          <div className="quantity quantity-wrap">
                                            <button
                                              className="decrement"
                                              type="button"
                                              onClick={() =>
                                                handlePassengerChange(
                                                  "child",
                                                  "decrement"
                                                )
                                              }
                                            >
                                              -
                                            </button>
                                            <input
                                              className="number"
                                              type="text"
                                              value={passengers.child}
                                              readOnly
                                            />
                                            <button
                                              className="increment"
                                              type="button"
                                              onClick={() =>
                                                handlePassengerChange(
                                                  "child",
                                                  "increment"
                                                )
                                              }
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="passenger-box mb-24">
                                      <div className="row">
                                        <div className="col-md-7 col-sm-6 col-6">
                                          <div className="content-box">
                                            <h5 className="lightest-black">
                                              Infant
                                            </h5>
                                            <p className="color-medium-gray light">
                                              {" "}
                                              Below 2 years.
                                            </p>
                                          </div>
                                        </div>
                                        <div className="col-md-5 col-sm-6 col-6">
                                          <div className="quantity quantity-wrap">
                                            <button
                                              className="decrement"
                                              type="button"
                                              onClick={() =>
                                                handlePassengerChange(
                                                  "infant",
                                                  "decrement"
                                                )
                                              }
                                            >
                                              -
                                            </button>
                                            <input
                                              className="number"
                                              type="text"
                                              value={passengers.infant}
                                              readOnly
                                            />
                                            <button
                                              className="increment"
                                              type="button"
                                              onClick={() =>
                                                handlePassengerChange(
                                                  "infant",
                                                  "increment"
                                                )
                                              }
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="color-medium-gray light mb-32">
                                      Please note: You can book for a maximum of
                                      nine passengers.
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="custom-sel-input-block">
                                <div className="h6 color-medium-gray">
                                  Class Type
                                </div>
                                <select
                                  className="sel-input"
                                  value={selectedOption}
                                  onChange={(e) =>
                                    handleOptionClick(e.target.value)
                                  }
                                  style={{
                                    width: "100%",
                                    cursor: "pointer",
                                  }}
                                >
                                  {options.map((option, index) => (
                                    <option key={index} value={index}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        {multiCities.map((city, index) => (
                          <div
                            key={index}
                            className="row booking-info mb-16 city-row border-bottom pb-4 mb-2"
                          >
                            <div className="col-12 d-xl-flex align-items-center justify-content-between gap-16 d-lg-block p-0">
                              <div className="col-12 col-xl-5 d-xl-flex align-items-center gap-16">
                                <div className="custom-sel-input-block">
                                  <label className="h6 color-medium-gray">
                                    From
                                  </label>
                                  <AutoCompleteDropdown
                                    placeholder="From"
                                    readOnly
                                    value={
                                      index === 0
                                        ? arrivalTo
                                        : multiCities[index - 1]?.to || ""
                                    }
                                    showError={showError}
                                    disabled={true}
                                    onChange={() => {}} // No-op function to prevent errors
                                  />
                                </div>

                                <div className="arrows">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="mt-3"
                                  >
                                    <g clipPath="url(#clip0_518_2277)">
                                      <path
                                        d="M23.6804 6.07409L18.2259 0.619583C17.7999 0.193537 17.1092 0.193537 16.6831 0.619583C16.2571 1.04563 16.2571 1.73628 16.6831 2.16233L20.2754 5.75464H1.09096C0.488472 5.75464 3.51626e-05 6.24307 3.51626e-05 6.84556C3.51626e-05 7.44804 0.488472 7.93648 1.09096 7.93648H20.2754L16.6832 11.5287C16.2571 11.9548 16.2571 12.6455 16.6832 13.0715C16.8961 13.2845 17.1753 13.391 17.4545 13.391C17.7337 13.391 18.0129 13.2845 18.2258 13.0714L23.6804 7.61688C24.1064 7.19084 24.1064 6.50013 23.6804 6.07409Z"
                                        fill="#ffa85d"
                                      />
                                      <path
                                        d="M22.9091 16.6637H3.72462L7.31683 13.0714C7.74288 12.6453 7.74288 11.9547 7.31683 11.5286C6.89088 11.1026 6.20013 11.1026 5.77409 11.5286L0.319535 16.9831C-0.106512 17.4092 -0.106512 18.0998 0.319535 18.5259L5.77404 23.9804C5.98713 24.1935 6.26627 24.3 6.54546 24.3C6.82465 24.3 7.10388 24.1935 7.31679 23.9804C7.74283 23.5544 7.74283 22.8637 7.31679 22.4377L3.72457 18.8455H22.9091C23.5116 18.8455 24 18.357 24 17.7546C24 17.1521 23.5116 16.6637 22.9091 16.6637Z"
                                        fill="#ffa85d"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_518_2277">
                                        <rect
                                          width="24"
                                          height="24"
                                          fill="white"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </div>
                                <div className="custom-sel-input-block">
                                  <label className="h6 color-medium-gray">
                                    To
                                  </label>

                                  <AutoCompleteDropdown
                                    placeholder="To"
                                    value={multiCities[index]?.to || ""}
                                    onChange={(newValue) =>
                                      handleCityChange(index, "to", newValue)
                                    }
                                    showError={showError}
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-xl-3 d-xl-flex align-items-center gap-16">
                                <div className="input-date-picker">
                                  <label
                                    htmlFor="dep"
                                    className="h6 color-medium-gray"
                                  >
                                    Departure
                                  </label>
                                  <DatePicker
                                    selected={city.date}
                                    onChange={(date) =>
                                      handleCityChange(index, "date", date)
                                    }
                                    placeholderText="MM/DD/YYYY"
                                    dateFormat="dd-MMM-yyyy"
                                    className="sel-input date_from"
                                    style={{
                                      width: "100%",
                                      padding: "10px",
                                      cursor: "pointer",
                                    }}
                                    required
                                    minDate={
                                      multiCities[index - 1]?.date || ""
                                        ? new Date(
                                            multiCities[
                                              index - 1
                                            ]?.date.getTime() + 86400000
                                          )
                                        : new Date()
                                    }
                                    // readOnly
                                    showMonthDropdown={false} // Disable month dropdown
                                    showYearDropdown={false} // Disable year dropdown
                                    maxDate={
                                      new Date(
                                        new Date().setFullYear(
                                          new Date().getFullYear() + 10
                                        )
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-xl-3 d-xl-flex align-items-center gap-16 justify-content-end">
                                <button
                                  type="button"
                                  className="btn-delet mt-3"
                                  onClick={() => removeCity(index)}
                                >
                                  <MdOutlineDelete />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            className="cus-btn-outline"
                            onClick={addCity}
                          >
                            + Add City
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="row d-flex justify-content-end mt-4">
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-9">
                        <div className="row align-items-center">
                          <div className="col-sm-6">
                            {/* <div className="booking-info promo-code mb-sm-0 mb-16">
                                                            <div className="custom-sel-input-block m-0">
                                                                <input
                                                                    type="text"
                                                                    className="sel-input p-0"
                                                                    id="promoCode"
                                                                    name="promoCode"
                                                                    value={bookingDetails.promoCode}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter Promo Code"
                                                                />
                                                            </div>
                                                        </div> */}
                          </div>
                          <div className="col-sm-6 d-flex justify-content-end">
                            {loading ? (
                              <Progress />
                            ) : (
                              <>
                                <button type="submit" className="cus-btn">
                                  {searchlabel}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                  >
                                    <g clipPath="url(#clip0_502_1331)">
                                      <path
                                        d="M31.6933 0.544584C30.6572 -0.491824 27.1402 1.34503 26.1041 2.38143L21.9545 6.53127H3.07887C2.63024 6.53127 2.24462 6.85011 2.16055 7.29104C2.07669 7.73189 2.31798 8.16995 2.73524 8.3348L15.2174 13.2677L7.5633 20.9216H0.323909C0.168651 20.9221 0.0346723 21.0323 0.00576263 21.1852C-0.023357 21.3385 0.060152 21.4901 0.20498 21.5471L6.29687 23.9548C6.33201 24.1078 6.38108 24.2574 6.44394 24.4038L6.17745 24.6709C5.79778 25.0503 5.79778 25.6651 6.17745 26.045C6.55664 26.4247 7.17263 26.4247 7.55182 26.045L7.81194 25.785C7.95935 25.8501 8.11132 25.9014 8.26623 25.9382L10.6144 31.9561C10.6709 32.1013 10.8229 32.1851 10.976 32.1568C11.0419 32.145 11.1002 32.1123 11.1451 32.0673C11.2044 32.0087 11.2399 31.9274 11.2399 31.8382V24.7512L19.0155 16.976L23.9019 29.4993C24.0654 29.9177 24.5037 30.1608 24.9452 30.0781C25.136 30.0421 25.3038 29.9498 25.4333 29.8212C25.6038 29.6499 25.7071 29.4151 25.7077 29.1591V10.284L29.8573 6.13423C30.893 5.09789 32.7293 1.58085 31.6933 0.544584Z"
                                        fill="white"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_502_1391">
                                        <rect
                                          width="32"
                                          height="32"
                                          fill="black"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading && loadingforlist ? (
        <></>
      ) : (
        <section className="flight-listing-page mb-60">
          <div className="container">
            <div className="row">
              {selectedlistbooking.length !== 0 ? (
                selectedlisttype == 1 ? (
                  <FlightBooking
                    uData={uData}
                    data={selectedlistbooking}
                    traveltype={traveltype}
                    tripinfo={tripinfodetails}
                    onUpdate={(updatedItem) => {
                      Setselectedlistbooking([]);
                      Setselectedlisttype(null);
                      Setselectedlist([]);
                      Setselectedlistnew([]);
                      Setsearchflightlistindex(null);
                    }}
                    airlines={airlines}
                    triptype={flightType}
                    isisnetfarefromback={isisnetfare}
                  />
                ) : selectedlisttype == 2 ? (
                  <Series_flight_booking
                    data={selectedlistbooking}
                    onUpdate={(updatedItem) => {
                      Setselectedlistbooking([]);
                      Setselectedlisttype(null);
                    }}
                  />
                ) : selectedlisttype == 3 ? (
                  <Series_flight_booking_gofly
                    data={selectedlistbooking}
                    onUpdate={(updatedItem) => {
                      Setselectedlistbooking([]);
                      Setselectedlisttype(null);
                    }}
                  />
                ) : selectedlisttype == 4 ? (
                  <Series_flight_booking_4
                    data={selectedlistbooking}
                    tripinfo={tripinfodetails}
                    onUpdate={(updatedItem) => {
                      Setselectedlistbooking([]);
                      Setselectedlisttype(null);
                    }}
                  />
                ) : (
                  <Series_flight_booking_offline
                    data={selectedlistbooking}
                    onUpdate={(updatedItem) => {
                      Setselectedlistbooking([]);
                      Setselectedlisttype(null);
                    }}
                  />
                )
              ) : flightType == "0" && searchflightlist.length > 0 ? (
                <>
                  <div className="col-xl-8 col-lg-8">
                    {searchflightlist.map((flight, index) => {
                      const dtime = new Date(
                        flight?.segments?.at(0)?.departure_datetime
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false, // 24-hour format
                      });

                      const atime = new Date(
                        flight?.segments?.at(-1)?.arrival_datetime
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false, // 24-hour format
                      });

                      const previousFlight =
                        index > 0 ? searchflightlist[index - 1] : null;
                      const currentFlightKey = flight.flight_numbers.join(", ");
                      const isFirstInGroup =
                        !previousFlight ||
                        previousFlight.flight_numbers.join(", ") !==
                          currentFlightKey;

                      // Show the item if it's the first in the group OR if its flight_numbers matches viewMore
                      const shouldDisplay =
                        isFirstInGroup || viewMore === currentFlightKey;
                      const displayStyle = shouldDisplay
                        ? { display: "block" }
                        : { display: "none" };
                      const morefarecount =
                        searchflightlist.filter(
                          (i) =>
                            i.flight_numbers.join(", ") === currentFlightKey
                        ).length - 1;
                      const showFullText = (text) => {
                        alert(text); // Show the full text in an alert
                      };

                      const truncateText = (text, length = 5) => {
                        return text.trim().length > length
                          ? text.substring(0, length) + "... "
                          : text;
                      };
                      return (
                        <div
                          className="meri_marji"
                          key={index}
                          style={{
                            ...displayStyle, // Apply inline display style
                          }}
                        >
                          <div
                            className="flight-block light-shadow p-16 br-10 mb-16"
                            style={{
                              backgroundColor:
                                viewMore === currentFlightKey &&
                                viewMoreindex != index
                                  ? "rgb(183 197 255)"
                                  : "#F8F8FF",
                            }}
                          >
                            <div className="flight-area">
                              <div className="airline-name">
                                <Airlogo
                                  airCode={flight.Airline_Code}
                                  airline={flight.airline}
                                  type={flight.airline == null ? 0 : 3}
                                  airlinelist={airlines}
                                />
                                <div>
                                  <h5 className="lightest-black mb-8">
                                    {/* {flight?.Segments.at(0).Airline_Name} */}
                                    {airlines.find(
                                      (data) =>
                                        data.code === flight.Airline_Code ||
                                        data.name === flight.airline
                                    )?.name ||
                                      flight.airline ||
                                      ""}
                                  </h5>
                                  <h6 className="dark-gray">
                                    {flight.flight_numbers.join(", ")}
                                  </h6>
                                </div>
                              </div>
                              <div className="flight-detail">
                                <div className="flight-departure">
                                  <h5 className="color-black">{dtime}</h5>
                                  <h5 className="dark-gray text-end">
                                    {flight?.segments?.at(0).origin || ""}
                                  </h5>
                                </div>
                                <div className="d-inline-flex align-items-center gap-8">
                                  <span className="color-black">To</span>
                                  <div className="from-to text-center">
                                    <h6 className="color-black">
                                      {calculateTotalJourneyTime(
                                        flight?.segments
                                      )}
                                    </h6>
                                    <img
                                      className="f_icon_list"
                                      src={route_plane}
                                      alt="route-plan"
                                    />
                                    <h6 className="color-black">
                                      {flight?.stopovers || "Non"} Stop
                                    </h6>
                                  </div>
                                  <span className="color-black">From</span>
                                </div>
                                <div className="flight-departure">
                                  <h5 className="color-black">{atime}</h5>
                                  <h5 className="dark-gray">
                                    {flight?.segments?.at(-1)?.destination ||
                                      ""}
                                  </h5>
                                </div>
                              </div>
                              <div className="flight-button">
                                {" "}
                                <div className="d-flex">
                                  <h4>
                                    ₹
                                    {Number(
                                      (isisnetfare
                                        ? flight.price.isisnetfare
                                        : flight.price.Without_Net_Fare) || 0
                                    ).toFixed(2)}
                                  </h4>
                                  {uData?.type === "2" && (
                                    <MdOutlineContentCopy
                                      className="ms-2"
                                      onClick={() => handleCopy(flight)}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <hr className="bg-light-gray mt-16 mb-16" />
                            <div className="d-flex justify-content-between">
                              <h5 className="color-black">
                                {formatDate(flight.departure_datetime)}
                              </h5>

                              <div
                                className="row"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between", // Optional: space between buttons
                                  gap: "10px",
                                  "flexWrap": "nowrap", // Optional: spacing between buttons
                                }}
                              >
                                <button
                                  className="accordion-button color-primary h5 collapsed"
                                  onClick={() =>
                                    setExpandedIndex(
                                      expandedIndex == `${index}-on`
                                        ? `${index}-off`
                                        : `${index}-on`
                                    )
                                  }
                                >
                                  <i
                                    className={`fal fa-chevron-${
                                      expandedIndex == `${index}-on`
                                        ? "up"
                                        : "down"
                                    } color-primary`}
                                  ></i>
                                  View More Details
                                </button>
                              </div>
                              <div className="booknowcheckbox">
                                <label className="custom-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={
                                      index == searchflightlistindex
                                      // checkedStatesPerTab[currenttab]?.[index] || false
                                    }
                                    onChange={(e) => {
                                      Setselectedlistnew([
                                        flight,
                                        // {
                                        //   ischecked: true,
                                        //   fareid: flight.other_fare.Fare_Id,
                                        //   item: flight.other_fare,
                                        //   flight: flight.other,
                                        //   Search_Key: flight.searchkey,
                                        //   charges: configdatamain
                                        //     ? configdatamain
                                        //     : "0",
                                        //   currenttab: 0,
                                        //   adultcount: {
                                        //     adult: 1,
                                        //     child: 0,
                                        //     infant: 0,
                                        //   },
                                        // },
                                      ]);
                                      Setsearchflightlistindex(index);
                                    }}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                            </div>
                            {expandedIndex === `${index}-on` && (
                              <>
                                <div className="">
                                  <div className="d-flex justify-content-between align-items-center p-8 highlight-section">
                                    <div>
                                      {flight.sit_type == 1 && (
                                        <h6
                                          className={`color-white mb-2 ${
                                            flight.refundable
                                              ? "refundsit"
                                              : "nonrefundsit"
                                          }`}
                                          style={{ background: "#ffa85d" }}
                                        >
                                          <>
                                            Class:{" "}
                                            {flight.other_fare.ProductClass}
                                          </>
                                        </h6>
                                      )}
                                      <h6
                                        className={`color-black mb-2 ${
                                          flight.refundable != null &&
                                          flight.refundable == true
                                            ? "refundsit"
                                            : "nonrefundsit"
                                        }`}
                                      >
                                        {flight.refundable != null &&
                                        flight.refundable == true
                                          ? "Refundable"
                                          : "Non-Refundable"}
                                      </h6>
                                      <h6
                                        className={`color-white ${
                                          flight.refundable != null &&
                                          flight.refundable == true
                                            ? "refundsit"
                                            : "nonrefundsit"
                                        }`}
                                        style={{ background: "#5353e1" }}
                                      >
                                        {flight.stopovers === 0
                                          ? "Non Stop"
                                          : flight.stopovers === 1
                                          ? "1 Stop"
                                          : "2+ Stop"}{" "}
                                      </h6>
                                    </div>
                                    <div>
                                      <h6 className="color-black">
                                        Seats Available:{" "}
                                        {flight.seats_available}
                                      </h6>{" "}
                                      {/* <h6 className="color-black"> */}
                                      {/* {flight.baggage} */}
                                      {/* </h6> */}
                                      {flight.baggage?.Check_In_Baggage && (
                                        <h6 className="color-black">
                                          Check In Baggage:{" "}
                                          {flight.baggage?.Check_In_Baggage
                                            ? truncateText(
                                                flight.baggage.Check_In_Baggage
                                              )
                                            : "-"}
                                          {flight.baggage?.Check_In_Baggage?.trim()
                                            .length > 5 && (
                                            <span
                                              style={{
                                                color: "blue",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                showFullText(
                                                  flight.baggage
                                                    .Check_In_Baggage
                                                )
                                              }
                                            >
                                              {" "}
                                              View More
                                            </span>
                                          )}
                                        </h6>
                                      )}
                                      {flight.baggage?.Hand_Baggage && (
                                        <h6 className="color-black">
                                          Hand Baggage:{" "}
                                          {flight.baggage?.Hand_Baggage
                                            ? truncateText(
                                                flight.baggage.Hand_Baggage
                                              )
                                            : "-"}
                                          {flight.baggage?.Hand_Baggage?.trim()
                                            .length > 5 && (
                                            <span
                                              style={{
                                                color: "blue",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                showFullText(
                                                  flight.baggage.Hand_Baggage
                                                )
                                              }
                                            >
                                              {" "}
                                              View More
                                            </span>
                                          )}
                                        </h6>
                                      )}
                                    </div>
                                    {flight.sit_type == 1 && (
                                      <div className="d-flex justify-content-between">
                                        <p className="mb-0 text-muted">
                                          {
                                            flight.other_fare.FareDetails[0]
                                              .FareClasses[0].Class_Desc
                                          }{" "}
                                          (
                                          {
                                            flight.other_fare.FareDetails[0]
                                              .FareClasses[0].Class_Code
                                          }
                                          ):
                                        </p>
                                        <p className="mb-0">
                                          {
                                            flight.other_fare.FareDetails[0]
                                              .FareClasses[0].FareBasis
                                          }
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  <hr className="bg-light-gray mt-8 mb-8" />
                                  <div className="flight-area">
                                    {/* <div className=""> */}
                                    <div className="row  mx-2">
                                      {flight.segments.map((segment, index) => (
                                        <>
                                          <div className="row">
                                            <div className="flight-departure mt-2 col-12 col-md-2">
                                              <center>
                                                <Airlogo
                                                  airCode={
                                                    segment.flight_number.split(
                                                      " "
                                                    )[0] || ""
                                                  }
                                                  // airline={flight.airline}
                                                  type={
                                                    flight.airline == null
                                                      ? 0
                                                      : 3
                                                  }
                                                  airlinelist={airlines}
                                                />
                                                <h6
                                                  className="color-black"
                                                  style={{
                                                    "font-size": "10px",
                                                  }}
                                                >
                                                  {airlines.find(
                                                    (data) =>
                                                      data.code ===
                                                        flight.Airline_Code ||
                                                      data.name ===
                                                        flight.airline
                                                  )?.name ||
                                                    flight.airline ||
                                                    ""}
                                                </h6>
                                                <h5
                                                  className="dark-gray"
                                                  style={{
                                                    "font-size": "12px",
                                                  }}
                                                >
                                                  {segment.flight_number}
                                                </h5>
                                              </center>
                                            </div>
                                            <div className="flight-detail mt-2 col-12 col-md-10">
                                              <div className="flight-departure">
                                                <h6 className="color-black">
                                                  {formatDatetime(
                                                    segment.departure_datetime ||
                                                      ""
                                                  )}
                                                </h6>
                                                <h6 className="dark-gray text-end">
                                                  {segment.origin || ""}
                                                </h6>
                                              </div>
                                              <div className="d-inline-flex align-items-center gap-8">
                                                <span className="color-black">
                                                  To
                                                </span>
                                                <div className="from-to text-center">
                                                  <h6 className="dark-gray">
                                                    {segment.duration || ""}
                                                  </h6>
                                                  <img
                                                    className="f_icon_list"
                                                    src={route_plane}
                                                    alt="route-plane"
                                                  />
                                                  {/* <h6 className="color-black"> */}
                                                  {/* {segment.Stop_Over || ""} Stop */}
                                                  {/* </h6> */}
                                                </div>
                                                <span className="color-black">
                                                  From
                                                </span>
                                              </div>
                                              <div className="flight-departure">
                                                <h6 className="color-black">
                                                  {formatDatetime(
                                                    segment.arrival_datetime ||
                                                      ""
                                                  )}
                                                </h6>
                                                <h6 className="dark-gray">
                                                  {segment.destination || ""}
                                                </h6>
                                              </div>
                                            </div>
                                          </div>
                                          {index !=
                                            flight.segments.length - 1 && (
                                            <hr
                                              style={{
                                                border: "none",
                                                borderTop: "2px dotted #000",
                                                margin: "20px 0",
                                              }}
                                            />
                                          )}
                                        </>
                                      ))}
                                    </div>
                                  </div>
                                  <hr className="bg-light-gray mt-16 mb-16" />{" "}
                                  {flight.sit_type == 1 ? (
                                    <span
                                      className="checkmark"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          flight.other_fare?.Warning || "",
                                      }}
                                    ></span>
                                  ) : flight.sit_type == 5 ? (
                                    <span
                                      className="checkmark"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          "This is a Series on Request Fare / Non Refundable/ Non Changeable. <b>May take upto 30 to 40+ Minutes for the confirmation</b>.<br>Reach out to the help desk if you have any clarifications.",
                                      }}
                                    ></span>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                                <hr
                                  style={{ border: "none", height: "20px" }}
                                />
                              </>
                            )}
                          </div>

                          <button
                            className="accordion-button color-primary h5 collapsed"
                            style={{
                              display:
                                viewMore === currentFlightKey &&
                                viewMoreindex != index
                                  ? "none"
                                  : morefarecount == 0
                                  ? "none"
                                  : "block",
                            }}
                            onClick={() => {
                              setviewMore(
                                viewMore === currentFlightKey
                                  ? ""
                                  : currentFlightKey
                              );
                              setviewMoreindex(index);
                            }}
                          >
                            <i
                              className={`fal fa-chevron-${
                                viewMore === currentFlightKey ? "up" : "down"
                              } color-primary`}
                            ></i>
                            {` View More Fares (+${morefarecount})`}
                          </button>
                        </div>
                      );
                    })}
                    {loading && (
                      <>
                        <Progress value={" More Loading..."} />
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      position: "fixed",
                      bottom: 250,
                      right: 20,
                      zIndex: 1000,
                      backgroundColor: "#ff5722",
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      cursor: "pointer",
                    }}
                    className="d-flex d-lg-none"
                    onClick={handleClickfiltter1}
                  >
                    <FiFilter size={28} color="#fff" />
                  </div>
                  {/* <div style="position: fixed; bottom: 185px; right: 43px; z-index: 1000; background-color: rgb(255, 87, 34); width: 56px; height: 56px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 8px; cursor: pointer;">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 16 16"
                    color="#fff"
                    height="28"
                    width="28"
                    xmlns="http://www.w3.org/2000/svg"
                    style="color: rgb(255, 255, 255);"
                  >
                    <path d="M4.5 1L4 1.5V3.02746C4.16417 3.00932 4.331 3 4.5 3C4.669 3 4.83583 3.00932 5 3.02746V2H14V7H12.2929L11 8.29289V7H8.97254C8.99068 7.16417 9 7.331 9 7.5C9 7.669 8.99068 7.83583 8.97254 8H10V9.5L10.8536 9.85355L12.7071 8H14.5L15 7.5V1.5L14.5 1H4.5Z"></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.41705 10.4288C7.37039 9.80348 8 8.72527 8 7.5C8 5.567 6.433 4 4.5 4C2.567 4 1 5.567 1 7.5C1 8.72527 1.62961 9.80348 2.58295 10.4288C2.11364 10.6498 1.68557 10.9505 1.31802 11.318C0.900156 11.7359 0.568688 12.232 0.342542 12.7779C0.180451 13.1692 0.0747425 13.5807 0.0278638 14C0.00933826 14.1657 0 14.3326 0 14.5V15H1L0.999398 14.5C0.999398 14.4784 0.999599 14.4567 1 14.4351C1.00811 13.9975 1.09823 13.5651 1.26587 13.1604C1.44179 12.7357 1.69964 12.3498 2.0247 12.0247C2.34976 11.6996 2.73566 11.4418 3.16038 11.2659C3.57088 11.0958 4.00986 11.0056 4.45387 10.9997C4.46922 10.9999 4.4846 11 4.5 11C4.5154 11 4.53078 10.9999 4.54613 10.9997C4.99014 11.0056 5.42912 11.0958 5.83962 11.2659C6.26433 11.4418 6.65024 11.6996 6.9753 12.0247C7.30036 12.3498 7.55821 12.7357 7.73413 13.1604C7.90177 13.5651 7.99189 13.9975 8 14.4351C8.0004 14.4567 8.0006 14.4784 8.0006 14.5L8 15H9V14.5C9 14.3326 8.99066 14.1657 8.97214 14C8.92526 13.5807 8.81955 13.1692 8.65746 12.7779C8.43131 12.232 8.09984 11.7359 7.68198 11.318C7.31443 10.9505 6.88636 10.6498 6.41705 10.4288ZM4.5 10C3.11929 10 2 8.88071 2 7.5C2 6.11929 3.11929 5 4.5 5C5.88071 5 7 6.11929 7 7.5C7 8.88071 5.88071 10 4.5 10Z"
                    ></path>
                  </svg>
                </div> */}
                  <div className="col-xl-4 col-lg-4 mb-xl-0 mb-32">
                    <div
                      className={`respo-filter ${
                        isfiltter1Active ? "active" : ""
                      }`}
                    >
                      <div className="sidebar pb-2 bg-white br-10 light-shadow mb-4">
                        <div className="sidebar-title d-flex justify-content-between align-items-center">
                          <h4 className="lightest-black">Filter Search</h4>
                          <div className="d-flex gap-2">
                            <p className="cler-cls" onClick={handleClear}>
                              Clear
                            </p>
                            <IoIosCloseCircleOutline
                              className="d-block d-lg-none"
                              size={28}
                              onClick={() => setIsfiltter1Active(false)}
                              color="#ffa85d"
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            minHeight: "100px",
                            maxHeight: "500px",
                            overflowY: "auto",
                          }}
                        >
                          <div className="filter-block plr-24 box-3">
                            {uData && uData.type === "2" && (
                              <>
                                <div className="title mb-16 mt-16 d-flex justify-content-between align-items-center">
                                  <h4 className="color-black fw-500">
                                    Customer View
                                  </h4>
                                  <input
                                    type="checkbox"
                                    checked={
                                      !isisnetfare
                                      // checkedStatesPerTab[currenttab]?.[index] || false
                                    }
                                    onChange={(e) => Setisnetfare(!isisnetfare)}
                                  />
                                </div>
                                <hr></hr>
                              </>
                            )}
                            <div
                              className="title mb-16 mt-16 d-flex justify-content-between align-items-center"
                              onClick={() =>
                                setAirlinesExpanded(!isAirlinesExpanded)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <h4 className="color-black fw-500">Airlines</h4>
                              <i
                                className={`fal fa-chevron-${
                                  isAirlinesExpanded ? "up" : "down"
                                } color-primary`}
                              ></i>
                            </div>
                            {isAirlinesExpanded && (
                              <div className="content-block">
                                {Object.entries(airlineCounts).map(
                                  ([airlineName, count], index) => (
                                    <div className="custom-control" key={index}>
                                      <div className="d-flex justify-content-between align-items-center mb-24">
                                        <div className="radio-button">
                                          <input
                                            type="radio"
                                            name="airline"
                                            className="custom-control-input"
                                            onChange={(e) =>
                                              handleFilter(e, "airline")
                                            }
                                            value={airlineName}
                                            id={airlineName
                                              .replace(/\s/g, "")
                                              .toLowerCase()}
                                            checked={
                                              selectedAirline === airlineName
                                            }
                                          />
                                          <label
                                            className="custom-control-label lightest-black"
                                            htmlFor={airlineName
                                              .replace(/\s/g, "")
                                              .toLowerCase()}
                                          >
                                            {airlines.find(
                                              (data) =>
                                                data.code === airlineName
                                            )?.name || airlineName}
                                          </label>
                                        </div>
                                        <h5 className="light-black">
                                          ({count})
                                        </h5>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                            <hr className="bg-sec-gray mb-16" />
                          </div>
                          <div className="filter-block plr-24 box-3">
                            <div
                              className="title mb-16 mt-16 d-flex justify-content-between align-items-center"
                              onClick={() =>
                                setRefundableExpanded(!isRefundableExpanded)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <h4 className="color-black fw-500">Fare Type</h4>
                              <i
                                className={`fal fa-chevron-${
                                  isRefundableExpanded ? "up" : "down"
                                } color-primary`}
                              ></i>
                            </div>
                            {isRefundableExpanded && (
                              <div className="content-block">
                                <div
                                  className="custom-control"
                                  key="Refundable"
                                >
                                  <div className="d-flex justify-content-between align-items-center mb-24">
                                    <div className="radio-button">
                                      <input
                                        type="radio"
                                        name="refund"
                                        className="custom-control-input"
                                        onChange={(e) =>
                                          handleFilter(e, "refund")
                                        }
                                        value="yes"
                                        checked={selectedRefundable === "yes"}
                                        id="refund"
                                      />
                                      <label
                                        className="custom-control-label lightest-black"
                                        htmlFor="refund" // Updated to match the input ID
                                      >
                                        Refundable
                                      </label>
                                    </div>
                                    <h5 className="light-black">
                                      {
                                        tempflightData2.filter(
                                          (flight) =>
                                            flight.refundable != null ||
                                            flight.refundable === true
                                        ).length
                                      }
                                      {/* ({Refundablecount}) */}
                                    </h5>
                                  </div>
                                </div>
                                <div
                                  className="custom-control"
                                  key="NONRefundable"
                                >
                                  <div className="d-flex justify-content-between align-items-center mb-24">
                                    <div className="radio-button">
                                      <input
                                        type="radio"
                                        name="refund"
                                        className="custom-control-input"
                                        onChange={(e) =>
                                          handleFilter(e, "refund")
                                        } // Fixed the handler
                                        checked={selectedRefundable === "no"}
                                        value="no"
                                        id="nonrefund"
                                      />
                                      <label
                                        className="custom-control-label lightest-black"
                                        htmlFor="nonrefund" // Updated to match the input ID
                                      >
                                        NON Refundable
                                      </label>
                                    </div>
                                    <h5 className="light-black">
                                      {
                                        tempflightData2.filter(
                                          (flight) =>
                                            flight.refundable == null ||
                                            flight.refundable === false
                                        ).length
                                      }
                                      {/* ({Refundablecount}) */}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            )}
                            <hr className="bg-sec-gray mb-16" />
                          </div>

                          <div className="filter-block plr-24 box-3">
                            <div
                              className="title mb-16 mt-16 d-flex justify-content-between align-items-center"
                              onClick={() => setStopExpanded(!isStopExpanded)}
                              style={{ cursor: "pointer" }}
                            >
                              <h4 className="color-black fw-500">Stop</h4>
                              <i
                                className={`fal fa-chevron-${
                                  isStopExpanded ? "up" : "down"
                                } color-primary`}
                              ></i>
                            </div>
                            {isStopExpanded && (
                              <div className="content-block">
                                {tempflightData2.filter(
                                  (flight) => flight.segments.length === 1
                                ).length > 0 && (
                                  <div
                                    className="custom-control"
                                    key="Refundable"
                                  >
                                    <div className="d-flex justify-content-between align-items-center mb-24">
                                      <div className="radio-button">
                                        <input
                                          type="radio"
                                          name="stop"
                                          className="custom-control-input"
                                          onChange={(e) =>
                                            handleFilter(e, "stop")
                                          }
                                          value="nonstop"
                                          checked={selectedstop === "nonstop"}
                                          id="stop"
                                        />
                                        <label
                                          className="custom-control-label lightest-black"
                                          htmlFor="stop"
                                        >
                                          Non Stop
                                        </label>
                                      </div>
                                      <h5 className="light-black">
                                        {
                                          tempflightData2.filter(
                                            (flight) =>
                                              flight.segments.length === 1
                                          ).length
                                        }
                                        {/* ({Refundablecount}) */}
                                      </h5>
                                    </div>
                                  </div>
                                )}
                                {tempflightData2.filter(
                                  (flight) => flight.segments.length === 2
                                ).length > 0 && (
                                  <div className="custom-control" key="STOP">
                                    <div className="d-flex justify-content-between align-items-center mb-24">
                                      <div className="radio-button">
                                        <input
                                          type="radio"
                                          name="stop"
                                          className="custom-control-input"
                                          onChange={(e) =>
                                            handleFilter(e, "stop")
                                          } // Fixed the handler
                                          checked={selectedstop === "1stop"}
                                          value="1stop"
                                          id="1stop"
                                        />
                                        <label
                                          className="custom-control-label lightest-black"
                                          htmlFor="1stop" // Updated to match the input ID
                                        >
                                          1 Stop
                                        </label>
                                      </div>
                                      <h5 className="light-black">
                                        {
                                          tempflightData2.filter(
                                            (flight) =>
                                              flight.segments.length === 2
                                          ).length
                                        }
                                        {/* ({Refundablecount}) */}
                                      </h5>
                                    </div>
                                  </div>
                                )}

                                {tempflightData2.filter(
                                  (flight) => flight.segments.length > 2
                                ).length > 0 && (
                                  <div className="custom-control" key="2STOP">
                                    <div className="d-flex justify-content-between align-items-center mb-24">
                                      <div className="radio-button">
                                        <input
                                          type="radio"
                                          name="stop"
                                          className="custom-control-input"
                                          onChange={(e) =>
                                            handleFilter(e, "stop")
                                          } // Fixed the handler
                                          checked={selectedstop === "2stop"}
                                          value="2stop"
                                          id="2stop"
                                        />
                                        <label
                                          className="custom-control-label lightest-black"
                                          htmlFor="2stop" // Updated to match the input ID
                                        >
                                          2+ Stop
                                        </label>
                                      </div>
                                      <h5 className="light-black">
                                        {
                                          tempflightData2.filter(
                                            (flight) =>
                                              flight.segments.length > 2
                                          ).length
                                        }
                                        {/* ({Refundablecount}) */}
                                      </h5>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}{" "}
                            <hr className="bg-sec-gray mb-16" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedlistnew.length > 0 && (
                      <>
                        <div className="flight-booking flisting-detls">
                          <div className="flight-booking-detail light-shadow mb-32">
                            <div className="flight-title ">
                              <h4 className="color-black">
                                Your Selected Booking Details
                              </h4>
                            </div>
                            {selectedlistloading ? (
                              <></>
                            ) : (
                              selectedlistnew.map((Data, index) => (
                                <div className="box bg-white p-24 border-top">
                                  <div className="row bookingdetails_aireline">
                                    <div className="airline-name-outside">
                                      <div className="airline-name">
                                        <Airlogo
                                          airCode={Data.Airline_Code}
                                          airline={Data.airline}
                                          type={3}
                                          airlinelist={airlines}
                                        />
                                        <div>
                                          <div className="d-flex gap-2">
                                            <h5 className="lightest-black mb-8">
                                              {airlines.find(
                                                (data) =>
                                                  data.code ===
                                                    Data.Airline_Code ||
                                                  data.name === Data.airline
                                              )?.name ||
                                                Data.airline ||
                                                ""}
                                            </h5>
                                            <h6 className="dark-gray">
                                              {Data.flight_numbers.join(", ")}
                                            </h6>
                                          </div>
                                          <div className="d-flex justify-content-between">
                                            <p className="mb-0 text-muted">
                                              {Data.fare_type}
                                              {/* <p className="mb-0 text-muted">
                                              {
                                                Data.item.FareDetails[0]
                                                  .FareClasses[0].Class_Desc
                                              }{" "}
                                              (
                                              {
                                                Data.item.FareDetails[0]
                                                  .FareClasses[0].Class_Code
                                              }
                                              ):
                                           
                                            {
                                              Data.item.FareDetails[0]
                                                .FareClasses[0].FareBasis
                                            } */}{" "}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      className="fair-ruls"
                                      style={{
                                        display:
                                          Data.sit_type == 1 ? "block" : "none",
                                      }}
                                    >
                                      <p
                                        onClick={() =>
                                          openModal(
                                            Data.other_fare.Fare_Id,
                                            Data.other.Flight_Key,
                                            Data.searchkey
                                          )
                                        }
                                      >
                                        {fareloding ? (
                                          <Progress />
                                        ) : (
                                          "Show Rules"
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="fare-class mb-2">
                                    <div className="ps-2">
                                      {/* {Details.item.FareDetails[0].FareClasses.map((fareClass, idx) => ( */}

                                      {/* ))} */}
                                    </div>
                                  </div>
                                  {Data.segments.map((segment, index) => (
                                    <div className="flight-detail mt-4 mb-20">
                                      <div className="flight-departure">
                                        <h5 className="color-black">
                                          {formatDatetime(
                                            segment.departure_datetime
                                          )}
                                        </h5>
                                        <h5 className="dark-gray text-end">
                                          {segment.origin}
                                        </h5>
                                      </div>
                                      <div className="d-inline-flex align-items-center gap-8">
                                        <span className="color-black">To</span>
                                        <div className="from-to text-center">
                                          <h5 className="dark-gray">
                                            {segment.duration}
                                          </h5>
                                          <img
                                            className="f_icon_list"
                                            src={route_plane}
                                            alt="route-plane"
                                          />
                                          {/* <h6 className="color-black">Stop</h6> */}
                                        </div>
                                        <span className="color-black">
                                          From
                                        </span>
                                      </div>
                                      <div className="flight-departure">
                                        <h5 className="color-black">
                                          {formatDatetime(
                                            segment.arrival_datetime
                                          )}
                                        </h5>
                                        <h5 className="dark-gray">
                                          {segment.destination}
                                        </h5>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))
                            )}

                            <div className="d-flex align-items-center justify-content-between mb-16 mt-4 mx-3 mb-2">
                              <h5 className="color-black fw-bold fs-5">
                                ₹
                                {selectedlistnew
                                  .reduce((acc, data) => {
                                    return (
                                      acc +
                                      Number(
                                        (isisnetfare
                                          ? data.price.isisnetfare
                                          : data.price.Without_Net_Fare) || 0
                                      )
                                    );
                                  }, 0)
                                  .toFixed(2)}
                                {/* {selectedlist.reduce((acc, data) => {
                                  return (
                                    acc +
                                    ((Number(
                                      data.item.FareDetails.find(
                                        (fare) => fare.PAX_Type === 0
                                      )?.Total_Amount || 0
                                    ) -
                                      (Number(
                                        data.item.FareDetails.find(
                                          (fare) => fare.PAX_Type === 0
                                        )?.Net_Commission || 0
                                      ) *
                                        Number(
                                          isisnetfare &&
                                            uData &&
                                            uData.type === "2"
                                            ? uData.agents.flight_booking_c
                                            : "0"
                                        )) /
                                        100 +
                                      Number(
                                        isisnetfare &&
                                          uData &&
                                          uData.type === "2"
                                          ? data.item.FareDetails.find(
                                              (fare) => fare.PAX_Type === 0
                                            )?.TDS || 0
                                          : 0
                                      )) *
                                      Number(passengers.adult || 0) +
                                      // Number(Details.charges) +
                                      Number(
                                        data.item.FareDetails.find(
                                          (fare) => fare.PAX_Type === 1
                                        )?.Total_Amount ||
                                          0 -
                                            (Number(
                                              data.item.FareDetails.find(
                                                (fare) => fare.PAX_Type === 1
                                              )?.Net_Commission || 0
                                            ) *
                                              Number(
                                                isisnetfare &&
                                                  uData &&
                                                  uData.type === "2"
                                                  ? uData.agents
                                                      .flight_booking_c
                                                  : "0"
                                              )) /
                                              100 +
                                            Number(
                                              isisnetfare &&
                                                uData &&
                                                uData.type === "2"
                                                ? data.item.FareDetails.find(
                                                    (fare) =>
                                                      fare.PAX_Type === 1
                                                  )?.TDS || 0
                                                : 0
                                            )
                                      ) *
                                        Number(passengers.child || 0) +
                                      (Number(
                                        data.item.FareDetails.find(
                                          (fare) => fare.PAX_Type === 2
                                        )?.Total_Amount || 0
                                      ) -
                                        (Number(
                                          data.item.FareDetails.find(
                                            (fare) => fare.PAX_Type === 2
                                          )?.Net_Commission || 0
                                        ) *
                                          Number(
                                            isisnetfare &&
                                              uData &&
                                              uData.type === "2"
                                              ? uData.agents.flight_booking_c
                                              : "0"
                                          )) /
                                          100 +
                                        Number(
                                          isisnetfare &&
                                            uData &&
                                            uData.type === "2"
                                            ? data.item.FareDetails.find(
                                                (fare) => fare.PAX_Type === 2
                                              )?.TDS || 0
                                            : 0
                                        )) *
                                        Number(passengers.infant || 0) +
                                      Number(agencycharge))
                                  );
                                }, 0)} */}
                                {/* {selectedlist.reduce((acc, data) => {
                                  return (
                                    acc +
                                    data.item.FareDetails.reduce(
                                      (fareAcc, fare) => {
                                        return (
                                          fareAcc + Number(fare.Total_Amount)
                                        );
                                      },
                                      0
                                    )
                                  );
                                }, 0)} */}
                              </h5>

                              <button
                                onClick={() => {
                                  Setselectedlisttype(
                                    selectedlistnew[0].sit_type
                                  );
                                  if (selectedlistnew[0].sit_type == 1) {
                                    Setselectedlistbooking([
                                      {
                                        ischecked: true,
                                        fareid:
                                          selectedlistnew[0].other_fare.Fare_Id,
                                        item: selectedlistnew[0].other_fare,
                                        flight: selectedlistnew[0].other,
                                        Search_Key:
                                          selectedlistnew[0].searchkey,
                                        charges: configdatamain["1"] ?? "0",
                                        currenttab: 0,
                                        adultcount: passengers,
                                        agencycharge: agencycharge,
                                        uData: uData,
                                      },
                                    ]);
                                  } else if (selectedlistnew[0].sit_type == 2) {
                                    Setselectedlistbooking([
                                      {
                                        ticket_id:
                                          selectedlistnew[0].other.ticket_id,
                                        flight: selectedlistnew[0].other,
                                        charges: configdatamain["2"] ?? "0",
                                        adultcount: passengers,
                                        uData: uData,
                                      },
                                    ]);
                                  } else if (selectedlistnew[0].sit_type == 3) {
                                    // console.log(passengers);
                                    Setselectedlistbooking([
                                      {
                                        flight: selectedlistnew[0],
                                        charges: configdatamain["3"] ?? "0",
                                        adultcount: passengers,
                                        airlines: airlines,
                                        uData: uData,
                                      },
                                    ]);
                                  } else if (selectedlistnew[0].sit_type == 4) {
                                    // console.log(passengers);
                                    Setselectedlistbooking([
                                      {
                                        flight: selectedlistnew[0],
                                        charges: configdatamain["4"] ?? "0",
                                        adultcount: passengers,
                                        airlines: airlines,
                                        uData: uData,
                                      },
                                    ]);
                                  } else if (selectedlistnew[0].sit_type == 5) {
                                    // console.log(passengers);
                                    Setselectedlistbooking([
                                      {
                                        flight: selectedlistnew[0],
                                        charges: configdatamain["5"] ?? "0",
                                        // configdatamain
                                        //   ? configdatamain
                                        //   : "0",
                                        adultcount: passengers,
                                        airlines: airlines,
                                        uData: uData,
                                      },
                                    ]);
                                  }
                                }}
                                className="cus-btn btn-sec"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <Modal
                      show={modalIsOpen}
                      onHide={closeModal}
                      size="xl"
                      backdrop="static"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Fare Details</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: fareDetails,
                          }}
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <button
                          className="btn btn-secondary"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                  {/* <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  /> */}

                  {/* ); */}
                </>
              ) : tempflightData && tempflightData.length > 0 ? (
                <>
                  {flightsdata && flightsdata.length === 0 ? (
                    <div className="col-xl-8 col-lg-8">
                      {" "}
                      <Container
                        maxWidth={false}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "50px 20px",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={NoFlightsSVG}
                          alt="No Flights"
                          style={{
                            maxWidth: "300px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                          }}
                        />
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                            color: "#343a40",
                            fontFamily: "Roboto, sans-serif",
                            marginBottom: "10px",
                          }}
                        >
                          Oops! No Flights Available ✈️
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{
                            fontSize: "18px",
                            color: "#6c757d",
                            marginBottom: "30px",
                          }}
                        >
                          It looks like there are no flights available at the
                          moment. Please check again later.
                        </Typography>
                      </Container>
                    </div>
                  ) : (
                    <div className="col-xl-8 col-lg-8">
                      {" "}
                      {flightType !== "3" && flightType !== "2" && (
                        <div className="first-tab">
                          <div className="tab-container">
                            {tripinfodetails.map((item, index) => (
                              <div
                                key={index}
                                className={`tab ${
                                  currenttab === index ? "active" : ""
                                }`}
                                onClick={() => openTab(index)}
                              >
                                {item.Origin} - {item.Destination} <br />{" "}
                                {formatDate(item.TravelDate)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}{" "}
                      {flightType !== "3" && flightType !== "2" ? (
                        <>
                          <div className="d-block d-md-none">
                            <FlightList
                              flights={flightsdata}
                              skey={searchkey}
                              flightsPerPage={20}
                              adult={passengers}
                              selectedTab={currenttab}
                              onUpdate={(updatedItem) => {
                                setflightitem(updatedItem);
                              }}
                              onUpdatenew={(updatedItem) => {
                                setselectedlistin(updatedItem);
                              }}
                              selectedlist={selectedlist}
                              airlinelist={airlines}
                              uData={uData}
                              isisnetfare={isisnetfare}
                              flightType={flightType}
                            />
                          </div>

                          <div className="row cstmroundt">
                            {/* {tripinfodetails.map((item, index) => (  */}
                            <div className="col-md-6 text-white d-none d-md-block">
                              <FlightList
                                flights={flightsdatanew}
                                skey={searchkey}
                                flightsPerPage={20}
                                adult={passengers}
                                selectedTab={0}
                                onUpdate={(updatedItem) => {
                                  setflightitem(updatedItem);
                                }}
                                onUpdatenew={(updatedItem) => {
                                  setselectedlistin(updatedItem);
                                }}
                                selectedlist={selectedlist}
                                airlinelist={airlines}
                                uData={uData}
                                isisnetfare={isisnetfare}
                                flightType={flightType}
                              />
                            </div>{" "}
                            <div className="col-md-6 text-white d-none d-md-block">
                              <FlightList
                                flights={flightsdata2}
                                skey={searchkey}
                                flightsPerPage={20}
                                adult={passengers}
                                selectedTab={1}
                                onUpdate={(updatedItem) => {
                                  setflightitem(updatedItem);
                                }}
                                onUpdatenew={(updatedItem) => {
                                  setselectedlistin(updatedItem);
                                }}
                                selectedlist={selectedlist}
                                airlinelist={airlines}
                                uData={uData}
                                isisnetfare={isisnetfare}
                                flightType={flightType}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <FlightList
                          flights={flightsdata}
                          skey={searchkey}
                          flightsPerPage={20}
                          adult={passengers}
                          selectedTab={currenttab}
                          onUpdate={(updatedItem) => {
                            setflightitem(updatedItem);
                          }}
                          onUpdatenew={(updatedItem) => {
                            setselectedlistin(updatedItem);
                          }}
                          selectedlist={selectedlist}
                          airlinelist={airlines}
                          uData={uData}
                          isisnetfare={isisnetfare}
                          flightType={flightType}
                        />
                      )}
                    </div>
                  )}
                  <div className="col-xl-4 col-lg-4 mb-xl-0 mb-32">
                    <div
                      style={{
                        position: "fixed",
                        bottom: 250,
                        right: 20,
                        zIndex: 1000,
                        backgroundColor: "#ff5722",
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                        cursor: "pointer",
                      }}
                      className="d-flex d-lg-none"
                      onClick={handleClickfiltter1}
                    >
                      <FiFilter size={28} color="#fff" />
                    </div>
                    <div
                      className={`respo-filter ${
                        isfiltter1Active ? "active" : ""
                      }`}
                    >
                      <div className="sidebar pb-2 bg-white br-10 light-shadow mb-4">
                        <div className="sidebar-title d-flex justify-content-between align-items-center">
                          <h4 className="lightest-black">Filter Search</h4>
                          <div className="d-flex gap-2">
                            <p className="cler-cls" onClick={handleClear}>
                              Clear
                            </p>
                            <IoIosCloseCircleOutline
                              className="d-block d-lg-none"
                              size={28}
                              onClick={() => setIsfiltter1Active(false)}
                              color="#ffa85d"
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            minHeight: "100px",
                            maxHeight: "500px",
                            overflowY: "auto",
                          }}
                        >
                          <div className="filter-block plr-24 box-3">
                            {uData && uData.type === "2" && (
                              <>
                                <div className="title mb-16 mt-16 d-flex justify-content-between align-items-center">
                                  <h4 className="color-black fw-500">
                                    Customer View
                                  </h4>
                                  <input
                                    type="checkbox"
                                    checked={
                                      !isisnetfare
                                      // checkedStatesPerTab[currenttab]?.[index] || false
                                    }
                                    onChange={(e) => Setisnetfare(!isisnetfare)}
                                  />
                                </div>
                                <hr></hr>
                              </>
                            )}
                            <div
                              className="title mb-16 mt-16 d-flex justify-content-between align-items-center"
                              onClick={() =>
                                setAirlinesExpanded(!isAirlinesExpanded)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <h4 className="color-black fw-500">Airlines</h4>
                              <i
                                className={`fal fa-chevron-${
                                  isAirlinesExpanded ? "up" : "down"
                                } color-primary`}
                              ></i>
                            </div>
                            {isAirlinesExpanded && (
                              <div className="content-block">
                                {Object.entries(airlineCounts).map(
                                  ([airlineName, count], index) => (
                                    <div className="custom-control" key={index}>
                                      <div className="d-flex justify-content-between align-items-center mb-24">
                                        <div className="radio-button">
                                          <input
                                            type="radio"
                                            name="airline"
                                            className="custom-control-input"
                                            onChange={(e) =>
                                              handleFilter(e, "airline")
                                            }
                                            value={airlineName}
                                            id={airlineName
                                              .replace(/\s/g, "")
                                              .toLowerCase()}
                                            checked={
                                              selectedAirline === airlineName
                                            }
                                          />
                                          <label
                                            className="custom-control-label lightest-black"
                                            htmlFor={airlineName
                                              .replace(/\s/g, "")
                                              .toLowerCase()}
                                          >
                                            {airlines.find(
                                              (data) =>
                                                data.code === airlineName
                                            )?.name || airlineName}
                                          </label>
                                        </div>
                                        <h5 className="light-black">
                                          ({count})
                                        </h5>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                            <hr className="bg-sec-gray mb-16" />
                          </div>
                          <div className="filter-block plr-24 box-3">
                            <div
                              className="title mb-16 mt-16 d-flex justify-content-between align-items-center"
                              onClick={() =>
                                setRefundableExpanded(!isRefundableExpanded)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <h4 className="color-black fw-500">Fare Type</h4>
                              <i
                                className={`fal fa-chevron-${
                                  isRefundableExpanded ? "up" : "down"
                                } color-primary`}
                              ></i>
                            </div>
                            {isRefundableExpanded && (
                              <div className="content-block">
                                <div
                                  className="custom-control"
                                  key="Refundable"
                                >
                                  <div className="d-flex justify-content-between align-items-center mb-24">
                                    <div className="radio-button">
                                      <input
                                        type="radio"
                                        name="refund"
                                        className="custom-control-input"
                                        onChange={(e) =>
                                          handleFilter(e, "refund")
                                        }
                                        value="yes"
                                        checked={selectedRefundable === "yes"}
                                        id="refund"
                                      />
                                      <label
                                        className="custom-control-label lightest-black"
                                        htmlFor="refund" // Updated to match the input ID
                                      >
                                        Refundable
                                      </label>
                                    </div>
                                    <h5 className="light-black">
                                      {
                                        tempflightData.filter((flight) =>
                                          flight.Fares.some(
                                            (fare) => fare.Refundable
                                          )
                                        ).length
                                      }
                                      {/* ({Refundablecount}) */}
                                    </h5>
                                  </div>
                                </div>
                                <div
                                  className="custom-control"
                                  key="NONRefundable"
                                >
                                  <div className="d-flex justify-content-between align-items-center mb-24">
                                    <div className="radio-button">
                                      <input
                                        type="radio"
                                        name="refund"
                                        className="custom-control-input"
                                        onChange={(e) =>
                                          handleFilter(e, "refund")
                                        } // Fixed the handler
                                        checked={selectedRefundable === "no"}
                                        value="no"
                                        id="nonrefund"
                                      />
                                      <label
                                        className="custom-control-label lightest-black"
                                        htmlFor="nonrefund" // Updated to match the input ID
                                      >
                                        NON Refundable
                                      </label>
                                    </div>
                                    <h5 className="light-black">
                                      {
                                        tempflightData.filter((flight) =>
                                          flight.Fares.some(
                                            (fare) => fare.Refundable === false
                                          )
                                        ).length
                                      }
                                      {/* ({Refundablecount}) */}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            )}
                            <hr className="bg-sec-gray mb-16" />
                          </div>

                          <div className="filter-block plr-24 box-3">
                            <div
                              className="title mb-16 mt-16 d-flex justify-content-between align-items-center"
                              onClick={() => setStopExpanded(!isStopExpanded)}
                              style={{ cursor: "pointer" }}
                            >
                              <h4 className="color-black fw-500">Stop</h4>
                              <i
                                className={`fal fa-chevron-${
                                  isStopExpanded ? "up" : "down"
                                } color-primary`}
                              ></i>
                            </div>
                            {isStopExpanded && (
                              <div className="content-block">
                                {/* NON STOP */}
{tempflightData.filter((flight) => {
  const grouped = flight.Segments.reduce((acc, seg) => {
    acc[seg.Leg_Index] = acc[seg.Leg_Index] || [];
    acc[seg.Leg_Index].push(seg);
    return acc;
  }, {});

  // ✅ All legs have 1 segment → Non Stop
  return Object.values(grouped).every(
    (tripSegments) => tripSegments.length === 1
  );
}).length > 0&&(
  <div className="custom-control" key="nonstop">
    <div className="d-flex justify-content-between align-items-center mb-24">
      <div className="radio-button">
        <input
          type="radio"
          name="stop"
          className="custom-control-input"
          onChange={(e) => handleFilter(e, "stop")}
          value="nonstop"
          checked={selectedstop === "nonstop"}
          id="nonstop"
        />
        <label className="custom-control-label lightest-black" htmlFor="nonstop">
          Non Stop
        </label>
      </div>
      <h5 className="light-black">
        {
          tempflightData.filter((flight) => {
            const grouped = flight.Segments.reduce((acc, seg) => {
              acc[seg.Leg_Index] = acc[seg.Leg_Index] || [];
              acc[seg.Leg_Index].push(seg);
              return acc;
            }, {});
            return Object.values(grouped).every((trip) => trip.length === 1);
          }).length
        }
      </h5>
    </div>
  </div>
)}

{/* 1 STOP */}
{tempflightData.filter((flight) => {
  const grouped = flight.Segments.reduce((acc, seg) => {
    acc[seg.Leg_Index] = acc[seg.Leg_Index] || [];
    acc[seg.Leg_Index].push(seg);
    return acc;
  }, {});

  // ✅ All legs have 1 segment → Non Stop
  return Object.values(grouped).every(
    (tripSegments) => tripSegments.length === 2
  );
}).length > 0&&(
  <div className="custom-control" key="1stop">
    <div className="d-flex justify-content-between align-items-center mb-24">
      <div className="radio-button">
        <input
          type="radio"
          name="stop"
          className="custom-control-input"
          onChange={(e) => handleFilter(e, "stop")}
          value="1stop"
          checked={selectedstop === "1stop"}
          id="1stop"
        />
        <label className="custom-control-label lightest-black" htmlFor="1stop">
          1 Stop
        </label>
      </div>
      <h5 className="light-black">
        {
          tempflightData.filter((flight) => {
  const grouped = flight.Segments.reduce((acc, seg) => {
    acc[seg.Leg_Index] = acc[seg.Leg_Index] || [];
    acc[seg.Leg_Index].push(seg);
    return acc;
  }, {});
  const stops = Object.values(grouped).map((trip) => trip.length - 1);
  return stops.some((s) => s === 0);
}).length
        }
      </h5>
    </div>
  </div>
)}

{/* 2+ STOP */}
{tempflightData.filter((flight) => {
  const grouped = flight.Segments.reduce((acc, seg) => {
    acc[seg.Leg_Index] = acc[seg.Leg_Index] || [];
    acc[seg.Leg_Index].push(seg);
    return acc;
  }, {});

  // ✅ All legs have 1 segment → Non Stop
  return Object.values(grouped).every(
    (tripSegments) => tripSegments.length >2
  );
}).length > 0&&(
  <div className="custom-control" key="2stop">
    <div className="d-flex justify-content-between align-items-center mb-24">
      <div className="radio-button">
        <input
          type="radio"
          name="stop"
          className="custom-control-input"
          onChange={(e) => handleFilter(e, "stop")}
          value="2stop"
          checked={selectedstop === "2stop"}
          id="2stop"
        />
        <label className="custom-control-label lightest-black" htmlFor="2stop">
          2+ Stop
        </label>
      </div>
      <h5 className="light-black">
        {
         tempflightData.filter((flight) => {
  const grouped = flight.Segments.reduce((acc, seg) => {
    acc[seg.Leg_Index] = acc[seg.Leg_Index] || [];
    acc[seg.Leg_Index].push(seg);
    return acc;
  }, {});
  const stops = Object.values(grouped).map((trip) => trip.length - 1);
  return stops.some((s) => s === 0);
}).length
        }
      </h5>
    </div>
  </div>
)}

                              </div>
                            )}{" "}
                            <hr className="bg-sec-gray mb-16" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedlist.length > 0 && (
                      <>
                        <div className="flight-booking flisting-detls">
                          <div className="flight-booking-detail light-shadow mb-32">
                            <div className="flight-title ">
                              <h4 className="color-black">
                                Your Selected Booking Details
                              </h4>
                            </div>
                            {selectedlistloading ? (
                              <></>
                            ) : (
                              selectedlist.map((Data, index) => (
                                <div className="box bg-white p-24 border-top">
                                  <div className="row bookingdetails_aireline">
                                    <div className="airline-name-outside">
                                      <div className="airline-name">
                                        <Airlogo
                                          airCode={Data.flight.Airline_Code}
                                          type={0}
                                          airlinelist={airlines}
                                        />
                                        <div>
                                          <div className="d-flex gap-2">
                                            <h5 className="lightest-black mb-8">
                                              {airlines.find(
                                                (data) =>
                                                  data.code ===
                                                  Data.flight.Airline_Code
                                              )?.name || ""}
                                            </h5>
                                            <h6 className="dark-gray">
                                              {/* {Data.flight.Flight_Numbers.split(
                                                "-"
                                              ).at(0) ?? ""} */}
                                              {/* {(
                                                Data.flight.Flight_Numbers.split(
                                                  "-"
                                                ).at(0) ?? ""
                                              )
                                                .split(",")
                                                .map(
                                                  (
                                                    flightNumber,
                                                    index,
                                                    array
                                                  ) => (
                                                    <>
                                                      {Data.flight.Airline_Code}{" "}
                                                      {flightNumber.trim()}
                                                      {index !==
                                                      array.length - 1
                                                        ? ", "
                                                        : ""}
                                                    </>
                                                  )
                                                )} */}
                                              {Data.flight.Segments.map(
                                                (
                                                  flightNumber,
                                                  index,
                                                  array
                                                ) => (
                                                  <>
                                                    {flightNumber.Airline_Code}{" "}
                                                    {flightNumber.Flight_Number}
                                                    {index !== array.length - 1
                                                      ? ", "
                                                      : ""}
                                                  </>
                                                )
                                              )}
                                            </h6>
                                          </div>
                                          <div className="d-flex justify-content-between">
                                            <p className="mb-0 text-muted">
                                              {
                                                Data.item.FareDetails[0]
                                                  .FareClasses[0].Class_Desc
                                              }{" "}
                                              (
                                              {
                                                Data.item.FareDetails[0]
                                                  .FareClasses[0].Class_Code
                                              }
                                              ):
                                            </p>
                                            {
                                              Data.item.FareDetails[0]
                                                .FareClasses[0].FareBasis
                                            }
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="fair-ruls">
                                      <p
                                        onClick={() =>
                                          openModal(
                                            Data.item.Fare_Id,
                                            Data.flight.Flight_Key,
                                            Data.Search_Key
                                          )
                                        }
                                      >
                                        {fareloding ? (
                                          <Progress />
                                        ) : (
                                          "Show Rules"
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="fare-class mb-2">
                                    <div className="ps-2">
                                      {/* {Details.item.FareDetails[0].FareClasses.map((fareClass, idx) => ( */}

                                      {/* ))} */}
                                    </div>
                                  </div>
                                  {Data.flight.Segments.map(
                                    (segment, index) => (
                                      <div className="flight-detail mt-4 mb-20">
                                        <div className="flight-departure">
                                          <h5 className="color-black">
                                            {formatDatetime(
                                              segment.Departure_DateTime
                                            )}
                                          </h5>
                                          <h5 className="dark-gray text-end">
                                            {segment.Origin_City}
                                          </h5>
                                        </div>
                                        <div className="d-inline-flex align-items-center gap-8">
                                          <span className="color-black">
                                            To
                                          </span>
                                          <div className="from-to text-center">
                                            <h5 className="dark-gray">
                                              {segment.Duration}
                                            </h5>
                                            <img
                                              className="f_icon_list"
                                              src={route_plane}
                                              alt="route-plane"
                                            />
                                            {/* <h6 className="color-black">
                                              {segment.Stop_Over} Stop
                                            </h6> */}
                                          </div>
                                          <span className="color-black">
                                            From
                                          </span>
                                        </div>
                                        <div className="flight-departure">
                                          <h5 className="color-black">
                                            {formatDatetime(
                                              segment.Arrival_DateTime
                                            )}
                                          </h5>
                                          <h5 className="dark-gray">
                                            {segment.Destination_City}
                                          </h5>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ))
                            )}

                            <div className="d-flex align-items-center justify-content-between mb-16 mt-4 mx-3 mb-2">
                              <h5 className="color-black fw-bold fs-5">
                                ₹
                                {selectedlist
                                  .reduce((acc, data) => {
                                    const fareDetails = data.item.FareDetails;

                                    const getFareAmount = (paxType) => {
                                      const fare = fareDetails.find(
                                        (f) => f.PAX_Type === paxType
                                      );
                                      const total = Number(
                                        fare?.Total_Amount || 0
                                      );
                                      const commission = Number(
                                        fare?.Net_Commission || 0
                                      );
                                      // Remove commission only if isisnetfare and user type is "2"
                                      // if  {
                                      return isisnetfare && uData?.type === "2"
                                        ? total - commission
                                        : total;
                                    };

                                    const getCharge = () => {
                                      return Number(
                                        isisnetfare && uData?.type === "2"
                                          ? uData.agents.flight_charges["1"] ??
                                              "0"
                                          : agencycharge["1"] ?? "0"
                                      );
                                    };
                                    const adultAmount =
                                      (getFareAmount(0) + getCharge()) *
                                      Number(passengers.adult || 0);
                                    const childAmount =
                                      (getFareAmount(1) + getCharge()) *
                                      Number(passengers.child || 0);
                                    const infantAmount =
                                      (getFareAmount(2) + getCharge()) *
                                      Number(passengers.infant || 0);
                                    // Show fare and charge separately in the console
                                    // console.log(
                                    //   "adultFare", getFareAmount(0) * Number(passengers.adult || 0),
                                    //   "adultCharge", getCharge() * Number(passengers.adult || 0),
                                    //   "childFare", getFareAmount(1) * Number(passengers.child || 0),
                                    //   "childCharge", getCharge() * Number(passengers.child || 0),
                                    //   "infantFare", getFareAmount(2) * Number(passengers.infant || 0),
                                    //   "infantCharge", getCharge() * Number(passengers.infant || 0)
                                    // );
                                    return (
                                      acc +
                                      adultAmount +
                                      childAmount +
                                      infantAmount
                                    );
                                  }, 0)
                                  .toFixed(2)}
                              </h5>

                              <button
                                onClick={() => {
                                  // console.log(selectedlist);
                                  if (
                                    Array.isArray(tripinfodetails) &&
                                    Array.isArray(selectedlist)
                                  ) {
                                    if (
                                      tripinfodetails.length ===
                                        selectedlist.length ||
                                      ((flightType === "3" ||
                                        flightType === "2") &&
                                        selectedlist.length == 1)
                                    ) {
                                      Setselectedlisttype(1);
                                      // console.log(selectedlist);
                                      Setselectedlistbooking(selectedlist);
                                    } else {
                                      alert("Please select required fair");
                                    }
                                  } else {
                                    alert(
                                      "tripinfodetails or selectedlist is not an array."
                                    );
                                  }
                                }}
                                className="cus-btn btn-sec"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <Modal
                      show={modalIsOpen}
                      onHide={closeModal}
                      size="xl"
                      backdrop="static"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Fare Details</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div
                          dangerouslySetInnerHTML={{ __html: fareDetails }}
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <button
                          className="btn btn-secondary"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </>
              ) : (
                <Container
                  maxWidth={false}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "50px 20px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={NoFlightsSVG}
                    alt="No Flights"
                    style={{
                      maxWidth: "300px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      color: "#343a40",
                      fontFamily: "Roboto, sans-serif",
                      marginBottom: "10px",
                    }}
                  >
                    Oops! No Flights Available ✈️
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{
                      fontSize: "18px",
                      color: "#6c757d",
                      marginBottom: "30px",
                    }}
                  >
                    It looks like there are no flights available at the moment.
                    Please check again later.
                  </Typography>
                </Container>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Flight_listing;

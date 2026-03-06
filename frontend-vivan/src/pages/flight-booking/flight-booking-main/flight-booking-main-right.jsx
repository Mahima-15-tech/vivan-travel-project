import React, { useState, useEffect, useRef } from "react";

import "../flight-booking-main/flight-booking-main.css";
import route_plane from "../../../assets/images/icon/route-plan.png";
import { post } from "../../../API/airline";
import {
  third_party,
  AIR_2_URL,
  AIR_FARERULE,
  api_logs,
} from "../../../API/endpoints";
import { useLocation } from "react-router-dom";
import Progress from "../../../component/Loading";
import { Modal } from "react-bootstrap";
import { formatDatetime } from "../../../API/apiHelper";
import Airlogo from "../../../widget/air_logo";

const FlightBookingDetails = ({
  data,
  bookingamount,
  bookingamountwithcommission,
  onUpdate,
  ssrselect,
  airlines,
  uData,
  isisnetfarefromback,
  agencycharge,
  useragencycharge,
  repricedata,
}) => {
  // console.log(JSON.stringify(data));
  const location = useLocation();
  const FlightData = data[0].flight;
  const Search_Key = data[0].Search_Key;
  const fareid = data[0].fareid;
  const charges = data[0].charges;
  const adult = data[0].adultcount;
  const faredetails = data[0].item;

  const [Data, setData] = useState(FlightData);
  const [loading, setLoding] = useState(null);

  data.forEach((element, index) => {
    if (repricedata) {
      const flightforreprice = repricedata[index]?.Flight;
      const FareDetailsofreprice =
        flightforreprice.Fares?.find(
          (item) => item.Fare_Id === element.item.Fare_Id
        )?.FareDetails ||
        flightforreprice.Fares?.at(0)?.FareDetails ||
        [];

      element.flightreprice = flightforreprice;
      element.FareDetailsofreprice = FareDetailsofreprice;
    } else {
      element.flightreprice = null;
      element.FareDetailsofreprice = null;
    }
  });
  // const [Frule, setcode] = useState([]);

  // useEffect(() => {
  //     const fetchrules = async () => {
  //         try {
  //             setLoding(true);
  //             const payload = {
  //                 "Auth_Header": {
  //                     "UserId": "viviantravelsuat",
  //                     "Password": "3B96F16F32C9AEB30C4DF9B3FBABAE964E4E1033",
  //                     "IP_Address": "12333333",
  //                     "Request_Id": "5500887959052",
  //                     "IMEI_Number": "9536615000"
  //                 },
  //                 "Search_Key": Search_Key,
  //                 "Flight_Key": Data.Flight_Key,
  //                 "Fare_Id": fareid
  //             }
  //             const api_url = await AIR_2_URL() + AIR_FARERULE;
  //             const response = await post(third_party, JSON.stringify(payload), api_url);
  //             const resp = await response.json();
  //             if (resp.data.FareRules.length > 0) {
  //                 setcode(resp.data.FareRules[0].FareRuleDesc);
  //             } else {
  //                 setcode("<p>No fare rules found try another </p>")
  //             }
  //             setLoding(false);
  //         } catch (error) {
  //             setLoding(false);
  //             console.error('Failed to fetch data:', error);
  //         }
  //     };
  //     fetchrules();
  // }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return date;
  };

  const formattime = (timeString) => {
    const time = new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return time;
  };

  const Add_amount = () => {};

  // const sum = data.reduce((total, item) => {
  //     return total + (item.item.FareDetails[0].Total_Amount + Number(item.charges) || 0); // Add the amount if it exists, otherwise add 0
  // }, 0);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  // const truncatedContent = Frule.length > 1000 ? Frule.slice(0, 1000) + "..." : Frule;
  // const AdultAmount = (sum) * (data[0].adultcount.adult);
  // const childAmount = (sum) * (data[0].adultcount.child);
  // const infantAmount = (((sum) * 10) / (100));
  // const finalinfantAmount = (((sum) * 10) / (100) * Number(data[0].adultcount.infant));
  // const bookingamount = Number(AdultAmount) + Number(childAmount) + Number(finalinfantAmount);

  function add_services_charges(flight_id) {
    const SSRsumCharge = ssrselect
      .filter((item) => item.flightId == flight_id)
      .reduce((total, item) => {
        return total + item.Total_Amount; // Add the amount if it exists, otherwise add 0
      }, 0);
    return SSRsumCharge;
  }
  const [isisnetfare, Setisnetfare] = useState(isisnetfarefromback);

  function add_services_charges_total() {
    const SSRsumCharge = ssrselect.reduce((total, item) => {
      return total + item.Total_Amount; // Add the amount if it exists, otherwise add 0
    }, 0);
    return SSRsumCharge;
  }

  return (
    <div className="col-xl-4 mb-lg-0 mb-32">
      {/* <div className="flight-booking-detail light-shadow mb-32">
                <div className="flight-title">
                    <h4 className="color-black">Your Booking Detail</h4>
                </div>
                <div className="box bg-white p-24">
                    {data.map((Details, index) => (
                        <>
                            <div className="flight-detail mb-32">
                                <div className="flight-departure">
                                    <h5 className="color-black">{formattime(Details.flight.Segments[0].Departure_DateTime)}</h5>
                                    <h5 className="dark-gray text-end">{Details.flight.Segments[0].Destination}</h5>
                                </div>
                                <div className="d-inline-flex align-items-center gap-8">
                                    <span>From</span>
                                    <div className="from-to text-center">
                                        <h5 className="dark-gray">{Details.flight.Segments[0].Duration}</h5>
                                        <img className='route-plan' src={route_plane} alt="Route Plan" />
                                        <h6 className="color-black">{Details.flight.Segments[0].Stop_Over}</h6>
                                    </div>
                                    <span>To</span>
                                </div>
                                <div className="flight-departure">
                                    <h5 className="color-black">{formattime(Details.flight.Segments[0].Arrival_DateTime)}</h5>
                                    <h5 className="dark-gray">{Details.flight.Segments[0].Origin}</h5>
                                </div>
                            </div>
                            <div className="d-flex justify-content-around mb-20">
                                <div className="flight-departure">
                                    <h6 className="dark-gray">Departure</h6>
                                    <h5 className="color-black">{formatDate(Details.flight.Segments[0].Departure_DateTime)}</h5>
                                </div>
                                <div className="vr-line"></div>
                                <div className="flight-departure">
                                    <h6 className="dark-gray">Arrival</h6>
                                    <h5 className="color-black">{formatDate(Details.flight.Segments[0].Arrival_DateTime)}</h5>
                                </div>
                            </div>
                            <hr className="bg-medium-gray mb-20" />
                            <div className="text">
                                <h6 className="color-medium-gray">Tpm Line</h6>
                                <h6 className="color-medium-gray">Operated by {Details.flight.Segments[0].Airline_Name}</h6>
                                <h6 className="color-medium-gray">Flight {Details.flight.Segments[0].Flight_Number} | Aircraft {Details.flight.Segments[0].Aircraft_Type}</h6>
                                <h6 className="color-medium-gray">Adult(s): {Details.flight.Segments[0].Leg_Index}</h6>
                            </div><br />
                        </>
                    ))
                    }
                </div>
            </div> */}

      <div className="flight-booking-detail light-shadow mb-32">
        <div className="flight-title">
          {uData && uData.type === "2" && (
            <>
              <div className="title mb-16 d-flex justify-content-between align-items-center">
                <h4 className="color-black fw-500">Customer View</h4>
                <input
                  type="checkbox"
                  checked={
                    !isisnetfare
                    // checkedStatesPerTab[currenttab]?.[index] || false
                  }
                  onChange={(e) => Setisnetfare(!isisnetfare)}
                />
              </div>
            </>
          )}
          <div className="row d-flex align-items-center justify-content-between">
            <h4 className="color-black col-7">Payment Details</h4>
            <h6
              className="color-black col-5"
              style={{ cursor: "pointer", textAlign: "right" }}
              onClick={() => onUpdate({})}
            >
              Change Fare
            </h6>
          </div>
        </div>
        <div className="box bg-white p-24">
          {data.map((Details, index) => (
            <>
              <div className="row bookingdetails_aireline">
                <div className="airline-name-outside">
                  <div className="airline-name">
                    <Airlogo
                      airCode={Details.flight.Airline_Code}
                      type={0}
                      airlinelist={airlines}
                    />
                    <div>
                      <div className="d-flex gap-2">
                        <h5 className="lightest-black mb-8">
                          {/* {Details.flight?.Segments.at(0).Airline_Name} */}
                          {airlines.find(
                            (data) => data.code === Details.flight.Airline_Code
                          )?.name || ""}
                        </h5>
                        <h6 className="dark-gray">
                          {/* {(
                            Details.flight.Flight_Numbers.split("-").at(0) ?? ""
                          )
                            .split(",")
                            .map((flightNumber, index, array) => (
                              <>
                                {Details.flight.Airline_Code}{" "}
                                {flightNumber.trim()}
                                {index !== array.length - 1 ? ", " : ""}
                              </>
                            ))} */}
                          {Details.flight.Segments.map(
                            (flightNumber, index, array) => (
                              <>
                                {flightNumber.Airline_Code}{" "}
                                {flightNumber.Flight_Number}
                                {index !== array.length - 1 ? ", " : ""}
                              </>
                            )
                          )}
                        </h6>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="mb-0 text-muted">
                          {
                            Details.item.FareDetails[0].FareClasses[0]
                              .Class_Desc
                          }{" "}
                          (
                          {
                            Details.item.FareDetails[0].FareClasses[0]
                              .Class_Code
                          }
                          ):
                        </p>
                        {Details.item.FareDetails[0].FareClasses[0].FareBasis}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {Details.flight.Segments.map((segment, index) => (
                <div className="flight-detail mt-4 mb-20">
                  <div className="flight-departure">
                    <h5 className="color-black">
                      {formatDatetime(segment.Departure_DateTime)}
                    </h5>
                    <h5 className="dark-gray text-end">
                      {segment.Origin_City}
                    </h5>
                  </div>
                  <div className="d-inline-flex align-items-center gap-8">
                    <span>To</span>
                    <div className="from-to text-center">
                      <h5 className="dark-gray">{segment.Duration}</h5>
                      <img
                        className="f_icon_list"
                        src={route_plane}
                        alt="route-plane"
                      />
                      {/* <h6 className="color-black">{segment.Stop_Over} Stop</h6> */}
                    </div>
                    <span>From</span>
                  </div>
                  <div className="flight-departure">
                    <h5 className="color-black">
                      {formatDatetime(segment.Arrival_DateTime)}
                    </h5>
                    <h5 className="dark-gray">{segment.Destination_City}</h5>
                  </div>
                </div>
              ))}{" "}
              <hr />
              <br />
              <div className="fare-class mb-2">
                {/* <h6 className="text-secondary fw-bold">Fare Class</h6>
                <div className="ps-2"> */}
                {/* {Details.item.FareDetails[0].FareClasses.map((fareClass, idx) => ( */}
                {/* <div className="d-flex justify-content-between">
                    <p className="mb-0 text-muted">
                      {Details.item.FareDetails[0].FareClasses[0].Class_Desc} (
                      {Details.item.FareDetails[0].FareClasses[0].Class_Code}
                      ):
                    </p>
                    <p className="mb-0">
                      {Details.item.FareDetails[0].FareClasses[0].FareBasis}
                    </p>
                  </div> */}
                {/* ))} */}
                {/* </div> */}
              </div>
              {bookingamount > 0 && (
                <>
                  <div className="fare-details mb-2">
                    <h6 className="text-secondary fw-bold">
                      Base Fare Details
                    </h6>
                    <div className="ps-2">
                      {data[0].adultcount.adult > 0 ? (
                        <>
                          <div className="d-flex justify-content-between mb-1">
                            <p className="mb-0 text-muted">Adult(s) Amount :</p>
                            <p className="mb-0">
                              {(() => {
                                const adultCount =
                                  Number(data[0]?.adultcount?.adult) || 0;
                                const fareDetail =
                                  Details.FareDetailsofreprice.find(
                                    (fare) => fare.PAX_Type === 0
                                  );

                                const baseAmount = Number(
                                  fareDetail?.Basic_Amount || 0
                                );
                                const netCommission = Number(
                                  fareDetail?.Net_Commission || 0
                                );

                                const charge = Number(
                                  isisnetfare && uData && uData.type === "2"
                                    ? uData.agents.flight_charges["1"] ?? "0"
                                    : agencycharge["1"] ?? "0"
                                );
                                // console.log("charge", charge);
                                const perAdultAmount =
                                  baseAmount +
                                  charge -
                                  (uData?.type === "2" && isisnetfare
                                    ? netCommission
                                    : 0);

                                const totalAmount = perAdultAmount * adultCount;

                                return `(${adultCount} x ${perAdultAmount}) = ₹${totalAmount.toFixed(
                                  2
                                )}`;
                              })()}
                            </p>
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      {data[0].adultcount.child > 0 ? (
                        <>
                          <div className="d-flex justify-content-between mb-1">
                            <p className="mb-0 text-muted">
                              Child(s) Amount :{" "}
                            </p>
                            <p className="mb-0">
                              ({Number(data[0].adultcount.child) || 0} x{" "}
                              {Number(
                                Details.FareDetailsofreprice.find(
                                  (fare) => fare.PAX_Type === 1
                                )?.Basic_Amount || 0
                              )}
                              ) = ₹
                              {Number(
                                Details.FareDetailsofreprice.find(
                                  (fare) => fare.PAX_Type === 1
                                )?.Basic_Amount || 0
                              ) * Number(data[0].adultcount.child)}
                            </p>
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      {data[0].adultcount.infant > 0 ? (
                        <>
                          <div className="d-flex justify-content-between mb-1">
                            <p className="mb-0 text-muted">
                              Infant(s) Amount :{" "}
                            </p>
                            <p className="mb-0">
                              ({Number(data[0].adultcount.infant) || 0} x{" "}
                              {Number(
                                Details.FareDetailsofreprice.find(
                                  (fare) => fare.PAX_Type === 2
                                )?.Basic_Amount || 0
                              )}
                              ) = ₹
                              {Number(
                                Details.FareDetailsofreprice.find(
                                  (fare) => fare.PAX_Type === 2
                                )?.Basic_Amount || 0
                              ) * Number(data[0].adultcount.infant)}
                            </p>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="taxes mb-2">
                    <h6 className="text-secondary fw-bold">Airport Taxes</h6>
                    <div className="ps-2">
                      <div className="d-flex justify-content-between">
                        <p className="mb-0 text-muted">Airport tax:</p>
                        <p className="mb-0">
                          ₹
                          {/* {
                                        Details.FareDetailsofreprice.reduce(
                                            (total, fare) => total + Number(fare.AirportTax_Amount),
                                            0
                                        )} */}
                          {
                            Details.FareDetailsofreprice.find(
                              (fare) => fare.PAX_Type === 0
                            )?.AirportTax_Amount *
                              Number(data[0].adultcount.adult) +
                              Number(
                                Details.FareDetailsofreprice.find(
                                  (fare) => fare.PAX_Type === 1
                                )?.AirportTax_Amount || 0
                              ) *
                                Number(data[0].adultcount.child) +
                              Number(
                                Details.FareDetailsofreprice.find(
                                  (fare) => fare.PAX_Type === 2
                                )?.AirportTax_Amount || 0
                              ) *
                                Number(data[0].adultcount.infant)
                            // +
                            // Number(
                            //   data[0].uData.type === "2"
                            //     ? data[0].uData.agents.flight_charges["1"] ?? 0
                            //     : Details.charges)
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="additional-charges mb-2">
                    <h6 className="text-secondary fw-bold">
                      Additional Charges
                    </h6>
                    <div className="ps-2">
                      {/* {!isisnetfare && (
                    <div className="d-flex justify-content-between">
                      <p className="mb-0 text-muted">TDS:</p>
                      <p className="mb-0">
                        ₹
                        {Details.item.FareDetails.find(
                          (fare) => fare.PAX_Type === 0
                        )?.TDS *
                          Number(data[0].adultcount.adult) +
                          Number(
                            Details.item.FareDetails.find(
                              (fare) => fare.PAX_Type === 1
                            )?.TDS || 0
                          ) *
                            Number(data[0].adultcount.child) +
                          Number(
                            Details.item.FareDetails.find(
                              (fare) => fare.PAX_Type === 2
                            )?.TDS || 0
                          ) *
                            Number(data[0].adultcount.infant)}
                      </p>
                    </div>
                  )} */}
                      <div className="d-flex justify-content-between">
                        <p className="mb-0 text-muted">Service Fee:</p>
                        <p className="mb-0">
                          ₹
                          {/* {Details.item.FareDetails.reduce(
                                                (total, service_Fee_Amount) => total + Number(service_Fee_Amount.Service_Fee_Amount),
                                                0
                                            )} */}
                          {Details.FareDetailsofreprice.find(
                            (fare) => fare.PAX_Type === 0
                          )?.Service_Fee_Amount *
                            Number(data[0].adultcount.adult) +
                            Number(
                              Details.FareDetailsofreprice.find(
                                (fare) => fare.PAX_Type === 1
                              )?.Service_Fee_Amount || 0
                            ) *
                              Number(data[0].adultcount.child) +
                            Number(
                              Details.FareDetailsofreprice.find(
                                (fare) => fare.PAX_Type === 2
                              )?.Service_Fee_Amount || 0
                            ) *
                              Number(data[0].adultcount.infant)}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="mb-0 text-muted">Promo Discount:</p>
                        <p className="mb-0">
                          ₹
                          {/* {Details.FareDetailsofreprice.reduce(
                                                (total, promo_Discount) => total + Number(promo_Discount.Promo_Discount),
                                                0
                                            )} */}
                          {Details.FareDetailsofreprice.find(
                            (fare) => fare.PAX_Type === 0
                          )?.Promo_Discount *
                            Number(data[0].adultcount.adult) +
                            Number(
                              Details.FareDetailsofreprice.find(
                                (fare) => fare.PAX_Type === 1
                              )?.Promo_Discount || 0
                            ) *
                              Number(data[0].adultcount.child) +
                            Number(
                              Details.FareDetailsofreprice.find(
                                (fare) => fare.PAX_Type === 2
                              )?.Promo_Discount || 0
                            ) *
                              Number(data[0].adultcount.infant)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {ssrselect.filter(
                    (item) => item.flightId == Details.flight.Flight_Id
                  ).length > 0 && (
                    <>
                      <div className="additional-charges mb-2">
                        <h6 className="text-secondary fw-bold">
                          Additional Service Charges for
                        </h6>
                        <div className="ps-2">
                          {Details.flight.Segments.map((segment, index) => (
                            <div
                              style={{
                                display:
                                  ssrselect.filter(
                                    (item) =>
                                      item.flightId ===
                                        Details.flight.Flight_Id &&
                                      item.Segment_Id === index
                                  ).length > 0
                                    ? "block"
                                    : "none",
                              }}
                              className="pb-2"
                            >
                              <h6 className="text-secondary fw-bold">
                                {segment.Origin_City}-{segment.Destination_City}
                              </h6>
                              {ssrselect
                                .filter(
                                  (item) =>
                                    item.flightId ===
                                      Details.flight.Flight_Id &&
                                    item.Segment_Id === index
                                )
                                .map((ssritem, idx) => (
                                  <>
                                    {" "}
                                    <h6 className="text-secondary fw-bold">
                                      {ssritem.typeName}
                                    </h6>
                                    <div className="d-flex justify-content-between">
                                      <p className="mb-0 text-muted">
                                        P {ssritem.pindex} {ssritem.typeName}{" "}
                                        {ssritem.SSR_TypeDesc}:
                                      </p>
                                      <p className="mb-0">
                                        ₹{ssritem.Total_Amount}
                                      </p>
                                    </div>
                                  </>
                                ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="additional-charges mb-2">
                    <h6 className="text-secondary fw-bold">Sub Total</h6>
                    <div className="ps-2">
                      <div className="d-flex justify-content-between">
                        <p className="mb-0 text-muted">Amount:</p>
                        <p className="mb-0">
                          ₹
                          {(() => {
                            const paxTypes = [0, 1, 2]; // 0: Adult, 1: Child, 2: Infant

                            let totalFareAmount = 0;
                            let totalAirportTax = 0;
                            let Service_Fee_Amount = 0;

                            paxTypes.forEach((paxType) => {
                              const count =
                                Number(
                                  data[0]?.adultcount?.[
                                    paxType === 0
                                      ? "adult"
                                      : paxType === 1
                                      ? "child"
                                      : paxType === 2
                                      ? "infant"
                                      : "0"
                                  ]
                                ) || 0;

                              const fareDetail =
                                Details.FareDetailsofreprice.find(
                                  (fare) => fare.PAX_Type === paxType
                                );

                              const baseAmount = Number(
                                fareDetail?.Basic_Amount || 0
                              );
                              const netCommission = Number(
                                fareDetail?.Net_Commission || 0
                              );
                              const airportTax = Number(
                                fareDetail?.AirportTax_Amount || 0
                              );
                              const Service_Fee = Number(
                                fareDetail?.Service_Fee_Amount || 0
                              );

                              const charge = Number(
                                isisnetfare && uData?.type === "2"
                                  ? uData.agents.flight_charges["1"] ?? "0"
                                  : agencycharge["1"] ?? "0"
                              );

                              const perPersonAmount =
                                baseAmount +
                                charge -
                                (uData?.type === "2" && isisnetfare
                                  ? netCommission
                                  : 0);

                              totalFareAmount += perPersonAmount * count;
                              totalAirportTax += airportTax * count;
                              Service_Fee_Amount += Service_Fee * count;
                            });

                            // const extraCharges = Number(
                            //   isisnetfare && uData?.type === "2"
                            //     ? uData.agents.flight_charges["1"] ?? "0"
                            //     : agencycharge["1"] ?? "0"
                            // );

                            // SSR total
                            const ssrTotal = ssrselect
                              .filter(
                                (item) =>
                                  item.flightId === Details.flight.Flight_Id
                              )
                              .reduce(
                                (acc, item) =>
                                  acc + Number(item.Total_Amount || 0),
                                0
                              );

                            const finalAmount =
                              totalFareAmount +
                              totalAirportTax +
                              Service_Fee_Amount +
                              // extraCharges +
                              ssrTotal;
                            // console.log("Sub Total Calculation:", {
                            //   totalFareAmount,
                            //   totalAirportTax,
                            //   Service_Fee_Amount,
                            //   ssrTotal,
                            //   finalAmount,
                            // });

                            return finalAmount.toFixed(2);
                          })()}
                          {
                            //   (() => {
                            //     const fareDetails = FareDetailsofreprice;
                            //     const getFareAmount = (paxType) => {
                            //       const fare = fareDetails.find((f) => f.PAX_Type === paxType);
                            //       const total = Number(fare?.Total_Amount || 0);
                            //       const commission = Number(fare?.Net_Commission || 0);
                            //       // Remove commission only if isisnetfare and user type is "2"
                            //       return (isisnetfare && uData?.type === "2") ? (total - commission) : total;
                            //     };
                            //     const getCharge = () => {
                            //       return Number(
                            //         isisnetfare && uData?.type === "2"
                            //           ? uData.agents.flight_charges["1"] ?? "0"
                            //           : agencycharge["1"] ?? "0"
                            //       );
                            //     };
                            //     const adultAmount = (getFareAmount(0) + getCharge()) * Number(adultcount.adult || 0);
                            //     const childAmount = (getFareAmount(1) + getCharge()) * Number(adultcount.child || 0);
                            //     const infantAmount = (getFareAmount(2) + getCharge()) * Number(adultcount.infant || 0);
                            //     return adultAmount + childAmount + infantAmount;
                            //   }
                            // ).toFixed(2)
                          }
                          {/* {Number(
                        uData && uData.type === "2"
                          ? isisnetfare
                            ? bookingamountwithcommission
                            : bookingamount
                          : bookingamount
                      ).toFixed(2)} */}
                          {/* {Number(
                        Details.item.FareDetails.find(
                          (fare) => fare.PAX_Type === 0
                        )?.Total_Amount || 0
                      ) *
                        Number(data[0].adultcount.adult || 0) +
                        Number(Details.charges) +
                        Number(
                          Details.item.FareDetails.find(
                            (fare) => fare.PAX_Type === 1
                          )?.Total_Amount || 0
                        ) *
                          Number(data[0].adultcount.child || 0) +
                        Number(
                          Details.item.FareDetails.find(
                            (fare) => fare.PAX_Type === 2
                          )?.Total_Amount || 0
                        ) *
                          Number(data[0].adultcount.infant || 0) +
                        add_services_charges(Details.flight.Flight_Id) +
                        (Details.item.FareDetails.find(
                          (fare) => fare.PAX_Type === 0
                        )?.TDS *
                          Number(data[0].adultcount.adult) +
                          Number(
                            Details.item.FareDetails.find(
                              (fare) => fare.PAX_Type === 1
                            )?.TDS || 0
                          ) *
                            Number(data[0].adultcount.child) +
                          Number(
                            Details.item.FareDetails.find(
                              (fare) => fare.PAX_Type === 2
                            )?.TDS || 0
                          ) *
                            Number(data[0].adultcount.infant)) +
                        (Details.item.FareDetails.find(
                          (fare) => fare.PAX_Type === 0
                        )?.Service_Fee_Amount *
                          Number(data[0].adultcount.adult) +
                          Number(
                            Details.item.FareDetails.find(
                              (fare) => fare.PAX_Type === 1
                            )?.Service_Fee_Amount || 0
                          ) *
                            Number(data[0].adultcount.child) +
                          Number(
                            Details.item.FareDetails.find(
                              (fare) => fare.PAX_Type === 2
                            )?.Service_Fee_Amount || 0
                          ) *
                            Number(data[0].adultcount.infant))} */}
                        </p>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <br />
                </>
              )}
            </>
          ))}
          <div className="ps-2">
            <div className="total-amount p-2 bg-secondary text-dark rounded mt-2">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Total Amount:</h5>
                <h5 className="fw-bold mb-0">
                  ₹
                  {bookingamount === 0 ? (
                    <span>Please Wait</span>
                  ) : (
                    Number(
                      uData && uData.type === "2"
                        ? isisnetfare
                          ? bookingamountwithcommission
                          : bookingamount
                        : bookingamount
                    ).toFixed(2)
                  )}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flight-booking-detail light-shadow">
                <div className="flight-title">
                    <h4 className="color-black">Fares Rules</h4>
                </div>
                <div className="box bg-white p-24">
                    {loading ? (
                        <Progress />
                    ) : (
                        <>
                            <div dangerouslySetInnerHTML={{ __html: truncatedContent }} />
                            {Frule.length > 500 && (
                                <button className="btn btn-primary mt-3 btn-sm" onClick={toggleModal}>
                                    View More
                                </button>
                            )}
                        </>
                    )}
                </div>

                <Modal show={showModal} onHide={toggleModal} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>Fare Rules</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div dangerouslySetInnerHTML={{ __html: Frule }} />
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-secondary" onClick={toggleModal}>
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>
            </div> */}
    </div>
  );
};

export default FlightBookingDetails;

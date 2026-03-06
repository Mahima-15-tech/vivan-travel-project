import React, { useState, useEffect } from 'react';
import route_plane from "../../assets/images/icon/route-plan.png";

function booking_fare_details({ selectedlist }) {

    const handleBookingClick = (value, item) => {
        // onUpdate({
        //     FlightData: flight,
        //     Search_Key: searchkey,
        //     fareid: value,
        //     charges: othercharges,
        //     adult: adultcount,
        //     faredetails: item
        // });
    };




    return (
        <>



            <div className="flight-booking flisting-detls">
                <div className="flight-booking-detail light-shadow mb-32">
                    <div className="flight-title ">
                        <h4 className="color-black">Your Selected Booking Details</h4>
                    </div >

                    {selectedlist.map((Data, index) => (
                        <div className="box bg-white p-24 border-top">
                            <div className="flight-detail mb-32">
                                <div className="flight-departure">
                                    <h5 className="dark-gray text-end">{Data.flight.Segments[0].Destination}</h5>
                                </div>
                                <div className="d-inline-flex align-items-center gap-8">
                                    <span>From</span>
                                    <div className="from-to text-center">
                                        <h5 className="dark-gray">{Data.flight.Segments[0].Duration}</h5>
                                        <img className='route-plan' src={route_plane} alt="Route Plan" />
                                        <h6 className="color-black">{Data.flight.Segments[0].Stop_Over}</h6>
                                    </div>
                                    <span>To</span>
                                </div>
                                <div className="flight-departure">
                                    <h5 className="dark-gray">{Data.flight.Segments[0].Origin}</h5>
                                </div>
                            </div>
                            <div className="d-flex justify-content-around mb-16">
                                <div className="flight-departure">
                                    <h6 className="dark-gray">Departure</h6>
                                    <h5 className="color-black">{Data.flight.Segments[0].Departure_DateTime}</h5>
                                </div>
                                <div className="vr-line"></div>
                                <div className="flight-departure">
                                    <h6 className="dark-gray">Arrival</h6>
                                    <h5 className="color-black">{Data.flight.Segments[0].Arrival_DateTime}</h5>
                                </div>
                            </div>
                            <div className="d-flex justify-content-around mb-16">
                                ₹{Number(Data.item.FareDetails[0].Total_Amount) + Number(Data.charges)}
                            </div>
                        </div>
                    ))}
                    

                    <button onClick={() => handleBookingClick(selectedlist)} className="cus-btn btn-sec">
                        Book Now
                    </button>

                </div>
            </div>


        </>
    )
}

export default booking_fare_details;
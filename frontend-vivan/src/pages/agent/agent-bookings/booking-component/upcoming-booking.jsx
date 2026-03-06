import React from 'react';

const BookingWidget = ({
    title,
    bookingID,
    type,
    timeDetails,
    bookedBy,
    addressDetails,
    manageBookingLabel = "Manage Booking",
    isFlight = true
}) => {
    return (
        <div className="border mb-4 card">
            <div className="border-bottom d-md-flex justify-content-md-between align-items-center card-header">
                <div className="d-flex align-items-center">
                    <div className="icon-lg bg-light rounded-circle flex-shrink-0">
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 576 512"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isFlight ? (
                                <path d="M480 192H365.71L260.61 8.06A16.014 16.014 0 0 0 246.71 0h-65.5c-10.63 0-18.3 10.17-15.38 20.39L214.86 192H112l-43.2-57.6c-3.02-4.03-7.77-6.4-12.8-6.4H16.01C5.6 128-2.04 137.78.49 147.88L32 256 .49 364.12C-2.04 374.22 5.6 384 16.01 384H56c5.04 0 9.78-2.37 12.8-6.4L112 320h102.86l-49.03 171.6c-2.92 10.22 4.75 20.4 15.38 20.4h65.5c5.74 0 11.04-3.08 13.89-8.06L365.71 320H480c35.35 0 96-28.65 96-64s-60.65-64-96-64z"></path>
                            ) : (
                                <path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91z"></path>
                            )}
                        </svg>
                    </div>
                    <div className="ms-2">
                        <h6 className="card-title mb-0">{title}</h6>
                        <ul className="nav nav-divider small">
                            <li className="nav-item">Booking ID: {bookingID}</li>
                            <li className="nav-item">{type}</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-2 mt-md-0">
                    <button type="button" className="mb-0 btn btn-primary-soft">
                        {manageBookingLabel}
                    </button>
                    {/* <p class="text-danger text-md-end mb-0">Booking Cancelled</p> */}
                </div>
            </div>
            <div className="card-body">
                <div className="g-3 row">
                    {isFlight ? (
                        <>
                            <div className="col-md-4 col-sm-6">
                                <span>Departure time</span>
                                <h6 className="mb-0">{timeDetails.departure}</h6>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <span>Arrival time</span>
                                <h6 className="mb-0">{timeDetails.arrival}</h6>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="col-md-4 col-sm-6">
                                <span>Pickup address</span>
                                <h6 className="mb-0">{addressDetails.pickup}</h6>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <span>Drop address</span>
                                <h6 className="mb-0">{addressDetails.drop}</h6>
                            </div>
                        </>
                    )}
                    <div className="col-md-4 col-sm-6">
                        <span>Booked by</span>
                        <h6 className="mb-0">{bookedBy}</h6>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingWidget;

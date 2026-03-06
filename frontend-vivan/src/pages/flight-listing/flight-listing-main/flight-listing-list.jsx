import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// FlightItem Component
const FlightItem = ({ flight, index, toggleExpand, expanded }) => {
    return (
        <div className="meri_marji">
            <div className="flight-block bg-white light-shadow p-24 br-10 mb-16">
                <div className="flight-area">
                    <div className="airline-name">
                        <img src={flight.image} alt={flight.airlineName} />
                        <div>
                            <h5 className="lightest-black mb-8">{flight.airlineName}</h5>
                            <h6 className="dark-gray">{flight.aircraft}</h6>
                        </div>
                    </div>
                    <div className="flight-detail">
                        <div className="flight-departure">
                            <h5 className="color-black">{flight.departureTime}</h5>
                            <h5 className="dark-gray text-end">{flight.departure}</h5>
                        </div>
                        <div className="d-inline-flex align-items-center gap-8">
                            <span>To</span>
                            <div className="from-to text-center">
                                <h5 className="dark-gray">{flight.duration}</h5>
                                <img className='f_icon_list' src="https://flight.readytouse.in/assets/media/icons/route-plan.png" alt="route-plan" />
                                <h6 className="color-black">{flight.stops} Stop</h6>
                            </div>
                            <span>From</span>
                        </div>
                        <div className="flight-departure">
                            <h5 className="color-black">{flight.arrivalTime}</h5>
                            <h5 className="dark-gray">{flight.arrival}</h5>
                        </div>
                    </div>
                    <div className="flight-button">
                        <div className="amount">
                            <h5 className="color-black">${flight.price}</h5>
                            <h6 className="dark-gray text-end">Price</h6>
                        </div>
                        <Link to="/flight-booking" className="cus-btn btn-sec">Book Now</Link>
                    </div>
                </div>
                <hr className="bg-light-gray mt-24 mb-24" />
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="color-black">{flight.date}</h5>
                    <div>
                        <button className="accordion-button color-primary h5 collapsed"
                            onClick={() => toggleExpand(index)}
                        >
                            <i className={`fal fa-chevron-${expanded ? 'up' : 'down'} color-primary`}></i>&nbsp;Flight Detail
                        </button>
                    </div>
                </div>
            </div>
            {
                expanded && (
                    <div className="accordion-collapse mb-32 collapse show">
                        <div className="row bg-white br-10 light-shadow p-24 m-0 align-items-center">
                            <div className="col-lg-3 col-sm-4">
                                <div className="time-detail">
                                    <h6 className="flight-date mb-32">{flight.date}</h6>
                                    <h6 className="color-black mb-8">{flight.departureTime}</h6>
                                    <h6 className="dark-gray mb-16">{flight.duration}</h6>
                                    <h6 className="dark-gray">{flight.arrivalTime}</h6>
                                </div>
                            </div>
                            <div className="col-lg-9 col-sm-8">
                                <div className="detail-block">
                                    <div className="d-sm-flex d-block align-items-center gap-24">
                                        <img src={flight.image} alt={flight.airlineName} />
                                        <div className="content">
                                            <h6 className="dark-gray">TPM Line</h6>
                                            <h6 className="dark-gray">{flight.operator}</h6>
                                            <h6 className="dark-gray">{flight.flightClass} | Flight {flight.flightCode} | Aircraft {flight.aircraft}</h6>
                                            <h6 className="dark-gray">Adult(s): 25KG luggage free</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* </div > */}
        </div>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);
    return (
        <div className="paginations mt-8">
            <ul className="unstyled">
                <li className="arrow">
                    <button onClick={() => onPageChange(currentPage - 1)} className="h4 fw-600 mb-0">
                        <i className="far fa-chevron-left"></i>
                    </button>
                </li>
                {pageNumbers.map((num) => (
                    <li key={num} className={currentPage === num ? 'active' : ''}>
                        <button onClick={() => onPageChange(num)} className="h6 fw-600 mb-0">
                            {num}
                        </button>
                    </li>
                ))}
                <li className="arrow">
                    <button onClick={() => onPageChange(currentPage + 1)} className="h4 fw-600 mb-0">
                        <i className="far fa-chevron-right"></i>
                    </button>
                </li>
            </ul>
        </div>
    );
};

// FlightList Component
const FlightList = ({ flights, flightsPerPage }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

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
                />
            ))}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

// Example usage in main component
const flightsData = [
    {
        airlineName: 'United Dubai Airlines',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-1.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    {
        airlineName: 'Feel Dubai Airline',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-2.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    {
        airlineName: 'United Dubai Airlines',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-1.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    {
        airlineName: 'Feel Dubai Airline',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-2.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    {
        airlineName: 'United Dubai Airlines',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-1.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    {
        airlineName: 'Feel Dubai Airline',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-2.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    {
        airlineName: 'United Dubai Airlines',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-1.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    {
        airlineName: 'Feel Dubai Airline',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-2.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    {
        airlineName: 'United Dubai Airlines',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-1.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    {
        airlineName: 'Feel Dubai Airline',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-2.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    {
        airlineName: 'United Dubai Airlines',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-1.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    {
        airlineName: 'Feel Dubai Airline',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-2.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    {
        airlineName: 'United Dubai Airlines',
        aircraft: 'Boeing 777-90',
        departureTime: '12:00',
        arrivalTime: '12:50',
        duration: '0h 50m',
        departure: 'DUB',
        arrival: 'SHJ',
        price: 240,
        date: 'Monday 14 August',
        image: 'https://flight.readytouse.in/assets/media/flight_icon/icon-1.png',
        stops: 1,
        operator: 'Tpm Line',
        flightClass: 'Economy',
        flightCode: 'FK234',
    },
    // Add more flight data...
];

const FlightListt = () => {
    return (
        <div className="col-xl-8 col-lg-8">
            <FlightList flights={flightsData} flightsPerPage={8} />
        </div>
    );
};

export default FlightListt;

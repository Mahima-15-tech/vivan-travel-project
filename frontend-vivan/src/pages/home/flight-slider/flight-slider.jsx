import React from 'react';
import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import '../flight-slider/flight-slider.css'
import flight2 from "../../../assets/images/flight-2.png";
import flight3 from "../../../assets/images/flight-3.png";
import flight4 from "../../../assets/images/flight-4.png";


const FlightCardSlider = () => {
    const flightDeals = [
        { imgSrc: flight2, destination: 'Dubai to Thailand', date: '14 Aug, 2023 - 20 Aug 2023', class: 'Premium Class', price: '$540' },
        { imgSrc: flight3, destination: 'Dubai to Maldives', date: '14 Aug, 2023 - 20 Aug 2023', class: 'Business Class', price: '$980' },
        { imgSrc: flight4, destination: 'Dubai to Canada', date: '14 Aug, 2023 - 20 Aug 2023', class: 'First Class', price: '$5000' },
        { imgSrc: flight2, destination: 'Dubai to Dhaka', date: '14 Aug, 2023 - 20 Aug 2023', class: 'Economy Class', price: '$400' },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <section className="flight-card p-40 mb-30">
            <div className="container">
                <h3 className="lightest-black h3 bold mb-30">Latest Flight Deals</h3>
                <Slider {...settings}>
                    {flightDeals.map((deal, index) => (
                        <div className="flight-deal-block bg-white p-24" key={index}>
                            <div className="image-box mb-24">
                                <Link to="/flight-booking"><img src={deal.imgSrc} alt={deal.destination} /></Link>
                            </div>
                            <div className="content-box">
                                <h5 className="color-black mb-8"><Link to="/flight-booking">{deal.destination}</Link></h5>
                                <p className="light-black mb-24">{deal.date}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="price">
                                        <h6 className="light-black mb-8 fw-500">{deal.class}</h6>
                                        <h5 className="lightest-black fw-500">{deal.price}</h5>
                                    </div>
                                    <Link to="/flight-booking" className="cus-btn small-pad">Booking Now</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};


export default FlightCardSlider;

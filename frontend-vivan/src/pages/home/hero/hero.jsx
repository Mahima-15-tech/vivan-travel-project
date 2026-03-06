import React ,{ useEffect,useState} from 'react';
import '../hero/hero.css';
import { Link } from 'react-router-dom';
import Slider from 'react-slick'; // Import the slider component
import flight from "../../../assets/images/plane.png";
import locationblue from "../../../assets/images/icon/location-blue.png";
import visaIcon from "../../../assets/images/visa.png";
import otbIcon from "../../../assets/images/otb.png";

const HeroBanner = () => {
    // Slider settings
    const settings = {
        dots: true, // Display dots for navigation
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000, // Change slide every 3 seconds
        arrows: false, // Show left and right arrows
    };

    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const userDataFromSession = sessionStorage.getItem('userData');
        if (userDataFromSession && userDataFromSession != null) {
            const userData = JSON.parse(userDataFromSession);
            setUserData(userData.model);
        }
    }, []);

    return (
      <section className="hero-banner-1">
        <div className="container">
          <Slider {...settings}>
            <div className="content">
              <div className="vector-image">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1414"
                  height="319"
                  viewBox="0 0 1414 319"
                  fill="none"
                >
                  <path
                    className="path"
                    d="M-0.5 215C62.4302 220.095 287 228 373 143.5C444.974 72.7818 368.5 -3.73136 320.5 1.99997C269.5 8.08952 231.721 43.5 253.5 119C275.279 194.5 367 248.212 541.5 207.325C675.76 175.867 795.5 82.7122 913 76.7122C967.429 73.9328 1072.05 88.6813 1085 207.325C1100 344.712 882 340.212 922.5 207.325C964.415 69.7967 1354 151.5 1479 183.5"
                    stroke="#ECECF2"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="round"
                  />
                  <path
                    className="dashed"
                    d="M-0.5 215C62.4302 220.095 287 228 373 143.5C444.974 72.7818 368.5 -3.73136 320.5 1.99997C269.5 8.08952 231.721 43.5 253.5 119C275.279 194.5 367 248.212 541.5 207.325C675.76 175.867 795.5 82.7122 913 76.7122C967.429 73.9328 1072.05 88.6813 1085 207.325C1100 344.712 882 340.212 922.5 207.325C964.415 69.7967 1354 151.5 1479 183.5"
                    stroke="#212627"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="22 22"
                  />
                </svg>
                <div className="location-image">
                  <img src={locationblue} alt="Location Icon" />
                </div>
              </div>
              <div className="row align-items-center row-gap-5">
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-5 col-sm-5">
                  <div className="content-block">
                    <h1 className="lightest-black mb-16">
                      <span className="color-primary">Book</span> Your Dream{" "}
                      <span className="color-primary">Flights</span> Now!
                    </h1>
                    <p className="dark-gray mb-24">
                      Streamline your travel business with our efficient flight
                      services. We quickly and accurately handle flight
                      bookings, cancellations, and modifications, saving you
                      time and hassle.
                    </p>
                    <Link
                      to={userData ? "flight-listing" : "/login"}
                      className="cus-btn"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
                <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-7 col-sm-7">
                  <div
                    className="image flynow-tilt"
                    data-tilt-options='{"glare": false, "maxGlare": 0, "maxTilt": 3, "speed": 700, "scale": 1.02}'
                  >
                    <img src={flight} alt="Plane" />
                  </div>
                </div>
              </div>
            </div>

            {/* Add more slides if needed */}
            <div className="content">
              <div className="row align-items-center row-gap-5">
                <div className="col-xxl-6 col-xl-4 col-lg-4 col-md-5 col-sm-5">
                  <div className="content-block col-xxl-6 m-auto">
                    <h1 className="lightest-black mb-16">
                      <span className="color-primary">Apply</span> for Your{" "}
                      <span className="color-primary">Visa</span> Now!
                    </h1>
                    <p className="dark-gray mb-24">
                      Reliable, efficient, and trusted by hundreds of
                      travel agents. We handle visas and travel requirements,
                      ensuring your business runs smoothly.
                    </p>
                    {/* <Link
                      to={userData ? "/visa" : "/login"}
                      className="cus-btn"
                    >
                      Apply Now
                    </Link> */}
                  </div>
                </div>
                <div className="col-xxl-6 col-xl-8 col-lg-8 col-md-7 col-sm-7">
                  <div
                    className="image applynow-tilt"
                    data-tilt-options='{"glare": false, "maxGlare": 0, "maxTilt": 3, "speed": 700, "scale": 1.02}'
                  >
                    <img src={visaIcon} alt="Visa Icon" />
                  </div>
                </div>
              </div>
            </div>

            <div className="content">
              <div className="row align-items-center row-gap-5">
                <div className="col-xxl-6 col-xl-4 col-lg-4 col-md-5 col-sm-5">
                  <div className="content-block col-xxl-6 m-auto">
                    <h1 className="lightest-black mb-16">
                      <span className="color-primary">Apply</span> for{" "}
                      <span className="color-primary">OTB</span> Now!
                    </h1>
                    <p className="dark-gray mb-24">
                      Your OTB experts: We handle OK to Board requirements with
                      precision and care, ensuring seamless travel for your
                      clients.
                    </p>
                    <Link to={userData ? "/otb" : "/login"} className="cus-btn">
                      Apply Now
                    </Link>
                  </div>
                </div>
                <div className="col-xxl-6 col-xl-8 col-lg-8 col-md-7 col-sm-7">
                  <div
                    className="image otbnow-tilt"
                    data-tilt-options='{"glare": false, "maxGlare": 0, "maxTilt": 3, "speed": 700, "scale": 1.02}'
                  >
                    <img src={otbIcon} alt="OTB Icon" />
                  </div>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>
    );
};

export default HeroBanner;

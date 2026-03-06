import React from "react";
import '../travel-us/travel-us.css'
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png"

import borderline from "../../../assets/images/vector/border-line.png";
import vectorline from "../../../assets/images/vector/vector-line.png";
import cloudline from "../../../assets/images/vector/cloud-vector.png";
import dubai from "../../../assets/images/dubai.png";
import italy from "../../../assets/images/italy.png";
import paris from "../../../assets/images/paris.png";

const TravelUs = () => {
    return (
        <div className="travel-sec mb-30">
            <div className="cloud-vector-block">
                <img src={cloudline} alt="cloud" className="cloud-vector" />
            </div>
            <img src={vectorline} alt="line vector" className="line-vector" />
            <div className="container">
                <div className="row align-items-center justify-content-center row-gap-sm-5 row-gap-4">
                    <div
                        className="col-xxl-3 col-lg-4 col-md-8">
                        <div className="left-content">
                            <img src={logo} alt="logo" className="mb-30" />
                            <div className="text mb-30">
                                <span className="h1 review-block bg-lightest-gray">TRAVEL</span>{" "}
                                <span className="h1 review-block bg-lightest-gray">All</span>{" "}
                                <span className="h1 bg-lightest-gray">OVER</span>{" "}
                                <span className="h1 bg-lightest-gray color-primary">The</span>{" "}
                                <span className="h1 bg-lightest-gray color-primary">WORLD</span>
                            </div>
                            <Link to="/flight-listing" className="cus-btn">
                                Booking Now
                            </Link>
                        </div>
                    </div>
                    <div className="col-xxl-7 col-lg-7 col-md-10">
                        <div className="right-images-block">
                            <img src={borderline} alt="border line" className="border-image" />
                            <div className="row justify-content-center align-items-center">
                                <div className="col-lg-2 col-md-2 col-2 d-none d-lg-block"></div>
                                <div className="col-lg-3 col-md-3 col-3">
                                    <img src={paris} alt="Paris" className="side-image" />
                                </div>
                                <div className="col-lg-4 col-md-4 col-4">
                                    <img src={dubai} alt="Dubai" className="center-image" />
                                </div>
                                <div className="col-lg-3 col-md-3 col-3">
                                    <img src={italy} alt="Italy" className="side-image" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelUs;

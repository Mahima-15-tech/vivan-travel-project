import React from "react";
import '../achievments/achievments.css'
import { Link } from "react-router-dom";

import userimage from "../../../assets/images/icon/user.png";
import userimage2 from "../../../assets/images/icon/user-2.png";
import achievement from "../../../assets/images/achievement-image.png";

const AchievementSection = () => {
    return (
      <section className="achievement p-40">
        <div className="container">
          <div className="bg-white light-shadow br-20 achievements-block">
            <div className="row align-items-center">
              <div
                className="col-xl-6 col-lg-12 mb-xl-0 mb-24 sal-animate"
                data-sal="slide-up"
                data-sal-duration="800"
                data-sal-delay="100"
                data-sal-easing="ease-in-out"
              >
                <h5 className="color-primary mb-16">Achievement</h5>
                <h3 className="h3 bold mb-8">
                  Your Destination Awaits, Book Now
                </h3>
                <p className="dark-gray mb-24 w-90">
                  At Vivan Travels, we're proud to have worked with a diverse
                  range of clients from across the globe. Our clients include:
                </p>
                <ul><li>⁠Individuals and families seeking personalized travel
                    experiences.
                  </li>
                  <li>
                    ⁠Business travelers looking for efficient and cost-effective
                    solutions
                  </li>
                </ul>
                <div className="counter-section mb-24">
                  <div className="row row-gap-4">
                    <div className="col-sm-6">
                      <div className="counter-count bg-lightest-gray">
                        <div>
                          <span className="count h3 bold color-primary">
                            12870
                          </span>
                          <span className="h3 bold color-primary">+</span>
                          <h5 className="title white">Happy Customers</h5>
                        </div>
                        <img src={userimage} alt="User Icon" />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="counter-count bg-lightest-gray">
                        <div>
                          <span className="count h3 bold color-primary">
                            100
                          </span>
                          <span className="h3 bold color-primary">%</span>
                          <h5 className="title white">Client Satisfied</h5>
                        </div>
                        <img src={userimage2} alt="Client Satisfaction Icon" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-md-flex gap-32 align-items-center">
                  <h5 className="lightest-black mb-md-0 mb-16">
                    Let's Connect Reach Out for More Information
                  </h5>
                  <Link to="/Contact-us" className="cus-btn">
                    Contact Us
                  </Link>
                </div>
              </div>
              <div
                className="col-xl-6 col-lg-12 sal-animate"
                data-sal="slide-down"
                data-sal-duration="800"
                data-sal-delay="100"
                data-sal-easing="ease-in-out"
              >
                <img
                  src={achievement}
                  alt="Achievement"
                  className="achievement-image light-shadow br-20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default AchievementSection;

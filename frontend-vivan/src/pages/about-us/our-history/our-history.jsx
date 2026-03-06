import React from 'react';
import '../our-history/our-history.css'; // Assuming your styles are in this CSS file
import car from "../../../assets/images/icon/car.png";
import hotel from "../../../assets/images/icon/hotel-lg.png";
import calender from "../../../assets/images/icon/calender-lg.png";
import support from "../../../assets/images/icon/support-lg.png";
import since1 from "../../../assets/images/blog/since-1.png";
import since2 from "../../../assets/images/blog/since-2.png";
import since3 from "../../../assets/images/blog/since-3.png";
import since4 from "../../../assets/images/blog/since-4.png";

const OurHistory = () => {
    return (
      <section className="our-history p-40 mb-16">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 mb-xl-0 mb-24">
              <div className="left-block bg-white light-shadow p-24 br-20">
                <h2 className="light-black mb-8">Our History</h2>
                <h5 className="color-primary mb-8">Since 2021</h5>
                <p className="light-black mb-32">
                  Vivan Travels was founded in [2021] by [Umesh Taglani], with a
                  vision to provide personalized travel experiences to
                  individuals and businesses alike. Our journey began with a
                  small team and a big dream.
                </p>
                <p>
                  In the initial years, we focused on building strong
                  relationships with our clients and partners. We worked
                  tirelessly to understand the unique needs of each traveler,
                  and tailored our services to exceed their expectations.
                </p>
                <p>
                  Today, Vivan Travels is a leading travel services provider,
                  with a team of experienced professionals and a loyal customer
                  base. We continue to innovate and adapt to the changing travel
                  landscape, while remaining committed to our core values of
                  personalized service, expertise, and customer satisfaction.
                </p>
                {/* <div className="row">
                  <div className="col-lg-6 col-md-6 mb-30">
                    <div className="benefit-box bg-lightest-gray br-30">
                      <img src={car} alt="Car Icon" className="mb-16" />
                      <h4 className="light-black">
                        Extensive Selection of Luxury Cars
                      </h4>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 mb-30">
                    <div className="benefit-box bg-lightest-gray br-30">
                      <img src={hotel} alt="Hotel Icon" className="mb-16" />
                      <h4 className="light-black">
                        Well-Maintained &amp; Luxury Hotels
                      </h4>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 mb-lg-0 mb-30">
                    <div className="benefit-box bg-lightest-gray br-30">
                      <img
                        src={calender}
                        alt="Calendar Icon"
                        className="mb-16"
                      />
                      <h4 className="light-black">
                        Easy and Intuitive Booking Process
                      </h4>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="benefit-box bg-lightest-gray br-30">
                      <img src={support} alt="Support Icon" className="mb-16" />
                      <h4 className="light-black">
                        Exceptional Customer Service
                      </h4>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="col-xl-6">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 mb-30">
                  <img
                    src={since1}
                    alt="History Image 1"
                    className="br-20 light-shadow"
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 mb-30">
                  <img
                    src={since2}
                    alt="History Image 2"
                    className="br-20 light-shadow"
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 mb-sm-0 mb-30">
                  <img
                    src={since3}
                    alt="History Image 3"
                    className="br-20 light-shadow"
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <img
                    src={since4}
                    alt="History Image 4"
                    className="br-20 light-shadow"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default OurHistory;

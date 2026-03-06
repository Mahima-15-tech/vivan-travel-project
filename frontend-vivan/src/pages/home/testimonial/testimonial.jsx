import Slider from 'react-slick';
import '../testimonial/testimonial.css';
import React, { useState, useEffect } from "react";

import { post } from "../../../API/apiHelper";
import { feedbacklist } from "../../../API/endpoints";




const TestimonialsSection = () => {
  const [list, SetData] = useState([]);
  const fetch_Agent = async () => {
    try {
      const response = await post(
        feedbacklist,
        { "ishome": "yes" },
        true
      );
      const data = await response.json();
      SetData(data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  useEffect(() => {
    fetch_Agent();
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section className="testimonials p-40">
      <div className="container">
        <div className="testimonials-box bg-white light-shadow br-20">
          <div className="row align-items-center row-gap-4">
            <div className="col-xl-4">
              <div className="text-area">
                <h5 className="color-primary mb-16">Testimonials</h5>
                <h3 className="h1 bold lightest-black">
                  What our clients think about us?
                </h3>
              </div>
            </div>
            <div className="col-xl-7 offset-xl-1">
              {(list.length == 1) ? (
                <>
                  {list.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="review-block bg-lightest-gray pad-32 br-10"
                    >
                      <h6 className="light-black mb-32">
                        {testimonial.message}
                      </h6>
                      <h5 className="light-black mb-2">{testimonial.name}</h5>
                      <p className="dark-gray">{testimonial.designation}</p>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <Slider {...settings}>
                    {list.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="review-block bg-lightest-gray pad-32 br-10"
                      >
                        <h6 className="light-black mb-32">
                          {testimonial.message}
                        </h6>
                        <h5 className="light-black mb-2">{testimonial.name}</h5>
                        <p className="dark-gray">{testimonial.designation}</p>
                      </div>
                    ))}
                  </Slider>
                </>
              )
              }

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

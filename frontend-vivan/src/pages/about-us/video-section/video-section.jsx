import React from 'react';
import '../video-section/video-section.css'; // Assuming a corresponding CSS file is available

import blog_banner from "../../../assets/images/blog/blog-banner.png";
import blog_play from "../../../assets/images/blog/play-btn.png";

const BlogVideoSection = () => {
    return (
      <section
        className="blog-video-sec p-40 mb-16 sal-animate"
        data-sal="slide-up"
        data-sal-duration="800"
        data-sal-delay="100"
        data-sal-easing="ease-in-out"
      >
        <div className="container">
          <div className="video-block bg-white light-shadow p-24 br-20">
            <h2 className="light-black text-center mb-16">
              Where Your Journey Begins with
              <br className="d-md-flex d-none" /> Quality and Reliability
            </h2>
            <p className="light-black text-center mb-32">
              When you choose Vivan Travels, you're not just booking a trip –
              you're beginning a journey that will leave you with lifelong
              memories. We promise to deliver exceptional quality, reliability,
              and personalized service every step of the way.
            </p>
            <img
              src={blog_banner}
              alt="Blog Banner"
              className="main-image br-20 light-shadow"
            />
            {/* <a href="#" data-bs-toggle="modal" data-bs-target="#videoModal" className="play-btn"> */}
            {/* <img src={blog_play} alt="Play Button" className="video-btn" /> */}
            {/* </a> */}
          </div>
        </div>
      </section>
    );
};

export default BlogVideoSection;

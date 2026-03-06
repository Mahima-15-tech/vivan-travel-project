import React from 'react';
import '../benefits/benefits.css'; // Assuming a CSS file for styles
import benefit1 from "../../../assets/images/vector/benefit-1.png";
import benefit2 from "../../../assets/images/vector/benefit-2.png";
import benefit3 from "../../../assets/images/vector/benefit-3.png";

const benefitsData = [
    {
        imgSrc: benefit1,
        title: 'We are Now Available',
        description: 'Call +91 88244 15793 contact with us',
    },
    {
        imgSrc: benefit2,
        title: 'International Flight',
        description: 'Call +91 88244 15793 contact with us',
    },
    {
        imgSrc: benefit3,
        title: 'Check Refund',
        description: 'Call +91 88244 15793 contact with us',
    },
];

const Benefit = ({setting}) => {
    
    return (
        <section className="benefit p-40 sal-animate" data-sal="slide-up" data-sal-duration="800" data-sal-delay="100" data-sal-easing="ease-in-out">
            <div className="container">
                <div className="row">
                <div key={1} className="col-xl-4 col-lg-6 col-md-6 mb-xl-0 mb-24">
                            <div className="benefit-block bg-white">
                                <div className="image-box">
                                    <img src={benefit1} alt='We are Now Available' />
                                </div>
                                <div className="text-box">
                                    <h4 className="lightest-black mb-8">We are Now Available</h4>
                                    <p className="color-medium-gray">Call {setting.support_no} contact with us</p>
                                </div>
                            </div>
                        </div>
                        
                        <div key={2} className="col-xl-4 col-lg-6 col-md-6 mb-xl-0 mb-24">
                            <div className="benefit-block bg-white">
                                <div className="image-box">
                                    <img src={benefit2} alt='International Flight' />
                                </div>
                                <div className="text-box">
                                    <h4 className="lightest-black mb-8">International Flight</h4>
                                    <p className="color-medium-gray">Call {setting.support_no} contact with us</p>
                                </div>
                            </div>
                        </div>
                        <div key={3} className="col-xl-4 col-lg-6 col-md-6 mb-xl-0 mb-24">
                            <div className="benefit-block bg-white">
                                <div className="image-box">
                                    <img src={benefit3} alt='Check Refund' />
                                </div>
                                <div className="text-box">
                                    <h4 className="lightest-black mb-8">Check Refund</h4>
                                    <p className="color-medium-gray">Call {setting.support_no} contact with us</p>
                                </div>
                            </div>
                        </div>
                    {/* {benefitsData.map((benefit, index) => (
                        <div key={index} className="col-xl-4 col-lg-6 col-md-6 mb-xl-0 mb-24">
                            <div className="benefit-block bg-white">
                                <div className="image-box">
                                    <img src={benefit.imgSrc} alt={benefit.title} />
                                </div>
                                <div className="text-box">
                                    <h4 className="lightest-black mb-8">{benefit.title}</h4>
                                    <p className="color-medium-gray">{benefit.description}</p>
                                </div>
                            </div>
                        </div>
                    ))} */}
                </div>
            </div>
        </section>
    );
};

export default Benefit;

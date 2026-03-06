import React, { useState } from 'react';
import '../about-us/about-us.css'
import TitleBanner from '../about-us/title-ban'
import VideoSection from '../about-us/video-section/video-section'
import OurHistory from '../about-us/our-history/our-history'
import Achievments from '../home/achievments/achievments'
import Benefits from '../home/benefits/benefits'
import Testimonial from '../home/testimonial/testimonial'



const aboutus = ({setting}) => {
    return (
        <div className='about-us'>
            <TitleBanner />
            <VideoSection />
            <OurHistory />
            <Achievments />
            {setting &&   <Benefits setting={setting}/>}
            <Testimonial />
        </div>
    )
}

export default aboutus
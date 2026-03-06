import React from 'react'

import Hero from '../home/hero/hero'
import Benefits from '../home/benefits/benefits'
// import FlightSlider from '../home/flight-slider/flight-slider'
import TravelUs from '../home/travel-us/travel-us'
import Marquee from '../home/marquee/marquee'
import Achievments from '../home/achievments/achievments'
import Testimonial from '../home/testimonial/testimonial'
// import Footer from '../../component/footer/footer'

const home = ({ setting }) => {
    return (
        <>
            <Hero />
            {setting && <Benefits setting={setting} />}
            {/* <FlightSlider /> */}
            <TravelUs />
            <Marquee />
            <Achievments />
            <Testimonial />
            {/* <Footer /> */}
        </>
    )
}


export default home
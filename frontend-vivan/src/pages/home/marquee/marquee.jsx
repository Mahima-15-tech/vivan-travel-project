import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import "./marquee.css";
import { post } from "../../../API/apiHelper"
import { agent_list, IMAGE_BASE_URL } from "../../../API/endpoints"
import userimage from "../../../assets/images/profile.png"

const MarqueeComponent = () => {

    const [agents, SetData] = useState([])
    const fetch_Agent = async () => {
        try {
            const response = await post(agent_list, { page: '0', limit: '50000',"ishome":"yes" }, true);
            const data = await response.json();
            SetData(data.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };
    useEffect(() => {
        fetch_Agent();
    }, []);

    
    return (
      <div className="marquee-container-sit">
        <div className="container">
          <div className="bg-white light-shadow br-20 p-30 marquee-sit">
            <h2 className="marquee-title h1 bold lightest-black">
              {/* <span className="highlight">{agents.length}+</span>  */}
              Travel Agents trust Vivan Travels for On Time Visas
            </h2>
            <Marquee
              speed={50}
              pauseOnHover={true}
              gradient={false}
              className="marquee"
            >
              {agents.map((agent) => (
                <div key={agent.id} className="marquee-item">
                  <img
                    src={
                      agent.profile_photo == null
                        ? userimage
                        : IMAGE_BASE_URL + agent.profile_photo
                    }
                    alt={agent.name}
                    className="marquee-logo"
                  />
                  <div className="marquee-info">
                    <h3 className="marquee-name">
                      {agent.agents.company_name||agent.name}
                    </h3>
                    <p className="marquee-location">
                      📍 {agent.agents.city_district},{agent.agents.state},
                      {agent.agents.pincode}
                    </p>
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    );
};

export default MarqueeComponent;

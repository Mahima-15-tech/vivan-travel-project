import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../visa-list/visa-list.css";
import { Button, Alert } from "react-bootstrap";
import { post, get } from "../../../../API/apiHelper";
import { post as HelperPost } from "../../../../API/apiHelper";
import { siteconfig, users_profile } from "../../../../API/endpoints";

function VisaLit() {
  const location = useLocation();
  const [vdata, setData] = useState([]);
  const [formData, setformDataData] = useState([]);
  const [setting, setSettings] = useState(null);
  const [uData, setUData] = useState(null);

  const fetchSettings = async () => {
    try {
      const res = await get(siteconfig, true);
      const response = await res.json();
      setSettings(response.data);
    } catch (error) {}
  };

  const fetchUserData = async () => {
    try {
      const response = await get(users_profile, true);
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Error ${response.status}: ${errorMsg}`);
      }
      const data = await response.json();
      setUData(data.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    if (location.state && location.state.vdata) {
      setData(location.state.vdata);
      setformDataData(location.state.formData);
    }
    fetchUserData();
    fetchSettings();
  }, [location.state]);

  const handleClick = (value) => {
    const encodedData = btoa(value);
    const jsonString = JSON.stringify(formData);
    const encodedformData = btoa(jsonString);
    window.open(
      `/#/visa-verification/?data=${encodedData}&other=${encodedformData}`,
      "_blank"
    );
    // window.open(
    //   `/#/visa-verification/?data=${encodedData}&other=${encodedformData}`,
    //   "_blank"
    // );
  };

  const today = new Date();
  today.setDate(today.getDate() + 4);
  const deliveryDate = today.toDateString();
  const handleViewMore = (documentsArray) => {
    alert("Full Documents: " + documentsArray.join(" - "));
  };
  return (
    <div className="flex flex-col max-w-screen-xl mt-4 m-4">
      {vdata && vdata.length > 0 ? (
        vdata.map((visa, index) => {
          const documentsArray = visa.documents.split(" - ");
          const displayedDocuments = documentsArray.slice(0, 2).join(" - ");

          return (
            <div className="visa-card-sit" key={index}>
              {/* <Alert variant="warning" className="custom-alert">
                            Your visa will not come in time before your departure date. Your visa will be delivered on <strong>{deliveryDate}</strong>
                        </Alert> */}

              <div className="card-content">
                <div className="visa-header">
                  <h5>{visa.about}</h5>
                </div>

                <div className="visa-details">
                  <div className="visa-row">
                    <span>Entry</span>
                    <span>{visa.entry}</span>
                  </div>
                  <div className="visa-row">
                    <span>Validity</span>
                    <span>{visa.validity}</span>
                  </div>
                  <div className="visa-row">
                    <span>Duration</span>
                    <span>{visa.duration}</span>
                  </div>
                  <div className="visa-row">
                    <span>Documents</span>
                    <span>
                      {displayedDocuments}
                      {documentsArray.length > 2 && (
                        <>
                          {" - "}
                          <span
                            className="view-more"
                            onClick={() => handleViewMore(documentsArray)}
                            style={{ color: "blue", cursor: "pointer" }}
                          >
                            View More
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="visa-row">
                    <span>Processing Time</span>
                    <span>{visa.processing_time}</span>
                  </div>
                  {visa.absconding_fees !== "0" && (
                    <div className="visa-row">
                      <span>Absconding Fees</span>
                      <span>{visa.absconding_fees}</span>
                    </div>
                  )}
                </div>
                <div className="visa-row">
                  <span>Description</span>
                  <span>{visa.description}</span>
                </div>

                <div className="footer">
                  <span className="price">
                    ₹
                    {uData && uData.type !== "2"
                      ? Number(visa.amount ?? 0) +
                        Number(
                          setting != null ? setting.visa_agency_charge ?? 0 : 0
                        )
                      : Number(
                          visa.visa_agent_charges?.price ??
                            Number(visa.amount ?? 0) +
                              (uData?.agents
                                ? Number(uData.agents.visa_booking_c ?? 0)
                                : 0)
                        )}
                  </span>
                  <Button
                    onClick={() => handleClick(visa.id)}
                    variant="primary"
                    className="select-button"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No visa data available</p>
      )}
    </div>
  );
}

export default VisaLit;

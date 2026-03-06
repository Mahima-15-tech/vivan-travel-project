import React, { useState, useEffect } from "react";
import "./dashboard.css";
import usersimage from "../../Assets/Images/customers.png";
import languageimage from "../../Assets/Images/language.png";
import Visaimage from "../../Assets/Images/visa.png";
import supportimage from "../../Assets/Images/support.png";
import Agentimage from "../../Assets/Images/travel-agent.png";
import analytics from "../../Assets/Images/analytics.png";
import Ticketimage from "../../Assets/Images/plane-ticket.png";
import { post } from "../../API/apiHelper";
import { dashboard } from "../../API/endpoints";

function Login() {
  const [loading, SetLoading] = useState(true);
  const [data, setData] = useState([]);
  const [statisticsType, setStatisticsType] = useState("overall"); // State for filter

  useEffect(() => {
    const fetchData = async () => {
      try {
        SetLoading(true);
        const res = await post(dashboard, { statistics_type: statisticsType });
        const response = await res.json();
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        SetLoading(false);
      }
    };
    fetchData();
  }, [statisticsType]);

  const handleStatisticsChange = (event) => {
    setStatisticsType(event.target.value); // Update filter criteria
  };

  return (
    <main id="content" role="main" className="main pointer-event">
      <div className="content container-fluid">
        <div className="page-header pb-0 mb-0 border-0">
          <div className="flex-between align-items-center">
            <div>
              <h1 className="page-header-title">Welcome Admin</h1>
              <p>Monitor your Admins.</p>
            </div>
          </div>
        </div>
        <div className="card mb-2 remove-card-shadow">
          <div className="card-body">
            <div className="row flex-between align-items-center g-2 mb-3">
              <div className="col-sm-6">
                <h4 className="d-flex align-items-center text-capitalize gap-10 mb-0">
                  <img src={analytics} alt="" width="30" />
                  Vivan travels analytics
                </h4>
              </div>
              <div className="col-sm-6 d-flex justify-content-sm-end">
                <select
                  className="custom-select w-auto"
                  name="statistics_type"
                  id="statistics_type"
                  value={statisticsType}
                  onChange={handleStatisticsChange}
                >
                  <option value="overall">All</option>
                  <option value="today">Today's</option>
                  <option value="this_month">This Month's</option>
                </select>
              </div>
            </div>
            <div className="row g-2" id="order_stats">
              {/* users count */}
              <div className="col-sm-6 col-lg-3">
                <div className="business-analytics">
                  <h5 className="business-analytics__subtitle">Total Users</h5>
                  <h2 className="business-analytics__title">
                    {data.totalusers ? data.totalusers : "0"}
                  </h2>
                  <img
                    src={usersimage}
                    className="business-analytics__img"
                    alt=""
                    width="30"
                  />
                </div>
              </div>
              {/* language count */}
              <div className="col-sm-6 col-lg-3">
                <div className="business-analytics">
                  <h5 className="business-analytics__subtitle">Total Agents</h5>
                  <h2 className="business-analytics__title">
                    {data.total_agent ? data.total_agent : "0"}
                  </h2>
                  <img
                    src={Agentimage}
                    className="business-analytics__img"
                    alt=""
                    width="30"
                  />
                </div>
              </div>

              {/* language count */}
              <div className="col-sm-6 col-lg-3">
                <div className="business-analytics">
                  <h5 className="business-analytics__subtitle">Total Visa</h5>
                  <h2 className="business-analytics__title">
                    {data.total_visa ? data.total_visa : "0"}
                  </h2>
                  <img
                    src={Visaimage}
                    className="business-analytics__img"
                    alt=""
                    width="30"
                  />
                </div>
              </div>

              {/* language count */}
              {/* <div className="col-sm-6 col-lg-3">
                <div className="business-analytics">
                  <h5 className="business-analytics__subtitle">Total Language</h5>
                  <h2 className="business-analytics__title">
                    {data.total_lang ? data.total_lang : "0"}
                  </h2>
                  <img src={languageimage} className="business-analytics__img" alt="" width="30" />
                </div>
              </div> */}
            </div>
            <div className="row g-2" id="order_stats">
              {/* short div */}
              <div className="col-sm-6 col-lg-3">
                <a className="order-stats order-stats_confirmed">
                  <div className="order-stats__content">
                    <img width="20" src={Visaimage} alt="" />
                    <h6 className="order-stats__subtitle">In Process</h6>
                  </div>
                  <span className="order-stats__title">
                    {data.visainprocess ? data.visainprocess : "0"}
                  </span>
                </a>
              </div>

              <div className="col-sm-6 col-lg-3">
                <a className="order-stats order-stats_packaging">
                  <div className="order-stats__content">
                    <img width="20" src={Visaimage} alt="" />
                    <h6 className="order-stats__subtitle">
                      Additional Document Required
                    </h6>
                  </div>
                  <span className="order-stats__title">
                    {data.visaadd_doc_req ? data.visaadd_doc_req : "0"}
                  </span>
                </a>
              </div>
              <div className="col-sm-6 col-lg-3">
                <a className="order-stats order-stats_out-for-delivery">
                  <div className="order-stats__content">
                    <img width="20" src={Visaimage} alt="" />
                    <h6 className="order-stats__subtitle">Rejected</h6>
                  </div>
                  <span className="order-stats__title">
                    {data.visareject ? data.visareject : "0"}
                  </span>
                </a>
              </div>
              <div className="col-sm-6 col-lg-3">
                <a className="order-stats order-stats_pending">
                  <div className="order-stats__content">
                    <img width="20" src={Visaimage} alt="" />
                    <h6 className="order-stats__subtitle">Approved</h6>
                  </div>
                  <span className="order-stats__title">
                    {data.visa_approved ? data.visa_approved : "0"}
                  </span>
                </a>
              </div>

              {/* short div 2 */}
              <div className="col-sm-6 col-lg-3">
                <a className="order-stats order-stats_pending">
                  <div className="order-stats__content">
                    <img width="20" src={Ticketimage} alt="" />
                    <h6 className="order-stats__subtitle">In Process</h6>
                  </div>
                  <span className="order-stats__title">
                    {data.oktbinprocess ? data.oktbinprocess : "0"}
                  </span>
                </a>
              </div>
              <div className="col-sm-6 col-lg-3">
                <a className="order-stats order-stats_confirmed">
                  <div className="order-stats__content">
                    <img width="20" src={Ticketimage} alt="" />
                    <h6 className="order-stats__subtitle">
                      Additional Document Required
                    </h6>
                  </div>
                  <span className="order-stats__title">
                    {data.oktbadd_doc_req ? data.oktbadd_doc_req : "0"}
                  </span>
                </a>
              </div>

              <div className="col-sm-6 col-lg-3">
                <a className="order-stats order-stats_out-for-delivery">
                  <div className="order-stats__content">
                    <img width="20" src={Ticketimage} alt="" />
                    <h6 className="order-stats__subtitle">Rejected</h6>
                  </div>
                  <span className="order-stats__title">
                    {data.oktbreject ? data.oktbreject : "0"}
                  </span>
                </a>
              </div>
              <div className="col-sm-6 col-lg-3">
                <a className="order-stats order-stats_out-for-delivery">
                  <div className="order-stats__content">
                    <img width="20" src={Ticketimage} alt="" />
                    <h6 className="order-stats__subtitle">Approved</h6>
                  </div>
                  <span className="order-stats__title">
                    {data.oktb_approved ? data.oktb_approved : "0"}
                  </span>
                </a>
              </div>
              <div className="col-sm-6 col-lg-3">
                <a className="order-stats order-stats_packaging">
                  <div className="order-stats__content">
                    <img width="20" src={Ticketimage} alt="" />
                    <h6 className="order-stats__subtitle">On Hold</h6>
                  </div>
                  <span className="order-stats__title">
                    {data.oktb_onhold ? data.oktb_onhold : "0"}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


export default Login;

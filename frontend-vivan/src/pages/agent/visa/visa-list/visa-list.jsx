import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../visa-list/visa-list.css";
import { Button, Alert } from "react-bootstrap";

function VisaLit() {
  return (
    <>
      <div className="visa-card-sit">
        <Alert variant="warning" className="custom-alert">
          Your visa will not come in time before your departure date. Your visa
          will be delivered on <strong>14th Oct, 2024 at 2:00 PM</strong>
        </Alert>

        <div className="card-content">
          <div className="visa-header">
            <h5>Single Entry Testing Visa 0-y38</h5>
          </div>

          <div className="visa-details">
            <div className="visa-row">
              <span>Entry</span>
              <span>Single</span>
            </div>
            <div className="visa-row">
              <span>Validity</span>
              <span>2 Month</span>
            </div>
            <div className="visa-row">
              <span>Duration</span>
              <span>24 Days</span>
            </div>
            <div className="visa-row">
              <span>Documents</span>
              <a href="#documents" className="view-link">
                View Here
              </a>
            </div>
            <div className="visa-row">
              <span>Processing Time</span>
              <span>15 business days</span>
            </div>
          </div>

          <div className="footer">
            <span className="price">₹15000</span>
            <Button variant="primary" className="select-button">
              Select
            </Button>
          </div>
        </div>
      </div>
      <div className="visa-card-sit">
        <Alert variant="warning" className="custom-alert">
          Your visa will not come in time before your departure date. Your visa
          will be delivered on <strong>14th Oct, 2024 at 2:00 PM</strong>
        </Alert>

        <div className="card-content">
          <div className="visa-header">
            <h5>Single Entry Testing Visa 0-y38</h5>
          </div>

          <div className="visa-details">
            <div className="visa-row">
              <span>Entry</span>
              <span>Single</span>
            </div>
            <div className="visa-row">
              <span>Validity</span>
              <span>2 Month</span>
            </div>
            <div className="visa-row">
              <span>Duration</span>
              <span>24 Days</span>
            </div>
            <div className="visa-row">
              <span>Documents</span>
              <a href="#documents" className="view-link">
                View Here
              </a>
            </div>
            <div className="visa-row">
              <span>Processing Time</span>
              <span>15 business days</span>
            </div>
          </div>

          <div className="footer">
            <span className="price">₹15000</span>
            <Button variant="primary" className="select-button">
              Select
            </Button>
          </div>
        </div>
      </div>
      <div className="visa-card-sit">
        <Alert variant="warning" className="custom-alert">
          Your visa will not come in time before your departure date. Your visa
          will be delivered on <strong>14th Oct, 2024 at 2:00 PM</strong>
        </Alert>

        <div className="card-content">
          <div className="visa-header">
            <h5>Single Entry Testing Visa 0-y38</h5>
          </div>

          <div className="visa-details">
            <div className="visa-row">
              <span>Entry</span>
              <span>Single</span>
            </div>
            <div className="visa-row">
              <span>Validity</span>
              <span>2 Month</span>
            </div>
            <div className="visa-row">
              <span>Duration</span>
              <span>24 Days</span>
            </div>
            <div className="visa-row">
              <span>Documents</span>
              <a href="#documents" className="view-link">
                View Here
              </a>
            </div>
            <div className="visa-row">
              <span>Processing Time</span>
              <span>15 business days</span>
            </div>
          </div>

          <div className="footer">
            <span className="price">₹15000</span>
            <Button variant="primary" className="select-button">
              Select
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
export default VisaLit;

// const Button = ({ data, otherdata, label, disabled }) => {
//     const encodedData = btoa(data);
//     const jsonString = JSON.stringify(otherdata);
//     const encodedformData = btoa(jsonString);
//     return (
//         <Link to={`/visa-verification/?data=${encodedData}&other=${encodedformData}`} className={`cus-btn-outline ${disabled ? 'cus-btn-outline cus-btn-outline-dis' : ''}`} disabled={disabled}>
//             {label}
//         </Link>
//     );
// };

// const Table = ({ data }) => (
//     <table className="overflow-x-auto text-left whitespace-nowrap">
//         <thead className="text-sm bg-card-table-gradient">
//             <tr>
//                 <th className="w-[6rem] py-3 pl-5 font-semibold">Entry</th>
//                 <th className="w-[6rem] py-3 font-semibold">Validity</th>
//                 <th className="py-3 font-semibold w-28">Duration</th>
//                 <th className="w-32 py-3 font-semibold">Documents</th>
//                 <th className="py-3 font-semibold w-32">Processing Time</th>
//             </tr>
//         </thead>
//         <tbody>
//             {data.map((row, index) => (
//                 <tr key={index}>
//                     <td className="py-1.5 pl-5">{row.entry}</td>
//                     <td className="py-1.5">{row.validity}</td>
//                     <td className="py-1.5">{row.duration}</td>
//                     <td className="py-1.5">
//                         <button className="text-blue-500 underline view-heree">View Here</button>
//                     </td>
//                     <td className="py-1.5 capitalize">{row.processingTime}</td>
//                 </tr>
//             ))}
//         </tbody>
//     </table>
// );

// const Card = ({ title, dateInfo, price, tableData, visaid, other }) => (
//     <div className="font-basier mb-5 rounded-3 border border-gray-200 bg-white">
//         <div className="z-10 rounded-top-3 py-3 px-3 text-lg tracking-wider text-white vi-name">
//             {title}
//         </div>
//         <div className="pb-2 pt-4">
//             <div className="flex items-center gap-3 px-3 font-medium tracking-wider vi-erre">
//                 <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="triangle-exclamation" class="svg-inline--fa fa-triangle-exclamation fa-xl h-6 w-6" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                     <path fill="currentColor" d="M248.4 84.3c1.6-2.7 4.5-4.3 7.6-4.3s6 1.6 7.6 4.3L461.9 410c1.4 2.3 2.1 4.9 2.1 7.5c0 8-6.5 14.5-14.5 14.5H62.5c-8 0-14.5-6.5-14.5-14.5c0-2.7 .7-5.3 2.1-7.5L248.4 84.3zm-41-25L9.1 385c-6 9.8-9.1 21-9.1 32.5C0 452 28 480 62.5 480h387c34.5 0 62.5-28 62.5-62.5c0-11.5-3.2-22.7-9.1-32.5L304.6 59.3C294.3 42.4 275.9 32 256 32s-38.3 10.4-48.6 27.3zM288 368a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm-8-184c0-13.3-10.7-24-24-24s-24 10.7-24 24v96c0 13.3 10.7 24 24 24s24-10.7 24-24V184z"></path>
//                 </svg>
//                 {dateInfo && <span className="font-medium">{dateInfo}</span>}
//             </div>
//         </div>
//         <div className="d-flex flex-column flex-lg-row gap-2 py-3">
//             <div className="col-8 col-lg-9 overflow-x-auto">
//                 <Table data={tableData} />
//             </div>
//             <div className="col-4 col-lg-3 d-flex flex-column align-items-end justify-content-start gap-3 pe-4">
//                 <div className="d-flex align-items-center gap-0 font-medium">
//                     ₹{price}
//                     <button type="button" aria-expanded="false" className="circle-infoss">
//                         <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle-info" className="svg-inline--fa fa-circle-info" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" color="gray" >
//                             <path fill="currentColor" d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336c-13.3 0-24 10.7-24 24s10.7 24 24 24h80c13.3 0 24-10.7 24-24s-10.7-24-24-24h-8V248c0-13.3-10.7-24-24-24H216c-13.3 0-24 10.7-24 24s10.7 24 24 24h24v64H216zm40-144a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
//                         </svg>
//                     </button>
//                 </div>
//                 <Button data={visaid} otherdata={other} label="Select" />
//             </div>
//         </div>
//     </div>
// );

// function App() {
//     const location = useLocation();
//     const [vdata, setData] = useState([]);
//     const [formData, setformDataData] = useState([]);

//     useEffect(() => {
//         if (location.state && location.state.vdata) {
//             setData(location.state.vdata);
//             setformDataData(location.state.formData);
//         } else {
//             console.log("No data available");
//         }
//     }, [location.state]);

//     return (
//         <div className="flex flex-col max-w-screen-xl mt-4 m-4">
//             {vdata && vdata.length > 0 ? (
//                 vdata.map((visa, index) => (
//                     <Card
//                         title={visa.about}
//                         dateInfo={visa.description}
//                         price={visa.amount}
//                         tableData={[
//                             {
//                                 entry: visa.entry,
//                                 validity: visa.validity,
//                                 duration: visa.duration,
//                                 processingTime: visa.processing_time
//                             }
//                         ]}
//                         visaid={visa.id}
//                         other={formData}
//                     />
//                 ))
//             ) : (
//                 <p>No visa data available</p>
//             )}
//         </div>
//     );
// }

// export default App;

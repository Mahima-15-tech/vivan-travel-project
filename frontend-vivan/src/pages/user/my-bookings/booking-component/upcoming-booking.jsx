import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import {
  booking_cancle,
  third_party,
  AIR_4_URL,
  AIR_CANCELLATION,
  siteconfig,
  api_logs,
} from "../../../../API/endpoints";
import Ticket_Details from "../../../../widget/ticket_details";
import Air_iq_ticket_details from "../../../../widget/air_iq_ticket_details";
import Offline_ticket_details from "../../../../widget/offline_ticket_details";
import Gofly_ticket_details from "../../../../widget/gofly_ticket_details";
import Winfly_ticket_details from "../../../../widget/winfly_ticket_details";

import { post } from "../../../../API/airline"; // Assuming you have an API helper for making requests
import { toast } from "react-toastify";
import { post as apipost, get } from "../../../../API/apiHelper";
const BookingWidget = ({ data }) => {
  let bookingdata = null;
  let Airline = null;
  let origananddestination = null;
  if (data.Ticket_Details) {
    bookingdata = JSON.parse(data.Ticket_Details);
  }
  let pax_list = [];
  if (data.type == 1) {
    Airline = `${bookingdata.AirPNRDetails[0].Flights[0].Segments[0].Airline_Name} (${bookingdata.AirPNRDetails[0].Flights[0].Segments[0].Airline_Code})`;
    origananddestination = `${bookingdata.AirPNRDetails[0].Flights[0].Segments[0].Origin} /${bookingdata.AirPNRDetails[0].Flights[0].Segments[0].Destination}`;
  } else if (data.type == 2) {
    // console.log(`hi yogesh your data${JSON.stringify(bookingdata)}`);
    Airline = bookingdata.airline_code;
    const tempdata = JSON.parse(data.BookingFlightDetails);
    origananddestination = `${tempdata.flight.origin || ""}/${
      tempdata.flight.destination
    }`;
    pax_list = JSON.parse(data.PAX_Details);
  } else if (data.type == 3) {
    Airline = bookingdata.booking_items[0].flight.legs[0].airline;
    origananddestination = `${
      bookingdata.booking_items[0].flight.legs[0].origin || ""
    } /${bookingdata.booking_items[0].flight.legs[0].destination}`;
  } else if (data.type == 4) {
    const tempdata = JSON.parse(data.BookingFlightDetails);
    Airline = tempdata.flight.Airline_Code;
    origananddestination = `${tempdata.flight.origin || ""} /${
      tempdata.flight.destination
    }`;
    pax_list = JSON.parse(data.PAX_Details);
  } else if (data.type == 5) {
    const tempdata = JSON.parse(data.Ticket_Details);
    Airline = tempdata.flight.Airline_Code;
    origananddestination = `${tempdata.flight.origin || ""} /${
      tempdata.flight.destination
    }`;
    pax_list = tempdata.flight_traveller_details;
  }

  const [cancelReason, setCancelReason] = useState("");
  const [cancellationType, setCancellationType] = useState(""); // State for CancellationType
  const [cancelCode, setCancelCode] = useState("");
  const [Upiid, setUpiid] = useState(null);

  const [setting, setSettings] = useState(null);
  let isuat = "";

  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false); // New state for cancel confirmation modal

  const toggleModal = () => setShowModal(!showModal);
  const toggleCancelModal = () => setShowCancelModal(!showCancelModal); // Toggle cancel modal visibility
  const [userData, setUserData] = useState(null);
  const fetchSettings = async () => {
    try {
      const res = await get(siteconfig, true);
      const response = await res.json();
      setSettings(response.data);
      if (response.data) {
        if (response.data.etrav_api_prod_on === 1) {
          isuat = "no";
        } else {
          isuat = "yes";
        }
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession && userDataFromSession != null) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    }
    fetchSettings();
  }, [data]);

  const [isScanModalVisible, setIsScanModalVisible] = useState(false);
  const toggleScanModal = () => {
    setIsScanModalVisible(!isScanModalVisible);
  };

  const QrCodeComponent = () => {
    const ref_no = data.Agency_RefNo;
    const currentUrl = window.location.origin;
    const dataToEncode = encodeURI(`${currentUrl}/#/ticket_details/${ref_no}`);
    return (
      <div style={{ textAlign: "center" }}>
        <QRCodeCanvas value={dataToEncode} size={100} level="M" />
        <p style={{ marginTop: "10px" }}>Scan for Ticket</p>
      </div>
    );
  };

  // Function to handle booking cancellation
  const handleCancelBooking = async ({
    cancellationType,
    cancelCode,
    cancelReason,
  }) => {
    try {
      if (!cancellationType.trim()) {
        toast.error("Please select a Cancellation Type.");
        return;
      }
      if (!cancelCode.trim()) {
        toast.error("Please select a Cancellation Code.");
        return;
      }
      if (!cancelReason.trim()) {
        toast.error("Please provide a reason for cancellation.");
        return;
      }

      if (data.paying_method == "Rezorpay") {
        if (!Upiid) {
          toast.error("Please enter UPI ID");
          return;
        }
      }

      let AirTicketCancelDetails = [];
      bookingdata.AirPNRDetails.forEach((details, index) => {
        AirTicketCancelDetails.push({
          FlightId: details.Flights[0].Flight_Id,
          PassengerId: "1",
          SegmentId: details.Flights[0].Segments[0].Segment_Id,
        });
      });
      const setttingDataFromSession = sessionStorage.getItem("settting");
      if (setttingDataFromSession) {
        const setttingData = JSON.parse(setttingDataFromSession);
        if (setttingData.etrav_api_prod_on === 1) {
          isuat = "no";
        } else {
          isuat = "yes";
        }
      }
      const payload = {
        // "Auth_Header": {
        //     "UserId": "viviantravelsuat",
        //     "Password": "3B96F16F32C9AEB30C4DF9B3FBABAE964E4E1033",
        //     "IP_Address": "12333333",
        //     "Request_Id": "5500833959053023879",
        //     "IMEI_Number": "9536615000"
        // },
        api_c: "a",
        is_uat: isuat,
        AirTicketCancelDetails: AirTicketCancelDetails,
        Airline_PNR: "",
        RefNo: data.Booking_RefNo,
        CancelCode: cancelCode,
        ReqRemarks: cancelReason,
        CancellationType: parseInt(cancellationType, 10),
      };

      const api_url = (await AIR_4_URL()) + AIR_CANCELLATION;
      const res = await post(third_party, JSON.stringify(payload), api_url);
      const Apires = await res.json();

      const logs_response = await apipost(
        api_logs,
        {
          user_id: "",
          api_name: "AIR_CANCELLATION",
          api_url: api_url,
          api_payload: JSON.stringify(payload),
          api_response: JSON.stringify(Apires),
        },
        true
      );

      if (Apires.data.Response_Header.Error_Desc == "SUCCESS") {
        const info = {
          Booking_RefNo: data.Booking_RefNo,
          description: cancelReason,
          upi: Upiid ? Upiid : null,
          type: Upiid ? "Online" : "Wallet",
          amount: data.Amount,
          user_id: userData.id,
          cancel_api_type: "Etrav",
        };

        const response = await apipost(booking_cancle, info, true); // Replace with actual endpoint
        if (response.ok) {
          toast.success("Booking cancelled successfully.");
          setShowCancelModal(false);
        } else {
          toast.error("Failed to cancel booking.");
        }
      } else {
        return alert(
          Apires.data.Response_Header.Error_Desc +
            " " +
            Apires.data.Response_Header.Error_InnerException
        );
      }
    } catch (error) {
      console.error("Cancellation error:", error.message);
      alert("An error occurred during cancellation.");
    }
  };

  const [qrshowModal, setShowqrModal] = useState(false);
  const qrtoggleModal = () => setShowqrModal(!qrshowModal); // Toggle cancel modal visibility
  const cancellationOptions = {
    0: [
      {
        code: "015",
        description: "Please cancel my ticket with Applicable Penalty",
      },
      {
        code: "005",
        description: "I cancelled the ticket directly with Airline",
      },
      {
        code: "001",
        description: "Other - Mentioned the reason in Request Remarks",
      },
    ],
    1: [
      { code: "016", description: "Flight Schedule Changed by Airline" },
      {
        code: "005",
        description: "I cancelled the ticket directly with Airline",
      },
      {
        code: "004",
        description:
          "Received a communication from Airline that Flight is not Operational",
      },
      { code: "008", description: "Flight Cancelled by the Airline" },
      {
        code: "001",
        description: "Other - Mentioned the reason in Request Remarks",
      },
    ],
    2: [
      { code: "011", description: "Claim No Show Tax Refund" },
      {
        code: "001",
        description: "Other - Mentioned the reason in Request Remarks",
      },
    ],
  };
  const handleCancellationTypeChange = (e) => {
    setCancellationType(e.target.value);
    setCancelCode("");
  };

  return (
    <>
      {bookingdata && (
        <>
          <tr>
            <td>{Airline}</td>
            <td>{data.Agency_RefNo ? data.Agency_RefNo : "N/A"}</td>
            <td>{origananddestination}</td>
            <td>
              <div className="">
                {data.type == 2
                  ? pax_list.map((Passanger, index) => (
                      <h6 className="mb-0" key={index}>
                        {Passanger.title} {Passanger.firstName}{" "}
                        {Passanger.lastName}
                      </h6>
                    ))
                  : data.type == 3
                  ? bookingdata.pax_details.map((Passanger, index) => (
                      <h6 className="mb-0" key={index}>
                        {Passanger.title} {Passanger.first_name}{" "}
                        {Passanger.last_name}
                      </h6>
                    ))
                  : data.type == 4
                  ? pax_list.map((Passanger, index) => (
                      <h6 className="mb-0" key={index}>
                        {Passanger.title} {Passanger.first_name}{" "}
                        {Passanger.last_name}
                      </h6>
                    ))
                  : data.type == 5
                  ? pax_list.map((Passanger, index) => (
                      <h6 className="mb-0" key={index}>
                        {Passanger.title} {Passanger.first_name}{" "}
                        {Passanger.last_name}
                      </h6>
                    ))
                  : bookingdata.AirPNRDetails[0].PAXTicketDetails.map(
                      (Passanger, index) => (
                        <h6 className="mb-0" key={index}>
                          {Passanger.Title} {Passanger.First_Name}{" "}
                          {Passanger.Last_Name}
                        </h6>
                      )
                    )}
              </div>
            </td>
            <td>
              {data.type == 1
                ? bookingdata.Booking_Type == 0
                  ? "One Way"
                  : bookingdata.Booking_Type == 1
                  ? "Round-trip"
                  : "Multi-city"
                : "One Way"}
            </td>
            <td>₹{data.Amount}</td>
            <td>{data.status}</td>
            <td>
              {data.status != "Pending" && (
                <div className="action-buttons d-flex gap-2">
                  {/* <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={toggleModal}
                  >
                    <i className="fa fa-ticket m-1"></i>{" "}
                    <span className="button-text">Show Ticket</span>
                  </button> */}

                  <button
                    type="button"
                    className="btn btn-info btn-sm"
                    onClick={() => {
                      // Construct the ticket page URL
                      let ref_no =
                        data.type === 4 || data.type === 5
                          ? data.Agency_RefNo
                          : bookingdata.Agency_RefNo || data.Agency_RefNo;
                      const url = `${window.location.origin}/#/ticket_details/${ref_no}`;
                      window.open(url, "_blank");
                    }}
                  >
                    <i className="fa fa-ticket m-1"></i>{" "}
                    <span className="button-text">Show Ticket</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={qrtoggleModal}
                  >
                    <i className="fa fa-qrcode m-1"></i>{" "}
                    <span className="button-text"> Ticket QR </span>
                  </button>

                  {data.type == 1 && data.status !== "cancelled" && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={toggleCancelModal}
                    >
                      <i className="fa fa-times-circle m-1"></i>{" "}
                      <span className="button-text">Cancel Ticket</span>
                    </button>
                  )}
                </div>
              )}
            </td>
          </tr>

          {/* Show Ticket Modal */}
          <Modal
            show={showModal}
            onHide={toggleModal}
            size="xl"
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title>Ticket Details</Modal.Title>
            </Modal.Header>
            {data.type === 1 ? (
              <Ticket_Details reference_id={bookingdata.Booking_RefNo} />
            ) : data.type === 2 ? (
              <Air_iq_ticket_details
                ticket={data}
                reference_id={data.Booking_RefNo}
              />
            ) : data.type === 3 ? (
              <Gofly_ticket_details
                ticket_data={bookingdata}
                reference_id={bookingdata.booking_reference}
              />
            ) : data.type === 5 ? (
              <Offline_ticket_details
                ticket_data={bookingdata}
                reference_id={data.Agency_RefNo}
                pax_list={pax_list}
                maindata={data}
              />
            ) : (
              <Winfly_ticket_details
                pax_list={pax_list}
                ticket_data={data}
                reference_id={bookingdata.reference_id}
              />
            )}
          </Modal>

          {/* Cancel Confirmation Modal */}

          <Modal
            show={showCancelModal}
            onHide={toggleCancelModal}
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title>Cancel Booking</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to cancel this booking?</p>
              <br />
              <div className="mb-3">
                <label htmlFor="cancellationType" className="form-label">
                  Cancellation Type
                </label>
                <select
                  id="cancellationType"
                  className="form-control"
                  value={cancellationType}
                  onChange={handleCancellationTypeChange}
                >
                  <option value="">Select Cancellation Type</option>
                  <option value="0">Normal Cancel</option>
                  <option value="1">Full Refund</option>
                  <option value="2">No Show</option>
                </select>
              </div>
              {cancellationType &&
                cancellationOptions[cancellationType]?.length > 0 && (
                  <div className="mb-3">
                    <label htmlFor="cancelCode" className="form-label">
                      Cancellation Code
                    </label>
                    <select
                      id="cancelCode"
                      className="form-control"
                      value={cancelCode}
                      onChange={(e) => setCancelCode(e.target.value)}
                    >
                      <option value="">Select Cancellation Code</option>
                      {cancellationOptions[cancellationType].map((option) => (
                        <option key={option.code} value={option.code}>
                          {option.description}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              <div className="mb-3">
                <label htmlFor="cancelReason" className="form-label">
                  Cancellation Reason
                </label>
                <textarea
                  id="cancelReason"
                  className="form-control"
                  placeholder="Please provide a reason for cancellation (optional)"
                  rows="2"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                ></textarea>
              </div>

              {data.paying_method == "Rezorpay" ? (
                <>
                  <div className="mb-3">
                    <label htmlFor="cancelReason" className="form-label">
                      Enter UPI ID To Receving Payment
                    </label>
                    <input
                      type="text"
                      name="uipid"
                      onChange={(e) => setUpiid(e.target.value)}
                      placeholder="Enter UPI ID here"
                      className="form-control wizard-required"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <h4>
                      Amount will be receive in your wallet after cancel process
                    </h4>
                  </div>
                </>
              )}

              {/* <div className="mb-3">
                                <label htmlFor="cancelCode" className="form-label">Cancellation Code</label>
                                <select
                                    id="cancelCode"
                                    className="form-control"
                                    // value={cancelCode}
                                    onChange={(e) => setCancelCode(e.target.value)}
                                >
                                    <option value="">Select Cancellation Code</option>
                                    <option value="">Select Cancellation Code</option>
                                    <option value="">Select Cancellation Code</option>
                                </select>
                            </div> */}
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={toggleCancelModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() =>
                  handleCancelBooking({
                    cancellationType,
                    cancelCode,
                    cancelReason,
                  })
                }
              >
                Confirm Cancel
              </button>
            </Modal.Footer>
          </Modal>

          {/* qr Modal */}
          <Modal show={qrshowModal} onHide={qrtoggleModal} backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>Ticket Qr</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <QrCodeComponent value={bookingdata} />
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={qrtoggleModal}
              >
                Close
              </button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default BookingWidget;

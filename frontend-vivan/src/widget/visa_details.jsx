import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { Card, Col, Row } from "react-bootstrap";
import visaimage from "../assets/images/visa.png";
import Progress from "../component/Loading";
import { get } from "../API/airline";
import { siteconfig, IMAGE_BASE_URL } from "../API/endpoints";
import "./ticket_details.css";

function Visa_details({ visa }) {
  const [setting, setSettings] = useState(null);

  const fetchSettings = async () => {
    try {
      const res = await get(siteconfig, true);
      const response = await res.json();
      setSettings(response.data);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [visa]);

  const downloadPDF = () => {
    const element = document.getElementById("ticket-details");
    const options = {
      margin: 1,
      filename: "ticket_vivantravels.com.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  const InfoRow = ({ label, value }) => (
    <Col sm={6} md={4} lg={3} xl={2} xxl={2} className="mb-3">
      <h6 className="fw-semibold text-muted">{label}</h6>
      <p className="mb-0">{value || "N/A"}</p>
    </Col>
  );

  const FileRow = ({ label, file, error }) => (
    <Col sm={6} md={4} lg={3} xl={2} xxl={2} className="mb-3">
      <h6 className="fw-semibold text-muted">{label}</h6>
      {file ? (
        <a
          href={IMAGE_BASE_URL + file}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-primary"
        >
          <i className="fa fa-download me-2"></i> Download {label}
        </a>
      ) : (
        <p className="mb-0 text-danger">{error || "No file uploaded"}</p>
      )}
    </Col>
  );

  const capitalizeWords = (str) => {
    if (!str) return str;
    return str
      .toString()
      .replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  };
  return (
    <>
      {visa ? (
        <div className="card-body py-4 px-4">
          {visa.applied_visa_list.map((visa_user, index) => (
            <>
              <h3 className="mb-4 onelinetext">
                {index + 1}. {capitalizeWords(visa_user.first_name)}{" "}
                {capitalizeWords(visa_user.last_name)}
              </h3>
              <Row key={index}>
                <InfoRow
                  label="Reference Number"
                  value={visa_user.refrense_no}
                />
                <InfoRow label="Visa Type" value={visa_user.visa_type} />
                {/* <InfoRow label="First Name" value={visa_user.first_name} /> */}
                {/* <InfoRow label="Last Name" value={visa_user.last_name} /> */}
                <InfoRow label="Mother Name" value={visa_user.motherName} />
                <InfoRow label="Father Name" value={visa_user.fatherName} />
                <InfoRow label="Nationality" value={visa_user.nationality} />
                <InfoRow
                  label="Place of Birth"
                  value={visa_user.placeOfBirth}
                />
                <InfoRow label="Spouse Name" value={visa_user.spouseName} />
                <InfoRow label="Travel Date" value={visa_user.travelDate} />
                <InfoRow
                  label="Passport Number"
                  value={visa_user.passport_no}
                />
                <InfoRow label="Sex" value={visa_user.sex} />
                <InfoRow label="Date of Birth" value={visa_user.dob} />
                <InfoRow
                  label="Insurance Status"
                  value={visa_user.is_insurance}
                />
                <InfoRow label="PAN Card No" value={visa_user.pen_card_no} />
                <InfoRow
                  label="Traveler's Occupation"
                  value={visa_user.additional_question}
                />
                <InfoRow label="Amount" value={visa_user.amount} />
                <InfoRow label="Status" value={visa_user.status} />
                <InfoRow label="Remark" value={visa_user.remark} />
                <InfoRow label="Hotel Name" value={visa_user.hotal_name} />

                <FileRow
                  label="Front Passport File"
                  file={visa_user.front_passport_img}
                />
                <FileRow
                  label="Back Passport File"
                  file={visa_user.back_passport_img}
                />
                <FileRow
                  label="Traveler Photo"
                  file={visa_user.traveler_photo}
                />
                <FileRow label="Hotel Voucher" file={visa_user.hotal} />
                <FileRow
                  label="PAN Card Photo"
                  file={visa_user.pen_card_photo}
                />
                <FileRow
                  label="Insurance File"
                  file={visa_user.insurance_file}
                  error={"Insurance not generated"}
                />
                <FileRow
                  label="Visa File"
                  file={visa_user.created_file}
                  error={"Visa not generated"}
                />
              </Row>
            </>
          ))}
        </div>
      ) : (
        <Progress />
      )}
    </>
  );
}

export default Visa_details;

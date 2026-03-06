import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { post } from "../../API/apiHelper";
import CircularProgressBar from "../Component/Loading";
import {
  get_applied_visa_details,
  IMAGE_BASE_URL,
  update_applied_status,
} from "../../API/endpoints";
import visaimage from "../../Assets/Images/visa.png";
import { Card, Col, Row } from "react-bootstrap";
import "../Visa/VisaDetails.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Modal, Button, Form } from "react-bootstrap";

import { toast } from "react-toastify";
import Default from "../../Assets/Images/user.webp";
function Applied_visa_details() {
  const { id } = useParams();
  const visaid = atob(id);
  const [loading, setLoading] = useState(true);
  const [visa_data_files, setData] = useState(null);
  const [files, setfiles] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [Isloading, setIsloading] = useState(false);
  const [modalData, setModalData] = useState({
    status: "",
    id: "",
    created_file: null,
    remark: "",
    is_insurance: "",
    insurance_file: "",
  });
  const handleShowEdit = (data) => {
    setIsloading(false);
    setModalData({
      status: data.status,
      id: data.id,
      is_insurance: data.is_insurance,
      remark: data.remark || "",
    });
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setModalData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  const handleCloseEdit = () => setShowEditModal(false);

  const handleSave = async () => {
    setIsloading(true);
    try {
      const response = await post(update_applied_status, modalData, true);
      const data = await response.json();
      if (data.status == false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        window.location.reload();
      }

      handleCloseEdit();

      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      toast.error("An error occurred");
    }
  };
  const fetchSettingsData = async () => {
    setLoading(true);
    try {
      const res = await post(get_applied_visa_details, { id: visaid }, true);
      const response = await res.json();
      const data = response.data;
      setData(data);

      // let fileslist = [];
      // if (data.front_passport_img) {
      //   const fileExtension = data.front_passport_img.split(".").pop();
      //   fileslist.push({
      //     name: "front_passport_img." + fileExtension,
      //     url: IMAGE_BASE_URL + data.front_passport_img,
      //   });
      // }
      // if (data.back_passport_img) {
      //   const fileExtension = data.back_passport_img.split(".").pop();
      //   fileslist.push({
      //     name: "back_passport_img." + fileExtension,
      //     url: IMAGE_BASE_URL + data.back_passport_img,
      //   });
      // }
      // if (data.pen_card_photo) {
      //   const fileExtension = data.pen_card_photo.split(".").pop();
      //   fileslist.push({
      //     name: "pen_card_photo." + fileExtension,
      //     url: IMAGE_BASE_URL + data.pen_card_photo,
      //   });
      // }

      // if (data.traveler_photo) {
      //   const fileExtension = data.traveler_photo.split(".").pop();
      //   fileslist.push({
      //     name: "traveler_photo." + fileExtension,
      //     url: IMAGE_BASE_URL + data.traveler_photo,
      //   });
      // }

      // if (data.additional_folder) {
      //   const fileExtension = data.additional_folder.split(".").pop();
      //   fileslist.push({
      //     name:
      //       (data.additional_folder_label || "additional_file") +
      //       "." +
      //       fileExtension,
      //     url: IMAGE_BASE_URL + data.additional_folder,
      //   });
      // }
      // if (data.hotal) {
      //   const fileExtension = data.hotal.split(".").pop();
      //   fileslist.push({
      //     name: "hotal." + fileExtension,
      //     url: IMAGE_BASE_URL + data.hotal,
      //   });
      // }
      // console.log(fileslist);
      // setfiles(fileslist);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const downloadAllFiles = async () => {
    const zip = new JSZip();

    // Fetch and add files to ZIP
    for (const file of files) {
      const response = await fetch(file.url);
      if (!response.ok) {
        console.error(`Failed to fetch ${file.name}`);
        continue;
      }
      const blob = await response.blob();
      zip.file(file.name, blob);
    }

    // Generate ZIP file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "all_files.zip");
    });
  };

  const InfoRow = ({ label, value }) => (
    <Col md={6} lg={4} xl={3} xxl={2} className="mb-3">
      <h6 className="fw-semibold text-muted">{label}</h6>
      <p className="mb-0">{value || "N/A"}</p>
    </Col>
  );

  // const FileRow = ({ label, file, error }) => (
  //   <Col md={6} lg={4} xl={3} xxl={2} className="mb-3">
  //     <h6 className="fw-semibold text-muted">{label}</h6>
  //     {file ? (
  //       <a
  //         href={IMAGE_BASE_URL + file}
  //         target="_blank"
  //         rel="noopener noreferrer"
  //         className="text-primary"
  //       >
  //         Download {label}
  //       </a>
  //     ) : (
  //       <p className="mb-0 text-danger">{error || "No file uploaded"}</p>
  //     )}
  //   </Col>
  // );

  const FileRow = ({ label, file, error }) => (
    <Col md={6} lg={4} xl={3} xxl={2} className="mb-3">
      <h6 className="fw-semibold text-muted">{label}</h6>
      {file ? (
        <a
          href={IMAGE_BASE_URL + file}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="text-primary"
        >
          {file.split('/').pop()}
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
    <main id="content" role="main" className="main pointer-event">
      <div className="content container-fluid visadetails-page">
        <Card className="mb-5 visa-details-card">
          <div className="border-bottom px-4 py-3 card-header-section">
            <h5 className="mb-0 text-capitalize d-flex align-items-center gap-2 text-white">
              <img width="20" src={visaimage} alt="settings icon" />
              Applied Details
            </h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center">
                <CircularProgressBar />
              </div>
            ) : (
              <>
                {visa_data_files ? (
                  <div className="card-body py-4 px-4">
                    {visa_data_files.applied_visa_list.map(
                      (visa_user, index) => (
                        <>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            {" "}
                            <h3 className="mb-4 onelinetext">
                              {index + 1}.{" "}
                              {capitalizeWords(visa_user.first_name)}{" "}
                              {capitalizeWords(visa_user.last_name)}
                            </h3>{" "}
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleShowEdit(visa_user)}
                            >
                              <i className="tio-edit"></i>
                            </Button>
                          </div>
                          <Row key={index}>
                            <InfoRow
                              label="Reference Number"
                              value={visa_user.refrense_no}
                            />
                            <InfoRow
                              label="Visa Type"
                              value={visa_user.visa_type}
                            />
                            {/* <InfoRow label="First Name" value={visa_user.first_name} /> */}
                            {/* <InfoRow label="Last Name" value={visa_user.last_name} /> */}
                            <InfoRow
                              label="Mother Name"
                              value={visa_user.motherName}
                            />
                            <InfoRow
                              label="Father Name"
                              value={visa_user.fatherName}
                            />
                            <InfoRow
                              label="Nationality"
                              value={visa_user.nationality}
                            />
                            <InfoRow
                              label="Place of Birth"
                              value={visa_user.placeOfBirth}
                            />
                            <InfoRow
                              label="Spouse Name"
                              value={visa_user.spouseName}
                            />
                            <InfoRow
                              label="Travel Date"
                              value={
                                visa_user.travelDate &&
                                visa_user.travelDate !== "Invalid date"
                                  ? visa_user.travelDate
                                  : "N/A"
                              }
                            />

                            <InfoRow
                              label="Entry Point"
                              value={visa_user.entryPoint}
                            />
                            <InfoRow
                              label="Exit Point"
                              value={visa_user.exitPoint}
                            />
                            <InfoRow
                              label="Passport Number"
                              value={visa_user.passport_no}
                            />
                            <InfoRow label="Sex" value={visa_user.sex} />
                            <InfoRow
                              label="Date of Birth"
                              value={visa_user.dob}
                            />
                            <InfoRow
                              label="Insurance Status"
                              value={visa_user.is_insurance}
                            />
                            <InfoRow
                              label="PAN Card No"
                              value={visa_user.pen_card_no}
                            />
                            <InfoRow
                              label="Traveler's Occupation"
                              value={visa_user.additional_question}
                            />
                            <InfoRow label="Amount" value={visa_user.amount} />
                            <InfoRow label="Status" value={visa_user.status} />
                            <InfoRow label="Remark" value={visa_user.remark} />
                            <InfoRow
                              label="Hotel Name"
                              value={visa_user.hotal_name}
                            />

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
                            <FileRow
                              label="Hotel Voucher"
                              file={visa_user.hotal}
                            />
                            {/* {visa_user.additional_folder && (
                              <FileRow
                                label={
                                  visa_user.additional_folder_label ??
                                  "Additional File"
                                }
                                file={visa_user.additional_folder ?? ""}
                              />
                            )} */}

<FileRow
  label={
    visa_user.additional_folder_label ??
    "Ticket Voucher / Additional Files"
  }
  file={visa_user.additional_folder}
  error="No file uploaded"
/>
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
                      )
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
          <Modal show={showEditModal} onHide={handleCloseEdit}>
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>Update Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="status">
                  <Form.Label>Status:</Form.Label>
                  <Form.Control
                    as="select"
                    value={modalData.status}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Status</option>
                    <option value="In Process">In Process</option>
                    <option value="Additional Document Required">
                      Additional Document Required
                    </option>
                    <option value="On Hold">On Hold</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Approved">Approved</option>
                  </Form.Control>
                  <Form.Control
                    type="hidden"
                    value={modalData.id}
                    onChange={handleChange}
                  />
                </Form.Group>
                {modalData.status === "Approved" && (
                  <Form.Group>
                    <Form.Label>Upload Visa</Form.Label>
                    <Form.Control
                      type="file"
                      name="created_file"
                      accept="application/pdf"
                      onChange={handleChange}
                    />
                  </Form.Group>
                )}
                <br />
                {modalData.status === "Approved" &&
                  modalData.is_insurance === "Yes" && (
                    <Form.Group>
                      <Form.Label>Upload Insurance File</Form.Label>
                      <Form.Control
                        type="file"
                        name="insurance_file"
                        accept="application/pdf"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  )}
                <br />
                {(modalData.status === "Rejected" ||
                  modalData.status === "In Process" ||
                  modalData.status === "Additional Document Required") && (
                  <Form.Group controlId="remarks">
                    <Form.Label>Remarks:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter remarks"
                      value={modalData.remark}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          remark: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                )}
              </Form>
            </Modal.Body>
            {!Isloading ? (
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEdit}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
              </Modal.Footer>
            ) : (
              <CircularProgressBar />
            )}
          </Modal>
        </Card>
      </div>
    </main>
  );
}

export default Applied_visa_details;

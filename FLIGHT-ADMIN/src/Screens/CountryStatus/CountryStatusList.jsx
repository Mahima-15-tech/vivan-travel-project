import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { country_status_update } from "../../API/endpoints";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { post } from "../../API/apiHelper";
import CircularProgressBar from "../Component/Loading";

const CountryStatusList = ({ data, onUpdate }) => {
  const navigate = useNavigate();
  const [IsVisaLoading, setIsVisaLoading] = useState(false);
  const [IsOTBLoading, setIsOTBLoading] = useState(false);
  const [IsRulesLoading, setIsRulesLoading] = useState(false);

  const handleSaveallow = async (dataval, type) => {
    try {
      if (type === "allow_for_visa") {
        setIsVisaLoading(true);
      } else {
        setIsOTBLoading(true);
      }
      const response = await post(
        country_status_update,
        type == "allow_for_visa"
          ? {
            id: dataval.id,
            allow_for_visa: dataval.allow_for_visa === "Yes" ? "No" : "Yes",
          }
          : {
            id: dataval.id,
            allow_for_otb: dataval.allow_for_otb === "Yes" ? "No" : "Yes",
          },
        true
      );
      const data = await response.json();

      if (type === "allow_for_visa") {
        setIsVisaLoading(false);
      } else {
        setIsOTBLoading(false);
      }
      if (data.status === false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      handleCloseEdit();
      onUpdate(
        type === "allow_for_visa"
          ? {
            ...dataval,
            id: dataval.id,
            allow_for_visa: dataval.allow_for_visa === "Yes" ? "No" : "Yes",
            type: type,
          }
          : {
            ...dataval,
            id: dataval.id,
            allow_for_otb: dataval.allow_for_otb === "Yes" ? "No" : "Yes",
            type: type,
          }
      );
    } catch (error) {
      toast.error("An error occurred");
    }
  };
  const handleSave = async () => {
    try {
      setIsRulesLoading(true);
      const response = await post(
        country_status_update,
        {
          id: modalData.id,
          allow_for_pp_front: modalData.allow_for_pp_front,
          allow_for_pp_front_required: modalData.allow_for_pp_front_required,
          allow_for_pp_back: modalData.allow_for_pp_back,
          allow_for_pp_back_required: modalData.allow_for_pp_back_required,
          allow_for_pancard: modalData.allow_for_pancard,
          allow_for_pancard_required: modalData.allow_for_pancard_required,
          allow_for_pancard_no: modalData.allow_for_pancard_no,
          allow_for_pancard_no_required:
            modalData.allow_for_pancard_no_required,
          allow_for_pp_no: modalData.allow_for_pp_no,
          allow_for_pp_no_required: modalData.allow_for_pp_no_required,
          allow_for_first_name: modalData.allow_for_first_name,
          allow_for_first_name_required:
            modalData.allow_for_first_name_required,
          allow_for_last_name: modalData.allow_for_last_name,
          allow_for_last_name_required: modalData.allow_for_last_name_required,
          allow_for_nationalty: modalData.allow_for_nationalty,
          allow_for_nationalty_required:
            modalData.allow_for_nationalty_required,
          allow_for_checkinpoint: modalData.allow_for_checkinpoint,
          allow_for_checkinpoint_required:
            modalData.allow_for_checkinpoint_required,
          allow_for_checkoutpoint: modalData.allow_for_checkoutpoint,
          allow_for_checkoutpoint_required:
            modalData.allow_for_checkoutpoint_required,
          allow_for_additional_folder: modalData.allow_for_additional_folder,
          allow_for_additional_folder_required:
            modalData.allow_for_additional_folder_required,
          allow_for_additional_folder_label:
            modalData.allow_for_additional_folder_label,
          allow_for_insurance: modalData.allow_for_insurance,
          allow_for_insurance_required: modalData.allow_for_insurance_required,
          allow_for_occupation: modalData.allow_for_occupation,
          allow_for_occupation_required:
            modalData.allow_for_occupation_required,
          allow_for_photo: modalData.allow_for_photo,
          allow_for_photo_required: modalData.allow_for_photo_required,
          allow_for_hotal_name: modalData.allow_for_hotal_name,
          allow_for_hotal_name_required:
            modalData.allow_for_hotal_name_required,


          allow_for_hotal_voucher: modalData.allow_for_hotal_voucher,
          allow_for_hotal_voucher_required:
            modalData.allow_for_hotal_voucher_required,

          allow_for_travel_date: modalData.allow_for_travel_date,
          allow_for_travel_date_required:
            modalData.allow_for_travel_date_required,
          allow_for_gender: modalData.allow_for_gender,
          allow_for_gender_required: modalData.allow_for_gender_required,
          allow_for_dob: modalData.allow_for_dob,
          allow_for_dob_required: modalData.allow_for_dob_required,
          allow_for_mothername: modalData.allow_for_mothername,
          allow_for_mothername_required:
            modalData.allow_for_mothername_required,
          allow_for_fathername: modalData.allow_for_fathername,
          allow_for_fathername_required:
            modalData.allow_for_fathername_required,
          allow_for_place_of_birth: modalData.allow_for_place_of_birth,
          allow_for_place_of_birth_required:
            modalData.allow_for_place_of_birth_required,
          allow_for_spouse_name: modalData.allow_for_spouse_name,
          allow_for_spouse_name_required:
            modalData.allow_for_spouse_name_required,
        },
        true
      );
      const data = await response.json();
      if (data.status == false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      handleCloseEdit();
      onUpdate({
        ...modalData,
      });
      setIsRulesLoading(false);
    } catch (error) {
      toast.error("An error occurred");
    }
  };
  const [modalData, setModalData] = useState({});

  const handleShowEdit = () => {
    setModalData({ ...data });
    setShowEditModal(true);
  };
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseEdit = () => setShowEditModal(false);
  return (
    <tr>
      <td className="text-center">{data.id || "N/A"}</td>
      <td className="text-center">{data.country_name || "N/A"}</td>
      <td className="text-center">{data.code || "N/A"}</td>
      <td className="text-center">{data.currency || "N/A"}</td>
      <td>
        <div className="text-center">
          <div
            className={`badge ${data.allow_for_visa === "Yes"
              ? "badge-soft-success"
              : "badge-soft-danger"
              }`}
            onClick={() => handleSaveallow(data, "allow_for_visa")}
          >
            {IsVisaLoading ? <CircularProgressBar /> : data.allow_for_visa}
          </div>
        </div>
      </td>
      <td>
        <div className="text-center">
          <div
            className={`badge ${data.allow_for_otb === "Yes"
              ? "badge-soft-success"
              : "badge-soft-danger"
              }`}
            onClick={() => handleSaveallow(data, "allow_for_otb")}
          >
            {IsOTBLoading ? <CircularProgressBar /> : data.allow_for_otb}
          </div>
        </div>
      </td>
      <td className="text-center">
        <div className="d-flex justify-content-center gap-2">
          <Button variant="outline-danger" size="sm" onClick={handleShowEdit}>
            <i className="tio-edit"></i>
          </Button>
          <Modal
            show={showEditModal}
            onHide={handleCloseEdit}
            className="visa_rules"
          >
            <Modal.Header closeButton className="customModalHeader">
              <Modal.Title>Update VISA Validation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <div className="row">
                  <Form.Group
                    controlId="allow_for_pp_front"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Passport Front:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_pp_front}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_pp_front: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_pp_front_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Passport Front Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_pp_front_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_pp_front_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_pp_back"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Passport Back:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_pp_back}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_pp_back: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_pp_no_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Passport Back Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_pp_no_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_pp_no_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_pp_no"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Passport No:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_pp_no}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_pp_no: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_pp_no_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Passport No Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_pp_no_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_pp_no_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_first_name"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>First Name:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_first_name}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_first_name: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_first_name_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>First Name Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_first_name_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_first_name_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_last_name"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>last Name:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_last_name}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_last_name: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_last_name_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>last Name Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_last_name_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_last_name_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_nationalty"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>nationalty:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_nationalty}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_nationalty: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_nationalty_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>nationalty Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_nationalty_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_nationalty_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_pancard"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>pancard:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_pancard}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_pancard: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_pancard_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>pancard Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_pancard_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_pancard_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_pancard_no"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>pancard no:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_pancard_no}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_pancard_no: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_pancard_no_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>pancard no Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_pancard_no_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_pancard_no_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_checkinpoint"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Check In Point:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_checkinpoint}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_checkinpoint: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_checkinpoint_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Check In Point Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_checkinpoint_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_checkinpoint_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_checkoutpoint"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Check Out Point:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_checkoutpoint}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_checkoutpoint: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_checkoutpoint_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Check Out Point Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_checkoutpoint_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_checkoutpoint_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_insurance"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Insurance:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_insurance}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_insurance: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_insurance_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Insurance Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_insurance_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_insurance_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_occupation"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>occupation:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_occupation}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_occupation: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_occupation_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>occupation Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_occupation_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_occupation_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_photo"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>photo:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_photo}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_photo: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_photo_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>photo Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_photo_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_photo_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_hotal_name"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>hotel name:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_hotal_name}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_hotal_name: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_hotal_name_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>hotal name Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_hotal_name_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_hotal_name_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>





                  <Form.Group
                    controlId="allow_for_hotal_name"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>hotel voucher:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_hotal_voucher}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_hotal_voucher: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_hotal_name_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>hotal voucher Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_hotal_voucher_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_hotal_voucher_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>




                  <Form.Group
                    controlId="allow_for_travel_date"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>travel date:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_travel_date}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_travel_date: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_travel_date_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>travel date Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_travel_date_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_travel_date_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_gender"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>gender:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_gender}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_gender: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_gender_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>gender Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_gender_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_gender_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_dob"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>DOB:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_dob}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_dob: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_dob_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>DOB Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_dob_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_dob_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_mothername"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>mother name:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_mothername}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_mothername: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_mothername_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>mother name Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_mothername_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_mothername_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_fathername"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>father name:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_fathername}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_fathername: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_fathername_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>father name Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_fathername_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_fathername_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_place_of_birth"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>place of birth:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_place_of_birth}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_place_of_birth: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_place_of_birth_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>place of birth Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_place_of_birth_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_place_of_birth_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_spouse_name"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>spouse name:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_spouse_name}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_spouse_name: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_spouse_name_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>spouse name Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_spouse_name_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_spouse_name_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group
                    controlId="allow_for_additional_folder"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Additional Folder:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_additional_folder}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_additional_folder: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="allow_for_additional_folder_required"
                    className="col-lg-3 col-sm-6 mb-2"
                  >
                    <Form.Label>Additional Folder Required:</Form.Label>
                    <Form.Control
                      as="select"
                      value={modalData.allow_for_additional_folder_required}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_additional_folder_required: e.target.value,
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group
                    controlId="formCategoryName"
                    className="col-lg-6 col-sm-6 mb-2"
                  >
                    <Form.Label>Enter Additional Folder Label</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Additional Folder Label"
                      value={modalData.allow_for_additional_folder_label}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          allow_for_additional_folder_label: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </div>
              </Form>
            </Modal.Body>
            {IsRulesLoading ? (
              <CircularProgressBar />
            ) : (
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEdit}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
              </Modal.Footer>
            )}
          </Modal>
        </div>
      </td>
    </tr>
  );
};
export default CountryStatusList;

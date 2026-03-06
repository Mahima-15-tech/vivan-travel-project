import React, { useRef, useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { json, useLocation } from "react-router-dom";
import { post, get } from "../../../../API/apiHelper";
import { post as HelperPost } from "../../../../API/apiHelper";
import { razarpaypayment } from "../../../../API/utils";
// import { hdfcPayment } from "../../API/utils";

import PaymentStatusPopup from "../../../user/check_payment";

import {
  apply_visa,
  wallet_add,
  siteconfig,
  users_profile,
  maincountry_list,
  payment_check,
  IMAGE_BASE_URL,
} from "../../../../API/endpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import Progress from "../../../../component/Loading";
import { CiWallet } from "react-icons/ci";
import { SiRazorpay } from "react-icons/si";
import logo from "../../../../assets/images/logo.png";

import visa_country from "../../../../widget/visa_country";
import Select from "react-select";

const dropzoneStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  borderWidth: "2px",
  borderRadius: "2px",
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "rgba(77, 115, 252, 0.1)",
  color: "#bdbdbd",
  outline: "none",
  transition: "border 0.24s ease-in-out",
  cursor: "pointer",
};

const activeDropzoneStyle = {
  borderColor: "#00adb5",
};

const DropzoneText = {
  margin: "0",
  fontSize: "16px",
  fontWeight: "600",
  textAlign: "center",
  paddingBottom: "20px",
};

const ImagePreview = {
  display: "flex",
  maxWidth: "100%",
  maxHeight: "150px",
  margin: "auto",
  borderRadius: "2px",
};

const FileName = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  fontSize: "14px",
  marginTop: "8px",
  position: "absolute",
  bottom: "-26px",
  right: "50%",
  transform: "translate(50%)",
};

function TabComponent({ visaDetails, applied_visa_list, applied_visa_id }) {
  const navigate = useNavigate();
  const [visaDetail, setVisaDetails] = useState(visaDetails || {});

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const encodedformData = queryParams.get("other");
  const formData = atob(encodedformData);
  const jsonObject = JSON.parse(formData);
  const visavaildations = jsonObject.visa_data;

  // const travelDate = new Date(jsonObject.travelDate);
  // const returnDate = new Date(jsonObject.returnDate);
  // const formattedDate = travelDate.toLocaleDateString("en-US", {
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  // });
  // const formattedreturnDate = returnDate.toLocaleDateString("en-US", {
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  // });

  const handleCheckboxChange = (e) => {
    setIsinsurense(e.target.checked);
  };

  useEffect(() => {
    if (visaDetails) {
      setVisaDetails(visaDetails);
    }
  }, [visaDetails]);

  const [files, setFiles] = useState({});
  const [setting, setSettings] = useState(null);
  const [Isinsurense, setIsinsurense] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [payment_id_forcheck, setpayment_id_forcheck] = useState(null);
  const [finaldatafor_payment, setfinaldatafor_payment] = useState(null);
  const clickedButton = useRef(null);

  const defaultApplicant = {
    mylastappliedid: applied_visa_id || "",
    mylastid: "",
    passportNumber: "",
    penNumber: "",
    firstName: "",
    lastName: "",
    sex: "",
    birthday: "",
    addi: "",
    files: "",
    front_passport_img: "",
    back_passport_img: "",
    traveler_photo: "",
    pen_card_photo: "",
    panNumber: "",
    additional_folder: "",
    Occupation: "",
    hotal: "",
    hotal_name: "",
    Passenger_type: "Adult",
    motherName: "",
    fatherName: "",
    placeOfBirth: "",
    spouseName: "",
    travelDate: "",
    entryPoint: "",
    exitPoint: "",
    show: false,
    last_status: "",
  };

  const initialFormList = Array.from({ length: 10 }, (_, i) => ({
    ...defaultApplicant,
    show: i === 0, // First one is true, rest are false
  }));

  const [formlist, setFormlist] = useState(initialFormList);

  // [`user_id_${index + 1}`]: userData.id,
  // [`visa_id_${index + 1}`]: visaDetails.id,
  // [`mylastid_${index + 1}`]: visaDetails.mylastid,
  // [`visa_type_${index + 1}`]: visa_typeval,
  // [`internal_ID_${index + 1}`]: internal_ID,
  // [`group_name_${index + 1}`]: group_name,
  // [`passport_no_${index + 1}`]: traveler.passportNumber,
  // [`first_name_${index + 1}`]: traveler.firstName,
  // [`last_name_${index + 1}`]: traveler.lastName,
  // [`nationality_${index + 1}`]: traveler.nationality,
  // [`sex_${index + 1}`]: traveler.sex,
  // [`dob_${index + 1}`]: traveler.birthday,
  // [`pen_card_no_${index + 1}`]: traveler.panNumber,
  // [`additional_question_${index + 1}`]: traveler.Occupation,
  // [`front_passport_img_${index + 1}`]: traveler.front_passport_img,
  // [`back_passport_img_${index + 1}`]: traveler.back_passport_img,
  // [`traveler_photo_${index + 1}`]: traveler.traveler_photo,
  // [`pen_card_photo_${index + 1}`]: traveler.pen_card_photo,
  // [`additional_folder_${index + 1}`]: traveler.additional_folder,
  // [`hotal_${index + 1}`]: traveler.hotal,
  // [`hotal_name_${index + 1}`]: traveler.hotal_name,
  // [`additional_folder_label_${index + 1}`]:
  //   visavaildations.allow_for_additional_folder_label,
  // [`motherName_${index + 1}`]: traveler.motherName,
  // [`fatherName_${index + 1}`]: traveler.fatherName,
  // [`placeOfBirth_${index + 1}`]: traveler.placeOfBirth,
  // [`spouseName_${index + 1}`]: traveler.spouseName,
  // [`travelDate_${index + 1}`]: traveler.travelDate,
  // [`entryPoint_${index + 1}`]: traveler.entryPoint,
  // [`exitPoint_${index + 1}`]: traveler.exitPoint,
  // [`is_insurance_${index + 1}`]: Isinsurense ? "Yes" : "No",
  // [`amount_${index + 1}`]: amount,

  const updateField = (index, key, value) => {
    const newFormList = [...formlist];
    // if (key == "nationality") {
    //   if (value == "United Arab Emirates") {
    //     setPassenger(true);
    //   } else {
    //     setPassenger(false);
    //   }
    //   newFormList[index] =
    //     value == "United Arab Emirates"
    //       ? {
    //         ...newFormList[index],
    //         [key]: value,
    //         ["Passenger_type"]: value,
    //       }
    //       : {
    //         ...newFormList[index],
    //         [key]: value,
    //         ["Passenger_type"]: value,
    //       };
    //   setFormlist(newFormList);
    // } else {
    newFormList[index] = {
      ...newFormList[index],
      [key]: value,
    };
    setFormlist(newFormList);
    // }
  };

  const addNewTraveler = () => {
    const newFormList = [...formlist];
    const index = newFormList.filter((item) => item.show).length;
    if (index == 10) {
      toast.success("List");
    } else {
      newFormList[index] = {
        ...newFormList[index],
        ["show"]: true,
      };
      setFormlist(newFormList);
    }
  };

  const removeitem = (index) => {
    const newFormList = [...formlist];

    newFormList[index] = {
      ...newFormList[index],
      // passportNumber: "",
      // penNumber: "",
      // firstName: "",
      // lastName: "",
      // sex: "",
      // birthday: "",
      // addi: "",
      // files: "",
      // front_passport_img: "",
      // back_passport_img: "",
      // traveler_photo: "",
      // pen_card_photo: "",
      // panNumber: "",
      // additional_folder: "",
      // Occupation: "",
      // hotal: "",
      // hotal_name: "",
      // Passenger_type: "",
      // motherName: "",
      // fatherName: "",
      // placeOfBirth: "",
      // spouseName: "",
      // travelDate: "",
      // entryPoint: "",
      // exitPoint: "",
      show: false,
    };
    setFormlist(newFormList);
  };

  const [userData, setUserData] = useState(null);
  const [uData, setUData] = useState(null);

  const fetchSettings = async () => {
    try {
      const res = await get(siteconfig, true);
      const response = await res.json();
      setSettings(response.data);
    } catch (error) {
      // console.log(error);
    }
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
    const newFormList = [...formlist];
    applied_visa_list.forEach((item, index) => {
      newFormList[index] = {
        ...newFormList[index],
        mylastid: item.id.toString() || "",
        passportNumber: item.passport_no, // corrected
        penNumber: item.pen_card_no, // corrected
        firstName: item.first_name,
        lastName: item.last_name,
        nationality: item.nationality,
        sex: item.sex,
        birthday: item.dob, // corrected
        addi: item.additional_question || "", // fallback if not available
        files: "",
        front_passport_img_url: item.front_passport_img || "",
        back_passport_img_url: item.back_passport_img || "",
        traveler_photo_url: item.traveler_photo,
        pen_card_photo_url: item.pen_card_photo,
        panNumber: item.pen_card_no, // panNumber seems same as pen_card_no
        additional_folder: item.additional_folder,
        additional_folder_url: item.additional_folder,
        Occupation: item.additional_question || "", // fallback if 'Occupation' not defined
        hotal_url: item.hotal,
        hotal_name: item.hotal_name,
        Passenger_type: item.visa_type || "Adult", // assuming Passenger_type maps to visa_type
        motherName: item.motherName,
        fatherName: item.fatherName,
        placeOfBirth: item.placeOfBirth,
        spouseName: item.spouseName,
        travelDate: item.travelDate,
        entryPoint: item.entryPoint,
        exitPoint: item.exitPoint,
        show: true,
        last_status: item.status,
        last_remark: item.remark,
      };
    });
    setFormlist(newFormList);
    // console.log("Form list updated with applied visa data:", newFormList);
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession && userDataFromSession != null) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    }
    fetchUserData();
    fetchSettings();
  }, []);
  const handlePaymentAndApplyVisa = async (action) => {
    if (!setting) return;

    const visa_typeval =
      formlist.filter((item) => item.show).length > 1 ? "group" : "individual";
    const now = new Date();
    const timestampMs = now.getTime();
    const group_name =
      visa_typeval === "group"
        ? `g_${userData.id || userData.model?.id || "0"}_${timestampMs}`
        : "no group";
    const internal_ID = `${
      userData.id || userData.model?.id || "0"
    }_${timestampMs}`;

    const buildFormData = () => {
      let final_params = {
        submit_type: action,
        mylastappliedid: formlist[0]?.mylastappliedid,
      };
      formlist
        .filter((item) => item.show)
        .forEach((traveler, index, filteredList) => {
          const isChild = traveler.Passenger_type === "Child";
          const isAgent = uData?.type === "2";
          const isLast = index === filteredList.length - 1;

          const amount = !isChild
            ? isAgent
              ? Number(
                  visaDetail.visa_agent_charges?.price ??
                    Number(visaDetail.amount ?? 0) +
                      (uData?.agents
                        ? Number(uData.agents.visa_booking_c ?? 0)
                        : 0)
                )
              : Number(visaDetail.amount ?? 0) +
                Number(setting?.visa_agency_charge ?? 0)
            : Number(visaDetail.child_amount ?? 0) +
              Number(
                isAgent
                  ? uData?.agents?.visa_booking_child_c ?? "0"
                  : setting?.child_visa_prize ?? "0"
              );

          const travelerData = {
            [`user_id_${index + 1}`]: userData.id,
            [`visa_id_${index + 1}`]: visaDetails.id,
            [`last_status_${index + 1}`]: traveler.last_status,
            [`mylastid_${index + 1}`]: traveler.mylastid,
            [`visa_type_${index + 1}`]: visa_typeval,
            [`internal_ID_${index + 1}`]: internal_ID,
            [`group_name_${index + 1}`]: group_name,
            [`passport_no_${index + 1}`]: traveler.passportNumber,
            [`first_name_${index + 1}`]: traveler.firstName,
            [`last_name_${index + 1}`]: traveler.lastName,
            [`nationality_${index + 1}`]: traveler.nationality,
            [`sex_${index + 1}`]: traveler.sex,
            [`dob_${index + 1}`]: traveler.birthday,
            [`pen_card_no_${index + 1}`]: traveler.panNumber,
            [`additional_question_${index + 1}`]: traveler.Occupation,
            [`front_passport_img_${index + 1}`]: traveler.front_passport_img,
            [`back_passport_img_${index + 1}`]: traveler.back_passport_img,
            [`traveler_photo_${index + 1}`]: traveler.traveler_photo,
            [`pen_card_photo_${index + 1}`]: traveler.pen_card_photo,
            [`additional_folder_${index + 1}`]: traveler.additional_folder,
            [`hotal_${index + 1}`]: traveler.hotal,
            [`hotal_name_${index + 1}`]: traveler.hotal_name,
            [`additional_folder_label_${index + 1}`]:
              visavaildations.allow_for_additional_folder_label,
            [`motherName_${index + 1}`]: traveler.motherName,
            [`fatherName_${index + 1}`]: traveler.fatherName,
            [`placeOfBirth_${index + 1}`]: traveler.placeOfBirth,
            [`spouseName_${index + 1}`]: traveler.spouseName,
            [`travelDate_${index + 1}`]: traveler.travelDate,
            [`entryPoint_${index + 1}`]: traveler.entryPoint,
            [`exitPoint_${index + 1}`]: traveler.exitPoint,
            [`is_insurance_${index + 1}`]: Isinsurense ? "Yes" : "No",
            [`amount_${index + 1}`]: amount,
          };

          final_params = { ...final_params, ...travelerData };
        });

      return final_params;
    };
    const finalamount =
      (jsonObject.going_to == "United Arab Emirates" && Isinsurense
        ? Number(setting.insurance_prize) *
          formlist.filter((item) => item.show).length
        : 0) +
      (uData && uData.type === "2"
        ? Number(
            visaDetail.visa_agent_charges?.price ??
              Number(visaDetail.amount ?? 0) +
                (uData?.agents ? Number(uData.agents.visa_booking_c ?? 0) : 0)
          )
        : Number(visaDetail.amount ?? 0) +
          Number(setting != null ? setting.visa_agency_charge ?? 0 : 0)) *
        formlist.filter((item) => item.show && item.Passenger_type != "Child")
          .length +
      (uData && uData.type === "2"
        ? Number(
            visaDetail.visa_agent_charges?.child_price ??
              Number(visaDetail.child_amount ?? 0) +
                (uData?.agents ? Number(uData.agents.visa_booking_c ?? 0) : 0)
          )
        : Number(visaDetail.child_amount ?? 0) +
          Number(setting != null ? setting.visa_agency_charge ?? 0 : 0)) *
        formlist.filter((item) => item.show && item.Passenger_type == "Child")
          .length;
    // 👉 Wallet Payment Flow
    const order_id_visa = Math.floor(Date.now() / 1000);

    if (action === "draft") {
      const finalFormData = buildFormData();
      apply_visaafterpayment(finalFormData);
    } else if (action === "resubmit") {
      const finalFormData = buildFormData();
      apply_visaafterpayment(finalFormData);
    } else if (paymentMethod === "wallet") {
      const userDataFromSession = sessionStorage.getItem("userData");
      const walletBalance = JSON.parse(userDataFromSession)?.model?.wallet ?? 0;

      if (Number(walletBalance) >= Number(finalamount)) {
        // Wallet transaction entry
        const walletTransaction = {
          user_id: userData.id,
          order_id: Math.floor(10000000 + Math.random() * 90000000),
          transaction_type: "Visa Apply",
          amount: finalamount,
          payment_getway: "wallet",
          details: "Visa Apply",
          type: "2",
          status: "Success",
        };

        await HelperPost(wallet_add, walletTransaction, true);

        // Deduct wallet
        const newWallet = walletBalance - finalamount;
        let sessionUser = JSON.parse(userDataFromSession);
        sessionUser.model.wallet = newWallet;
        sessionStorage.setItem("userData", JSON.stringify(sessionUser));
        setUData((prev) => ({ ...prev, wallet: newWallet }));

        // Apply Visa
        const finalFormData = buildFormData();
        apply_visaafterpayment(finalFormData);
      } else {
        setLoading(false);
        alert("Your Wallet Balance is low");
      }
    }

    // 👉 Razorpay Flow
    else if (paymentMethod === "razorpay") {
      const finalFormData = buildFormData();
      setpayment_id_forcheck(order_id_visa);
      setfinaldatafor_payment(finalFormData);
      razarpaypayment(
        order_id_visa,
        finalamount,
        "Visa Applied",
        "",
        async (response) => {
          setLoading(true);

          if (response?.razorpay_payment_id ?? "") {
            const finalFormData = buildFormData();
            apply_visaafterpayment(finalFormData);
          } else {
          }

          setLoading(false);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = clickedButton.current;
    // alert(action);
    // return;
    let a_amount = 0;
    let a_amount_child = 0;
    if (uData != null && uData.type === "2") {
      a_amount = uData.agents ? uData.agents.visa_booking_c : "0";
      a_amount_child = uData.agents
        ? uData.agents.visa_booking_child_c || "0"
        : "0";
    }
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
    }
    let allow_next = true;
    if (action === "apply") {
      formlist.forEach((item, index) => {
        if (item.show) {
          if (
            item.show &&
            visavaildations.allow_for_first_name_required === "Yes" &&
            item.firstName === ""
          ) {
            const el = document.getElementById(`firstName_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the first name");
            return;
          }
          if (
            visavaildations.allow_for_last_name_required === "Yes" &&
            item.show &&
            item.lastName === ""
          ) {
            const el = document.getElementById(`lastName_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the last name");
            return;
          }
          if (
            visavaildations.allow_for_pancard_no_required === "Yes" &&
            item.show &&
            item.passportNumber === ""
          ) {
            const el = document.getElementById(`passportNumber_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the passport number");
            return;
          }
          if (
            // visavaildations.allow_for_pancard_no_required === "Yes" &&
            item.show &&
            item.Passenger_type === ""
          ) {
            const el = document.getElementById(`Passenger_type_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the passenger type");
            return;
          }
          if (
            visavaildations.allow_for_nationalty_required === "Yes" &&
            item.show &&
            item.nationality === ""
          ) {
            const el = document.getElementById(`nationality_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the nationality");
            return;
          }
          if (
            visavaildations.allow_for_gender_required === "Yes" &&
            item.show &&
            item.sex === ""
          ) {
            const el = document.getElementById(`sex_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the gender");
            return;
          }
          if (
            visavaildations.allow_for_dob_required === "Yes" &&
            item.show &&
            item.birthday === ""
          ) {
            const el = document.getElementById(`travelerBirthday_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the date of birth");
            return;
          }
          if (
            visavaildations.allow_for_place_of_birth_required === "Yes" &&
            item.show &&
            item.placeOfBirth === ""
          ) {
            const el = document.getElementById(`placeOfBirth_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the place of birth");
            return;
          }
          if (
            visavaildations.allow_for_spouse_name_required === "Yes" &&
            item.show &&
            item.spouseName === ""
          ) {
            const el = document.getElementById(`spouseName_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the spouse name");
            return;
          }
          if (
            visavaildations.allow_for_mothername_required === "Yes" &&
            item.show &&
            item.motherName === ""
          ) {
            const el = document.getElementById(`motherName_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the mother's name");
            return;
          }
          if (
            visavaildations.allow_for_fathername_required === "Yes" &&
            item.show &&
            item.fatherName === ""
          ) {
            const el = document.getElementById(`fatherName_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the father's name");
            return;
          }
          if (
            visavaildations.allow_for_travel_date_required === "Yes" &&
            item.show &&
            item.travelDate === ""
          ) {
            const el = document.getElementById(`travelDate_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the travel date");
            return;
          }
          if (
            visavaildations.allow_for_checkinpoint_required === "Yes" &&
            item.show &&
            item.entryPoint === ""
          ) {
            const el = document.getElementById(`entryPoint_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the entry point");
            return;
          }
          if (
            visavaildations.allow_for_checkoutpoint_required === "Yes" &&
            item.show &&
            item.exitPoint === ""
          ) {
            const el = document.getElementById(`exitPoint_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the exit point");
            return;
          }
          if (
            visavaildations.allow_for_pancard_no_required === "Yes" &&
            item.show &&
            item.panNumber === ""
          ) {
            const el = document.getElementById(`panNumber_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the PAN number");
            return;
          }
          if (
            visavaildations.allow_for_hotal_name_required === "Yes" &&
            item.show &&
            item.hotal_name === ""
          ) {
            const el = document.getElementById(`hotalName_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the hotel name");
            return;
          }
          if (
            visavaildations.allow_for_occupation_required === "Yes" &&
            item.show &&
            item.Occupation === ""
          ) {
            const el = document.getElementById(`occupation_${index}`);
            if (el) el.focus();
            allow_next = false;
            toast.error("Please fill in the occupation");
            return;
          }
        }
      });
    }
    if (allow_next === false) {
      return;
    }
    // if (formlist[0].firstName === "" && action !== "draft") {
    //   const el = document.getElementById(`firstName_${0}`);
    //   if (el) el.focus();
    //   return;
    // }
    const listval = formlist.filter(
      (item) =>
        item.show &&
        ((visavaildations.allow_for_pp_front === "Yes" &&
          visavaildations.allow_for_pp_front_required === "Yes" &&
          item.front_passport_img === "" &&
          item.front_passport_img_url === "") ||
          (visavaildations.allow_for_pp_back === "Yes" &&
            visavaildations.allow_for_pp_back_required === "Yes" &&
            item.back_passport_img === "" &&
            item.back_passport_img_url === "") ||
          (visavaildations.allow_for_photo === "Yes" &&
            visavaildations.allow_for_photo_required === "Yes" &&
            item.traveler_photo === "" &&
            item.traveler_photo_url === "") ||
          (visavaildations.allow_for_pancard === "Yes" &&
            visavaildations.allow_for_pancard_required === "Yes" &&
            item.pen_card_photo === "" &&
            item.pen_card_photo_url === "") ||
          (visavaildations.allow_for_hotal_name === "Yes" &&
            visavaildations.allow_for_hotal_name_required === "Yes" &&
            item.hotal === "" &&
            item.hotal_url === "") ||
          (visavaildations.allow_for_additional_folder === "Yes" &&
            visavaildations.allow_for_additional_folder_required === "Yes" &&
            item.additional_folder === "" &&
            item.additional_folder_url === ""))
    );
    if (listval.length !== 0) {
      listval.forEach((item) => {
        if (
          visavaildations.allow_for_pp_front === "Yes" &&
          visavaildations.allow_for_pp_front_required === "Yes" &&
          item.front_passport_img === ""
        ) {
          toast.error(`Upload front passport image for ${item.firstName}`);
        }
        if (
          visavaildations.allow_for_pp_back === "Yes" &&
          visavaildations.allow_for_pp_back_required === "Yes" &&
          item.back_passport_img === ""
        ) {
          toast.error(`Upload back passport image for ${item.firstName}`);
        }
        if (
          visavaildations.allow_for_photo === "Yes" &&
          visavaildations.allow_for_photo_required === "Yes" &&
          item.traveler_photo === ""
        ) {
          toast.error(`Upload photo for ${item.firstName}`);
        }
        if (
          visavaildations.allow_for_pancard === "Yes" &&
          visavaildations.allow_for_pancard_required === "Yes" &&
          item.pen_card_photo === ""
        ) {
          toast.error(`Upload pancard image for ${item.firstName}`);
        }
        if (
          visavaildations.allow_for_hotal_voucher === "Yes" &&
          visavaildations.allow_for_hotal_voucher_required === "Yes" &&
          item.hotal === ""
        ) {
          toast.error(`Upload hotel voucher for ${item.firstName}`);
        }
        if (
          visavaildations.allow_for_additional_folder === "Yes" &&
          visavaildations.allow_for_additional_folder_required === "Yes" &&
          item.additional_folder === ""
        ) {
          toast.error(
            `Upload ${visavaildations.allow_for_additional_folder_label} for ${item.firstName}`
          );
        }
      });
    } else {
      // setLoading(true);
      try {
        await handlePaymentAndApplyVisa(action);
      } catch (error) {
        setLoading(false);
        // console.error("Error occurred while handling payment and applying visa:", error);
      }
      // const finalamount =
      //   (jsonObject.going_to == "United Arab Emirates" && Isinsurense
      //     ? Number(setting.insurance_prize) *
      //       formlist.filter((item) => item.show).length
      //     : 0) +
      //   (uData && uData.type === "2"
      //     ? Number(
      //         visaDetail.visa_agent_charges?.price ??
      //           Number(visaDetail.amount ?? 0) +
      //             (uData?.agents
      //               ? Number(uData.agents.visa_booking_c ?? 0)
      //               : 0)
      //       )
      //     : Number(visaDetail.amount ?? 0) +
      //       Number(setting != null ? setting.visa_agency_charge ?? 0 : 0)) *
      //     formlist.filter(
      //       (item) => item.show && item.Passenger_type != "Child"
      //     ).length +
      //   (uData && uData.type === "2"
      //     ? Number(
      //         visaDetail.visa_agent_charges?.child_price ??
      //           Number(visaDetail.child_amount ?? 0) +
      //             (uData?.agents
      //               ? Number(uData.agents.visa_booking_c ?? 0)
      //               : 0)
      //       )
      //     : Number(visaDetail.child_amount ?? 0) +
      //       Number(setting != null ? setting.visa_agency_charge ?? 0 : 0)) *
      //     formlist.filter(
      //       (item) => item.show && item.Passenger_type == "Child"
      //     ).length;
      // if (setting != null) {
      //   if (paymentMethod == "razorpay") {
      //     razarpaypayment(
      //       "11",
      //       finalamount,
      //       "Visa Applied",
      //       "",
      //       async (response) => {
      //         setLoading(true);
      //         if (
      //           response.razorpay_payment_id &&
      //           response.razorpay_payment_id != null
      //         ) {
      //           const now = new Date();
      //           const timestampMs = now.getTime();
      //           const visa_typeval =
      //             formlist.filter((item) => item.show).length > 1
      //               ? "group"
      //               : "individual";
      //           const group_name =
      //             formlist.filter((item) => item.show).length > 1
      //               ? `g_${userData.model}_${timestampMs}`
      //               : "no group";
      //           const internal_ID = `${userData.model}_${timestampMs}`;
      //           formlist
      //             .filter((item) => item.show)
      //             .forEach((traveler, index, filteredList) => {
      //               const isLastItem = index === filteredList.length - 1;
      //               const formData = {
      //                 user_id: userData.id,
      //                 visa_id: visaDetails.id,
      //                 visa_type: visa_typeval,
      //                 internal_ID: internal_ID,
      //                 group_name: group_name,
      //                 passport_no: traveler.passportNumber,
      //                 first_name: traveler.firstName,
      //                 last_name: traveler.lastName,
      //                 nationality: traveler.nationality,
      //                 sex: traveler.sex,
      //                 dob: traveler.birthday,
      //                 pen_card_no: traveler.panNumber,
      //                 additional_question: traveler.Occupation,
      //                 // photodaysNumber: traveler.photoNumber,
      //                 front_passport_img: traveler.front_passport_img,
      //                 back_passport_img: traveler.back_passport_img,
      //                 traveler_photo: traveler.traveler_photo,
      //                 pen_card_photo: traveler.pen_card_photo,
      //                 additional_folder: traveler.additional_folder,
      //                 additional_folder_label:
      //                   visavaildations.allow_for_additional_folder_label,
      //                 hotal: traveler.hotal,
      //                 hotal_name: traveler.hotal_name,
      //                 motherName: traveler.motherName,
      //                 fatherName: traveler.fatherName,
      //                 placeOfBirth: traveler.placeOfBirth,
      //                 spouseName: traveler.spouseName,
      //                 travelDate: traveler.travelDate,
      //                 entryPoint: traveler.entryPoint,
      //                 exitPoint: traveler.exitPoint,
      //                 is_insurance: Isinsurense ? "Yes" : "No",
      //                 amount:
      //                   traveler.Passenger_type !== "Child"
      //                     ? uData && uData.type === "2"
      //                       ? Number(
      //                           visaDetail.visa_agent_charges?.price ??
      //                             Number(visaDetail.amount ?? 0) +
      //                               (uData?.agents
      //                                 ? Number(
      //                                     uData.agents.visa_booking_c ?? 0
      //                                   )
      //                                 : 0)
      //                         )
      //                       : Number(visaDetail.amount ?? 0) +
      //                         Number(
      //                           setting != null
      //                             ? setting.visa_agency_charge ?? 0
      //                             : 0
      //                         )
      //                     : Number(visaDetail.child_amount) +
      //                       Number(
      //                         uData != null && uData.type === "2"
      //                           ? uData.agents
      //                             ? uData.agents.visa_booking_child_c || "0"
      //                             : "0"
      //                           : setting != null
      //                           ? setting.child_visa_prize
      //                           : "0"
      //                       ),
      //               };
      //               apply_visaafterpayment(formData, isLastItem);
      //             });
      //         }
      //       }
      //     );

      //     setLoading(false);
      //   } else {
      //     const userDataFromSessionup = sessionStorage.getItem("userData");
      //     if (userDataFromSessionup) {
      //       let userDataup = JSON.parse(userDataFromSessionup).model;
      //       // console.log("h yogesh " + userDataup.wallet + "  " + finalamount);
      //       if (Number(userDataup.wallet) >= Number(finalamount)) {
      //         const formDatawallet = {
      //           user_id: userData.id,
      //           order_id: Math.floor(10000000 + Math.random() * 90000000),
      //           transaction_type: "Visa Apply",
      //           amount: finalamount,
      //           payment_getway: "wallet",
      //           details: "Visa Apply",
      //           type: "2",
      //           status: "Success",
      //         };
      //         await HelperPost(wallet_add, formDatawallet, true);

      //         let userDataS = sessionStorage.getItem("userData");
      //         userDataS = userDataS ? JSON.parse(userDataS) : {};
      //         userDataS.model.wallet = userData.wallet - finalamount;
      //         sessionStorage.setItem("userData", JSON.stringify(userDataS));
      //         setUData((prevData) => ({
      //           ...prevData,
      //           wallet: userData.wallet - finalamount,
      //         }));

      //         const now = new Date();
      //         const timestampMs = now.getTime();

      //         const visa_typeval =
      //           formlist.filter((item) => item.show).length > 1
      //             ? "group"
      //             : "individual";
      //         const group_name =
      //           formlist.filter((item) => item.show).length > 1
      //             ? `g_${
      //                 userData.id || userData.model.id || "0"
      //               }_${timestampMs}`
      //             : "no group";
      //         const internal_ID =
      //           `${userData.id}_${timestampMs}` || userData.model.id || "0";
      //         let final_params = { submit_type: action };
      //         formlist
      //           .filter((item) => item.show)
      //           .forEach((traveler, index, filteredList) => {
      //             try {
      //               const isLastItem = index === filteredList.length - 1;
      //               const formData = {
      //                 [`user_id_${index + 1}`]: userData.id,
      //                 [`visa_id_${index + 1}`]: visaDetails.id,
      //                 [`visa_type_${index + 1}`]: visa_typeval,
      //                 [`internal_ID_${index + 1}`]: internal_ID,
      //                 [`group_name_${index + 1}`]: group_name,
      //                 [`passport_no_${index + 1}`]: traveler.passportNumber,
      //                 [`first_name_${index + 1}`]: traveler.firstName,
      //                 [`last_name_${index + 1}`]: traveler.lastName,
      //                 [`nationality_${index + 1}`]: traveler.nationality,
      //                 [`sex_${index + 1}`]: traveler.sex,
      //                 [`dob_${index + 1}`]: traveler.birthday,
      //                 [`pen_card_no_${index + 1}`]: traveler.panNumber,
      //                 [`additional_question_${index + 1}`]:
      //                   traveler.Occupation,
      //                 // [`photodaysNumber_${index + 1}`]: traveler.photoNumber,
      //                 [`front_passport_img_${index + 1}`]:
      //                   traveler.front_passport_img,
      //                 [`back_passport_img_${index + 1}`]:
      //                   traveler.back_passport_img,
      //                 [`traveler_photo_${index + 1}`]:
      //                   traveler.traveler_photo,
      //                 [`pen_card_photo_${index + 1}`]:
      //                   traveler.pen_card_photo,
      //                 [`additional_folder_${index + 1}`]:
      //                   traveler.additional_folder,
      //                 [`hotal_${index + 1}`]: traveler.hotal,
      //                 [`hotal_name_${index + 1}`]: traveler.hotal_name,
      //                 [`additional_folder_label_${index + 1}`]:
      //                   visavaildations.allow_for_additional_folder_label,
      //                 [`motherName_${index + 1}`]: traveler.motherName,
      //                 [`fatherName_${index + 1}`]: traveler.fatherName,
      //                 [`placeOfBirth_${index + 1}`]: traveler.placeOfBirth,
      //                 [`spouseName_${index + 1}`]: traveler.spouseName,
      //                 [`travelDate_${index + 1}`]: traveler.travelDate,
      //                 [`entryPoint_${index + 1}`]: traveler.entryPoint,
      //                 [`exitPoint_${index + 1}`]: traveler.exitPoint,
      //                 [`is_insurance_${index + 1}`]: Isinsurense
      //                   ? "Yes"
      //                   : "No",
      //                 [`amount_${index + 1}`]:
      //                   traveler.Passenger_type !== "Child"
      //                     ? uData && uData.type === "2"
      //                       ? Number(
      //                           visaDetail.visa_agent_charges?.price ??
      //                             Number(visaDetail.amount ?? 0) +
      //                               (uData?.agents
      //                                 ? Number(
      //                                     uData.agents.visa_booking_c ?? 0
      //                                   )
      //                                 : 0)
      //                         )
      //                       : Number(visaDetail.amount ?? 0) +
      //                         Number(
      //                           setting != null
      //                             ? setting.visa_agency_charge ?? 0
      //                             : 0
      //                         )
      //                     : Number(visaDetail.child_amount) +
      //                       Number(
      //                         uData != null && uData.type === "2"
      //                           ? uData.agents
      //                             ? uData.agents.visa_booking_child_c || "0"
      //                             : "0"
      //                           : setting != null
      //                           ? setting.child_visa_prize
      //                           : "0"
      //                       ),
      //               };
      //               console.log("userData:", formData);
      //               final_params = { ...final_params, ...formData };
      //             } catch (error) {
      //               console.log("Error in formData:", error);
      //             }
      //           });
      //         console.log("final_params:", final_params);
      //         apply_visaafterpayment(final_params);
      //       } else {
      //         setLoading(false);
      //         alert("Your Wallet Balance is low ");
      //       }
      //     } else {
      //       setLoading(false);
      //       alert("Your Wallet Balance is low");
      //     }
      //   }
      // }
      // } catch (error) {
      //   setLoading(false);
      // }
    }
  };
  const formatDateForSQL = (date) => {
    if (!date || isNaN(new Date(date).getTime())) return null; // Handle invalid dates
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // e.g., "2025-04-01"
  };
  async function apply_visaafterpayment(formData) {
    try {
      const response = await post(apply_visa, formData, true);
      const data = await response.json();
      if (data.status == false) {
        toast.error(data.message);
      } else {
        toast.success(
          formData.submit_type == "draft" ? "Visa Save In Draft" : data.message
        );
        // if (isLastItem) {
        setTimeout(() => {
          navigate("/visa-status");
          window.location.reload();
        }, 3000);
        // }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const onDrop = useCallback((acceptedFiles, key) => {
    setFiles((prevState) => ({
      ...prevState,
      [key]: acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    }));
  }, []);

  const CreateDropzone = (index, key, key2) => {
    return useDropzone({
      accept:
        key !== "additional_folder" && key !== "hotal"
          ? {
              "image/jpeg": [],
              "image/png": [],
              "image/jpg": [],
            }
          : {
              "application/pdf": [],
              "image/jpeg": [],
              "image/png": [],
              "image/jpg": [],
            },
      maxSize: 1024 * 1024 * 5, // 5MB
      maxFiles: 3,
      onDrop: (acceptedFiles) => {
        updateField(index, key, acceptedFiles[0]);
        onDrop(acceptedFiles, key2);
      },
    });
  };

  const renderDropzone = (
    needtoshow,
    label,
    isreqired,
    dropzoneProps,
    fieldKey,
    options = {},
    already_file
  ) => {
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
      dropzoneProps;

    const hasUploadedFiles = acceptedFiles && acceptedFiles.length > 0;

    return (
      <div
        className="dz-clickable mb-3"
        key={fieldKey}
        style={{
          display: needtoshow ? "block" : "none",
        }}
      >
        <label className="form-label" htmlFor={fieldKey}>
          {label} <span className="text-danger">{isreqired ? "*" : ""}</span>
        </label>
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed rgba(0, 123, 255, 0.3)",
            borderRadius: "12px",
            padding: "30px",
            background: "linear-gradient(135deg, #f8f9fa, #e9f5ff)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease-in-out",
            cursor: "pointer",
            position: "relative",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className={`dropzone ${isDragActive ? "active" : ""}`}
        >
          <input {...getInputProps({ ...options })} />

          {!(hasUploadedFiles || already_file) && (
            <>
              {/* Modern Upload Icon */}
              <i
                className="fas fa-cloud-upload-alt"
                style={{
                  fontSize: "48px",
                  color: isDragActive ? "#007bff" : "#6c757d",
                  marginBottom: "15px",
                  transition: "color 0.3s ease-in-out",
                }}
              ></i>

              {/* Main Instruction Text */}
              <p
                style={{
                  color: "#333",
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "5px",
                }}
              >
                Drag & Drop files here
              </p>

              {/* Sub Text */}
              <p
                style={{
                  color: "#6c757d",
                  fontSize: "14px",
                  fontWeight: "400",
                  marginBottom: "0",
                }}
              >
                or click to browse from your device
              </p>
            </>
          )}

          {/* Displaying File List */}
          <ul
            style={{
              padding: "0",
              marginTop: "15px",
              listStyleType: "none",
              width: "100%",
              textAlign: "left",
            }}
          >
            {renderDocuList(fieldKey, already_file)}
          </ul>

          {/* Active State Message */}
          {isDragActive && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontWeight: "bold",
                color: "#007bff",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: "10px 15px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              Release to upload files
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDocuList = (key, already_file) => {
    const fileList = files[key];

    return Array.isArray(fileList) && fileList.length > 0 ? (
      fileList.map((file) => (
        <li key={file.name} style={{ position: "relative", listStyle: "none" }}>
          <img style={ImagePreview} src={file.preview} alt={file.name} />
          <span style={FileName}>{file.name}</span>
        </li>
      ))
    ) : already_file ? (
      <li style={{ position: "relative", listStyle: "none" }}>
        <img
          style={ImagePreview}
          src={IMAGE_BASE_URL + already_file}
          alt="Uploaded File"
        />
        <span style={FileName}>Uploaded File</span>
      </li>
    ) : (
      <></>
    );
  };

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const handlePaymentChangess = (e) => {
    setPaymentMethod(e.target.value);
  };

  const today = new Date();

  // const [options, setOptions] = useState([]);
  useEffect(() => {
    const fatchcountry = async () => {
      try {
        const res = await post(
          maincountry_list,
          { type: "visa", limit: 50000 },
          true
        );
        const response = await res.json();
        // const options = response.data.map((option) => ({
        //   country_id: option.id,
        //   value: option.country_name,
        //   label: option.country_name,
        //   currency: option.currency,
        // }));
        // setOptions(options);
      } catch (error) {
        // console.log(error);
      }
    };
    fatchcountry();
  }, []);
  const options = visa_country.map((option) => ({
    value: option,
    label: option,
  }));
  return (
    <div className="containe flex flex-col max-w-screen-xl gap-8">
      <form onSubmit={handleSubmit}>
        <div className="apllying-">
          {formlist.map((traveler, index) => (
            <div
              className={`apllying-ser ${
                traveler.last_status === "Additional Document Required" ||
                traveler.last_status === "draft" ||
                traveler.last_status === "" ||
                traveler.last_status === null ||
                traveler.last_status === undefined
                  ? ""
                  : "bootstrap-disable"
              }`}
              style={{
                display: traveler.show ? "block" : "none",
              }}
            >
              <header className="pb-4 border-b border-gray-300 border-solid">
                <h3 className="font-heading text-2xl font-semibold md:text-3xl">
                  Traveler Details
                </h3>
                <div
                  className="text-danger"
                  style={{
                    display:
                      traveler.last_status === "Additional Document Required"
                        ? "block"
                        : "none",
                  }}
                >
                  {traveler?.last_remark || ""}
                </div>
              </header>
              {index !== 0 &&
                formlist.filter(
                  (item) => item.last_status === "Additional Document Required"
                ).length == 0 && (
                  <div
                    className="close-buttonsit"
                    onClick={() => removeitem(index)}
                  >
                    X
                  </div>
                )}
              <div className="forms-st fpp">
                <div className="row mb-3">
                  {/* <p className="text-sm text-gray-700 mb-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat quaerat minus dolorum ut ab molestias soluta, illo ratione eius rem enim rerum vel itaque nostrum sequi aperiam. Dignissimos, eum debitis?</p> */}
                  <div
                    className="col-12 col-lg-5 mb-3"
                    style={{
                      display:
                        visavaildations.allow_for_pp_front === "Yes" ||
                        visavaildations.allow_for_pp_back === "Yes"
                          ? "block"
                          : "none",
                    }}
                  >
                    {renderDropzone(
                      visavaildations.allow_for_photo === "Yes",
                      "Upload Traveler's Photo",
                      visavaildations.allow_for_photo_required === "Yes",
                      //   toTravelersPhoto,

                      CreateDropzone(
                        index,
                        "traveler_photo",
                        `travelersPhoto${index}`
                      ),
                      `travelersPhoto${index}`,
                      {},
                      traveler.traveler_photo_url
                    )}
                    {renderDropzone(
                      visavaildations.allow_for_pp_front === "Yes",
                      "Front Passport Image",
                      visavaildations.allow_for_pp_front_required === "Yes",
                      //   toFrontPassport,
                      CreateDropzone(
                        index,
                        "front_passport_img",
                        `frontPassport${index}`
                      ),
                      `frontPassport${index}`,
                      {},
                      traveler.front_passport_img_url
                    )}
                  </div>
                  <div className="col-12 col-lg-7 mb-3">
                    <div className="row pb-2">
                      <div
                        className="col-12 col-md-6 col-lg-6 mb-6"
                        style={{
                          display:
                            visavaildations.allow_for_first_name === "Yes"
                              ? "block"
                              : "none",
                        }}
                      >
                        <label className="form-label" htmlFor="firstName">
                          First Name{" "}
                          <span className="text-danger">
                            {visavaildations.allow_for_first_name_required ===
                            "Yes"
                              ? "*"
                              : ""}
                          </span>
                        </label>
                        <div className="position-relative">
                          <i className="fas fa-user left-start-icon"></i>{" "}
                          {/* User icon */}
                          <input
                            type="text"
                            id={"firstName_" + index}
                            value={traveler.firstName}
                            onChange={(e) =>
                              updateField(index, "firstName", e.target.value)
                            }
                            // required={
                            //   clickedButton.current === "draft" &&
                            //   visavaildations.allow_for_first_name_required ===
                            //     "Yes" &&
                            //   traveler.show
                            // }
                            className="form-control with-icon"
                            placeholder="Enter First Name"
                          />
                        </div>
                      </div>

                      <div
                        className="col-12 col-md-6 col-lg-6 mb-6"
                        style={{
                          display:
                            visavaildations.allow_for_last_name === "Yes"
                              ? "block"
                              : "none",
                        }}
                      >
                        <label className="form-label" htmlFor="lastName">
                          Last Name
                          <span className="text-danger">
                            {visavaildations.allow_for_last_name_required ===
                            "Yes"
                              ? "*"
                              : ""}
                          </span>
                        </label>
                        <div className="position-relative">
                          <i className="fas fa-user left-start-icon"></i>{" "}
                          {/* Profile icon */}
                          <input
                            type="text"
                            id="lastName"
                            value={traveler.lastName}
                            onChange={(e) =>
                              updateField(index, "lastName", e.target.value)
                            }
                            // required={
                            //   visavaildations.allow_for_last_name_required ===
                            //     "Yes" && traveler.show
                            // }
                            className="form-control with-icon"
                            placeholder="Enter Last Name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row pb-2">
                      <div
                        className="col-12 col-md-6 col-lg-6 mb-6"
                        style={{
                          display:
                            visavaildations.allow_for_pp_no === "Yes"
                              ? "block"
                              : "none",
                        }}
                      >
                        <label className="form-label" htmlFor="passportNumber">
                          Passport Number
                          <span className="text-danger">
                            {visavaildations.allow_for_pp_no_required === "Yes"
                              ? "*"
                              : ""}
                          </span>
                        </label>
                        <div className="position-relative">
                          <i className="fas fa-passport left-start-icon"></i>{" "}
                          {/* Passport icon */}
                          <input
                            type="text"
                            id={"passportNumber_" + index}
                            pattern="^[A-Za-z]{1,2}[0-9]{6,7}$"
                            value={traveler.passportNumber}
                            onChange={(e) =>
                              updateField(
                                index,
                                "passportNumber",
                                e.target.value.toUpperCase()
                              )
                            }
                            // required={
                            //   visavaildations.allow_for_pancard_no_required ===
                            //     "Yes" && traveler.show
                            // }
                            className="form-control with-icon"
                            placeholder="A1234567"
                          />
                        </div>
                      </div>
                      <div
                        className="col-12 col-md-6 col-lg-6 mb-6 sitdrpdwn"
                        style={{
                          display:
                            visavaildations.allow_for_nationalty === "Yes"
                              ? "block"
                              : "none",
                        }}
                      >
                        <label className="form-label" htmlFor="nationality">
                          Nationality{" "}
                          <span className="text-danger">
                            {visavaildations.allow_for_nationalty_required ===
                            "Yes"
                              ? "*"
                              : ""}
                          </span>
                        </label>

                        <div className="position-relative">
                          <i className="fas fa-globe left-start-icon"></i>{" "}
                          {/* Globe icon */}
                          <Select
                            options={options}
                            name="nationality"
                            id={`nationality_${index}`}
                            value={options.find(
                              (option) => option.value === traveler.nationality
                            )}
                            className="form-control with-icon"
                            classNamePrefix="react-select"
                            placeholder="Nationality"
                            isSearchable
                            onChange={(e) =>
                              updateField(index, "nationality", e.value)
                            }
                            // required={
                            //   visavaildations.allow_for_nationalty_required ===
                            //     "Yes" && traveler.show
                            // }
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                paddingLeft: "1.6rem",
                              }),
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row pb-2">
                      <div className="col-12 col-md-6 col-lg-6 mb-6 sitdrpdwn">
                        <label className="form-label" htmlFor="Passenger_type">
                          Passenger Type{" "}
                          <span className="text-danger">
                            {visavaildations.allow_for_nationalty_required ===
                            "Yes"
                              ? "*"
                              : ""}
                          </span>
                        </label>

                        <div className="position-relative">
                          <i className="fas fa-user left-start-icon"></i>{" "}
                          <select
                            name="Passenger_type"
                            id={`Passenger_type_${index}`}
                            className="form-control with-icon"
                            value={traveler.Passenger_type || ""}
                            onChange={(e) => {
                              updateField(
                                index,
                                "Passenger_type",
                                e.target.value
                              );
                            }}
                          >
                            <option value=""> Select Passenger type </option>
                            <option value="Adult">Adult</option>
                            {jsonObject.going_to == "United Arab Emirates" && (
                              <option value="Child">Child</option>
                            )}
                          </select>
                        </div>
                      </div>

                      <div
                        className="col-12 col-md-6 col-lg-6 mb-6 sitdrpdwn"
                        style={{
                          display:
                            visavaildations.allow_for_gender === "Yes"
                              ? "block"
                              : "none",
                        }}
                      >
                        <label className="form-label" htmlFor="sex">
                          Sex{" "}
                          <span className="text-danger">
                            {visavaildations.allow_for_gender_required === "Yes"
                              ? "*"
                              : ""}
                          </span>
                        </label>
                        <div className="position-relative">
                          <i className="fas fa-venus-mars left-start-icon"></i>{" "}
                          {/* Gender symbol icon */}
                          <select
                            id={`sex_${index}`}
                            value={traveler.sex}
                            onChange={(e) =>
                              updateField(index, "sex", e.target.value)
                            }
                            // required={
                            //   visavaildations.allow_for_gender_required ===
                            //     "Yes" && traveler.show
                            // }
                            className="form-control with-icon"
                          >
                            <option value="">Select Gender</option>
                            <option value="F">Female</option>
                            <option value="M">Male</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12 mb-3"
                      style={{
                        display:
                          visavaildations.allow_for_dob === "Yes"
                            ? "block"
                            : "none",
                      }}
                    >
                      <label className="form-label">
                        Date of Birth
                        <span className="text-danger">
                          {visavaildations.allow_for_dob_required === "Yes"
                            ? "*"
                            : ""}
                        </span>
                      </label>
                      <div className="mb-24 position-relative">
                        <FaRegCalendarAlt className="left-start-icon" />
                        <DatePicker
                          selected={
                            traveler.birthday
                              ? new Date(traveler.birthday)
                              : null
                          } // Ensure selected is a Date object
                          onChange={(date) => {
                            const formattedDate = formatDateForSQL(date); // Convert to YYYY-MM-DD
                            updateField(index, "birthday", formattedDate); // Pass the formatted string
                          }}
                          autoComplete="off"
                          placeholderText="DD/MM/YYYY"
                          dateFormat="dd-MMM-yyyy" // Display format remains dd-MMM-yyyy
                          className="form-control with-icon sel-input date_from"
                          yearDropdownItemNumber={1000}
                          style={{
                            width: "100%",
                            padding: "10px",
                            cursor: "pointer",
                          }}
                          onFocus={(e) => e.target.blur()}
                          // required={
                          //   visavaildations.allow_for_dob_required === "Yes" &&
                          //   traveler.show
                          // }
                          id={`travelerBirthday_${index}`}
                          showMonthDropdown={true}
                          showYearDropdown={true}
                          maxDate={new Date()} // Prevent future dates
                        />
                      </div>

                      {/* Place of Birth */}
                      <div
                        className="mb-3"
                        style={{
                          display:
                            visavaildations.allow_for_place_of_birth === "Yes"
                              ? "block"
                              : "none",
                        }}
                      >
                        <label className="form-label" htmlFor="placeOfBirth">
                          Place of Birth
                          <span className="text-danger">
                            {visavaildations.allow_for_place_of_birth_required ===
                            "Yes"
                              ? "*"
                              : ""}
                          </span>
                        </label>
                        <input
                          type="text"
                          id={`placeOfBirth_${index}`}
                          value={traveler.placeOfBirth}
                          onChange={(e) =>
                            updateField(index, "placeOfBirth", e.target.value)
                          }
                          // required={
                          //   visavaildations.allow_for_place_of_birth_required ===
                          //     "Yes" && traveler.show
                          // }
                          className="form-control"
                          placeholder="Enter Place of Birth"
                        />
                      </div>
                      {/* Spouse Name */}
                      <div
                        className="mb-3"
                        style={{
                          display:
                            visavaildations.allow_for_spouse_name === "Yes"
                              ? "block"
                              : "none",
                        }}
                      >
                        <label className="form-label" htmlFor="spouseName">
                          Spouse Name
                          <span className="text-danger">
                            {visavaildations.allow_for_spouse_name_required ===
                            "Yes"
                              ? "*"
                              : ""}
                          </span>
                        </label>
                        <input
                          type="text"
                          id={`spouseName_${index}`}
                          value={traveler.spouseName}
                          onChange={(e) =>
                            updateField(index, "spouseName", e.target.value)
                          }
                          // required={
                          //   visavaildations.allow_for_spouse_name_required ===
                          //     "Yes" && traveler.show
                          // }
                          className="form-control"
                          placeholder="Enter Spouse Name"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="bg-sec-gray mb-24 mt-24" />
              </div>
              <div className="forms-st tp">
                <div className="row mb-3">
                  <p className="text-sm text-gray-700 mb-3">
                    {/* {jsonObject.going_to} */}
                    {/* <a
                      className="text-blue-600"
                      href="https://drive.google.com/file/d/1kCVa9iZvIA53wLTfyytlPTgOIJBsVbMm/view?usp=sharing"
                      rel="noreferrer"
                      target="_blank"
                    >
                      here
                    </a> */}
                    Your visa can get rejected if these guidelines are not
                    followed. check the guidelines{" "}
                    <a
                      className="text-blue-600"
                      href="https://drive.google.com/file/d/1kCVa9iZvIA53wLTfyytlPTgOIJBsVbMm/view?usp=sharing"
                      rel="noreferrer"
                      target="_blank"
                    >
                      here
                    </a>
                    .
                  </p>
                  <div className="col-12 col-lg-5 mb-3">
                    {renderDropzone(
                      visavaildations.allow_for_pp_back === "Yes",
                      "Back Passport Image",
                      visavaildations.allow_for_pp_back_required === "Yes",
                      //   toBackPassport,
                      CreateDropzone(
                        index,
                        "back_passport_img",
                        `backPassport${index}`
                      ),
                      `backPassport${index}`,
                      {},
                      traveler.back_passport_img_url
                    )}
                  </div>
                  {/* <div className="col-12 col-lg-7 mb-3">
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="photodays">
                                                    How Many Days Old Is The Image?{" "}
                                                    <span className="text-danger"></span>
                                                </label>
                                                <div className="position-relative">
                                                    <i className="fas fa-camera left-start-icon"></i>
                                                    <input
                                                        type="text"
                                                        id="photodays"
                                                        pattern="^[0-9]{2}$"
                                                        onChange={(e) => setPhotoNumber(e.target.value)}
                                                        className="form-control with-icon"
                                                        placeholder="0 Days"
                                                    />
                                                </div>
                                            </div>
                                        </div> */}

                  {/* Mother Name */}
                  <div className="col-12 col-lg-7 mb-3">
                    <div
                      className="mb-3"
                      style={{
                        display:
                          visavaildations.allow_for_mothername === "Yes"
                            ? "block"
                            : "none",
                      }}
                    >
                      <label className="form-label" htmlFor="motherName">
                        Mother Name
                        <span className="text-danger">
                          {visavaildations.allow_for_mothername_required ===
                          "Yes"
                            ? "*"
                            : ""}
                        </span>
                      </label>
                      <input
                        type="text"
                        id={"motherName_" + index}
                        value={traveler.motherName}
                        onChange={(e) =>
                          updateField(index, "motherName", e.target.value)
                        }
                        // required={
                        //   visavaildations.allow_for_mothername_required ===
                        //     "Yes" && traveler.show
                        // }
                        className="form-control"
                        placeholder="Enter Mother Name"
                      />
                    </div>

                    {/* Father Name */}

                    <div
                      className="mb-3"
                      style={{
                        display:
                          visavaildations.allow_for_fathername === "Yes"
                            ? "block"
                            : "none",
                      }}
                    >
                      <label className="form-label" htmlFor="fatherName">
                        Father Name
                        <span className="text-danger">
                          {visavaildations.allow_for_fathername_required ===
                          "Yes"
                            ? "*"
                            : ""}
                        </span>
                      </label>
                      <input
                        type="text"
                        id={"fatherName_" + index}
                        value={traveler.fatherName}
                        onChange={(e) =>
                          updateField(index, "fatherName", e.target.value)
                        }
                        // required={
                        //   visavaildations.allow_for_fathername_required ===
                        //     "Yes" && traveler.show
                        // }
                        className="form-control"
                        placeholder="Enter Father Name"
                      />
                    </div>

                    {/* Travel Date */}
                    <div
                      className="mb-3"
                      style={{
                        display:
                          visavaildations.allow_for_travel_date === "Yes"
                            ? "block"
                            : "none",
                      }}
                    >
                      <label className="form-label" htmlFor="travelDate">
                        Travel Date{" "}
                        <span className="text-danger">
                          {visavaildations.allow_for_travel_date_required ===
                          "Yes"
                            ? "*"
                            : ""}
                        </span>
                      </label>
                      <input
                        type="date"
                        id={`travelDate_${index}`}
                        value={traveler.travelDate}
                        onChange={(e) =>
                          updateField(index, "travelDate", e.target.value)
                        }
                        // required={
                        //   visavaildations.allow_for_travel_date_required ===
                        //     "Yes" && traveler.show
                        // }
                        className="form-control"
                        placeholder="Select Travel Date"
                      />
                    </div>

                    {/* Optional Entry Point */}
                    <div
                      className="mb-3"
                      style={{
                        display:
                          visavaildations.allow_for_checkinpoint === "Yes"
                            ? "block"
                            : "none",
                      }}
                    >
                      <label className="form-label" htmlFor="entryPoint">
                        Entry Point{" "}
                        <span className="text-danger">
                          {visavaildations.allow_for_checkinpoint_required ===
                          "Yes"
                            ? "*"
                            : ""}
                        </span>
                        {/* (Optional) */}
                      </label>
                      <input
                        type="text"
                        id={`entryPoint_${index}`}
                        value={traveler.entryPoint}
                        onChange={(e) =>
                          updateField(index, "entryPoint", e.target.value)
                        }
                        // required={
                        //   visavaildations.allow_for_checkinpoint_required ===
                        //     "Yes" && traveler.show
                        // }
                        className="form-control"
                        placeholder="Enter Entry Point"
                      />
                    </div>

                    {/* Optional Exit Point */}
                    <div
                      className="mb-3"
                      style={{
                        display:
                          visavaildations.allow_for_checkoutpoint === "Yes"
                            ? "block"
                            : "none",
                      }}
                    >
                      <label className="form-label" htmlFor="exitPoint">
                        Exit Point{" "}
                        <span className="text-danger">
                          {visavaildations.allow_for_checkoutpoint_required ===
                          "Yes"
                            ? "*"
                            : ""}
                        </span>
                        {/* (Optional) */}
                      </label>
                      <input
                        type="text"
                        id={`exitPoint_${index}`}
                        value={traveler.exitPoint}
                        onChange={(e) =>
                          updateField(index, "exitPoint", e.target.value)
                        }
                        // required={
                        //   visavaildations.allow_for_checkoutpoint_required ===
                        //     "Yes" && traveler.show
                        // }
                        className="form-control"
                        placeholder="Enter Exit Point"
                      />
                    </div>
                  </div>
                </div>
                <hr className="bg-sec-gray mb-24 mt-24" />
              </div>

              <div className="forms-st">
                <div className="row mb-3">
                  <p className="text-sm text-gray-700 mb-3">
                    Note: Visa applications with errors or typo errors may be
                    rejected. Applicants are responsible for ensuring accuracy
                    and completeness. Vivan Travels will not be held responsible
                    for rejections or delays due to applicant errors.
                  </p>
                  <div
                    className="col-12 col-lg-5 mb-3"
                    // style={{
                    //   display:
                    //     visavaildations.allow_for_pancard === "Yes"
                    //       ? "block"
                    //       : "none",
                    // }}
                  >
                    {renderDropzone(
                      visavaildations.allow_for_pancard === "Yes",
                      "Upload Traveler's PAN Card",
                      visavaildations.allow_for_pancard_required === "Yes",
                      CreateDropzone(
                        index,
                        "pen_card_photo",
                        `travelersPAN${index}`
                      ),
                      `travelersPAN${index}`,
                      {},
                      traveler.pen_card_photo_url
                    )}

                    {renderDropzone(
                      visavaildations.allow_for_hotal_voucher === "Yes",
                      "Hotel Voucher",
                      visavaildations.allow_for_hotal_voucher_required ===
                        "Yes",
                      CreateDropzone(index, "hotal", `hotal${index}`),
                      `hotal${index}`,
                      {},
                      traveler.hotal_url
                    )}
                    {renderDropzone(
                      visavaildations.allow_for_additional_folder === "Yes",
                      visavaildations.allow_for_additional_folder_label,
                      visavaildations.allow_for_additional_folder_required ===
                        "Yes",
                      CreateDropzone(
                        index,
                        "additional_folder",
                        `additional_folder${index}`
                      ),
                      `additional_folder${index}`,
                      {},
                      traveler.additional_folder_url
                    )}
                  </div>

                  <div className="col-12 col-lg-7 mb-3">
                    <div
                      className="mb-3"
                      style={{
                        display:
                          visavaildations.allow_for_pancard_no === "Yes"
                            ? "block"
                            : "none",
                      }}
                    >
                      <label className="form-label" htmlFor="panNumber">
                        India PAN Card Number{" "}
                        <span className="text-danger">
                          {visavaildations.allow_for_pancard_no_required ===
                          "Yes"
                            ? "*"
                            : ""}
                        </span>
                      </label>
                      <div className="position-relative">
                        <i className="fas fa-id-card left-start-icon"></i>{" "}
                        {/* PAN Card icon */}
                        <input
                          type="text"
                          id={`panNumber_${index}`}
                          value={traveler.panNumber}
                          pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                          onChange={(e) =>
                            updateField(index, "panNumber", e.target.value)
                          }
                          // required={
                          //   visavaildations.allow_for_pancard_no_required ===
                          //     "Yes" && traveler.show
                          // }
                          // required
                          className="form-control with-icon"
                          placeholder="ABCDE1234F" // Optional example placeholder
                        />
                      </div>
                    </div>
                    <div
                      className="mb-3"
                      style={{
                        display:
                          visavaildations.allow_for_hotal_name === "Yes"
                            ? "block"
                            : "none",
                      }}
                    >
                      <label className="form-label" htmlFor="panNumber">
                        Hotel Name
                        <span className="text-danger">
                          {visavaildations.allow_for_hotal_name_required ===
                          "Yes"
                            ? "*"
                            : ""}
                        </span>
                      </label>
                      <div className="position-relative">
                        <i className="fas fa-id-card left-start-icon"></i>{" "}
                        {/* PAN Card icon */}
                        <input
                          type="text"
                          id={`hotalName_${index}`}
                          value={traveler.hotal_name}
                          // pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                          onChange={(e) =>
                            updateField(index, "hotal_name", e.target.value)
                          }
                          // required={
                          //   visavaildations.allow_for_hotal_name_required ===
                          //     "Yes" && traveler.show
                          // }
                          // required
                          className="form-control with-icon"
                          placeholder="Enter Hotel Name" // Optional example placeholder
                        />
                      </div>
                    </div>
                  </div>
                  {/* <div className="mb-3">
                                            <label className="form-label" htmlFor="panNumber">India PAN Card Number <span className="text-danger">{visavaildations.allow_for_additional_folder_required === "Yes"?"*":""}</span></label>
                                            <input type="text" id="panNumber" pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$" onChange={(e) => setPenNumber(e.target.value)} required className="form-control" />
                                        </div> */}
                </div>
              </div>

              <section
                className="stack-y mt-64"
                style={{
                  display:
                    visavaildations.allow_for_occupation === "Yes"
                      ? "block"
                      : "none",
                }}
              >
                <header>
                  <h4 className="font-heading text-xl font-semibold mb-8">
                    Answer Additional Required Questions
                  </h4>
                </header>
                <input
                  type="hidden"
                  name="travelers.0.application.completedSteps.ADDITIONAL_QUESTIONS"
                  value="true"
                />
                <div>
                  <input
                    type="hidden"
                    name="travelers.0.application.bouncerRequirement.additionalQuestions.0.key"
                    value="occupation"
                  />
                  <div aria-required="false" class="flex flex-col gap-2">
                    <div class="stack-y group gap-2">
                      <p class="text-sm text-gray-700 px-2 mt-3 mb-2">
                        What is the traveler's occupation?
                        <span className="text-danger">
                          {visavaildations.allow_for_occupation_required ===
                          "Yes"
                            ? " *"
                            : ""}
                        </span>
                      </p>
                      <div class="position-relative select">
                        <i class="fas fa-briefcase left-start-icon"></i>
                        <select
                          id={`occupation_${index}`}
                          name="travelers.0.application.bouncerRequirement.additionalQuestions.0.answer"
                          class="form-select wizard-required w-100 with-icon"
                          // required={
                          //   visavaildations.allow_for_occupation_required ===
                          //     "Yes" && traveler.show
                          // }
                          value={traveler.Occupation}
                          onChange={(e) =>
                            updateField(index, "Occupation", e.target.value)
                          }
                        >
                          <option value="">Select an item</option>
                          <option value="architect">Architect</option>
                          <option value="associate officer">
                            Associate Officer
                          </option>
                          <option value="business">Business</option>
                          <option value="businesswoman">Businesswoman</option>
                          <option value="none">Child</option>
                          <option value="clinical scientist">
                            Clinical Scientist
                          </option>
                          <option value="director">Director</option>
                          <option value="engineer">Engineer</option>
                          <option value="executive">Executive</option>
                          <option value="flight attendant">
                            Flight Attendant
                          </option>
                          <option value="house wife">Housewife</option>
                          <option value="journalist">Journalist</option>
                          <option value="lawyer">Lawyer</option>
                          <option value="manager">Manager</option>
                          <option value="medical doctors">
                            Medical Doctors
                          </option>
                          <option value="photographer">Photographer</option>
                          <option value="physician">Physician</option>
                          <option value="pilot">Pilot</option>
                          <option value="retired">Retired</option>
                          <option value="sales representative">
                            Sales Representative
                          </option>
                          <option value="sales specialist">
                            Sales Specialist
                          </option>
                          <option value="secretary">Secretary</option>
                          <option value="senior manager">Senior Manager</option>
                          <option value="services">Services</option>
                          <option value="soldier">Soldier</option>
                          <option value="student / not allowed to work">
                            Student / Not Allowed to Work
                          </option>
                          <option value="teacher">Teacher</option>
                          <option value="university professor">
                            University Professor
                          </option>
                          <option value="vice president">Vice President</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* <br /> */}
              {/* <button type="submit" className="cus-btn">Submit</button> */}
            </div>
          ))}
          {formlist.filter((item) => item.show).length !== 10 &&
            formlist.filter(
              (item) => item.last_status === "Additional Document Required"
            ).length === 0 && (
              <div className="d-flex justify-content-end gap-3 my-4 mx-4">
                {/* <div className="stack-x"> */}
                {/* Add Another Traveler Button */}
                <div
                  // type="button"
                  className="cus-btn-outline"
                  onClick={addNewTraveler}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="user-plus"
                    className="svg-inline--fa fa-user-plus fa-fw"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                  >
                    <path
                      fill="currentColor"
                      d="M224 48a80 80 0 1 1 0 160 80 80 0 1 1 0-160zm0 208A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 96h91.4c65.7 0 120.1 48.7 129 112H49.3c8.9-63.3 63.3-112 129-112zm0-48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3zM504 312c0 13.3 10.7 24 24 24s24-10.7 24-24V248h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H552V136c0-13.3-10.7-24-24-24s-24 10.7-24 24v64H440c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64z"
                    ></path>
                  </svg>
                  Add Another Traveler
                </div>
              </div>
            )}
          <div className="col-11 m-auto">
            <div className="">
              <div className="col-md-11 m-auto rounded border border-secondary bg-white shadow-md px-3 py-2 mb-3">
                {/* Visa Information Section */}
                <section className="py-2">
                  <header>
                    <h3 className="fw-semibold fs-5">Visa Information</h3>
                  </header>

                  <div className="d-flex">
                    <ul className="list-unstyled flex-grow-1">
                      <li className="py-1">{visaDetail.about || "N/A"}</li>
                      <li>
                        Travel city: <span>{jsonObject.going_from}</span> -{" "}
                        <span>{jsonObject.going_to}</span>
                      </li>
                      {/* <li>
                        {}
                        Travel Dates: <span>{formattedDate}</span> -{" "}
                        <span>{formattedreturnDate}</span>
                      </li> */}
                    </ul>
                  </div>
                </section>

                {/* Expected Visa Approval Section */}
                <section className="py-2">
                  <header>
                    <h3 className="fw-semibold fs-5 mb-1">
                      Expected Visa Approval
                    </h3>
                  </header>
                  <p className="fw-semibold">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="calendar"
                      className="svg-inline--fa fa-calendar me-2"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      style={{ width: "1em", height: "1em" }}
                    >
                      <path
                        fill="currentColor"
                        d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"
                      />
                    </svg>
                    {visaDetail.processing_time || "N/A"} , if submitted now!
                  </p>
                </section>

                {/* Know Before You Pay Section */}
                <section className="py-2">
                  <header>
                    <h3 className="fw-semibold fs-5">Know Before You Pay</h3>
                  </header>
                  <ul className="list-unstyled mb-0">
                    <li className="d-flex align-items-start py-2">
                      <div className="me-2">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="far"
                          data-icon="circle"
                          className="svg-inline--fa fa-circle text-success"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          style={{ width: "1em", height: "1em" }}
                        >
                          <path
                            fill="currentColor"
                            d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="fw-semibold">
                          Auto-validation upon submission
                        </p>
                        <p className="small">
                          .. performs automated validation after submission. We
                          will let you know if there are any problems with the
                          application.
                        </p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start py-2">
                      <div className="me-2">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="far"
                          data-icon="circle"
                          className="svg-inline--fa fa-circle text-success"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          style={{ width: "1em", height: "1em" }}
                        >
                          <path
                            fill="currentColor"
                            d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="fw-semibold">
                          Visa processed within 30 seconds
                        </p>
                        <p className="small">
                          .. automatically processes your visa.
                        </p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start py-2">
                      <div className="me-2">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="far"
                          data-icon="circle"
                          className="svg-inline--fa fa-circle text-warning"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          style={{ width: "1em", height: "1em" }}
                        >
                          <path
                            fill="currentColor"
                            d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="fw-semibold">
                          Non-refundable after you pay
                        </p>
                        <p className="small">
                          If canceled after payment, you will not be refunded.
                        </p>
                      </div>
                    </li>
                  </ul>
                </section>
              </div>

              {jsonObject.going_to == "United Arab Emirates" &&
                formlist.filter(
                  (item) => item.last_status === "Additional Document Required"
                ).length === 0 && (
                  <>
                    <div className="mb-2">
                      <input
                        type="checkbox"
                        id="confirmBooking"
                        checked={Isinsurense}
                        onChange={(e) => {
                          handleCheckboxChange(e);
                        }}
                      />
                      <label htmlFor="confirmBooking" className="ms-2">
                        I want to buy insurance
                      </label>
                    </div>
                  </>
                )}

              {formlist.filter((item) => item.show).length > 0 &&
                formlist.filter(
                  (item) => item.last_status === "Additional Document Required"
                ).length === 0 && (
                  <div className="col-md-11 m-auto rounded border border-secondary bg-white shadow-md px-3 py-2 mb-3">
                    <div className="">
                      <header>
                        <h3 className="fw-semibold fs-5">Price Details</h3>
                      </header>
                      <div className="p-3 border-0">
                        <div className="fw-bold d-flex justify-content-between pt-2">
                          {jsonObject.going_to == "United Arab Emirates" &&
                            Isinsurense && (
                              <>
                                <div>Insurance Fees</div>
                                <div>
                                  {" "}
                                  {
                                    formlist.filter((item) => item.show).length
                                  }{" "}
                                  X {setting.insurance_prize} = ₹
                                  {setting.insurance_prize *
                                    formlist.filter((item) => item.show).length}
                                </div>
                              </>
                            )}
                        </div>

                        <div className="fw-bold d-flex justify-content-between pt-2">
                          <div>Visa fees Adult</div>
                          <div>
                            {
                              formlist.filter(
                                (item) =>
                                  item.show && item.Passenger_type != "Child"
                              ).length
                            }{" "}
                            X {/* {JSON.stringify()} */}
                            {/* {Number(visaDetail.amount) +
                            Number(
                              setting != null ? setting.visa_agency_charge : "0"
                            )}{" "} */}
                            {uData && uData.type === "2"
                              ? Number(
                                  visaDetail.visa_agent_charges?.price ??
                                    Number(visaDetail.amount ?? 0) +
                                      (uData?.agents
                                        ? Number(
                                            uData.agents.visa_booking_c ?? 0
                                          )
                                        : 0)
                                )
                              : Number(visaDetail.amount ?? 0) +
                                Number(
                                  setting != null
                                    ? setting.visa_agency_charge ?? 0
                                    : 0
                                )}
                            = ₹{" "}
                            {(uData && uData.type === "2"
                              ? Number(
                                  visaDetail.visa_agent_charges?.price ??
                                    Number(visaDetail.amount ?? 0) +
                                      (uData?.agents
                                        ? Number(
                                            uData.agents.visa_booking_c ?? 0
                                          )
                                        : 0)
                                )
                              : Number(visaDetail.amount ?? 0) +
                                Number(
                                  setting != null
                                    ? setting.visa_agency_charge ?? 0
                                    : 0
                                )) *
                              formlist.filter(
                                (item) =>
                                  item.show && item.Passenger_type != "Child"
                              ).length}
                          </div>
                        </div>

                        {jsonObject.going_to == "United Arab Emirates" &&
                          formlist.filter(
                            (item) =>
                              item.show && item.Passenger_type == "Child"
                          ).length > 0 && (
                            <>
                              <div className="fw-bold d-flex justify-content-between pt-2">
                                <div>Visa fees Child</div>
                                <div>
                                  {
                                    formlist.filter(
                                      (item) =>
                                        item.show &&
                                        item.Passenger_type == "Child"
                                    ).length
                                  }{" "}
                                  X{" "}
                                  {Number(visaDetail.child_amount) +
                                    Number(
                                      uData != null && uData.type === "2"
                                        ? uData.agents
                                          ? uData.agents.visa_booking_child_c ||
                                            "0"
                                          : "0"
                                        : setting != null
                                        ? setting.child_visa_prize
                                        : "0"
                                    )}
                                  {/* {Number(
                                  uData != null && uData.type === "2"
                                    ? uData.agents
                                      ? uData.agents.visa_booking_child_c || "0"
                                      : "0"
                                    : setting != null
                                    ? setting.child_visa_prize
                                    : "0"
                                )}{" "} */}
                                  = ₹{" "}
                                  {(Number(visaDetail.child_amount) +
                                    Number(
                                      uData != null && uData.type === "2"
                                        ? uData.agents
                                          ? uData.agents.visa_booking_child_c ||
                                            "0"
                                          : "0"
                                        : setting != null
                                        ? setting.child_visa_prize
                                        : "0"
                                    )) *
                                    formlist.filter(
                                      (item) =>
                                        item.show &&
                                        item.Passenger_type == "Child"
                                    ).length}
                                </div>
                              </div>
                            </>
                          )}

                        <div className="fw-bold d-flex justify-content-between pt-2">
                          {/* <div>Convince fees</div>
                        <div>
                          {formlist.filter((item) => item.show).length} X{" "}
                          {Number(
                            setting != null ? setting.visa_agency_charge : "0"
                          )}{" "}
                          = ₹{" "}
                          {Number(
                            setting != null ? setting.visa_agency_charge : "0"
                          ) * formlist.filter((item) => item.show).length}
                        </div> */}
                        </div>
                        <br />
                        <hr />
                        <div className="fw-bold d-flex justify-content-between pt-2">
                          <div>Total Amount</div>
                          <div>
                            ₹
                            {(jsonObject.going_to == "United Arab Emirates" &&
                            Isinsurense
                              ? Number(setting.insurance_prize) *
                                formlist.filter((item) => item.show).length
                              : 0) +
                              (uData && uData.type === "2"
                                ? Number(
                                    visaDetail.visa_agent_charges?.price ??
                                      Number(visaDetail.amount ?? 0) +
                                        (uData?.agents
                                          ? Number(
                                              uData.agents.visa_booking_c ?? 0
                                            )
                                          : 0)
                                  )
                                : Number(visaDetail.amount ?? 0) +
                                  Number(
                                    setting != null
                                      ? setting.visa_agency_charge ?? 0
                                      : 0
                                  )) *
                                formlist.filter(
                                  (item) =>
                                    item.show && item.Passenger_type != "Child"
                                ).length +
                              (uData && uData.type === "2"
                                ? Number(
                                    visaDetail.visa_agent_charges
                                      ?.child_price ??
                                      Number(visaDetail.child_amount ?? 0) +
                                        (uData?.agents
                                          ? Number(
                                              uData.agents.visa_booking_c ?? 0
                                            )
                                          : 0)
                                  )
                                : Number(visaDetail.child_amount ?? 0) +
                                  Number(
                                    setting != null
                                      ? setting.visa_agency_charge ?? 0
                                      : 0
                                  )) *
                                // (Number(visaDetail.child_amount) +
                                // Number(
                                //   uData != null && uData.type === "2"
                                //     ? uData.agents
                                //       ? uData.agents.visa_booking_child_c || "0"
                                //       : "0"
                                //     : setting != null
                                //       ? setting.child_visa_prize
                                //       : "0"
                                // )
                                formlist.filter(
                                  (item) =>
                                    item.show && item.Passenger_type == "Child"
                                ).length}
                          </div>
                        </div>
                      </div>

                      {/* <div className="pt-4 pb-1">
                                        <button
                                            type="button"
                                            className="cus-btn w-100">
                                            Continue
                                        </button>
                                    </div> */}

                      <div className="row pt-4 border-top">
                        <div className="col-sm-12 mb-3">
                          <div className="final_step">
                            <div className="radio-group-sit">
                              <h5 className="mb-2">Choose Payment Method</h5>
                              <div className="row justify-content-between align-items-center">
                                <div className="col-sm-8 mb-3">
                                  <div className="radio-container paybutton">
                                    <label
                                      className={
                                        paymentMethod === "razorpay"
                                          ? "active"
                                          : ""
                                      }
                                    >
                                      <input
                                        type="radio"
                                        name="payment"
                                        value="razorpay"
                                        checked={paymentMethod === "razorpay"}
                                        onChange={handlePaymentChangess}
                                      />
                                      <SiRazorpay />
                                      <p className="textrr">Online</p>
                                    </label>

                                    <label
                                      className={
                                        paymentMethod === "wallet"
                                          ? "active"
                                          : ""
                                      }
                                    >
                                      <input
                                        type="radio"
                                        name="payment"
                                        value="wallet"
                                        checked={paymentMethod === "wallet"}
                                        onChange={handlePaymentChangess}
                                      />
                                      <CiWallet />
                                      <p className="textrr">Wallet</p>
                                    </label>
                                  </div>
                                </div>
                                {!applied_visa_list.find(
                                  (item) =>
                                    item.status ===
                                    "Additional Document Required"
                                ) && (
                                  <div className="col-sm-4 mb-3 float-end">
                                    {Loading ? (
                                      <Progress />
                                    ) : (
                                      <div className="d-flex gap-2">
                                        <button
                                          type="submit"
                                          onClick={() =>
                                            (clickedButton.current = "draft")
                                          }
                                          className="form-wizard-next-btn cus-btn cus-btn-strng w-100"
                                        >
                                          Save Draft
                                        </button>
                                        <button
                                          type="submit"
                                          onClick={() =>
                                            (clickedButton.current = "apply")
                                          }
                                          className="form-wizard-next-btn cus-btn cus-btn-strng w-100"
                                        >
                                          Apply Now
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <PaymentStatusPopup
                                paymentId={payment_id_forcheck} // your txnid
                                onSuccess={() => {
                                  apply_visaafterpayment(finaldatafor_payment);
                                  setpayment_id_forcheck(null);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              {applied_visa_list.find(
                (item) => item.status === "Additional Document Required"
              ) &&
                (Loading ? (
                  <Progress />
                ) : (
                  <div className="col-sm-4 mb-3 float-end">
                    <button
                      type="submit"
                      onClick={() => (clickedButton.current = "resubmit")}
                      className="form-wizard-next-btn cus-btn cus-btn-strng w-100"
                    >
                      Resubmit
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TabComponent;

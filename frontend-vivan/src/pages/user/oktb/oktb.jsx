import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ReactPlayer from "react-player";
import TitleBanner from "../oktb/title-ban";
import { ToastContainer, toast } from "react-toastify";
import MenuIcons from "../menu-icons";
import { post, get } from "../../../API/apiHelper";
import {
  oktb_create,
  siteconfig,
  listAirlinePrices,
  wallet_add,
  maincountry_list,
  users_profile,
} from "../../../API/endpoints";
import "../visa/visa.css";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { CiWallet } from "react-icons/ci";
import { SiRazorpay } from "react-icons/si";
import Progress from "../../../component/Loading";
import Select from "react-select";
import countrylist from "../../../widget/country";
import { post as HelperPost } from "../../../API/apiHelper";
import logo from "../../../assets/images/logo.png";
import { format } from "date-fns";
import { razarpaypayment } from "../../../API/utils";
// import { hdfcPayment } from "../../API/utils";

import { Button } from "bootstrap";
import PaymentStatusPopup from "../../user/check_payment";

const doclist = [
  "Passport",
  "Passport Back",
  "Traveler Photo",
  "India PAN Card",
];

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

const VisaApplication = () => {
  
  const navigate = useNavigate();
  const userDataFromSession = sessionStorage.getItem("userData");
  if (!userDataFromSession) {
    navigate("/login");
  }
  const [activeTabOktb, setActiveTabOktb] = useState("individualOktb");
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [oktbPNR, setOktbPNR] = useState("");
  const [amount, setamount] = useState("");
  const [birthday, setBirthday] = useState("");
  const [airline, setAirline] = useState("");
  const [passport_font, setpassport_font_side] = useState("");
  const [passport_back, setpassport_back_side] = useState("");
  const [visa, setvisa] = useState("");
  const [from_ticket, setfrom_ticket] = useState("");
  const [to_ticket, setto_ticket] = useState("");
  const [group_zip, set_group] = useState("");
  const [files, setFiles] = useState({
    passportFront: [],
    visa: [],
    fromTicket: [],
    toTicket: [],
    groupZIP: [],
  });
  const [setting, setSettings] = useState(null);
  const [airlinelist, setAirlinelist] = useState([]);
  const [countrylist, setCountrylist] = useState([]);
  const [options, setOptions] = useState([]);
  const [airlinelistoptions, setAirlinelistoptions] = useState([]);
  const [paying_amount, setfinalamount] = useState(0);

  const [payment_id_forcheck, setpayment_id_forcheck] = useState(null);
  const [finaldatafor_payment, setfinaldatafor_payment] = useState(null);
  const [formlist, setFormlist] = useState([

    
    {
      firstName: "",
      oktbPNR: "",
      birthday: "",
      passport_font: "",
      passport_back: "",
      visa: "",
      from_ticket: "",
      to_ticket: "",
      show: true,
    },
    {
      firstName: "",
      oktbPNR: "",
      birthday: "",
      passport_font: "",
      passport_back: "",
      visa: "",
      from_ticket: "",
      to_ticket: "",
      show: false,
    },
    {
      firstName: "",
      oktbPNR: "",
      birthday: "",
      passport_font: "",
      passport_back: "",
      visa: "",
      from_ticket: "",
      to_ticket: "",
      show: false,
    },
    {
      firstName: "",
      oktbPNR: "",
      birthday: "",
      passport_font: "",
      passport_back: "",
      visa: "",
      from_ticket: "",
      to_ticket: "",
      show: false,
    },
    {
      firstName: "",
      oktbPNR: "",
      birthday: "",
      passport_font: "",
      passport_back: "",
      visa: "",
      from_ticket: "",
      to_ticket: "",
      show: false,
    },
    {
      firstName: "",
      oktbPNR: "",
      birthday: "",
      passport_font: "",
      passport_back: "",
      visa: "",
      from_ticket: "",
      to_ticket: "",
      show: false,
    },
    {
      firstName: "",
      oktbPNR: "",
      birthday: "",
      passport_font: "",
      passport_back: "",
      visa: "",
      from_ticket: "",
      to_ticket: "",
      show: false,
    },
    {
      firstName: "",
      oktbPNR: "",
      birthday: "",
      passport_font: "",
      passport_back: "",
      visa: "",
      from_ticket: "",
      to_ticket: "",
      show: false,
    },
    {
      firstName: "",
      oktbPNR: "",
      birthday: "",
      passport_font: "",
      passport_back: "",
      visa: "",
      from_ticket: "",
      to_ticket: "",
      show: false,
    },
    {
      firstName: "",
      oktbPNR: "",
      birthday: "",
      passport_font: "",
      passport_back: "",
      visa: "",
      from_ticket: "",
      to_ticket: "",
      show: false,
    },
  ]);
  const updateField = (index, key, value) => {
    const newFormList = [...formlist];

    newFormList[index] = {
      ...newFormList[index],
      [key]: value,
    };
    setFormlist(newFormList);
  };
  const removeitem = (index) => {
    const newFormList = [...formlist];

    newFormList[index] = {
      firstName: "",
      oktbPNR: "",
      birthday: "",
      passport_font: "",
      passport_back: "",
      visa: "",
      from_ticket: "",
      to_ticket: "",
      show: false,
    };
    setFormlist(newFormList);
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

  // const [uData, setUData] = useState(null);
  // const fetchUserData = async () => {
  //   try {
  //     const response = await get(users_profile, true);
  //     if (!response.ok) {
  //       const errorMsg = await response.text();
  //       throw new Error(`Error ${response.status}: ${errorMsg}`);
  //     }
  //     const data = await response.json();
  //     setUData(data.data)
  //   } catch (error) {
  //     console.error('Failed to fetch user data:', error);
  //   }
  // };
  // useEffect(() => {
  //   fetchUserData();
  // }, []);
  

  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession && userDataFromSession != null) {
      const userData = JSON.parse(userDataFromSession);
      setUserData(userData.model);
    }
    const fetchSettings = async () => {
      try {
        const res = await get(siteconfig, true);
        const response = await res.json();
        setSettings(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fatchcountry = async (country) => {
      try {
        const res = await post(
          maincountry_list,
          { type: "otb", limit: 50000 },
          true
        );
        const response = await res.json();
        setCountrylist(response.data);
        const options = response.data.map((option) => ({
          country_id: option.id,
          value: option.country_name,
          label: option.country_name,
          currency: option.currency,
        }));
        setOptions(options);
      } catch (error) {
        // console.log(error);
      }
    };
    fatchcountry();
    fetchSettings();
  }, []);

  function payement(selectedValue) {
    const selectedairline = airlinelistoptions.find(
      (item) => item.value == selectedValue
    );

    let a_amount = "0";
    // if (uData.type == 2) {
    //   a_amount = uData.agents ? uData.agents.otb_booking_c : ''
    // }
    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession && userDataFromSession != null) {
      const userData = JSON.parse(userDataFromSession);
      a_amount = userData.agents ? userData.agents.otb_booking_c : "";
      // setUserData(userData.model);
    }
    const otb_amount =
      Number(selectedairline.price) +
      Number(setting != null ? setting.otb_agency_charge : "0");
    const commission = Number(a_amount);
    const finalamount = Number(otb_amount) - Number(commission);
    setfinalamount(finalamount);
  }

  const [Isapply, setIsapply] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsapply(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const listval = formlist.filter(
      (item) =>
        item.show &&
        (item.passport_font === "" ||
          item.passport_back === "" ||
          item.visa === "" ||
          item.from_ticket === "" ||
          item.to_ticket === "")
    );
    if (listval.length !== 0) {
      listval.forEach((item) => {
        if (item.passport_font === "") {
          toast.error(`Upload front passport image for ${item.firstName}`);
        }
        if (item.passport_back === "") {
          toast.error(`Upload back passport image for ${item.firstName}`);
        }
        if (item.visa === "") {
          toast.error(`Upload visa image for ${item.firstName}`);
        }
        if (item.from_ticket === "") {
          toast.error(`Upload from ticket image for ${item.firstName}`);
        }
        if (item.to_ticket === "") {
          toast.error(`Upload to ticket for ${item.firstName}`);
        }
      });
      //
      return;
    }
    if (!Isapply) {
      return toast.error("Please confirm before submition");
    }

    var airline_value = airlinelist.find(
      (item) => item.airlineDetails.name == airline
    ).airline_id;
    const order_id_oktb = Math.floor(Date.now() / 1000);
    if (paymentMethod == "razorpay") {
      setpayment_id_forcheck(order_id_oktb);
      razarpaypayment(
        order_id_oktb,
        paying_amount * formlist.filter((item) => item.show).length,
        "OTB Applied",
        "",
        async (response) => {
          if (
            response.razorpay_payment_id &&
            response.razorpay_payment_id != null
          ) {
            // setfinaldatafor_payment();
            formlist
              .filter((item) => item.show)
              .forEach((traveler) => {
                const formData = {
                  user_id: userData.id,
                  country: country,
                  name: traveler.firstName,
                  pnr: traveler.oktbPNR,
                  dob: traveler.birthday,
                  airlines: airline_value,
                  amount: paying_amount,
                  otb_type: "individual",
                  passport_font_side: traveler.passport_font,
                  passport_back_side: traveler.passport_back,
                  visa: traveler.visa,
                  from_ticket: traveler.from_ticket,
                  to_ticket: traveler.to_ticket,
                };
                apply_otb_afterpayment(formData);
              });
          }
        }
      );
    } else {
      const userDataFromSessionup = sessionStorage.getItem("userData");
      if (userDataFromSessionup) {
        let userDataup = JSON.parse(userDataFromSessionup).model;
        if (userDataup.wallet >= paying_amount) {
          const formDatawallet = {
            user_id: userData.id,
            order_id: Math.floor(10000000 + Math.random() * 90000000),
            transaction_type: "Otb Apply",
            amount: paying_amount * formlist.filter((item) => item.show).length,
            payment_getway: "wallet",
            details: "Otb Apply",
            type: "2",
            status: "Success",
          };
          await HelperPost(wallet_add, formDatawallet, true);
          let userDataS = sessionStorage.getItem("userData");
          userDataS = userDataS ? JSON.parse(userDataS) : {};
          userDataS.model.wallet = userData.wallet - paying_amount;
          sessionStorage.setItem("userData", JSON.stringify(userDataS));
          setUserData((prevData) => ({
            ...prevData,
            wallet: userData.wallet - paying_amount,
          }));

          formlist
            .filter((item) => item.show)
            .forEach((traveler) => {
              const formData = {
                user_id: userData.id,
                country: country,
                name: traveler.firstName,
                pnr: traveler.oktbPNR,
                dob: traveler.birthday,
                airlines: airline_value,
                amount: paying_amount,
                otb_type: "individual",
                passport_font_side: traveler.passport_font,
                passport_back_side: traveler.passport_back,

                visa: traveler.visa,
                from_ticket: traveler.from_ticket,
                to_ticket: traveler.to_ticket,
              };
              apply_otb_afterpayment(formData);
            });
        }
      } else {
        toast.error("Your Wallet Balance is low");
      }
    }
  };

  async function apply_otb_afterpayment(formData) {
    try {
      const response = await post(oktb_create, formData, true);
      const data = await response.json();
      if (data.status == false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        setTimeout(() => {
          navigate("/otb-status");
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handlegroupSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      user_id: userData.id,
      country: country,
      name: null,
      pnr: null,
      dob: null,
      airlines: null,
      amount: null,
      otb_type: "group",
      group_zip: group_zip,
    };

    try {
      const response = await post(oktb_create, formData, true);
      const data = await response.json();
      if (data.status == false) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        setTimeout(() => {
          navigate("/otb-status");
          window.location.reload();
        }, 2500);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
      accept: {
        "image/jpeg": [],
        "image/png": [],
        "image/jpg": [],
        "application/pdf": [],
      },
      maxSize: 1024 * 1024 * 5, // 5MB
      maxFiles: 3,
      onDrop: (acceptedFiles) => {
        updateField(index, key, acceptedFiles[0]);
        onDrop(acceptedFiles, key2);
      },
    });
  };

  const [Progressing, setLoding] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const handlePaymentChangess = (e) => {
    setPaymentMethod(e.target.value);
  };

  // const renderDropzone = (label, dropzoneProps, fieldKey, options = {}) => {
  //   const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
  //     dropzoneProps;
  //   const hasUploadedFiles = acceptedFiles && acceptedFiles.length > 0;

  //   return (
  //     <div className="dz-clickable mb-3" key={fieldKey}>
  //       <label className="form-label" htmlFor={fieldKey}>
  //         {label} <span className="text-danger">*</span>
  //       </label>
  //       <div
  //         {...getRootProps()}
  //         style={{
  //           border: "2px dashed rgba(0, 123, 255, 0.3)",
  //           borderRadius: "12px",
  //           padding: "30px",
  //           background: "linear-gradient(135deg, #f8f9fa, #e9f5ff)",
  //           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  //           transition: "all 0.3s ease-in-out",
  //           cursor: "pointer",
  //           position: "relative",
  //           textAlign: "center",
  //           display: "flex",
  //           flexDirection: "column",
  //           alignItems: "center",
  //         }}
  //         className={`dropzone ${isDragActive ? "active" : ""}`}
  //       >
  //         <input {...getInputProps({ ...options })} />

  //         {!hasUploadedFiles && (
  //           <>
  //             {/* Modern Upload Icon */}
  //             <i
  //               className="fas fa-cloud-upload-alt"
  //               style={{
  //                 fontSize: "48px",
  //                 color: isDragActive ? "#007bff" : "#6c757d",
  //                 marginBottom: "15px",
  //                 transition: "color 0.3s ease-in-out",
  //               }}
  //             ></i>

  //             {/* Main Instruction Text */}
  //             <p
  //               style={{
  //                 color: "#333",
  //                 fontSize: "18px",
  //                 fontWeight: "600",
  //                 marginBottom: "5px",
  //               }}
  //             >
  //               Drag & Drop files here
  //             </p>

  //             {/* Sub Text */}
  //             <p
  //               style={{
  //                 color: "#6c757d",
  //                 fontSize: "14px",
  //                 fontWeight: "400",
  //                 marginBottom: "0",
  //               }}
  //             >
  //               or click to browse from your device
  //             </p>
  //           </>
  //         )}

  //         {/* Displaying File List */}
  //         <ul
  //           style={{
  //             padding: "0",
  //             margin: "0",
  //             listStyleType: "none",
  //             width: "100%",
  //             textAlign: "left",
  //           }}
  //         >
  //           {renderFileList(fieldKey)}
  //         </ul>

  //         {/* Active State Message */}
  //         {isDragActive && (
  //           <div
  //             style={{
  //               position: "absolute",
  //               top: "50%",
  //               left: "50%",
  //               transform: "translate(-50%, -50%)",
  //               fontWeight: "bold",
  //               color: "#007bff",
  //               backgroundColor: "rgba(255, 255, 255, 0.8)",
  //               padding: "10px 15px",
  //               borderRadius: "8px",
  //               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  //             }}
  //           >
  //             Release to upload files
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  const renderFileList = (key) => {
    return files[key]?.map((file) => (
      <li key={file.name} style={{ position: "relative", listStyle: "none" }}>
        <img style={ImagePreview} src={file.preview} alt={file.name} />
        <span style={FileName}>{file.name}</span>
      </li>
    ));
  };

  const fatchairlines = async (country) => {
    try {
      setAirline("");
      setAirlinelistoptions([]);
      const res = await post(listAirlinePrices, { country_id: country }, true);
      const response = await res.json();
      setAirlinelist(response.data);
      const airlinelistoptions = response.data.map((option) => ({
        value: option.airlineDetails.name,
        label: option.airlineDetails.name,
        price: option.price,
      }));

      setAirlinelistoptions(airlinelistoptions);
    } catch (error) {
      // console.log(error);
    }
  };

  const renderDropzone = (
    label,
    dropzoneProps,
    fieldKey,
    isFieldRequired = true,
    fieldError = false
  ) => {
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
      dropzoneProps;
    const hasUploadedFiles = acceptedFiles && acceptedFiles.length > 0;

    

    return (
      <div className="dz-clickable mb-3" key={fieldKey}>
        <label className="form-label" htmlFor={fieldKey}>
          {label} {isFieldRequired && <span className="text-danger">*</span>}
        </label>
        <div
          {...getRootProps()}
          style={{
            border: fieldError
              ? "2px solid red"
              : "2px dashed rgba(0, 123, 255, 0.3)",
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
          <input {...getInputProps()} />

          {!hasUploadedFiles && (
            <>
              <i
                className="fas fa-cloud-upload-alt"
                style={{
                  fontSize: "48px",
                  color: isDragActive ? "#007bff" : "#6c757d",
                  marginBottom: "15px",
                  transition: "color 0.3s ease-in-out",
                }}
              ></i>

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

          <ul
            style={{
              padding: "0",
              margin: "0",
              listStyleType: "none",
              width: "100%",
              textAlign: "left",
            }}
          >
            {renderFileList(fieldKey)}
          </ul>

          {fieldError && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>
              {label} is required.
            </p>
          )}

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



  return (
    <>
      <TitleBanner />
      <section
        className="pt-3 pb-5"
        style={{ minHeight: "calc(100vh - 436px)" }}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="container">
          <div className="row">
            {/* <ProfileSidebarWidget /> */}
            <div className="col-xl-11 col-lg-11 m-auto">
              <MenuIcons />
              <div className="vstack gap-4">
                <div className="border card">
                  <div className="border-bottom card-header">
                    <h3 className="card-header-title">OTB</h3>
                  </div>
                  <div className="card-body p-0">
                    <div className="position-relative max-w-screen-lg rounded-br-5">
                      {/* <VisafFor /> */}
                      <div className="containe flex flex-col max-w-screen-xl gap-8">
                        {/* <hr className="bg-sec-gray mb-24 mt-24" /> */}
                        <div className="">
                          <form onSubmit={handleSubmit}>
                            {formlist.map((traveler, index) => (
                              <div
                                className="apllying-ser p-4"
                                style={{
                                  display: traveler.show ? "block" : "none",
                                }}
                              >
                                {index !== 0 && (
                                  <button
                                    className="close-buttonsit"
                                    onClick={() => removeitem(index)}
                                  >
                                    X
                                  </button>
                                )}
                                <div className="forms-st fpp">
                                  <div className="row mb-3">
                                    <div className="col-12 mb-3">
                                      <label
                                        className="form-label"
                                        htmlFor="firstNameOktb"
                                      >
                                        Full Name{" "}
                                        <span className="text-danger">*</span>
                                      </label>
                                      <div className="position-relative">
                                        <i className="fas fa-user left-start-icon"></i>
                                        <input
                                          type="text"
                                          id="firstNameOktb"
                                          value={traveler.firstName}
                                          onChange={(e) =>
                                            updateField(
                                              index,
                                              "firstName",
                                              e.target.value
                                            )
                                          }
                                          required={traveler.show}
                                          className="form-control with-icon"
                                          placeholder="Enter your full name"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-12 col-sm-6 mb-3">
                                      <label
                                        className="form-label"
                                        htmlFor="pnrOktb"
                                      >
                                        PNR{" "}
                                        <span className="text-danger">*</span>
                                      </label>
                                      <div className="position-relative">
                                        <i className="fas fa-ticket-alt left-start-icon"></i>
                                        <input
                                          type="text"
                                          id="pnrOktb"
                                          value={traveler.oktbPNR}
                                          onChange={(e) =>
                                            updateField(
                                              index,
                                              "oktbPNR",
                                              e.target.value
                                            )
                                          }
                                          required={traveler.show}
                                          className="form-control with-icon"
                                          placeholder="Enter your PNR"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                      <label className="form-label">
                                        Date of Birth
                                        <span className="text-danger">*</span>
                                      </label>
                                      <div className="mb-24 position-relative">
                                        <FaRegCalendarAlt className="left-start-icon" />
                                        <DatePicker
                                          selected={traveler.birthday}
                                          onChange={(e) =>
                                            updateField(
                                              index,
                                              "birthday",
                                              format(new Date(e), "MM/dd/yyyy")
                                            )
                                          }
                                          onFocus={(e) => e.target.blur()}
                                          autoComplete="off"
                                          placeholderText="DD/MM/YYYY"
                                          dateFormat="dd-MMM-yyyy"
                                          className="form-control with-icon sel-input date_from"
                                          style={{
                                            width: "100%",
                                            padding: "10px",
                                            cursor: "pointer",
                                          }}
                                          maxDate={new Date()}
                                          required={traveler.show}
                                          showMonthDropdown={true} // Disable month dropdown
                                          showYearDropdown={true} // Disable year dropdown
                                        />
                                      </div>
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                      {renderDropzone(
                                        "Upload Passport Front Page",
                                        CreateDropzone(
                                          index,
                                          "passport_font",
                                          `passportFront${index}`
                                        ),
                                        `passportFront${index}`
                                      )}
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                      {renderDropzone(
                                        "Upload Passport Back Page",
                                        CreateDropzone(
                                          index,
                                          "passport_back",
                                          `passportBack${index}`
                                        ),
                                        `passportBack${index}`
                                      )}
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                      {renderDropzone(
                                        "Upload Visa",
                                        // visaDropzone,
                                        CreateDropzone(
                                          index,
                                          "visa",
                                          `visa${index}`
                                        ),
                                        `visa${index}`
                                      )}
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                      {renderDropzone(
                                        "Upload From Ticket",
                                        // fromTicketDropzone,
                                        CreateDropzone(
                                          index,
                                          "from_ticket",
                                          `fromTicket${index}`
                                        ),
                                        `fromTicket${index}`
                                      )}
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                      {renderDropzone(
                                        "Upload To Ticket",
                                        // toTicketDropzone,
                                        CreateDropzone(
                                          index,
                                          "to_ticket",
                                          `toTicket${index}`
                                        ),
                                        `toTicket${index}`
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {formlist.filter((item) => item.show).length !==
                              10 && (
                              <div className="d-flex justify-content-end gap-3 my-4 mx-4">
                                <button
                                  type="button"
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
                                </button>
                              </div>
                            )}
                            <div className="apllying-ser p-4">
                              <div className="col-12 mb-3 sitdrpdwn">
                                <label
                                  className="form-label"
                                  htmlFor="nationality"
                                >
                                  Going To{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="position-relative">
                                  <i className="fas fa-globe left-start-icon"></i>
                                  <Select
                                    options={options}
                                    name="nationality"
                                    id="nationality"
                                    value={options.find(
                                      (option) => option.value === country
                                    )}
                                    className="form-control with-icon"
                                    classNamePrefix="react-select"
                                    placeholder="Going To"
                                    isSearchable
                                    required
                                    onChange={(e) => {
                                      setCountry(e.value);
                                      fatchairlines(
                                        options.find(
                                          (option) => option.value === e.value
                                        ).country_id
                                      );
                                    }}
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        paddingLeft: "1.6rem",
                                      }),
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-12 mb-3 sitdrpdwn">
                                <label
                                  className="form-label"
                                  id="seleairl"
                                  htmlFor="ari69"
                                >
                                  Select Airlines{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="position-relative">
                                  <i className="fas fa-plane-departure left-start-icon"></i>
                                  <div className="gender-select">
                                    <Select
                                      options={airlinelistoptions}
                                      name="airline"
                                      id="airline"
                                      value={
                                        airline !== ""
                                          ? airlinelistoptions.find(
                                              (option) =>
                                                option.value === airline
                                            )
                                          : ""
                                      }
                                      className="form-control with-icon"
                                      classNamePrefix="react-select"
                                      placeholder="Airline"
                                      isSearchable
                                      required
                                      onChange={(e) => {
                                        const selectedValue = e.value;
                                        setAirline(selectedValue); // Update the airline state
                                        payement(selectedValue); // Call your function
                                      }}
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          paddingLeft: "1.6rem",
                                        }),
                                      }}
                                    />
                                    {/* </div> */}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label
                                  className="form-label"
                                  id="seleairl"
                                  htmlFor="ari69"
                                >
                                  Total Amount{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="position-relative">
                                  <i className="fas fa-rupee-sign left-start-icon"></i>
                                  <div className="gender-select">
                                    <input
                                      type="text"
                                      value={
                                        paying_amount *
                                        formlist.filter((item) => item.show)
                                          .length
                                      }
                                      className="form-control with-icon"
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div>
                              <br />
                              <div className="mb-2">
                                <input
                                  type="checkbox"
                                  id="Applyconfirm"
                                  checked={Isapply}
                                  onChange={(e) => {
                                    handleCheckboxChange(e);
                                  }}
                                />
                                <label htmlFor="Applyconfirm" className="ms-2">
                                  Confirm and submit
                                </label>
                              </div>
                              <div className="row pt-4 border-top">
                                <div className="col-sm-12 mb-3">
                                  <div className="final_step">
                                    <div className="radio-group-sit">
                                      <h5 className="mb-2">
                                        Choose Payment Method
                                      </h5>
                                      <div className="row justify-content-between align-items-center">
                                        <div className="col-sm-9 mb-3">
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
                                                checked={
                                                  paymentMethod === "razorpay"
                                                }
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
                                                checked={
                                                  paymentMethod === "wallet"
                                                }
                                                onChange={handlePaymentChangess}
                                              />
                                              <CiWallet />
                                              <p className="textrr">Wallet</p>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="col-sm-3 mb-3">
                                          {Progressing ? (
                                            <Progress />
                                          ) : (
                                            <div className="col-12 float-end">
                                              <button
                                                type="submit"
                                                className="form-wizard-next-btn cus-btn cus-btn-strng w-100"
                                              >
                                                Apply Now
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                          <PaymentStatusPopup
                            paymentId={payment_id_forcheck}
                            onSuccess={() => {
                              var airline_value = airlinelist.find(
                                (item) => item.airlineDetails.name == airline
                              ).airline_id;
                              formlist
                                .filter((item) => item.show)
                                .forEach((traveler) => {
                                  const formData = {
                                    user_id: userData.id,
                                    country: country,
                                    name: traveler.firstName,
                                    pnr: traveler.oktbPNR,
                                    dob: traveler.birthday,
                                    airlines: airline_value,
                                    amount: paying_amount,
                                    otb_type: "individual",
                                    passport_font_side: traveler.passport_font,
                                    passport_back_side: traveler.passport_back,
                                    visa: traveler.visa,
                                    from_ticket: traveler.from_ticket,
                                    to_ticket: traveler.to_ticket,
                                  };
                                  apply_otb_afterpayment(formData);
                                });
                              setpayment_id_forcheck(null);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VisaApplication;

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactPlayer from "react-player";
import TitleBanner from '../oktb/title-ban'
import { ToastContainer, toast } from "react-toastify";
import MenuIcons from '../menu-icons';
import { post } from "../../../API/apiHelper";
import { oktb_create } from "../../../API/endpoints";
import '../visa/visa.css';
import { useNavigate } from 'react-router-dom';

const doclist = ['Passport', 'Passport Back', 'Traveler Photo', 'India PAN Card'];

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
    maxHeight: "260px",
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
    const [activeTabOktb, setActiveTabOktb] = useState("individualOktb");
    const [country, setCountry] = useState('');
    const [firstName, setFirstName] = useState('');
    const [oktbPNR, setOktbPNR] = useState('');
    const [amount, setamount] = useState('');
    const [birthday, setBirthday] = useState('');
    const [airline, setAirline] = useState('');
    const [passport_font, setpassport_font_side] = useState('');
    const [visa, setvisa] = useState('');
    const [from_ticket, setfrom_ticket] = useState('');
    const [to_ticket, setto_ticket] = useState('');
    const [group_zip, set_group] = useState('');
    const [files, setFiles] = useState({
        passportFront: [],
        visa: [],
        fromTicket: [],
        toTicket: [],
        groupZIP: []
    });

    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const userDataFromSession = sessionStorage.getItem('userData');
        if (userDataFromSession && userDataFromSession != null) {
            const userData = JSON.parse(userDataFromSession);
            setUserData(userData.model);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            'user_id': userData.id,
            'country': country,
            'name': firstName,
            'pnr': oktbPNR,
            'dob': birthday,
            'airlines': airline,
            'amount': amount,
            'otb_type': 'individual',
            'passport_font_side': passport_font,
            'visa': visa,
            'from_ticket': from_ticket,
            'to_ticket': to_ticket,
        }

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
            console.error('Error:', error);
        }
    };

    const handlegroupSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            'user_id': userData.id,
            'country': country,
            'name': null,
            'pnr': null,
            'dob': null,
            'airlines': null,
            'amount': null,
            'otb_type': 'group',
            'group_zip': group_zip
        }

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
            console.error('Error:', error);
        }
    };

    const onDrop = useCallback((acceptedFiles, key) => {
        setFiles((prevState) => ({
            ...prevState,
            [key]: acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            )
        }));
    }, []);




    const passportFrontDropzone = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
            'application/pdf': [],
        },
        maxSize: 1024 * 1024 * 5, // 5MB
        maxFiles: 3,
        onDrop: (acceptedFiles) => {
            setpassport_font_side(acceptedFiles[0]);
            onDrop(acceptedFiles, 'passportFront');
        }
    });

    const visaDropzone = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
            'application/pdf': [],
        },
        maxSize: 1024 * 1024 * 5, // 5MB
        maxFiles: 3,
        onDrop: (acceptedFiles) => {
            setvisa(acceptedFiles[0]);
            onDrop(acceptedFiles, 'visa');
        }
    });

    const fromTicketDropzone = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
            'application/pdf': [],
        },
        maxSize: 1024 * 1024 * 5, // 5MB
        maxFiles: 3,
        onDrop: (acceptedFiles) => {
            setfrom_ticket(acceptedFiles[0]);
            onDrop(acceptedFiles, 'fromTicket');
        }
    });

    const toTicketDropzone = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
            'application/pdf': [],
        },
        maxSize: 1024 * 1024 * 5, // 5MB
        maxFiles: 3,
        onDrop: (acceptedFiles) => {
            setto_ticket(acceptedFiles[0]);
            onDrop(acceptedFiles, 'toTicket');
        }
    });

    const toGroupZipDropzone = useDropzone({
        accept: "image/*",
        maxFiles: 3,
        onDrop: (acceptedFiles) => {
            set_group(acceptedFiles[0]);
            onDrop(acceptedFiles, 'groupZIP');
        }
    });

    const renderDocuList = (key) => {
      return files[key]?.map((file) => (
        <li key={file.name} style={{ position: "relative", listStyle: "none" }}>
          <img style={ImagePreview} src={file.preview} alt={file.name} />
          <span style={FileName}>{file.name}</span>
        </li>
      ));
    };
    const renderDropzone = (label, dropzoneProps, fieldKey, options = {}) => {
        const { getRootProps, getInputProps, isDragActive } = dropzoneProps;

        return (
            <div className="dz-clickable mb-3" key={fieldKey}>
                <label className="form-label" htmlFor={fieldKey}>
                    {label} <span className="text-danger">*</span>
                </label>
                <div
                    {...getRootProps()}
                    style={{
                        border: '2px dashed rgba(0, 123, 255, 0.3)',
                        borderRadius: '12px',
                        padding: '30px',
                        background: 'linear-gradient(135deg, #f8f9fa, #e9f5ff)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease-in-out',
                        cursor: 'pointer',
                        position: 'relative',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    className={`dropzone ${isDragActive ? 'active' : ''}`}
                >
                    <input {...getInputProps({ ...options })} />

                    {/* Modern Upload Icon */}
                    <i
                        className="fas fa-cloud-upload-alt"
                        style={{
                            fontSize: '48px',
                            color: isDragActive ? '#007bff' : '#6c757d',
                            marginBottom: '15px',
                            transition: 'color 0.3s ease-in-out',
                        }}
                    ></i>

                    {/* Main Instruction Text */}
                    <p style={{
                        color: '#333',
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '5px',
                    }}>
                        Drag & Drop files here
                    </p>

                    {/* Sub Text */}
                    <p style={{
                        color: '#6c757d',
                        fontSize: '14px',
                        fontWeight: '400',
                        marginBottom: '0',
                    }}>
                        or click to browse from your device
                    </p>

                    {/* Displaying File List */}
                    <ul style={{
                        padding: '0',
                        marginTop: '15px',
                        listStyleType: 'none',
                        width: '100%',
                        textAlign: 'left',
                    }}>
                        {renderDocuList(fieldKey)}
                    </ul>

                    {/* Active State Message */}
                    {isDragActive && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontWeight: 'bold',
                            color: '#007bff',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            padding: '10px 15px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}>
                            Release to upload files
                        </div>
                    )}
                </div>
            </div>

        );
    };

    const renderFileList = (key) => {
        return files[key]?.map((file) => (
            <li key={file.name} style={{ position: 'relative', listStyle: 'none' }}>
                <img style={ImagePreview} src={file.preview} alt={file.name} />
                <span style={FileName}>{file.name}</span>
            </li >
        ));
    };

    const [stepOktb, setStepOktb] = useState(1);
    const totalStepsOktb = 4; // Set the total number of steps

    // Function to handle "Continue" button click
    const handleContinueOktb = () => {
        if (stepOktb < totalStepsOktb) {
            setStepOktb(prevStep => prevStep + 1); // Go to next step
        }
    };

    const handleSkipOktb = () => {
        setStepOktb(totalStepsOktb); // Skip to the last step
    };

    const [playing, setPlaying] = useState(false);
    const videoUrl = "https://youtu.be/7GlavNgmU-k?si=i42r5VbJVm05N7yf";

    const handlePlayPause = () => {
        setPlaying((prevPlaying) => !prevPlaying);
    };

    // Function to render the content for the current step
    const RenderStepContentOktb = (stepOktb) => {
        switch (stepOktb) {
            case 1:
                return (
                    <div className="d-flex flex-column align-items-center gap-4">
                        {/* Header Section */}
                        <header>
                            <h1 className="font-heading text-center fw-semibold fs-3 md:fs-4">
                                Great! Let's Get Started
                            </h1>
                        </header>

                        {/* Step Description Section */}
                        <div className="d-flex flex-column align-items-center">
                            <div className="font-heading text-uppercase fw-bold text-center">
                                Step 1
                            </div>
                            <div className="text-lg text-center">
                                Gather all the following documents for each user. You can upload documents for up to 500 users at one time!
                            </div>
                        </div>

                        {/* Documents List */}
                        <ul className="list-unstyled d-flex flex-column flex-md-row justify-content-around text-sm fw-bold w-100 border-top">
                            {doclist.map((document, index) => (
                                <li key={index} className={`d-flex align-items-center gap-0 py-3 ${index !== doclist.length - 1 ? 'border-bottom' : ''}`}>
                                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" className="svg-inline--fa fa-circle me-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: '1em', height: '1em' }} >
                                        <path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                                    </svg>
                                    <span>{document}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 2:
                return (
                    <div className="d-flex flex-column align-items-center gap-4">
                        {/* Header Section */}
                        <header>
                            <h1 className="font-heading text-center fw-semibold fs-3 md:fs-4">
                                Now, Create a Folder
                            </h1>
                        </header>

                        {/* Step Description Section */}
                        <div className="d-flex flex-column align-items-center">
                            <div className="font-heading text-uppercase fw-bold text-center">
                                Step 2
                            </div>
                            <div className="text-lg text-center">
                                Gather all your travelers' documents and put them all into one folder.
                            </div>
                        </div>
                        <div className="rounded-lg overflow-hidden w-100 v-heigh">
                            <div className="position-relative h-100">
                                <ReactPlayer url={videoUrl} playing={playing} width="100%" height="100%" controls={false} />
                                <div className="d-flex position-absolute start-0 top-0 w-100 h-100 cursor-pointer">
                                    <div className="m-auto">
                                        <button className="btn btn-dark rounded-circle d-flex justify-content-center align-items-center" style={{ width: "50px", height: "50px" }} onClick={handlePlayPause}>
                                            {playing ? (
                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pause" className="svg-inline--fa fa-pause text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style={{ width: "24px", height: "24px" }} >
                                                    <path fill="currentColor" d="M64 0h64c8.8 0 16 7.2 16 16v480c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V16c0-8.8 7.2-16 16-16zm192 0h64c8.8 0 16 7.2 16 16v480c0 8.8-7.2 16-16 16h-64c-8.8 0-16-7.2-16-16V16c0-8.8 7.2-16 16-16z" />
                                                </svg>
                                            ) : (
                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" className="svg-inline--fa fa-play text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{ width: "24px", height: "24px" }} >
                                                    <path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                );
            case 3:
                return (
                    <div className="d-flex flex-column align-items-center gap-4">
                        {/* Header Section */}
                        <header>
                            <h1 className="font-heading text-center fw-semibold fs-3 md:fs-4">
                                Convert Folder to Zip File
                            </h1>
                        </header>

                        {/* Step Description Section */}
                        <div className="d-flex flex-column align-items-center">
                            <div className="font-heading text-uppercase fw-bold text-center">
                                Step 3
                            </div>
                            <div className="text-lg text-center">
                                Right click on the file to access the drop down. Choose the compress option to create a zip file.
                            </div>
                        </div>
                        {/* for local videos */}
                        {/* <video className="w-100 h-100" controls>
                                    <source src="/agencies/bulk-upload-tutorial.mp4" type="video/mp4" />
                                </video> */}

                        <div className="rounded-lg overflow-hidden w-100 v-heigh">
                            <div className="position-relative h-100">
                                <ReactPlayer url={videoUrl} playing={playing} width="100%" height="100%" controls={false} />
                                {/* // Hide default controls */}
                                <div className="d-flex position-absolute start-0 top-0 w-100 h-100 cursor-pointer">
                                    <div className="m-auto">
                                        <button className="btn btn-dark rounded-circle d-flex justify-content-center align-items-center" style={{ width: "50px", height: "50px" }} onClick={handlePlayPause}>
                                            {playing ? (
                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pause" className="svg-inline--fa fa-pause text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style={{ width: "24px", height: "24px" }} >
                                                    <path fill="currentColor" d="M64 0h64c8.8 0 16 7.2 16 16v480c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V16c0-8.8 7.2-16 16-16zm192 0h64c8.8 0 16 7.2 16 16v480c0 8.8-7.2 16-16 16h-64c-8.8 0-16-7.2-16-16V16c0-8.8 7.2-16 16-16z" />
                                                </svg>
                                            ) : (
                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" className="svg-inline--fa fa-play text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{ width: "24px", height: "24px" }} >
                                                    <path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                );
            // default:
            case 4:
                return (
                    <div className="d-flex flex-column align-items-center gap-4">
                        {/* Header Section */}
                        <header>
                            <h1 className="font-heading text-center fw-semibold fs-3 md:fs-4">
                                Upload Zip File Here
                            </h1>
                        </header>

                        {/* Step Description Section */}
                        <div className="d-flex flex-column align-items-center">
                            <div className="font-heading text-uppercase fw-bold text-center">
                                Step 4
                            </div>
                            <div className="text-lg text-center">
                                Vivan Travels scans and creates each travellers' application. We will email you as soon as all applications are created. After our email, please review and submit all applications.
                            </div>
                        </div>

                        <form onSubmit={handlegroupSubmit}>

                            {renderDropzone("Upload ZIP", toGroupZipDropzone, 'roupZIP', { accept: ".zip" }g)}

                            <div className="d-flex justify-content-end gap-3 my-4 mx-4">
                                <button type="submit" className="cus-btn">
                                    Upload
                                </button>
                            </div>

                        </form>

                    </div>
                );
            default:
        }
    };

    // Function to render the pagination dots with click event
    const renderPaginationDotsOktb = () => {
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                {Array.from({ length: totalStepsOktb }, (_, indexOktb) => (
                    <div
                        key={indexOktb}
                        onClick={() => setStepOktb(indexOktb + 1)}  // Set the step based on the dot clicked
                        style={{
                            height: "10px",
                            width: "10px",
                            borderRadius: "50%",
                            backgroundColor: stepOktb === indexOktb + 1 ? "#000" : "#ccc",
                            margin: "0 5px",
                            cursor: "pointer",  // Change cursor to pointer to indicate clickable dots
                        }}
                    ></div>
                ))}
            </div>
        );
    };







    return (
        <>
            <TitleBanner />
            <section className="pt-3 pb-5" style={{ minHeight: 'calc(100vh - 436px)' }}>
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
                                                <div className="apllying-ser col-12 p-4">
                                                    <header>
                                                        <h3 className="font-heading text-xl font-semibold mb-30">
                                                            Are You Applying For
                                                        </h3>
                                                    </header>
                                                    <div className="gap-4 d-flex justify-center align-items-end">
                                                        <div className="flex-1 stack-y col-12">
                                                            <ul className="nav nav-tabs border-0 mb-24 w-100">
                                                                <li className="nav-item col-12 col-sm-6">
                                                                    <button className={`cus-btn primary-light primary ${activeTabOktb === "individualOktb" ? "active" : ""}`} onClick={() => setActiveTabOktb("individualOktb")} aria-checked={activeTabOktb === "individual"} aria-disabled={activeTabOktb !== "individualOktb"}>Individual OTB</button>
                                                                </li>
                                                                <li className="nav-item col-12 col-sm-6">
                                                                    <button className={`cus-btn primary-light primary ${activeTabOktb === "groupOktb" ? "active" : ""}`} onClick={() => setActiveTabOktb("groupOktb")} aria-checked={activeTabOktb === "groupOktb"} aria-disabled={activeTabOktb !== "groupOktb"}>Group OTB</button>
                                                                </li>
                                                            </ul>


                                                            <div className="stack-y gap-2 mb-24">
                                                                <label className="form-label"
                                                                    id="reactss" htmlFor="ari869">
                                                                    Select Country
                                                                </label>
                                                                <div className="gender-select">
                                                                    <div className="select">
                                                                        <select name="gender" onChange={(e) => setCountry(e.target.value)} className="wizard-required" required>
                                                                            <option selected disabled>Select</option>
                                                                            <option value="ind">India</option>
                                                                            <option value="uae">UAE</option>
                                                                            <option value="canada">Canada</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <hr className="bg-sec-gray mb-24 mt-24" />


                                                            {activeTabOktb === "individualOktb" && (
                                                                <div className="">
                                                                    <form onSubmit={handleSubmit}>
                                                                        <div className="forms-st fpp">
                                                                            <div className='row mb-3'>
                                                                                <div className="col-12 mb-3">
                                                                                    <label className="form-label" htmlFor="firstNameOktb">Full Name <span className="text-danger">*</span></label>
                                                                                    <input type="text" id="firstNameOktb" onChange={(e) => setFirstName(e.target.value)} required className="form-control" />
                                                                                </div>
                                                                                <div className="col-12 col-sm-6 mb-3">
                                                                                    <label className="form-label" htmlFor="pnrOktb">PNR <span className="text-danger">*</span></label>
                                                                                    <input type="text" id="pnrOktb" onChange={(e) => setOktbPNR(e.target.value)} required className="form-control" />
                                                                                </div>
                                                                                <div className="col-12 col-sm-6 mb-3">
                                                                                    <label className="form-label" htmlFor="birthday">Date of Birth<span className="text-danger">*</span></label>
                                                                                    <input type="date" id="birthday" onChange={(e) => setBirthday(e.target.value)} required className="form-control"  />
                                                                      


                                                                                </div>

                                                                                {renderDropzone("Upload Passport Front Page", passportFrontDropzone, 'passportFront')}
                                                                                {renderDropzone("Upload Visa", visaDropzone, 'visa')}
                                                                                {renderDropzone("Upload From Ticket", fromTicketDropzone, 'fromTicket')}
                                                                                {renderDropzone("Upload To Ticket", toTicketDropzone, 'toTicket')}


                                                                                <div className="col-12 mb-3">
                                                                                    <label className="form-label" id="seleairl" htmlFor="ari69">Select Airlines</label>
                                                                                    <div className="gender-select">
                                                                                        <div className="select">
                                                                                            <select name="airline" onChange={(e) => setAirline(e.target.value)} className="wizard-required">
                                                                                                <option selected disabled>Select</option>
                                                                                                <option value="airind">Air India</option>
                                                                                                <option value="indigo">Indigo</option>
                                                                                                <option value="kingfisher">Kingfisher</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-12 mb-3">
                                                                                    <label className="form-label" htmlFor="amoutoktb">Amount(₹) <span className="text-danger">*</span></label>
                                                                                    <input type="number" id="amoutoktb" onChange={(e) => setamount(e.target.value)} required className="form-control" />
                                                                                </div>
                                                                            </div>
                                                                            <hr className="bg-sec-gray mb-24 mt-24" />
                                                                        </div>
                                                                        <div className="d-flex justify-content-end gap-3 my-4 mx-4">
                                                                            <button type="submit" className="cus-btn">Submit</button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            )}







                                                            {activeTabOktb === "groupOktb" && (
                                                                <div className="rounded border border-solid border-gray-300 bg-white p-4 shadow-md gap-3 stack-y md:gap-4 md:p-4">
                                                                    <div>
                                                                        {RenderStepContentOktb(stepOktb)}
                                                                        {stepOktb < totalStepsOktb && (
                                                                            <div className="d-flex justify-content-end gap-3 my-4 mx-4 couple-btn">
                                                                                <button onClick={handleSkipOktb} className="cus-btn-outline" style={{ background: "transparent" }}>
                                                                                    Skip
                                                                                </button>
                                                                                <button onClick={handleContinueOktb} className="cus-btn">
                                                                                    Continue
                                                                                </button>
                                                                            </div>
                                                                        )}

                                                                    </div>
                                                                    {renderPaginationDotsOktb()}
                                                                </div>
                                                            )}


                                                        </div>
                                                    </div>
                                                </div>
                                            </div >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >
        </>
    );
};

export default VisaApplication;








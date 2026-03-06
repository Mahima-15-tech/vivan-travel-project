import React, { useCallback, useState, useEffect } from 'react';
import ReactPlayer from "react-player";
import { useDropzone } from 'react-dropzone';
import { useLocation } from 'react-router-dom';
import { post } from "../../../../API/apiHelper";
import { apply_visa } from "../../../../API/endpoints";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

const doclists = ['Passport', 'Passport Back', 'Traveler Photo', 'India PAN Card'];

const dropzoneStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderColor: "rgb(205 202 202)",
    borderStyle: "dashed",
    backgroundColor: "rgb(202 214 255 / 10%)",
    color: "rgb(161 161 161)",
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




function TabComponent({ visaDetails }) {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("individual");
    const [visaDetail, setVisaDetails] = useState(visaDetails || {});

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const encodedformData = queryParams.get('other');
    const formData = atob(encodedformData);
    const jsonObject = JSON.parse(formData);


    const travelDate = new Date(jsonObject.travelDate);
    const returnDate = new Date(jsonObject.returnDate);
    const formattedDate = travelDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const formattedreturnDate = returnDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });


    useEffect(() => {
        if (visaDetails) {
            setVisaDetails(visaDetails);
        }
    }, [visaDetails]);


    const [passportNumber, setPassportNumber] = useState('');
    const [penNumber, setPenNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [internal_ID, setinternal_ID] = useState('');
    const [groupname, setgroupname] = useState('');
    const [lastName, setLastName] = useState('');
    const [nationality, setNationality] = useState('');
    const [sex, setSex] = useState('');
    const [birthday, setBirthday] = useState('');
    const [addi, setaddional] = useState('');
    const [files, setFiles] = useState('');

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
            'visa_id': visaDetails.id,
            'visa_type': 'individual',
            'internal_ID': internal_ID,
            'group_name': groupname,
            'passport_no': passportNumber,
            'first_name': firstName,
            'last_name': lastName,
            'nationality': nationality,
            'sex': sex,
            'dob': birthday,
            'pen_card_no': penNumber,
            'additional_question': addi,
        }


        try {
            const response = await post(apply_visa, formData, true);
            const data = await response.json();
            if (data.status == false) {
                toast.error(data.message);
            } else {
                toast.success(data.message);
                setTimeout(() => {
                    navigate("/visa-status");
                    window.location.reload();
                }, 3000);
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

    const toFrontPassport = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
            'application/pdf': [],
        },
        // maxSize: 1024 * 1024 * 5, // 5MB
        maxFiles: 3,
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'frontPassport')
    });
    const toBackPassport = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
            'application/pdf': [],
        },
        // maxSize: 1024 * 1024 * 5, // 5MB
        maxFiles: 3,
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'backPassport')
    });
    const toTravelersPhoto = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
            'application/pdf': [],
        },
        // maxSize: 1024 * 1024 * 5, // 5MB
        maxFiles: 3,
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'travelersPhoto')
    });
    const toTravelersPanCard = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
            'application/pdf': [],
        },
        // maxSize: 1024 * 1024 * 5, // 5MB
        maxFiles: 3,
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'travelersPAN')
    });
    const toTravelersGroup = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
            'application/pdf': [],
        },
        // maxSize: 1024 * 1024 * 5, // 5MB
        maxFiles: 3,
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'travelersGroup')
    });

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
                        border: '2px dashed #007bff', // Change border color to Bootstrap primary
                        borderRadius: '8px', // Add rounded corners
                        padding: '20px', // Add padding for better spacing
                        backgroundColor: isDragActive ? '#e9f5ff' : '#f8f9fa', // Light background on drag
                        transition: 'background-color 0.3s ease', // Smooth transition for background color
                        cursor: 'pointer', // Pointer cursor on hover
                        position: 'relative', // Position for absolutely positioned text
                    }}
                    className={`dropzone ${isDragActive ? 'active' : ''}`}
                >
                    <input {...getInputProps({ ...options })} />
                    <p style={{
                        color: '#6c757d', // Muted text color for better readability
                        textAlign: 'center', // Center align text
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '500',
                    }}>
                        Drag and drop your files here, or click to select files
                    </p>
                    <ul style={{ padding: '0', marginTop: '10px' }}>
                        {renderDocuList(fieldKey)}
                    </ul>
                    {isDragActive && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontWeight: 'bold',
                            color: '#007bff',
                        }}>
                            Drop the files here...
                        </div>
                    )}
                </div>
            </div>

        );
    };
    const renderDocuList = (key) => {
        return files[key]?.map((file) => (
            <li key={file.name} style={{ position: 'relative', listStyle: 'none' }}>
                <img style={ImagePreview} src={file.preview} alt={file.name} />
                <span style={FileName}>{file.name}</span>
            </li >
        ));
    };

    const [isFPPExpanded, setFPPExpanded] = useState(true);
    const [isBPPExpanded, setBPPExpanded] = useState(true);
    const [isPANCExpanded, setPANCExpanded] = useState(true);
    const [isTPExpanded, setTPExpanded] = useState(true);
    // const [isCabinExpanded, setCabinExpanded] = useState(true);



    const [occupation, setOccupation] = useState("");
    const handleOccupationChange = (event) => {
        setOccupation(event.target.value);
    };


    const [step, setStep] = useState(1);
    const totalSteps = 4; // Set the total number of steps

    // Function to handle "Continue" button click
    const handleContinue = () => {
        if (step < totalSteps) {
            setStep(prevStep => prevStep + 1); // Go to next step
        }
    };

    const handleSkip = () => {
        setStep(totalSteps); // Skip to the last step
    };


    const [playing, setPlaying] = useState(false);
    const videoUrl = "https://youtu.be/7GlavNgmU-k?si=i42r5VbJVm05N7yf";

    const handlePlayPause = () => {
        setPlaying((prevPlaying) => !prevPlaying);
    };


    // Function to render the content for the current step
    const renderStepContent = (step) => {
        switch (step) {
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
                        <ul className="list-unstyled d-flex justify-content-around text-sm fw-bold w-100 border-top">
                            {doclists.map((document, index) => (
                                <li key={index} className={`d-flex align-items-center gap-0 py-3 ${index !== doclists.length - 1 ? 'border-bottom' : ''}`}>
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

                        {renderDropzone("Upload ZIP", toTravelersGroup, 'travelersGroup', { accept: ".zip" })}

                        <div className="d-flex justify-content-end gap-3 my-4 mx-4">
                            <button onClick={''} className="cus-btn">
                                Upload
                            </button>
                        </div>


                    </div>
                );
            default:
            // return <h2>Finished</h2>;
        }
    };

    // Function to render the pagination dots with click event
    const renderPaginationDots = () => {
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                {Array.from({ length: totalSteps }, (_, index) => (
                    <div
                        key={index}
                        onClick={() => setStep(index + 1)}  // Set the step based on the dot clicked
                        style={{
                            height: "10px",
                            width: "10px",
                            borderRadius: "50%",
                            backgroundColor: step === index + 1 ? "#000" : "#ccc",
                            margin: "0 5px",
                            cursor: "pointer",  // Change cursor to pointer to indicate clickable dots
                        }}
                    ></div>
                ))}
            </div>
        );
    };








    return (
        <div className="containe flex flex-col max-w-screen-xl gap-8">
            <div className="apllying-ser mb-4 col-12">
                <header>
                    <h3 className="font-heading text-xl font-semibold mb-30">
                        Are You Applying For
                    </h3>
                </header>
                <div className="gap-4 d-flex justify-center align-items-end">
                    <div className="flex-1 stack-y col-12">
                        <ul className="nav nav-tabs border-0 mb-24 w-100">
                            <li className="nav-item col-6">
                                <button className={`cus-btn primary-light primary ${activeTab === "individual" ? "active" : ""}`} onClick={() => setActiveTab("individual")} aria-checked={activeTab === "individual"} aria-disabled={activeTab !== "individual"}>Individual</button>
                            </li>
                            <li className="nav-item col-6">
                                <button className={`cus-btn primary-light primary ${activeTab === "group" ? "active" : ""}`} onClick={() => setActiveTab("group")} aria-checked={activeTab === "group"} aria-disabled={activeTab !== "group"}>Group</button>
                            </li>
                        </ul>


                        <div className="stack-y gap-2 mb-24">
                            <label className="form-label"
                                id="react" htmlFor="aria43869">
                                Visa Type individual
                            </label>
                            <div className="gender-select">
                                <div className="select">
                                    <select name="gender" className="wizard-required">
                                        <option selected disabled>Select</option>
                                        <option value="UAECovidInsurance">UAE 30 Days Covid Insurance</option>
                                        <option value="CancelUAEVisa">Cancel UAE Visa</option>
                                        <option value="UAETransitE-Visa">UAE 96 Hours Transit E-Visa</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-24">
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <label className="form-label" id="aria4938169" htmlFor="aria493816">
                                        Internal ID
                                    </label>
                                    <input type="text" name="group.agency_custom_id" id="aria493816" onChange={(e) => setinternal_ID(e.target.value)} aria-labelledby="aria4938169" className="form-control" placeholder="Internal ID" />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label" id="aria8169" htmlFor="aria49470">
                                        Group Name
                                    </label>
                                    <input type="text" name="group_name" id="aria49470" onChange={(e) => setgroupname(e.target.value)} className="form-control" placeholder="Group Name" />
                                </div>
                            </div>
                        </div>

                    </div>


                </div>
            </div>


            {activeTab === "individual" && (
                <div className="apllying-">
                    <div className="apllying-ser">
                        <header className="pb-4 border-b border-gray-300 border-solid">
                            <h3 className="font-heading text-2xl font-semibold md:text-3xl">Traveler 1</h3>
                        </header>
                        <form onSubmit={handleSubmit}>

                            <div className="forms-st fpp">
                                <div className="mb-3">
                                    <div className="title d-flex justify-content-between align-items-center" onClick={() => setFPPExpanded(!isFPPExpanded)} style={{ cursor: 'pointer' }}>
                                        <h5 className="font-heading text-xl font-semibold md:text-2xl ">Upload Traveler's Passport Details</h5>
                                        <i className={`fal fa-chevron-${isFPPExpanded ? 'up' : 'down'} color-primary`}></i>
                                    </div>
                                </div>
                                {isFPPExpanded && (
                                    <div className='row mb-3'>
                                        <p className="text-sm text-gray-700 mb-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat quaerat minus dolorum ut ab molestias soluta, illo ratione eius rem enim rerum vel itaque nostrum sequi aperiam. Dignissimos, eum debitis?</p>
                                        {renderDropzone("Front Passport Image", toFrontPassport, 'frontPassport')}
                                        {renderDropzone("Back Passport Image", toBackPassport, 'backPassport')}

                                        <div className="col-12 mb-3">
                                            <label className="form-label" htmlFor="passportNumber">Passport Number<span className="text-danger">*</span></label>
                                            <input type="text" id="passportNumber" pattern="^[A-Z]{1}[0-9]{7}$" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} required className="form-control" />
                                        </div>
                                        <div className="col-12 col-sm-6 mb-3">
                                            <label className="form-label" htmlFor="firstName">First Name <span className="text-danger">*</span></label>
                                            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="form-control" />
                                        </div>
                                        <div className="col-12 col-sm-6 mb-3">
                                            <label className="form-label" htmlFor="lastName">Last Name</label>
                                            <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" />
                                        </div>
                                        <div className="col-12 col-md-4 mb-3">
                                            <label className="form-label" htmlFor="nationality">Nationality <span className="text-danger">*</span></label>
                                            <select id="nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} required className="form-select">
                                                <option value="">Select an item</option>
                                                <option value="ind">India</option>
                                                <option value="aus">Austrailia</option>
                                                <option value="uae">UAE</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-4 mb-3">
                                            <label className="form-label" htmlFor="sex">Sex <span className="text-danger">*</span></label>
                                            <select id="sex" value={sex} onChange={(e) => setSex(e.target.value)} required className="form-select">
                                                <option value="">Select an item</option>
                                                <option value="F">Female</option>
                                                <option value="M">Male</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-4 mb-3">
                                            <label className="form-label" htmlFor="birthday">Date of Birth <span className="text-danger">*</span></label>
                                            <input type="date" id="birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} required className="form-control" />
                                        </div>
                                    </div>
                                )}
                                <hr className="bg-sec-gray mb-24 mt-24" />
                            </div>

                            <div className="forms-st tp">
                                <div className="mb-3">
                                    <div className="title d-flex justify-content-between align-items-center" onClick={() => setTPExpanded(!isTPExpanded)} style={{ cursor: 'pointer' }}>
                                        <h5 className="font-heading text-xl font-semibold md:text-2xl ">Upload Traveler's Photo</h5>
                                        <i className={`fal fa-chevron-${isTPExpanded ? 'up' : 'down'} color-primary`}></i>
                                    </div>
                                </div>

                                {isTPExpanded && (
                                    <div className='row mb-3'>
                                        <p className="text-sm text-gray-700 mb-3">United Arab Emirates{' '}
                                            {/* <a className="text-blue-600" href="https://drive.google.com/file/d/1kCVa9iZvIA53wLTfyytlPTgOIJBsVbMm/view?usp=sharing" rel="noreferrer" target="_blank">here</a>. */}
                                            Your visa can get rejected if these guidelines are not followed.
                                        </p>
                                        {renderDropzone("Upload Traveler's Photo", toTravelersPhoto, 'travelersPhoto')}
                                    </div>

                                )}
                                <hr className="bg-sec-gray mb-24 mt-24" />
                            </div>

                            <div className="forms-st">
                                <div className="mb-3">
                                    <div className="title d-flex justify-content-between align-items-center" onClick={() => setPANCExpanded(!isPANCExpanded)} style={{ cursor: 'pointer' }}>
                                        <h5 className="font-heading text-xl font-semibold md:text-2xl ">Upload Traveler's PAN Card</h5>
                                        <i className={`fal fa-chevron-${isPANCExpanded ? 'up' : 'down'} color-primary`}></i>
                                    </div>
                                </div>

                                {isPANCExpanded && (
                                    <div className='row mb-3'>
                                        <p className="text-sm text-gray-700 mb-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea ut, commodi quidem exercitationem quo sunt ipsum id corrupti facere nobis?
                                        </p>

                                        {renderDropzone("Upload Traveler's PAN Card", toTravelersPanCard, 'travelersPAN')}

                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="panNumber">India PAN Card Number <span className="text-danger">*</span></label>
                                            <input type="text" id="panNumber" pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$" onChange={(e) => setPenNumber(e.target.value)} required className="form-control" />
                                        </div>
                                    </div>
                                )}
                            </div>



                            <section className="stack-y mt-64">
                                <header>
                                    <h4 className="font-heading text-xl font-semibold mb-8">Answer Additional Required Questions</h4>
                                </header>
                                <input type="hidden" name="travelers.0.application.completedSteps.ADDITIONAL_QUESTIONS" value="true" />
                                <div>
                                    <input type="hidden" name="travelers.0.application.bouncerRequirement.additionalQuestions.0.key" value="occupation" />
                                    <div aria-required="false" className="flex flex-col gap-2">
                                        <div className="stack-y group gap-2">
                                            <p className="text-sm text-gray-700 text-xs px-2 mt-3 mb-2">What is the traveler's occupation (optional)?</p>
                                            <div className="select">
                                                <select id="occupation" name="travelers.0.application.bouncerRequirement.additionalQuestions.0.answer" onChange={(e) => setaddional(e.target.value)} className="wizard-required w-100">
                                                    <option value="">Select an item</option>
                                                    <option value="architect">Architect</option>
                                                    <option value="associate officer">Associate Officer</option>
                                                    <option value="business">Business</option>
                                                    <option value="businesswoman">Businesswoman</option>
                                                    <option value="none">Child</option>
                                                    <option value="clinical scientist">Clinical Scientist</option>
                                                    <option value="director">Director</option>
                                                    <option value="engineer">Engineer</option>
                                                    <option value="executive">Executive</option>
                                                    <option value="flight attendant">Flight Attendant</option>
                                                    <option value="house wife">Housewife</option>
                                                    <option value="journalist">Journalist</option>
                                                    <option value="lawyer">Lawyer</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="medical doctors">Medical Doctors</option>
                                                    <option value="photographer">Photographer</option>
                                                    <option value="physician">Physician</option>
                                                    <option value="pilot">Pilot</option>
                                                    <option value="retired">Retired</option>
                                                    <option value="sales representative">Sales Representative</option>
                                                    <option value="sales specialist">Sales Specialist</option>
                                                    <option value="secretary">Secretary</option>
                                                    <option value="senior manager">Senior Manager</option>
                                                    <option value="services">Services</option>
                                                    <option value="soldier">Soldier</option>
                                                    <option value="student / not allowed to work">
                                                        Student / not allowed to work
                                                    </option>
                                                    <option value="teacher">Teacher</option>
                                                    <option value="university professor">University Professor</option>
                                                    <option value="vice president">Vice President</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <br />
                            <button type="submit" className="cus-btn">Submit</button>
                        </form>
                    </div >

                    <div className="d-flex justify-content-end gap-3 my-4 mx-4">
                        {/* <div className="stack-x"> */}
                        {/* Add Another Traveler Button */}
                        {/* <button type="button" className="cus-btn-outline">
                            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="user-plus" className="svg-inline--fa fa-user-plus fa-fw" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                <path fill="currentColor" d="M224 48a80 80 0 1 1 0 160 80 80 0 1 1 0-160zm0 208A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 96h91.4c65.7 0 120.1 48.7 129 112H49.3c8.9-63.3 63.3-112 129-112zm0-48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3zM504 312c0 13.3 10.7 24 24 24s24-10.7 24-24V248h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H552V136c0-13.3-10.7-24-24-24s-24 10.7-24 24v64H440c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64z"></path>
                            </svg>
                            Add Another Traveler
                        </button> */}
                        {/* </div> */}

                        {/* Review and Save Button */}
                        <button type="submit" className="cus-btn">
                            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="bookmark" className="svg-inline--fa fa-bookmark fa-fw" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                <path fill="currentColor" d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"></path>
                            </svg>
                            Review and Save
                        </button>
                    </div>


                    <div className="col-11 m-auto">
                        <div className="row">
                            <div className="col-md-8 rounded border border-secondary bg-white shadow-md px-3 py-2 mb-3">
                                {/* Visa Information Section */}
                                <section className="py-2">
                                    <header>
                                        <h3 className="fw-semibold fs-5">Visa Information</h3>
                                    </header>
                                    <div className="d-flex">
                                        <ul className="list-unstyled flex-grow-1">
                                            <li className="py-1">{visaDetail.about || 'N/A'}</li>
                                            <li>Travelers: 1</li>
                                            <li>Travel city: <span>{jsonObject.going_from}</span> - <span>{jsonObject.going_to}</span></li>
                                            <li>{ }
                                                Travel Dates: <span>{formattedDate}</span> - <span>{formattedreturnDate}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Expected Visa Approval Section */}
                                <section className="py-2">
                                    <header>
                                        <h3 className="fw-semibold fs-5 mb-1">Expected Visa Approval</h3>
                                    </header>
                                    <p className="fw-semibold">
                                        <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" className="svg-inline--fa fa-calendar me-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ width: '1em', height: '1em' }} >
                                            <path fill="currentColor" d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                                        </svg>
                                        {visaDetail.processing_time || 'N/A'} , if submitted now!
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
                                                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" className="svg-inline--fa fa-circle text-success"
                                                    role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: '1em', height: '1em' }}>
                                                    <path fill="currentColor"
                                                        d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="fw-semibold">Auto-validation upon submission</p>
                                                <p className="small">
                                                    .. performs automated validation after submission. We will let you know if there are any problems with the application.
                                                </p>
                                            </div>
                                        </li>
                                        <li className="d-flex align-items-start py-2">
                                            <div className="me-2">
                                                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" className="svg-inline--fa fa-circle text-success"
                                                    role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: '1em', height: '1em' }}>
                                                    <path fill="currentColor"
                                                        d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="fw-semibold">Visa processed within 30 seconds</p>
                                                <p className="small">.. automatically processes your visa.</p>
                                            </div>
                                        </li>
                                        <li className="d-flex align-items-start py-2">
                                            <div className="me-2">
                                                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" className="svg-inline--fa fa-circle text-warning"
                                                    role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: '1em', height: '1em' }}>
                                                    <path fill="currentColor"
                                                        d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                                                </svg>
                                            </div>

                                            <div>
                                                <p className="fw-semibold">Non-refundable after you pay</p>
                                                <p className="small">If canceled after payment, you will not be refunded.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </section>
                            </div>

                            <div className="col-md-4 rounded border border-secondary bg-white shadow-md px-3 py-2 mb-3">
                                <div className="">
                                    <header>
                                        <h3 className="fw-semibold fs-5">Price Details</h3>
                                    </header>
                                    <div className="p-3 border-0 bg-light">
                                        <ul className="list-unstyled mb-0">
                                            <li className="d-flex justify-content-between align-items-center py-2">
                                                <div>Visa Fees</div>
                                                <div className="d-flex align-items-center">
                                                    <div>₹7,799</div>
                                                    <button type="button" className="btn btn-link p-0 m-0" aria-label="Price Breakdown" title="Price Breakdown">
                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" className="svg-inline--fa fa-caret-down fa-fw" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style={{ width: '20px', height: '20px' }}>
                                                            <path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 306.7 54.6 201.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </li>

                                            <li className="d-flex justify-content-between py-2">
                                                <div>Taxes and Fees</div>
                                                <div>₹0</div>
                                            </li>
                                        </ul>
                                        <div className="fw-bold d-flex justify-content-between pt-2">
                                            <div>Total</div>
                                            <div>₹7,799</div>
                                        </div>
                                    </div>
                                    <div className="pt-4 pb-1">
                                        <button
                                            type="button"
                                            className="cus-btn w-100">
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}


            {
                activeTab === "group" && (
                    <div className="apllying-ser">
                        <div>
                            {/* <h1>Great! Let's Get Started</h1> */}
                            {renderStepContent(step)}


                            {/* Show "Continue" and "Skip" buttons as long as steps remain */}
                            {step < totalSteps && (
                                <div className="d-flex justify-content-end gap-3 my-4 mx-4">
                                    <button onClick={handleSkip} className="cus-btn-outline" style={{ background: "transparent" }}>
                                        Skip
                                    </button>
                                    <button onClick={handleContinue} className="cus-btn">
                                        Continue
                                    </button>
                                </div>
                            )}

                        </div>

                        {/* Pagination Dots */}
                        {renderPaginationDots()}

                    </div>
                )
            }




        </div >
    );
}

export default TabComponent;

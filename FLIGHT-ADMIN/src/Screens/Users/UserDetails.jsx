import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { post } from "../../API/apiHelper";
import { userdetails } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import { IMAGE_BASE_URL } from "../../API/endpoints";
import Default from "../../Assets/Images/user.webp";
import Modal from "../Model/Model";  // Import the Modal component


function UsersDetails() {
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState("");

    useEffect(() => {
        fetchUserDetails();
    }, []);

    async function fetchUserDetails() {
        setLoading(true);
        try {
            const response = await post(userdetails, { user_id: userId }, true);
            const data = await response.json();

            if (response.ok && data.status) {
                setUserData(data.data);
            } else {
                toast.error("Failed to fetch user details.");
                setUserData(null); // Handle failure by setting userData to null
            }
        } catch (error) {
            toast.error("An error occurred while fetching user details.");
            setUserData(null); // Handle error by setting userData to null
        } finally {
            setLoading(false);
        }
    }
    const handleImageClick = (imgSrc) => {
        setCurrentImage(imgSrc);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentImage("");
    };



    if (loading) {
        return (
            <center>
                <CircularProgressBar />
            </center>
        );
    }

    if (!userData) {
        return <div>No data found or failed to load data</div>;
    }

    const { model, images, interests } = userData;
    const Profile = model.profile ? `${IMAGE_BASE_URL}${model.profile}` : Default;

    const openMap = () => {
        alert(model?.latitude);
        const lat = model?.latitude;
        const lng = model?.longitude;
        const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
        window.open(mapUrl, '_blank');
    };

    return (
        <main id="content" role="main" className="main pointer-event">
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

            <div className="content container-fluid">
                <div className="card card-top-bg-element mb-5">
                    <div className="card-body">
                        <div className="d-flex flex-wrap gap-3 justify-content-between">
                            <div className="media flex-column flex-sm-row gap-3">


                                <img
                                    src={Profile}
                                    alt="User Image"
                                    className="avatar avatar-170 rounded-0"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleImageClick(Profile)}
                                />



                                <div className="media-body">
                                    <div className="d-block">
                                        <h2 className="mb-2 pb-1">{model?.name || "N/A"}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-sm-end flex-wrap gap-2 mb-3">
                            </div>
                        </div>
                        <hr />
                        <div className="d-flex gap-3 flex-wrap flex-lg-nowrap">
                            <div className="row gy-3 flex-grow-1 w-100">
                                <div className="col-sm-6 col-xxl-3">
                                    <h4 className="mb-3 text-capitalize">User information</h4>
                                    <div className="pair-list">
                                        <div>
                                            <span className="key text-nowrap">Name</span>
                                            <span>:</span>
                                            <span className="value ">{model?.name || "N/A"}</span>
                                        </div>

                                        <div>
                                            <span className="key">Phone</span>
                                            <span>:</span>
                                            <span className="value">{model?.mobile_no || "N/A"}</span>
                                        </div>

                                        <div>
                                            <span className="key">Email</span>
                                            <span>:</span>
                                            <span className="value">{model?.email || "N/A"}</span>
                                        </div>

                                        <div>
                                            <span className="key">Address</span>
                                            <span>:</span>
                                            <span className="value">{model?.address || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="key">Gender</span>
                                            <span>:</span>
                                            <span className="value">{model?.gender || "N/A"}</span>
                                        </div>

                                        <div>
                                            <span className="key">Status</span>
                                            <span>:</span>
                                            <span className="value">
                                                <span className="badge badge-info">
                                                    {(model?.status == 1) ? 'Active' : 'Block'}
                                                </span>
                                            </span>
                                        </div>

                                        <div>
                                            <span className="key">Account</span>
                                            <span>:</span>
                                            <span className="value">
                                                <span className="value">
                                                    {(model?.active_status == 1) ? 'Active' : 'Dactive'}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>


                                <div className="col-sm-6 col-xxl-3">
                                    <h4 className="mb-3 text-capitalize">Social information</h4>

                                    <div className="pair-list">
                                        <div>
                                            <span className="key">facebook id</span>
                                            <span>:</span>
                                            <span className="value text-capitalize">{model?.fb_id || "N/A"}</span>
                                        </div>

                                        <div>
                                            <span className="key">google id</span>
                                            <span>:</span>
                                            <span className="value">{model?.google_id || "N/A"}</span>
                                        </div>

                                        <div>
                                            <span className="key">apple id</span>
                                            <span>:</span>
                                            <span className="value">{model?.apple_id || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="key">x id</span>
                                            <span>:</span>
                                            <span className="value">{model?.x_id || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="key">location</span>
                                            <span>:</span>
                                            <span className="button">{model?.lat && model?.lng ? (
                                                <button onClick={openMap} className='btn btn-primary mt-3 btn-sm'>
                                                    Go to Map
                                                </button>
                                            ) : (
                                                'N/A'
                                            )}


                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6">
                                    <div className="bg-light p-3 border border-primary-light rounded">
                                        <h4 className="mb-3 text-capitalize">User Submitted Images</h4>
                                        <div className="d-flex flex-wrap gap-5">
                                            {images?.map((img, index) => (
                                                <div className="pair-list" key={index}>
                                                    <img
                                                        src={IMAGE_BASE_URL + img.image || "https://via.placeholder.com/150"}
                                                        alt={`User Image ${index + 1}`}
                                                        className="img-fluid rounded"
                                                        style={{ maxWidth: "100px", height: "100px", cursor: "pointer" }}
                                                        onClick={() => handleImageClick(IMAGE_BASE_URL + img.image)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>


                                <div className="col-xxl-6">
                                    <div className="bg-light p-3 border border-primary-light rounded">
                                        <h4 className="mb-3 text-capitalize">User Interest</h4>
                                        <div className="d-flex flex-wrap gap-5">
                                            {interests?.map((interests, index) => (
                                                <div className="pair-list" key={index}>
                                                    <img
                                                        src={IMAGE_BASE_URL + interests.image || "https://via.placeholder.com/150"}
                                                        alt={`User Image ${index + 1}`}
                                                        className="img-fluid rounded"
                                                        style={{ maxWidth: "100px", height: "100px" }}
                                                    />
                                                    <h5 style={{ textAlign: "center" }}>{interests.label}</h5>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <Modal isOpen={isModalOpen} onClose={handleCloseModal} imgSrc={currentImage} />
        </main>
    );
}

export default UsersDetails;

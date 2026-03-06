import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../visa.css";
import "../visa-verification/visa-verification.css";
// import VisafFor from '../visa-f'
import Visa_Verification from "../visa-verification/Visa_Verification_Form";
import ProfileSidebarWidget from "../../profile-sidebar";
import { post } from "../../../../API/apiHelper";
import {
  details_visa,
  get_applied_visa_details,
} from "../../../../API/endpoints";
import { useNavigate } from "react-router-dom";

const VisaApplication = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const encodedData = queryParams.get("data");
  const encodedfromData = queryParams.get("other");

  const visavaildations = JSON.parse(atob(encodedfromData));
  const visaid = atob(encodedData);
  console.log("Fetching visa details for ID:", visavaildations);
  console.log("Fetching visa visaid:", visaid);
  const [applied_visa_list, setAppliedVisaList] = useState([]); // State for storing applied visa list
  const [visaDetails, setVisaDetails] = useState(null); // State for storing visa details
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  // const formData = {
  //   going_from: visa.appliedvisa.going_from,
  //   going_to: visa.appliedvisa.going_to,
  //   travelDate: visa.travelDate,
  //   returnDate: visa.returnDate,
  //   visa_data: countrylist.find(
  //     (country) => country.country_name === visa.appliedvisa.going_to
  //   ),
  //   applied_visa_refrense_no: visa.refrense_no,
  //   applied_visa__id: visa.id,
  // };
  const fetchVisaDetails = async () => {
    setIsLoading(true);
    try {
      // const queryParams = new URLSearchParams(location.search);
      // const encodedfromData = queryParams.get("other");

      // const visavaildations = atob(encodedfromData);
      if (visavaildations.applied_visa_refrense_no) {
        const response = await post(get_applied_visa_details, {
          refrense_no: visavaildations.applied_visa_refrense_no,
          needcharges: "yes",
        });
        if (response.ok) {
          const data = await response.json();
          setAppliedVisaList(data.data.applied_visa_list);
          setVisaDetails(data.data.appliedvisa);
        } else {
          throw new Error("Failed to fetch visa details");
        }
      } else {
        const response = await post(details_visa, { id: visaid });
        if (response.ok) {
          const data = await response.json();
          setVisaDetails(data.data);
        } else {
          throw new Error("Failed to fetch visa details");
        }
      }
    } catch (error) {
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userDataFromSession = sessionStorage.getItem("userData");
    if (!userDataFromSession) {
      navigate("/login");
    }
    fetchVisaDetails();
  }, []);

  return (
    <section className="pt-3 pb-5" style={{ minHeight: "calc(100vh - 436px)" }}>
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
          <div className="col-xl-12 col-lg-12">
            {/* <div className="d-grid mb-0 d-lg-none w-100">
                            <button type="button" className="mb-4 items-center justify-content-center gap-1 btn btn-primary menu-btnspt">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M496 384H160v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h80v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h336c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160h-80v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h336v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h80c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160H288V48c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16C7.2 64 0 71.2 0 80v32c0 8.8 7.2 16 16 16h208v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h208c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16z"></path>
                                </svg> Menu
                            </button>
                        </div> */}
            <div className="vstack gap-4">
              <div className="border card">
                <div className="border-bottom card-header">
                  <h3 className="card-header-title">Visa Apply</h3>
                </div>
                {/* <div className="card-body p-0">
                                    <div className="position-relative max-w-screen-lg rounded-br-5 p-5">
                                        <VisafFor />
                                    </div>
                                </div> */}
                <div className="card-body p-0 visa-verifica">
                  {isLoading ? (
                    <p>Loading visa details...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : (
                    visaDetails && (
                      <Visa_Verification
                        visaDetails={visaDetails}
                        applied_visa_list={applied_visa_list}
                        applied_visa_id={visavaildations?.applied_visa_id || ""}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisaApplication;

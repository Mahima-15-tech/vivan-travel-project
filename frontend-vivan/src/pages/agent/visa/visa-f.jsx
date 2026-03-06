import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../visa/visa.css';
import { post } from "../../../API/apiHelper";
import { search_visa } from "../../../API/endpoints";
import { toast, ToastContainer } from 'react-toastify';



const VisaWidget = () => {
    const [going_from, setCitizenOf] = useState('');
    const [going_to, setGoingTo] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCitizenOfChange = (e) => setCitizenOf(e.target.value);
    const handleGoingToChange = (e) => setGoingTo(e.target.value);
    const handleTravelDateChange = (e) => setTravelDate(e.target.value);
    const handleReturnDateChange = (e) => setReturnDate(e.target.value);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state) {
            const { going_from, going_to, travelDate, returnDate } = location.state.formData || {};
            setCitizenOf(going_from || '');
            setGoingTo(going_to || '');
            setTravelDate(travelDate || '');
            setReturnDate(returnDate || '');
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);

        const formData = {
            going_from:going_from,
            going_to,
            travelDate,
            returnDate
        };

        try {
            const response = await post(
                search_visa, formData,
                true
            );
            const data = await response.json();
            if (data.status == false) {
                toast.error(data.message);
            } else {
                const vdata = data.data;
                navigate('/visa', { state: { vdata, formData } });
            }

        } catch (error) {
            setMessage(`Submission failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column justify-content-between gap-10">
            <h1 className="text-4xl font-semibold text-black">
                Guaranteed{' '}
                <span className="text-transparent underline cursor-pointer bg-text-gradient bg-clip-text decoration-purple-800 decoration-1 underline-offset-4">
                    visa on time
                </span>
                {' '}to
            </h1>
            <div className="d-flex flex-column gap-8 flex-sm-row">
                {/* Citizen of */}
                <div className="d-flex flex-row align-items-center flex-grow-1 px-4 bg-atcst rounded-3xl shadow-drop-modal">
                    <svg fill="none" height="26" viewBox="0 0 26 26" width="26" xmlns="http://www.w3.org/2000/svg" class="text-gray-500 cursor-pointer size-6 "><path d="M23.8334 18.4167V12.5117C23.8334 11.0997 23.8334 10.3937 23.6538 9.74184C23.4948 9.16438 23.2332 8.62019 22.8817 8.13523C22.4848 7.58781 21.9336 7.14678 20.831 6.26472L17.9976 3.99805C16.2141 2.57118 15.3223 1.85774 14.3332 1.58413C13.4609 1.34279 12.5393 1.34279 11.6669 1.58413C10.6779 1.85774 9.78611 2.57117 8.00253 3.99804L8.00252 3.99805L5.16919 6.26472C4.0666 7.14678 3.51531 7.58781 3.11849 8.13523C2.76695 8.62019 2.5054 9.16438 2.34632 9.74184C2.16675 10.3937 2.16675 11.0997 2.16675 12.5117V18.4167C2.16675 18.8036 2.16675 18.997 2.17745 19.1603C2.34156 21.6641 4.33595 23.6585 6.83973 23.8226C7.00307 23.8333 7.19652 23.8333 7.58342 23.8333C7.73817 23.8333 7.81555 23.8333 7.88089 23.8291C8.8824 23.7634 9.68016 22.9657 9.7458 21.9641C9.75008 21.8988 9.75008 21.8214 9.75008 21.6667V17.3333C9.75008 15.5383 11.2052 14.0833 13.0001 14.0833C14.795 14.0833 16.2501 15.5383 16.2501 17.3333V21.6667C16.2501 21.8214 16.2501 21.8988 16.2544 21.9641C16.32 22.9657 17.1178 23.7634 18.1193 23.8291C18.1846 23.8333 18.262 23.8333 18.4167 23.8333C18.8036 23.8333 18.9971 23.8333 19.1604 23.8226C21.6642 23.6585 23.6586 21.6641 23.8227 19.1603C23.8334 18.997 23.8334 18.8036 23.8334 18.4167Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
                    <div className="d-flex flex-column flex-1 w-100">
                        <input
                            className="form-control cstm-form-cntrl h-3.71rem border-gray-100 rounded-none shadow-none cursor-pointer"
                            placeholder="Citizen of"
                            aria-haspopup="listbox"
                            aria-expanded="false"
                            type="text"
                            autoComplete="off"
                            value={going_from}
                            onChange={handleCitizenOfChange}
                            required
                        />
                    </div>
                </div>

                <div className="pt-2 pb-2">
                    <hr className="border-0 border-t border-gray-300" />
                </div>

                {/* Going to */}
                <div className="d-flex flex-row align-items-center flex-grow-1 px-4 bg-atcst rounded-3xl shadow-drop-modal">
                    <svg fill="none" height="24" viewBox="0 0 25 24" width="25" xmlns="http://www.w3.org/2000/svg" class="text-gray-500 size-6"><path d="M7.59529 22.971L16.9678 13.9261H21.1244C21.7807 13.9261 22.4418 13.7856 23.0588 13.5085L23.463 13.3027C24.0062 13.0597 24.3428 12.5514 24.3428 11.9748C24.3428 11.3982 24.0062 10.8899 23.4862 10.6577L23.0364 10.4304C22.4418 10.1641 21.7818 10.0236 21.1244 10.0236H16.9682L7.59749 0.981502C7.12014 0.521042 6.48624 0.267334 5.81081 0.267334H4.6257C4.44086 0.267334 4.27108 0.364882 4.18288 0.521042C4.09395 0.677126 4.10021 0.868364 4.20126 1.0186L10.3069 10.2128C8.77747 10.3036 7.50049 10.4265 5.94642 10.5767L4.35376 10.7319L2.01513 7.31623C1.92032 7.17865 1.76268 7.0967 1.59253 7.0967H0.581596C0.429092 7.0967 0.283204 7.164 0.187292 7.27913C0.0902776 7.39523 0.053896 7.54644 0.0873366 7.68986L1.07512 11.9748L0.0873366 16.2597C0.0792521 16.2949 0.0752024 16.33 0.0752024 16.365C0.0752024 16.4754 0.113421 16.5826 0.186182 16.6704C0.283196 16.7856 0.429092 16.8528 0.581596 16.8528H1.59253C1.76268 16.8528 1.92105 16.7709 2.01439 16.6334L4.34972 13.2177L5.94715 13.3728C7.49938 13.5231 8.77527 13.646 10.3051 13.7367L4.20126 22.9309C4.10021 23.0823 4.09506 23.2723 4.18288 23.4275C4.27108 23.5845 4.44085 23.6823 4.62606 23.6823H5.81081C6.48624 23.6823 7.12014 23.4297 7.59529 22.971Z" fill="black"></path></svg>
                    <div className="d-flex flex-column flex-1 w-100">
                        <input className="form-control cstm-form-cntrl h-3.71rem border-gray-100 rounded-none shadow-none cursor-pointer" placeholder="Going to" aria-haspopup="listbox" aria-expanded="false" type="text" autoComplete="off" value={going_to} onChange={handleGoingToChange} required />
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column gap-8 flex-sm-row">
                {/* Travel Date */}
                <div className="d-flex flex-row align-items-center flex-grow-1 px-4 bg-atcst rounded-3xl shadow-drop-modal">
                    <svg fill="none" height="27" viewBox="0 0 27 27" width="27" class="text-[#2F384C] size-6"><g clip-path="url(#clip0_1139_45265)"><path d="M9.50293 1.14727V4.39727M18.1696 1.14727V4.39727M19.7946 8.7306H7.87793M9.50293 13.6056C9.50293 13.9048 9.26042 14.1473 8.96126 14.1473C8.66211 14.1473 8.4196 13.9048 8.4196 13.6056M9.50293 13.6056C9.50293 13.3064 9.26042 13.0639 8.96126 13.0639C8.66211 13.0639 8.4196 13.3064 8.4196 13.6056M9.50293 13.6056H8.4196M9.50293 17.9389C9.50293 18.2381 9.26042 18.4806 8.96126 18.4806C8.66211 18.4806 8.4196 18.2381 8.4196 17.9389M9.50293 17.9389C9.50293 17.6398 9.26042 17.3973 8.96126 17.3973C8.66211 17.3973 8.4196 17.6398 8.4196 17.9389M9.50293 17.9389H8.4196M14.3779 13.6056C14.3779 13.9048 14.1354 14.1473 13.8363 14.1473C13.5371 14.1473 13.2946 13.9048 13.2946 13.6056M14.3779 13.6056C14.3779 13.3064 14.1354 13.0639 13.8363 13.0639C13.5371 13.0639 13.2946 13.3064 13.2946 13.6056M14.3779 13.6056H13.2946M14.3779 17.9389C14.3779 18.2381 14.1354 18.4806 13.8363 18.4806C13.5371 18.4806 13.2946 18.2381 13.2946 17.9389M14.3779 17.9389C14.3779 17.6398 14.1354 17.3973 13.8363 17.3973C13.5371 17.3973 13.2946 17.6398 13.2946 17.9389M14.3779 17.9389H13.2946M19.2529 13.6056C19.2529 13.9048 19.0104 14.1473 18.7113 14.1473C18.4121 14.1473 18.1696 13.9048 18.1696 13.6056M19.2529 13.6056C19.2529 13.3064 19.0104 13.0639 18.7113 13.0639C18.4121 13.0639 18.1696 13.3064 18.1696 13.6056M19.2529 13.6056H18.1696M19.2529 17.9389C19.2529 18.2381 19.0104 18.4806 18.7113 18.4806C18.4121 18.4806 18.1696 18.2381 18.1696 17.9389M19.2529 17.9389C19.2529 17.6398 19.0104 17.3973 18.7113 17.3973C18.4121 17.3973 18.1696 17.6398 18.1696 17.9389M19.2529 17.9389H18.1696M12.6029 23.8973H15.0696C18.4299 23.8973 20.1101 23.8973 21.3935 23.2433C22.5225 22.6681 23.4404 21.7502 24.0156 20.6212C24.6696 19.3377 24.6696 17.6576 24.6696 14.2973V11.8306C24.6696 8.47029 24.6696 6.79013 24.0156 5.50666C23.4404 4.37769 22.5225 3.4598 21.3935 2.88456C20.1101 2.2306 18.4299 2.2306 15.0696 2.2306H12.6029C9.24261 2.2306 7.56246 2.2306 6.27899 2.88456C5.15001 3.4598 4.23213 4.37769 3.65689 5.50666C3.00293 6.79013 3.00293 8.47029 3.00293 11.8306V14.2973C3.00293 17.6576 3.00293 19.3377 3.65689 20.6212C4.23213 21.7502 5.15001 22.6681 6.27899 23.2433C7.56246 23.8973 9.24261 23.8973 12.6029 23.8973Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g><defs><clipPath id="clip0_1139_45265"><rect fill="white" height="26" transform="translate(0.835938 0.0639343)" width="26"></rect></clipPath></defs></svg>
                    <div className="d-flex flex-column flex-1 w-100">
                        <input
                            className="form-control cstm-form-cntrl h-3.71rem border-gray-100 rounded-none shadow-none cursor-pointer"
                            placeholder="Travel Date"
                            type="date"
                            autoComplete="off"
                            value={travelDate}
                            onChange={handleTravelDateChange}
                            required
                        />
                    </div>
                </div>

                {/* Return Date */}
                <div className="d-flex flex-row align-items-center flex-grow-1 px-4 bg-atcst rounded-3xl shadow-drop-modal">
                    <svg fill="none" height="27" viewBox="0 0 27 27" width="27" class="text-[#2F384C] size-6"><g clip-path="url(#clip0_1139_45265)"><path d="M9.50293 1.14727V4.39727M18.1696 1.14727V4.39727M19.7946 8.7306H7.87793M9.50293 13.6056C9.50293 13.9048 9.26042 14.1473 8.96126 14.1473C8.66211 14.1473 8.4196 13.9048 8.4196 13.6056M9.50293 13.6056C9.50293 13.3064 9.26042 13.0639 8.96126 13.0639C8.66211 13.0639 8.4196 13.3064 8.4196 13.6056M9.50293 13.6056H8.4196M9.50293 17.9389C9.50293 18.2381 9.26042 18.4806 8.96126 18.4806C8.66211 18.4806 8.4196 18.2381 8.4196 17.9389M9.50293 17.9389C9.50293 17.6398 9.26042 17.3973 8.96126 17.3973C8.66211 17.3973 8.4196 17.6398 8.4196 17.9389M9.50293 17.9389H8.4196M14.3779 13.6056C14.3779 13.9048 14.1354 14.1473 13.8363 14.1473C13.5371 14.1473 13.2946 13.9048 13.2946 13.6056M14.3779 13.6056C14.3779 13.3064 14.1354 13.0639 13.8363 13.0639C13.5371 13.0639 13.2946 13.3064 13.2946 13.6056M14.3779 13.6056H13.2946M14.3779 17.9389C14.3779 18.2381 14.1354 18.4806 13.8363 18.4806C13.5371 18.4806 13.2946 18.2381 13.2946 17.9389M14.3779 17.9389C14.3779 17.6398 14.1354 17.3973 13.8363 17.3973C13.5371 17.3973 13.2946 17.6398 13.2946 17.9389M14.3779 17.9389H13.2946M19.2529 13.6056C19.2529 13.9048 19.0104 14.1473 18.7113 14.1473C18.4121 14.1473 18.1696 13.9048 18.1696 13.6056M19.2529 13.6056C19.2529 13.3064 19.0104 13.0639 18.7113 13.0639C18.4121 13.0639 18.1696 13.3064 18.1696 13.6056M19.2529 13.6056H18.1696M19.2529 17.9389C19.2529 18.2381 19.0104 18.4806 18.7113 18.4806C18.4121 18.4806 18.1696 18.2381 18.1696 17.9389M19.2529 17.9389C19.2529 17.6398 19.0104 17.3973 18.7113 17.3973C18.4121 17.3973 18.1696 17.6398 18.1696 17.9389M19.2529 17.9389H18.1696M12.6029 23.8973H15.0696C18.4299 23.8973 20.1101 23.8973 21.3935 23.2433C22.5225 22.6681 23.4404 21.7502 24.0156 20.6212C24.6696 19.3377 24.6696 17.6576 24.6696 14.2973V11.8306C24.6696 8.47029 24.6696 6.79013 24.0156 5.50666C23.4404 4.37769 22.5225 3.4598 21.3935 2.88456C20.1101 2.2306 18.4299 2.2306 15.0696 2.2306H12.6029C9.24261 2.2306 7.56246 2.2306 6.27899 2.88456C5.15001 3.4598 4.23213 4.37769 3.65689 5.50666C3.00293 6.79013 3.00293 8.47029 3.00293 11.8306V14.2973C3.00293 17.6576 3.00293 19.3377 3.65689 20.6212C4.23213 21.7502 5.15001 22.6681 6.27899 23.2433C7.56246 23.8973 9.24261 23.8973 12.6029 23.8973Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g><defs><clipPath id="clip0_1139_45265"><rect fill="white" height="26" transform="translate(0.835938 0.0639343)" width="26"></rect></clipPath></defs></svg>
                    <div className="d-flex flex-column flex-1 w-100">
                        <input
                            className="form-control cstm-form-cntrl h-3.71rem border-gray-100 rounded-none shadow-none cursor-pointer"
                            placeholder="Return Date"
                            type="date"
                            autoComplete="off"
                            value={returnDate}
                            onChange={handleReturnDateChange}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button and Message */}
            <div className="d-flex justify-content-end">
                <button type="submit" className="cus-btn" disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
                {/* <div id="message" className="alert-msg">
                    {message}
                </div> */}
            </div>
        </form>
    );
};

export default VisaWidget;


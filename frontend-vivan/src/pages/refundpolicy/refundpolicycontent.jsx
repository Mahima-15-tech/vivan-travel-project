import React, { useState } from 'react';
import '../privacy-policy/privacy-policy.css'


const PrivacyPolicyCon = () => {

    return (
        <section className="privacy-policy p-60">
            <div className="container">
                <div className="row">

                    {/* Main Content */}
                    <div className="col-xl-12 col-lg-12">
                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">We care about your privacy</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                Vivan Travels has no liability for any act, omission, or default, whether negligent or otherwise, of
                                airlines, car rental operators, ferry companies, hoteliers, tour operators, or any other supplier or third party.
                                We have no liability for any loss or damage occasioned by the negligence, act, or omission of any supplier or
                                other third party. We reserve the right to cancel or modify itineraries or bookings where circumstances require.
                                In circumstances where liability of Vivan Travels cannot be excluded, such liability is limited to the value of
                                the purchased travel arrangements. Vivan Travels reserves the right to decline any booking.
                            </p>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Important Information</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400 mb-24">
                                It is essential that you enter details of each traveler correctly and according to passport or other
                                identification. Some suppliers will deny carriage if the travelers’ name varies from your booking and may
                                cancel automatically if the traveler’s name is amended. Vivan Travels is not responsible for any loss or damage
                                arising from incorrect entry of travelers’ names nor for any inability to travel as a result of the carrier's policies.
                            </p>
                            <h6 className="light-black mb-8">General Terms</h6>
                            <ul className="mb-24">
                                <li className="dark-gray">
                                    The terms displayed on this Website apply generally to all the travel products and packages sold by Vivan Travels.
                                </li>
                                <li className="dark-gray">
                                    Airlines, hotels, and other travel suppliers have additional conditions that may apply and may not be displayed on this Website.
                                </li>
                                <li className="dark-gray">
                                    It is your responsibility to contact the relevant supplier directly to obtain all applicable terms and conditions before booking.
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Cancellation and Refund Policy</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400 mb-24">
                                Cancellation policies vary depending on the airline or service provider. In case of cancellation or amendments:
                            </p>
                            <ul className="mb-24">
                                <li className="dark-gray">Refund process time: 1 to 10 working days, depending on the bank, airline, and provider.</li>
                                <li className="dark-gray">Money credited to the Vivan Travels virtual wallet cannot be credited back to individual/agents' bank accounts.</li>
                            </ul>
                            <p className="dark-gray fw-400">
                                In no event shall Vivan Travels be liable for direct, indirect, punitive, incidental, or consequential damages
                                arising from the use of the website or related services. Any material downloaded or obtained through the site
                                is at your own discretion and risk.
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicyCon;

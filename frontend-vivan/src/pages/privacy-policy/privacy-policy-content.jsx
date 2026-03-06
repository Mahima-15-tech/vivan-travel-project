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
                            <h5 className="light-black mb-24">Privacy Policy</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                Vivan Travels is committed to protecting your privacy and ensuring that your personal information is
                                handled in a safe and responsible manner. This Privacy Policy explains how we collect, use, and disclose
                                your information when you use our website for booking flight tickets, applying for visas, or using our OTB
                                services.
                            </p>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Information Collection</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                We collect personal information such as your name, contact details, payment information, passport details,
                                and travel preferences when you use our services to book flight tickets, apply for visas, or purchase other
                                services. This information is essential for processing your bookings and applications efficiently.
                            </p>
                            <p className="dark-gray fw-400">
                                We may also collect non-personal information such as your IP address, browser type, and operating system
                                to improve your browsing experience and to analyze the use of our website.
                            </p>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Use of Information</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                The information we collect is used for the following purposes:
                            </p>
                            <ul className="mb-24">
                                <li className="dark-gray">To process your flight ticket bookings, visa applications, and OTB services.</li>
                                <li className="dark-gray">To communicate with you about your bookings and services.</li>
                                <li className="dark-gray">To send promotional offers, updates, or notifications about new services, with your consent.</li>
                                <li className="dark-gray">To improve the functionality and user experience of our website.</li>
                            </ul>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Data Security</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                We take reasonable precautions to protect your personal information from unauthorized access, alteration,
                                or destruction. We employ encryption technology and secure payment gateways to safeguard your financial details
                                during transactions. However, no method of transmission over the Internet or electronic storage is 100% secure,
                                and we cannot guarantee absolute security.
                            </p>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Sharing of Information</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                Vivan Travels may share your personal information with third-party service providers for the purpose of
                                processing your bookings, visa applications, or OTB services. These third parties are required to use your
                                information solely for the purpose of delivering the service and are obligated to maintain the confidentiality
                                of your personal data.
                            </p>
                            <p className="dark-gray fw-400">
                                We may also disclose your information as required by law or to comply with a legal process such as a court
                                order or government request.
                            </p>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Cookies and Tracking Technologies</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                Our website uses cookies and other tracking technologies to enhance your experience and to collect analytical
                                data. Cookies are small data files stored on your device that help us improve the performance of our site.
                                You can choose to disable cookies through your browser settings, but this may affect your ability to use certain
                                features of the site.
                            </p>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Your Rights</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                You have the right to access, update, or delete the personal information we hold about you. If you wish to
                                exercise these rights, please contact us through the provided communication channels. We will respond to your
                                request in a timely manner as required by law.
                            </p>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Changes to This Privacy Policy</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                Vivan Travels reserves the right to modify or update this Privacy Policy at any time. Any changes will be
                                posted on this page, and the "Effective Date" at the top will be updated accordingly. By continuing to use
                                our services, you agree to the updated policy.
                            </p>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Contact Us</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                If you have any questions or concerns regarding our Privacy Policy, or if you wish to exercise your rights
                                related to your personal data, please contact us at:
                            </p>
                            <p className="dark-gray fw-400">
                                Email: <a href="mailto:support@vivantravels.com">support@vivantravels.com</a><br />
                                {/* Phone: +91 123 456 7890<br /> */}
                                {/* Address: Vivan Travels, Jaipur, Rajasthan, India */}
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicyCon;

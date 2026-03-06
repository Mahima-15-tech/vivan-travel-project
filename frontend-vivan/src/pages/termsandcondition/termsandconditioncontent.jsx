import React, { useState } from 'react';
import '../privacy-policy/privacy-policy.css'

const TermsConditionCon = () => {

    return (
        <section className="privacy-policy p-60">
            <div className="container">
                <div className="row">

                    {/* Main Content */}
                    <div className="col-xl-12 col-lg-12">
                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Limitation of Use</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                This site limits the way you may use the Content. There are a number of proprietary logos, service marks,
                                and trademarks found on this site, whether owned or used by Vivan Travels or otherwise. By displaying them
                                on this site, Vivan Travels is not granting you any license to utilize those proprietary logos, service marks,
                                or trademarks. Any unauthorized use of the content may violate copyright laws, trademark laws, the laws of
                                privacy and publicity, and civil and criminal statutes.
                            </p>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Use of Content</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                You may download such copy/copies of the content to be used only by you for your personal use at home
                                unless the section of the site you are accessing states otherwise. If you download any content from this
                                site, you shall not remove any copyright, trademark notices, or other notices that go with it.
                            </p>
                            <h6 className="light-black mb-8">Restrictions</h6>
                            <ul className="mb-24">
                                <li className="dark-gray">
                                    Defame, abuse, harass, stalk, threaten, or otherwise violate the legal rights of others.
                                </li>
                                <li className="dark-gray">
                                    Publish or disseminate defamatory, infringing, obscene, or unlawful materials.
                                </li>
                                <li className="dark-gray">
                                    Upload or attach files containing software protected by intellectual property laws unless you own or
                                    control the rights or have received all necessary consents.
                                </li>
                                <li className="dark-gray">
                                    Upload files with viruses, corrupted data, or any harmful programs.
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Liability Disclaimer</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400 mb-24">
                                Vivan Travels assumes no liability or responsibility arising from communications containing defamatory,
                                erroneous, inaccurate, obscene, or offensive material. Vivan Travels may change, edit, or remove any user
                                material or conversations that violate our policies or are illegal.
                            </p>
                            <p className="dark-gray fw-400">
                                Any material submitted to this site may be adapted, broadcast, copied, disclosed, or used by Vivan Travels
                                worldwide, in any medium, forever. Vivan Travels reserves all rights regarding content ownership and usage.
                            </p>
                        </div>

                        <div className="bg-white p-24 light-shadow br-20 mb-24">
                            <h5 className="light-black mb-24">Dispute Resolution</h5>
                            <hr className="bg-light-gray w-50 mb-24" />
                            <p className="dark-gray fw-400">
                                If any dispute arises between you and Vivan Travels during your use of the site or thereafter, the dispute
                                shall be referred to arbitration in Mumbai under the Arbitration and Conciliation Act, 1996. The proceedings
                                will be in English, and the laws of the Republic of India will govern the terms and conditions.
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </section>
    );
};

export default TermsConditionCon;

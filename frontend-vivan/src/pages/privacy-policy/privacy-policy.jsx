import React, { useState } from 'react';
import TitleBanner from '../privacy-policy/title-ban'
import PrivacyPolicyContent from '../privacy-policy/privacy-policy-content'



const PrivacyPolicy = () => {
    return (
        <div>
            <TitleBanner />
            <PrivacyPolicyContent />
        </div>
    )
}

export default PrivacyPolicy
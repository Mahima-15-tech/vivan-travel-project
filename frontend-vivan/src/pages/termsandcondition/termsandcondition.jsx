import React, { useState } from 'react';
import TitleBannerTermsCondition from '../termsandcondition/title-ban-termsandcondition'
import TermsConditionContent from '../termsandcondition/termsandconditioncontent'



const TermsCondition = () => {
    return (
        <div>
            <TitleBannerTermsCondition />
            <TermsConditionContent />
        </div>
    )
}

export default TermsCondition
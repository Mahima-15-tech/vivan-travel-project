import React from 'react';
import TitleBanner from '../../../component/title-banner/title-banner';
import Flight from "../../../assets/images/plane-2.png";

const TitleBanners = () => {
    return (

        <TitleBanner
            title="OTB Apply"
            leftImage={Flight}
            rightImage={Flight}
        />
    );
};

export default TitleBanners;

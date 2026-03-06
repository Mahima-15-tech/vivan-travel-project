import React from 'react';
import TitleBanner from '../../../component/title-banner/title-banner';
import Flight from "../../../assets/images/plane-2.png";

const TitleBannrs = () => {
    return (

        <TitleBanner
            title="Visa Apply"
            leftImage={Flight}
            rightImage={Flight}
        />
    );
};

export default TitleBannrs;

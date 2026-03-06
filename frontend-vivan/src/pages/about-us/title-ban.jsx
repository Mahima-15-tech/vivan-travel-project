import React from 'react';
import TitleBanner from '../../component/title-banner/title-banner';
import flite from "../../assets/images/plane-2.png";

const App = () => {
    return (
        <TitleBanner
            title="About Us"
            leftImage={flite}
            rightImage={flite}
        />
    );
};

export default App;

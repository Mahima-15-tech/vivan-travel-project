import React from 'react';
import TitleBanner from '../../component/title-banner/title-banner';
import flight from "../../assets/images/plane-2.png";

const App = () => {
    return (

        <TitleBanner
            title="Cancellation & Refund Policy"
            leftImage={flight}
            rightImage={flight}
        />
    );
};

export default App;

import React from 'react';
import '../title-banner/title-banner.css'

const TitleBanner = ({ title, leftImage, rightImage }) => {
    return (
        <div className="title-banner">
            <div className="container">
                <div className="row">
                    <div className="banner-area v-2">
                        <img src={leftImage} alt="" className="left-image" />
                        <div className="content-box">
                            <h1 className="fw-700 lightest-black">
                                {title.split('\n').map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        <br className={index === 0 ? 'title-break' : ''} />
                                    </span>
                                ))}
                            </h1>
                        </div>
                        <img src={rightImage} alt="" className="right-image" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TitleBanner;

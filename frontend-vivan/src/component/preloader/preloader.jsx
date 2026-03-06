import React, { useState, useEffect } from 'react';
import '../preloader/preloader.css'

const Preloader = () => {
    // State to control the visibility of the preloader
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading behavior with useEffect (e.g., hide after 3 seconds)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false); // Hide the preloader after 3 seconds
        }, 3000);

        // Cleanup timer
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {isLoading && (
                <div id="preloader" style={{ display: 'block' }}>
                    <div className="loader">
                        <div className="plane">
                            <img
                                src="https://zupimages.net/up/19/34/4820.gif"
                                className="plane-img"
                                alt="Loading..."
                            />
                        </div>
                        <div className="earth-wrapper">
                            <div className="earth"></div>
                        </div>
                    </div>
                    {/* Uncomment if you want to use the Lottie animation */}
                    {/* <dotlottie-player 
              src="https://lottie.host/cd993b04-33dd-4600-a4b6-62897a52f071/6gZOhSlbtF.json" 
              background="#b5c5ff" 
              speed="1" 
              style={{ width: '300px', height: '300px' }} 
              loop 
              autoplay>
            </dotlottie-player> */}
                </div>
            )}
        </>
    );
};

export default Preloader;

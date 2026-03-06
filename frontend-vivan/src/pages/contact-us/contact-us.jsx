import React, { useState } from 'react';
import TitleBanner from '../contact-us/title-ban'
import ContactForm from '../contact-us/contact-form/contact-form'
import { ToastContainer, toast } from "react-toastify";


const contactus = () => {
    return (
        <div>
            <TitleBanner />
            
            <ContactForm />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}

export default contactus
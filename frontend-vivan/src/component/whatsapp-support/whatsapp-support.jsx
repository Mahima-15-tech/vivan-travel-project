import React from 'react';
import './whatsapp-support.css'

const WhatsappSupport = ({number}) => {
    const link="https://wa.me/"+number;
    return (
      <div className="whatsapp-support">
        <a
          href={link}
          className="whatsapp-link btn btn-success rounded-circle"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="whatsapp-icon fab fa-whatsapp fa-2x"></i>
        </a>
      </div>
    );
};

export default WhatsappSupport;

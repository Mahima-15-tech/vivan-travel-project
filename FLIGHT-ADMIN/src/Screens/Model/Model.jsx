// Modal.js
import React from "react";
import "../Model/Modal.css"; // Import the CSS for the modal

function Modal({ isOpen, onClose, imgSrc }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={imgSrc} alt="User" className="img-fluid" />
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default Modal;

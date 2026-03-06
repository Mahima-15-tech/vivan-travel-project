import React from 'react';
// import '../../pages/agent/wallet-history.css'

function Farerulepopup({ show, handleClose }) {
    return (
        <div className={`modal fade ${show ? 'show' : ''}`} tabindex="-1" id="tranxDetails" aria-modal="true" role="dialog" style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}>
                        <i className="fa fa-window-close"></i>
                    </button>
                    <div className="modal-body modal-body-md">
                        
                      
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Farerulepopup;

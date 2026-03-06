import React from 'react';
import '../wallet-history/wallet-history.css'

function TransactionDetailsModal({ show, handleClose }) {
    return (
        <div className={`modal fade ${show ? 'show' : ''}`} tabindex="-1" id="tranxDetails" aria-modal="true" role="dialog" style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}>
                        <i className="fa fa-window-close"></i>
                    </button>
                    <div className="modal-body modal-body-md">
                        <div className="nk-modal-head mb-3 mb-sm-5">
                            <h4 className="nk-modal-title title">
                                Transaction <small className="text-primary">#TNX67234</small>
                            </h4>
                        </div>
                        <div className="nk-tnx-details">
                            <div className="nk-block-between flex-wrap g-3">
                                <div className="nk-tnx-type">
                                    <div className="nk-tnx-type-icon bg-warning text-white">
                                        <i class="fa fa-arrow-up rotate-45"></i>
                                    </div>
                                    <div className="nk-tnx-type-text">
                                        <h5 className="title">+ 0.004560 BTC</h5>
                                        <span className="sub-text mt-n1">15 Oct, 2019 09:45 PM</span>
                                    </div>
                                </div>
                                <ul className="align-center flex-wrap gx-3">
                                    <li><span className="badge badge-sm bg-success">Completed</span></li>
                                </ul>
                            </div>
                            <div className="nk-modal-head mt-sm-5 mt-4 mb-4">
                                <h5 className="title">Transaction Info</h5>
                            </div>
                            <div className="row gy-3">
                                <div className="col-lg-6">
                                    <span className="sub-text">Order ID</span>
                                    <span className="caption-text">YWLX52JG73</span>
                                </div>
                                <div className="col-lg-6">
                                    <span className="sub-text">Reference ID</span>
                                    <span className="caption-text text-break">NIY9TB2JG73YWLXPYM2U8HR</span>
                                </div>
                                <div className="col-lg-6">
                                    <span className="sub-text">Transaction Fee</span>
                                    <span className="caption-text">0.000002 BTC</span>
                                </div>
                                <div className="col-lg-6">
                                    <span className="sub-text">Amount</span>
                                    <span className="caption-text">0.004560 BTC</span>
                                </div>
                            </div>
                            <div className="nk-modal-head mt-sm-5 mt-4 mb-4">
                                <h5 className="title">Transaction Details</h5>
                            </div>
                            <div className="row gy-3">
                                <div className="col-lg-6">
                                    <span className="sub-text">Transaction Type</span>
                                    <span className="caption-text">Deposit</span>
                                </div>
                                <div className="col-lg-6">
                                    <span className="sub-text">Payment Gateway</span>
                                    <span className="caption-text align-center">
                                        CoinPayments <span className="badge bg-primary ms-2 text-white">Online Gateway</span>
                                    </span>
                                </div>
                                <div className="col-lg-6">
                                    <span className="sub-text">Payment From</span>
                                    <span className="caption-text text-break">1xA058106537340385c87d264f93</span>
                                </div>
                                <div className="col-lg-6">
                                    <span className="sub-text">Payment To</span>
                                    <span className="caption-text text-break">1x0385c87d264A05810653734f93</span>
                                </div>
                                <div className="col-lg-12">
                                    <span className="sub-text">Transaction Hash</span>
                                    <span className="caption-text text-break">Tx156d3342d5c87d264f9359200xa058106537340385c87d264f93</span>
                                </div>
                                <div className="col-lg-12">
                                    <span className="sub-text">Details</span>
                                    <span className="caption-text">Deposit Fund for Investment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionDetailsModal;

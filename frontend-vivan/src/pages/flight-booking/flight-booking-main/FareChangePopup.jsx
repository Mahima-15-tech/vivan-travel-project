import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const FareChangePopup = ({ show, onClose, oldFare, newFare }) => {
  const handleOk = () => {
    onClose(true); // Proceed with new fare
  };

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Notification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Fare Changed</strong>, The fare you selected has changed.
          <br />
          <br />
          Old Fare <strong>Rs {oldFare}</strong> New Fare{" "}
          <strong>Rs {newFare}</strong>.
          <br />
          <br />
          Please press OK to proceed with the new fare OR press Cancel to search
          again for an alternate option.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={handleCancel}>
          CANCEL
        </Button>
        <Button variant="success" onClick={handleOk}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FareChangePopup;

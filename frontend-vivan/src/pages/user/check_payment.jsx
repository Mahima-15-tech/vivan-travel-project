import React, { useState } from "react";
import { toast } from "react-toastify";
import { post, get } from "../../API/apiHelper";

import { payment_check } from "../../API/endpoints";
// Reusable Payment Status Popup Component
function PaymentStatusPopup({ paymentId, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);

  const checkPaymentStatus = async (valueofid) => {
    if (!valueofid) return;

    try {
      const response = await get(`${payment_check}?txnid=${valueofid}`, true);
      const data = await response.json();

      if (data.status === false) {
        toast.error(
          "Payment is not completed yet. Please wait a few minutes and try again."
        );
      } else {
        const payment_res = data.data.response
          ? JSON.parse(data.data.response)
          : {};

        if (
          payment_res &&
          payment_res["status"] &&
          payment_res["status"].toLowerCase() === "success"
        ) {
          toast.success("Payment successful!");

          // setIsOpen(false);
          if (onSuccess) onSuccess(); // call parent callback
        } else {
          toast.error("Payment not successful yet.");
        }
      }
    } catch (error) {
      console.error("Error checking payment:", error);
      toast.error("Error checking payment status.");
    }
  };

  if (!paymentId) return null; // hide if no payment id

  return (
    <div style={{ display: "block" }}>
      <button
        type="button"
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        onClick={() => setIsOpen(true)}
      >
        Check Payment
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "400px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => checkPaymentStatus(paymentId)}
              style={{
                padding: "10px 20px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              Check Status
            </button>

            <button
              onClick={() => setIsOpen(false)}
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentStatusPopup;

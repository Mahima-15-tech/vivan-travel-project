// Pdf417Barcode.jsx
import React, { useEffect, useRef } from "react";
import bwipjs from "bwip-js";

const Pdf417Barcode = ({ value = "DefaultBarcodeValue" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      try {
        // Set resolution (internal canvas size)
        canvasRef.current.width = 800;
        canvasRef.current.height = 400;

        bwipjs.toCanvas(canvasRef.current, {
          bcid: "pdf417", // Barcode type
          text: value, // Data to encode
          scale: 8, // Scale factor (higher = bigger)
          height: 14, // Height of bars in mm
          includetext: false, // Optional: Show human-readable text
          textxalign: "center",
        });
      } catch (err) {
        console.error("Error generating barcode:", err);
      }
    }
  }, [value]);

  return (
    <div style={{ width: "100px" }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%", // Responsive display
        }}
      />
    </div>
  );
};

export default Pdf417Barcode;

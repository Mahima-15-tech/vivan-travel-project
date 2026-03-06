import React from "react";
import logo from "../../src/assets/loading.gif";

const CircularProgressBar = ({ value }) => {
  return (
    <center>
      <img src={logo} alt="logo" width={50} height={50} />
      {value || ""}
    </center>
  );
};

export default CircularProgressBar;

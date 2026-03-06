import React, { useEffect, useState } from "react";
import { IMAGE_BASE_URL, airline_code } from "../API/endpoints";
import { post } from "../API/apiHelper";
import logo from "../assets/images/logo.png";

const AirlineLogo = ({ airCode, type, airline = "", airlinelist }) => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch airlines when required
  const getAirlines = async () => {
    try {
      const response = await post(airline_code, {}, true);
      const res = await response.json();
      setAirlines(res?.data?.rows || []);
    } catch (error) {
      console.log("Error fetching airlines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type === 1) {
      getAirlines();
    } else if (airlinelist && airlinelist.length > 0) {
      setAirlines(airlinelist);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [type, airlinelist]);

  // 🔹 Wait until airlines loaded
  if (loading) {
    return (
      <img
        src={logo}
        alt="loading"
        style={{ height: "50px", width: "50px" }}
      />
    );
  }

  // 🔹 Match airline by code OR name
  const matchedAirline =
    airlines.find(
      (data) =>
        data.code &&
        airCode &&
        data.code.trim().toLowerCase() === airCode.trim().toLowerCase()
    ) ||
    airlines.find(
      (data) =>
        data.name &&
        airline &&
        data.name.trim().toLowerCase() === airline.trim().toLowerCase()
    );

  const logoPath = matchedAirline?.logo;

  // 🔹 If logo found → show airline logo
  if (logoPath) {
    return (
      <img
        src={`${IMAGE_BASE_URL}public/${logoPath}`}
        alt="airline logo"
        style={{ height: "50px", width: "50px", objectFit: "contain" }}
      />
    );
  }

  // 🔹 Fallback → default logo
  return (
    <img
      src={logo}
      alt="default logo"
      style={{ height: "50px", width: "50px", objectFit: "contain" }}
    />
  );
};

export default AirlineLogo;

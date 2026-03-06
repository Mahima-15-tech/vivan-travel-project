import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Applied_visas_list = ({ data, onUpdate }) => {
  const navigate = useNavigate();
  const handleViewClick = () => {
    const encodedData = btoa(data.id);
    navigate(`/Applied_visa_details/${encodedData}`);
  };

  const Profile = "";
  //  data.visa_applied_user.profile_photo ? `${IMAGE_BASE_URL}${data.visa_applied_user.profile_photo}` : Default;
  // Format date utility
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <tr>
      <td className="text-center">{data.id}</td>
      {/* <td className="text-center">
        <img
          src={Profile}
          className="avatar rounded-circle"
          alt=""
          width="40"
        />{" "}
        <br />
        {data.visa_applied_user.name || "-"}
      </td> */}

      <td className="text-center">
        {data.applied_visa_list.map((item) => (
          <div key={item.id}>
            {item.name || ""} {item.last_name || ""}
          </div>
        ))}
      </td>
      <td className="text-center">{data?.appliedvisa?.going_to}</td>

      <td className="text-center">
        {data?.visa_applied_user?.type === "2"
          ? data?.visa_applied_user?.agents?.company_name ?? ""
          : data?.visa_applied_user?.name ?? ""}{" "}
        ({data?.visa_applied_user?.type === "2" ? "Agent" : "User"})<br />
        <a href={`tel:${data.visa_applied_user.mobile_no || "-"}`}>
          {data.visa_applied_user.mobile_no || "-"}
        </a>
      </td>

      <td className="text-center">{data.refrense_no || "N/A"}</td>
      <td className="text-center">
        {data.applied_visa_list.length == 1 ? "Individual" : "Group"}
      </td>
      <td className="text-center">
        {data.applied_visa_list.map((item) => (
          <div key={`internal_ID_${item.id}`}>{item.internal_ID}</div>
        ))}
      </td>
      <td className="text-center">
        {data.applied_visa_list.map((item) => (
          <div key={`passport_no_${item.id}`}>{item.passport_no}</div>
        ))}
      </td>
      <td className="text-center">
        {data.applied_visa_list.map((item) => (
          <div key={`pen_card_no_${item.id}`}>
            {item.pen_card_no && item.pen_card_no.trim() !== ""
              ? item.pen_card_no
              : "N/A"}
          </div>
        ))}
      </td>
      <td className="text-center">{data.is_insurance || "No"}</td>
      <td className="text-center">
        {" "}
        {data.applied_visa_list.map((item) => (
          <div key={`amount_${item.id}`}>
            {" "}
            {item.amount && item.amount.trim() !== ""
              ? `₹${item.amount}`
              : "N/A"}
          </div>
        ))}
      </td>
      <td className="text-center">
        {data.applied_visa_list.map((visa_user) => (
          <span
            style={{
              color:
                visa_user.status === "In Process"
                  ? "orange"
                  : visa_user.status === "Additional Document Required"
                    ? "red"
                    : visa_user.status === "On Hold"
                      ? "red"
                      : visa_user.status === "Rejected"
                        ? "red"
                        : "green",
            }}
          >
            <b className="onelinetext">
              {visa_user.status}
              <br />
            </b>
          </span>
        ))}
      </td>

      <td className="text-center">{formatDate(data.createdAt)}</td>
      <td className="text-center">
        <div className="d-flex justify-content-center gap-2">
          <button
            onClick={handleViewClick}
            className="btn btn-outline-info btn-sm square-btn delete"
          >
            <i className="tio-invisible"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Applied_visas_list;

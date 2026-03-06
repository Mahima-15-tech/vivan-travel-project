import { API_BASE_URL } from "./endpoints";

function getAuthToken() {
  const userDataFromSession = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDataFromSession);

  if (userData && userData !== "null") {
    return userData.token;
  } else {
    return null;
  }
}
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatDatetime = (dateString) => {
  if (!dateString) return "Invalid Date";
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0"); // Day
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear(); // Year
  const hours = String(date.getHours()).padStart(2, "0"); // 24-hour format
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} ${hours}:${minutes}`; // Format: DD-MM-YYYY
};

export const formatDate = (dateString) => {
  if (!dateString) return "Invalid Date";
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0"); // Day
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear(); // Year
  return `${day} ${month} ${year}`;
};

export const formatTime = (dateString) => {
  if (!dateString) return "Invalid Time";
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`; // Format: HH:mm:ss
};

export async function get(endpoint, isauth = null, BASE_URL = null) {
  const url = (BASE_URL || API_BASE_URL) + endpoint;
  const token = getAuthToken();

  if (isauth && !token) {
    throw new Error("Authorization required, but no valid token found.");
  }

  const headers = {
    authorization: isauth ? `Bearer ${token}` : "",
  };

  const options = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(url, options);
  if (response.status === 404) {
    throw new Error("Not Found: Resource Not Found");
  } else {
    return response;
  }
}

export async function post(endpoint, data, isauth = null, BASE_URL = null) {
  if (endpoint == "comman/save_api_logs") {
    return "";
  }
  const url = (BASE_URL || API_BASE_URL) + endpoint;
  const token = getAuthToken();

  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const headers = {
    authorization: `Bearer ${token}`,
  };

  const options = {
    method: "POST",
    body: formData,
    headers: headers,
  };

  const response = await fetch(url, options);
  if (response.status === 404) {
    throw new Error("Not Found: Resource Not Found");
  } else {
    return response;
  }
}

export async function put(endpoint, data, isauth = null, BASE_URL = null) {
  const url = (BASE_URL || API_BASE_URL) + endpoint;
  const token = getAuthToken();

  if (isauth && !token) {
    throw new Error("Authorization required, but no valid token found.");
  }

  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const headers = {
    authorization: isauth ? `Bearer ${token}` : "",
  };
  const options = {
    method: "PUT",
    body: formData,
    headers: headers,
  };

  const response = await fetch(url, options);
  if (response.status === 404) {
    throw new Error("Not Found: Resource Not Found");
  } else {
    return response;
  }
}

export async function del(endpoint, data, isauth = null, BASE_URL = null) {
  const url = (BASE_URL || API_BASE_URL) + endpoint;
  const token = getAuthToken();

  if (isauth && !token) {
    throw new Error("Authorization required, but no valid token found.");
  }

  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const headers = {
    authorization: isauth ? `Bearer ${token}` : "",
  };
  const options = {
    method: "DELETE",
    body: formData,
    headers: headers,
  };

  const response = await fetch(url, options);
  if (response.status === 404) {
    throw new Error("Not Found: Resource Not Found");
  } else {
    return response;
  }
}

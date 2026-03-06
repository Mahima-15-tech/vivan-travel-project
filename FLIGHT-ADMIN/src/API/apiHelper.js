import { API_BASE_URL } from "./endpoints";

// Helper function to get the authorization token
function getAuthToken() {
  const authtoken = sessionStorage.getItem("authtoken");
  if (authtoken && authtoken !== "null") {
    return JSON.parse(authtoken).token;
  }
  return null;
}

// Function to make GET requests
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

// Function to make POST requests
export async function post(endpoint, data, isauth = null, BASE_URL = null) {
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

// Function to make PUT requests
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

// Function to make DELETE requests
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

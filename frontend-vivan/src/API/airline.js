import { API_BASE_URL } from "./endpoints";

function getAuthToken() {
  const userDataFromSession = sessionStorage.getItem('userData');
  const userData = JSON.parse(userDataFromSession);

  if (userData && userData !== "null") {
    return userData.token;
  } else {
    return null;
  }
}

export async function get(endpoint, isauth = null, BASE_URL = null) {
  const url = (BASE_URL || API_BASE_URL) + endpoint;
  const token = getAuthToken();

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

export async function post(endpoint, data, api_url) {
  // const token = getAuthToken();
  const url = API_BASE_URL + endpoint;

  const formData = new FormData();
  formData.append('data', data);
  formData.append('url', api_url);

  const token = getAuthToken();

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

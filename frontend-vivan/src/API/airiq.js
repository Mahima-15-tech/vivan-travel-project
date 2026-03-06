import { API_BASE_URL, AIR_IQ } from "./endpoints";

function getAuthToken() {
    const userDataFromSession = sessionStorage.getItem('AiriqData');
    const userData = JSON.parse(userDataFromSession);

    if (userData && userData !== "null") {
        return userData.token;
    } else {
        return null;
    }
}

export async function post(endpoint, payload ) {
    const url = AIR_IQ + endpoint;
    const token = getAuthToken();

    const headers = {
        "Content-Type": "application/json",
        'api-key': 'NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OlFRYjhLVjNFMW9UV05RY1NWL0Vtcm9UYXFKTSs5dkZvaHo0RzM4WWhwTDhsamNqR3pPN1dJSHhVQ2pCSzNRcW0=',
        authorization: token,
    };

    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "API call failed");
    }

    return response.json();
}

(async () => {
    const payload = {
        Username: "9555202202",
        Password: "9800830000@testapi",
    };

    try {
        const api_url = AIR_IQ + "/login";
        const headers = {
            'api-key': 'NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OlFRYjhLVjNFMW9UV05RY1NWL0Vtcm9UYXFKTSs5dkZvaHo0RzM4WWhwTDhsamNqR3pPN1dJSHhVQ2pCSzNRcW0=',
        };
        const options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
        };
        const tokenResponse = await fetch(api_url, options);
        sessionStorage.setItem("AiriqData", JSON.stringify(tokenResponse));
    } catch (error) {
        console.error("Error:", error.message);
    }
})();

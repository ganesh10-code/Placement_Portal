import { API_URL } from "./API_path";

export const fetchWithAuth = async (url, logoutHandler, options = {}) => {
  let token = localStorage.getItem("loginToken");

  if (!options.headers) {
    options.headers = {};
  }

  options.headers["Content-Type"] = "application/json";
  options.headers["Authorization"] = `Bearer ${token}`;

  let response = await fetch(`${API_URL}${url}`, options);
  let data = await response.json();

  if (response.status === 401 && data.message === "Token Expired") {
    console.log("🔄 Token expired, attempting refresh...");
    const refreshResponse = await fetch(`${API_URL}/auth/refresh_token`, {
      method: "POST",
      credentials: "include",
    });

    const refreshData = await refreshResponse.json();

    if (refreshResponse.ok && refreshData.token) {
      console.log("New login token received, retrying request...");
      localStorage.setItem("loginToken", refreshData.token);
      options.headers["Authorization"] = `Bearer ${refreshData.token}`;
      // Retry the original request with the new token
      response = await fetch(`${API_URL}${url}`, options);
      data = await response.json();
    } else {
      // Refresh token is expired -> logout the user
      console.error("❌Refresh token expired. Logging out...");
      logoutHandler();
    }
  }
  return { response, data };
};

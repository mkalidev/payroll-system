import axios from "axios";
import { getCookie } from "../lib/utils";

const apiURL = import.meta.env.VITE_API_URL;

export async function inviteAdmin(body, id) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const response = await axios.post(
      `${apiURL}workspace/${id}/admins/invite`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while inviting admin", error);
    throw new Error(
      error.response?.data?.message || "An error occurred while inviting admin"
    );
  }
}

export async function acceptAdmin(body) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const response = await axios.post(
      `${apiURL}workspace/admins/accept`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while accepting admin invite", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while accepting admin invite"
    );
  }
}

export async function removeAdmin(workspaceId, adminId) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const response = await axios.delete(
      `${apiURL}workspace/${workspaceId}/admins/${adminId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while deleting admin", error);
    throw new Error(
      error.response?.data?.message || "An error occurred while deleting admin"
    );
  }
}

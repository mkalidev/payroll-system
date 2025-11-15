import axios from "axios";
import { getCookie } from "../lib/utils";

const apiURL = import.meta.env.VITE_API_URL;

export async function getWorkspace() {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const { data } = await axios.get(`${apiURL}workspace/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during while fetching workspace data", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching workspace data"
    );
  }
}

export async function getSingleWorkspace(slug) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const { data } = await axios.get(`${apiURL}workspace/slug/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during while fetching workspace data", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching workspace data"
    );
  }
}

export async function createWorkspace(body) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const response = await axios.post(`${apiURL}workspace/create`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during while creating workspace", error);
    throw new Error(
      error.response?.data?.error ||
        "An error occurred while creating workspace"
    );
  }
}

export async function deleteWorkspace(workspaceId) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const response = await axios.delete(`${apiURL}workspace/${workspaceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during while deleting workspace", error);
    throw new Error(
      error.response?.data?.error ||
        "An error occurred while deleting workspace"
    );
  }
}

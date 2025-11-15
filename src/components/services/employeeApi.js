import axios from "axios";
import { getCookie } from "../lib/utils";

const apiURL = import.meta.env.VITE_API_URL;

export async function createEmployee(body) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const response = await axios.post(`${apiURL}employees/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during while adding an employee", error);
    throw new Error(
      error.response?.data?.error ||
        "An error occurred while adding the employee."
    );
  }
}
export async function updateEmployee(body, id) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const response = await axios.put(`${apiURL}employees/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during while adding an employee", error);
    throw new Error(
      error.response?.data?.error ||
        "An error occurred while adding the employee."
    );
  }
}

export async function deleteEmployee(employeeId) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const response = await axios.delete(`${apiURL}employees/${employeeId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during while deleting an employee", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while deleting the employee."
    );
  }
}

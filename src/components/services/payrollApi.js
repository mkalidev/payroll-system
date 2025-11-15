import axios from "axios";
import { getCookie } from "../lib/utils";

const apiURL = import.meta.env.VITE_API_URL;

export async function getPayroll(workspaceId) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const { data } = await axios.get(`${apiURL}payroll/${workspaceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during while fetching payroll data", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching payroll data"
    );
  }
}

export async function getAllPayroll() {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const { data } = await axios.get(`${apiURL}payroll/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during while fetching payroll data", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching payroll data"
    );
  }
}

// export async function getSingleWorkspace(slug) {
//   try {
//     // Get token from cookies
//     const token = getCookie("token"); // or whatever your cookie name is

//     const { data } = await axios.get(`${apiURL}workspace/slug/${slug}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return data;
//   } catch (error) {
//     console.error("Error during while fetching user data", error);
//     throw new Error(
//       error.response?.data?.message ||
//         "An error occurred while fetching user data"
//     );
//   }
// }

export async function createPayroll(body) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const response = await axios.post(`${apiURL}payroll/create`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during while creating payroll", error);
    throw new Error(
      error.response?.data?.error || "An error occurred while creating payroll"
    );
  }
}

export async function getPayrollByTx(txHash) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const { data } = await axios.get(`${apiURL}payroll/tx/${txHash}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error while fetching payroll by transaction hash", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching payroll data"
    );
  }
}

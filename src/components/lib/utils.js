// Helper function to get cookie value
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// utils/truncate.js
export const truncate = (text = "", maxLength = 50) => {
  const ellipsis = "...";

  if (typeof text !== "string") return "";
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, maxLength);
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
};

// Utility function to truncate Ethereum addresses
export const truncateAddress = (address, startChars = 6, endChars = 4) => {
  if (!address || typeof address !== "string") return "";

  // Check if it's a valid Ethereum address (42 characters starting with 0x)
  if (address.length !== 42 || !address.startsWith("0x")) {
    return address; // Return as-is if not a valid Ethereum address
  }

  if (address.length <= startChars + endChars) {
    return address; // Return as-is if address is too short to truncate
  }

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Utility function to truncate transaction hashes
export const truncateTxHash = (hash, startChars = 10, endChars = 8) => {
  if (!hash || typeof hash !== "string") return "";

  // Check if it's a valid transaction hash (66 characters starting with 0x)
  if (hash.length !== 66 || !hash.startsWith("0x")) {
    return hash; // Return as-is if not a valid transaction hash
  }

  if (hash.length <= startChars + endChars) {
    return hash; // Return as-is if hash is too short to truncate
  }

  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
};

// Utility function to format numbers with commas
export const formatNumberWithCommas = (number) => {
  if (typeof number !== "number") return "";
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// utility function tp export employees to CSV
export const exportEmployeesToCSV = (
  employees,
  workspaceName = "Workspace"
) => {
  if (!employees || employees.length === 0) {
    alert("No employees to export");
    return;
  }

  // Define CSV headers
  const headers = [
    "Employee ID",
    "Name",
    "Email",
    "Role",
    "Employment Type",
    "Wallet Address",
    "Salary",
    "Employement Date",
  ];

  // Convert employees data to CSV format
  const csvData = employees.map((emp) => [
    emp.id || "",
    emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
    emp.email || "",
    emp.role || "",
    emp.employmentType || "",
    emp.address || "",
    emp.salary || 0,
    emp.employmentDate || emp.createdAt || "",
  ]);

  // Combine headers and data
  const csvContent = [headers, ...csvData]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${workspaceName}_employees_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// utility function to convert USD salary to USDC BigNumber (6 decimals)
export const convertSalaryToUSDC = (salaryUSD) => {
  // USDC has 6 decimals, so multiply by 10^6
  const usdcAmount = Math.floor(salaryUSD * 1000000);
  return BigInt(usdcAmount);
};

// utility function to create payment array for smart contract
export const createPaymentArray = (selectedEmployees) => {
  return selectedEmployees.map((employee) => ({
    recipient: employee.address,
    amount: convertSalaryToUSDC(employee.salary || 0),
  }));
};

// utility function to convert tax amount to USDC BigNumber
export const convertTaxToUSDC = (taxAmount) => {
  const usdcTaxAmount = Math.floor(taxAmount * 1000000);
  return BigInt(usdcTaxAmount);
};

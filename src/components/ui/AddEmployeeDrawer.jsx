import React, { useRef, useState } from "react";
import { InfoIcon, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCreateEmployee } from "../hooks/useEmployee";
import Papa from "papaparse";

const AddEmployeeDrawer = ({ setIsOpen, workspaceId }) => {
  const { register, handleSubmit, reset } = useForm();
  const { createEmployeeFn, isPending: isCreatingEmployee } =
    useCreateEmployee();

  // Tab state
  const [tab, setTab] = useState("single"); // 'single' or 'multiple'

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedEmployees, setParsedEmployees] = useState([]);
  const [parseError, setParseError] = useState("");
  const fileInputRef = useRef();

  // Handle file upload and parse CSV
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setParseError("");
    setParsedEmployees([]);
    if (file) {
      setUploadedFile(file);
      if (file.name.endsWith(".csv")) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length) {
              setParseError(
                "Error parsing CSV file. Please check your file format."
              );
              return;
            }
            // Add workspaceId to each employee
            const employees = results.data.map((emp) => ({
              ...emp,
              workspaceId,
            }));
            setParsedEmployees(employees);
          },
          error: () => setParseError("Failed to parse CSV file."),
        });
      } else {
        setParseError("Only CSV files are supported at the moment.");
      }
    }
  };

  // Submit handler for single employee
  const onSubmitSingle = (data) => {
    const updatedData = {
      ...data,
      workspaceId: workspaceId,
    };
    createEmployeeFn(updatedData, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
      },
    });
  };

  // Submit handler for multiple employees
  const onSubmitMultiple = (e) => {
    e.preventDefault();
    if (parsedEmployees.length > 0) {
      parsedEmployees.forEach((employee) => {
        createEmployeeFn(employee, {
          onSuccess: () => {
            setIsOpen(false);
            setUploadedFile(null);
            setParsedEmployees([]);
            setParseError("");
            reset();
          },
        });
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen">
      {/* Backdrop */}
      <div
        className="flex-1 bg-c-bg/20 backdrop-blur-xs bg-opacity-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="w-full max-w-md bg-white h-screen overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Add new employee
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-6">
          <button
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              tab === "single"
                ? "bg-c-color text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("single")}
          >
            Add Single Employee
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              tab === "multiple"
                ? "bg-c-color text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("multiple")}
          >
            Add Multiple Employees
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Multiple Employees Tab */}
          {tab === "multiple" && (
            <form onSubmit={onSubmitMultiple}>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    Bulk upload employees
                  </span>
                  <a
                    href="/employee-template.csv"
                    download
                    className="text-c-color text-sm font-medium hover:underline"
                  >
                    Download template
                  </a>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Upload a CSV file with the following columns: <br />
                  <span className="font-mono text-xs text-gray-700">
                    name, email, role, employmentDate, salary, address,
                    employmentType
                  </span>
                </p>
                <div className="flex flex-col items-start gap-3">
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-c-color file:text-white hover:file:bg-c-bg"
                  />
                </div>
                {parseError && (
                  <p className="text-xs text-red-600 mt-2">{parseError}</p>
                )}
                {parsedEmployees.length > 0 && (
                  <div className="flex gap-2 items-center mt-2">
                    <InfoIcon className="w-4" />
                    <p className="text-xs">
                      {parsedEmployees.length} employees detected. Submitting
                      will add all.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-4 px-6 bg-c-color text-white cursor-pointer rounded-lg text-sm font-medium hover:bg-c-bg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={parsedEmployees.length === 0 || isCreatingEmployee}
                >
                  {isCreatingEmployee ? "Adding..." : "Add Employees"}
                </button>
              </div>
            </form>
          )}

          {/* Single Employee Tab */}
          {tab === "single" && (
            <form onSubmit={handleSubmit(onSubmitSingle)}>
              <div className="space-y-4">
                <div div className="space-y-6 pl-0">
                  <div className="space-y-3">
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700 block">
                        Employee name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter employee name"
                        {...register("name", { required: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700 block">
                        Employee email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter employee email"
                        {...register("email", { required: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700 block">
                        Employee role
                      </label>
                      <input
                        type="text"
                        placeholder="Enter employee role"
                        {...register("role", { required: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700 block">
                        Employment date
                      </label>
                      <input
                        type="date"
                        placeholder="Enter employee salary (USD)"
                        {...register("employmentDate", { required: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700 block">
                        Salary (Monthly)
                      </label>
                      <input
                        type="number"
                        placeholder="Enter employee salary (USD)"
                        {...register("salary", { required: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700 block">
                        Employee address
                      </label>
                      <input
                        type="text"
                        placeholder="Enter employee address"
                        {...register("address", { required: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700 block">
                        Employment type
                      </label>
                      <select
                        defaultValue={""}
                        {...register("employmentType", { required: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                      >
                        <option value="" disabled>
                          Select employment type
                        </option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="intern">Internship</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 py-4 px-6 bg-c-color text-white cursor-pointer rounded-lg text-sm font-medium hover:bg-c-bg transition-colors"
                  disabled={isCreatingEmployee}
                >
                  {isCreatingEmployee ? "Adding..." : "Add Employee"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeDrawer;

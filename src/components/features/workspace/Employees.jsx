import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleWorkspace } from "../../hooks/useWorkspace";
import EmployeeTable from "./EmployeeTable";
import AddEmployeeDrawer from "../../ui/AddEmployeeDrawer";
import { exportEmployeesToCSV } from "../../lib/utils";

export default function Employees() {
  const [isOpen, setIsOpen] = useState(false);
  const { slug } = useParams();
  const { singleWorkspace, isLoadingSingleWorkspace } =
    useGetSingleWorkspace(slug);
  const employees = singleWorkspace?.employees || [];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
        <h1 className="text-xl font-bold text-gray-800">Employee</h1>
        <div className="flex items-center gap-3">
          <button
            className="bg-c-color text-white px-6 py-2.5 text-sm rounded-lg cursor-pointer hover:bg-c-bg transition-colors duration-200"
            onClick={() => setIsOpen(true)}
          >
            Add New Employee
          </button>
          <button
            className="bg-c-bg text-white px-6 py-2.5 text-sm rounded-lg cursor-pointer hover:bg-c-color transition-colors duration-200"
            disabled={employees.length === 0}
            onClick={() =>
              exportEmployeesToCSV(employees, singleWorkspace?.name)
            }
          >
            Export to CSV
          </button>
        </div>
      </div>
      <div className="w-full">
        {isLoadingSingleWorkspace ? (
          <div className="w-full h-full min-h-[70dvh] flex flex-col gap-3 items-center justify-center">
            <img src="/loading.svg" alt="" className="w-30" />
            <p className="text-gray-500">Loading workspace...</p>
          </div>
        ) : (
          <>
            {singleWorkspace?.employees?.length > 0 ? (
              <EmployeeTable employees={singleWorkspace?.employees} />
            ) : (
              <div className="w-full min-h-[320px]  bg-white rounded-lg flex flex-col items-center justify-center gap-2 p-6">
                <img src="/empty.svg" alt="No admins" className="w-20" />
                <p className="text-gray-500">No employee found.</p>
                <p className="text-gray-400 text-center text-sm">
                  You can add employees to your workspace to manage payroll.
                </p>
                <span className="text-c-color text-sm font-semibold">
                  Click on "Add New Employee" to get started.
                </span>
              </div>
            )}
          </>
        )}
      </div>
      {isOpen && (
        <AddEmployeeDrawer
          setIsOpen={setIsOpen}
          workspaceId={singleWorkspace?.id}
        />
      )}
    </div>
  );
}

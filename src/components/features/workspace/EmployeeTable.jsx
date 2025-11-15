import React, { useState } from "react";
import { Search, Filter, MoreVertical, Edit, Trash2 } from "lucide-react";
import moment from "moment/moment";
import { formatNumberWithCommas } from "../../lib/utils";
import { useDeleteEmployee } from "../../hooks/useEmployee";
import UpdateEmployeeDrawer from "../../ui/UpdateEmployeeDrawar";

export default function EmployeeTable({ employees }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState("all");

  // console.log("Employees:", employees);
  const { deleteEmployeeFn, isPending } = useDeleteEmployee();

  const handleEditClick = (employeeId) => {
    setSelectedEmployee(employeeId);
    setIsOpen(true);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployeeFn(employeeId);
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const types = ["all", "contract", "full-time", "intern", "part-time"];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" ||
      employee?.employmentType === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <>
      <div className="mx-auto space-y-6">
        {/* Search and Filter Bar */}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize appearance-none bg-white min-w-[150px]"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              {types.map((type) => (
                <option key={type} value={type} className="!capitalize">
                  {type === "all" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Wallet Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Salary (Monthly)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-400">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700 capitalize">
                        {employee?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700">
                        {employee?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700 capitalize">
                        {employee?.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700 capitalize">
                        {employee?.employmentType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700  capitalize">
                        {employee?.address || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700">
                        ${formatNumberWithCommas(employee?.salary)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {moment(employee?.employmentDate).format("LL")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                          onClick={() => handleEditClick(employee.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(employee.id)}
                          disabled={isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {/* <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center flex flex-col items-center w-full justify-center gap-1 py-12">
              <img src="/empty.svg" alt="" className="w-20" />
              <div className="text-gray-500 text-lg">No employees found</div>
              <div className="text-gray-400">
                Try adjusting your search or filter criteria
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
      </div>
      {isOpen && (
        <UpdateEmployeeDrawer
          setIsOpen={setIsOpen}
          employeeId={selectedEmployee}
        />
      )}
    </>
  );
}

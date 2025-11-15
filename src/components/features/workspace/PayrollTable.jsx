import { Search } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatNumberWithCommas } from "../../lib/utils";
import moment from "moment";

export default function PayrollTable({ payrolls }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { slug } = useParams();

  const filteredPayroll = payrolls.filter((payroll) => {
    const matchesSearch =
      payroll.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.chain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.currency?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search payroll..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Chain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Currency
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Gross Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Net Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Date (Month)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  TX Hash
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPayroll.map((payroll, index) => (
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
                      {payroll?.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700 capitalize">
                      {payroll?.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700 capitalize">
                      {payroll?.chain}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700 capitalize">
                      {payroll?.currency}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700 capitalize">
                      ${formatNumberWithCommas(payroll?.totalSalary)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700 capitalize">
                      ${formatNumberWithCommas(payroll?.tax)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700  capitalize">
                      {payroll?.employeeCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="text-sm font-medium text-gray-700">
                      {moment(payroll?.createdAt).format("LL")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium text-gray-700 capitalize px-3 py-1 rounded-lg ${
                        payroll?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : payroll?.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payroll?.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700 truncate w-40">
                      {payroll?.tx}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        navigate(
                          `/workspace/${slug}/payroll/invoice?tx=${payroll?.tx}`
                        )
                      }
                      className="text-sm bg-c-color rounded-lg px-4 py-2.5 font-medium text-white cursor-pointer hover:bg-c-bg transition-colors duration-200"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayroll.length === 0 && (
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
        Showing {filteredPayroll.length} of {payrolls?.length} payrolls
      </div>
    </div>
  );
}

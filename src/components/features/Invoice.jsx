import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPayrollByTx } from "../services/payrollApi";
import Spinner from "../ui/Spinner";

export default function Invoice() {
  const [searchParams] = useSearchParams();
  const txHash = searchParams.get("tx");

  const { data: payroll, isLoading: loading } = useQuery({
    queryKey: ["payroll", "invoice", txHash],
    queryFn: () => getPayrollByTx(txHash),
    enabled: !!txHash,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-[80dvh] bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!payroll) {
    return (
      <div className="min-h-[80dvh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <img
            src="/error.svg"
            alt="Error"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Invoice Not Found
          </h2>
          <p className="text-gray-500">
            The payroll invoice you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80dvh] bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Invoice Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
              <p className="text-gray-500">Payroll Transaction</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Invoice Date</div>
              <div className="font-semibold capitalize text-gray-900">
                {formatDate(payroll?.data?.createdAt)}
              </div>
            </div>
          </div>

          {/* Company and Transaction Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Workspace Details
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-500 text-sm">Workspace:</span>
                  <div className="font-medium capitalize text-gray-900">
                    {payroll?.data?.title || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Chain:</span>
                  <div className="font-medium capitalize text-gray-900">
                    {payroll?.data?.chain || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Currency:</span>
                  <div className="font-medium capitalize text-gray-900">
                    {payroll?.data?.currency || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Transaction Details
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-500 text-sm">
                    Transaction Hash:
                  </span>
                  <div className="font-mono text-sm text-gray-900 break-all">
                    {payroll?.data?.tx || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Status:</span>
                  <div className="font-medium text-gray-900">
                    <span
                      className={`inline-flex items-center capitalize px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payroll?.data?.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : payroll?.data?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payroll?.data?.status || "Unknown"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">
                    Total Employees:
                  </span>
                  <div className="font-medium text-gray-900">
                    {payroll?.data?.employeeCount || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Details */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Employee Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Employee
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Wallet Address
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    Salary
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    Tax
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    Net Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {payroll.employees?.map((employee, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {employee.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.email || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-sm text-gray-900">
                        {formatAddress(employee.walletAddress)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      {formatCurrency(employee.salary)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      {formatCurrency(employee.tax)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      {formatCurrency(employee.salary - employee.tax)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex justify-end">
            <div className="w-80">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Salary:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(payroll?.data?.totalSalary)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Tax:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(payroll?.data?.tax)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total Amount:</span>
                    <span className="text-gray-900">
                      {formatCurrency(
                        payroll?.data?.totalSalary + payroll?.data?.tax
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

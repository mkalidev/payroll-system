import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleWorkspace } from "../../hooks/useWorkspace";
import { formatNumberWithCommas } from "../../lib/utils";
import { IoPeopleOutline, IoWalletOutline } from "react-icons/io5";
import { useGetPayroll } from "../../hooks/usePayroll";
import Spinner from "../../ui/Spinner";
import { ChevronDown } from "lucide-react";
import MonthlyPayrollChartApex from "../MonthlyPayrollChartApex";
import MonthlyPayrollColumnChart from "../MonthlyPayrollColumnChart";

export default function Overview() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);

  const { slug } = useParams();
  const { singleWorkspace } = useGetSingleWorkspace(slug);
  const { payrolls, isLoadingPayroll } = useGetPayroll(singleWorkspace?.id);

  const getPayrollArray = () => (Array.isArray(payrolls) ? payrolls : []);

  // Get unique months from payrolls
  const getAvailableMonths = () => {
    const payrollArray = getPayrollArray();
    const monthsMap = new Map();

    payrollArray.forEach((payroll) => {
      if (payroll?.createdAt || payroll?.date || payroll?.month) {
        // Try different date fields
        const dateStr = payroll?.createdAt || payroll?.date || payroll?.month;
        const date = new Date(dateStr);

        if (!isNaN(date.getTime())) {
          const monthYear = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          const monthName = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          });

          // Only add if this month-year combination doesn't exist
          if (!monthsMap.has(monthYear)) {
            monthsMap.set(monthYear, {
              value: monthYear,
              label: monthName,
              date,
            });
          }
        }
      }
    });

    // Convert to array and sort by date (newest first)
    return Array.from(monthsMap.values()).sort((a, b) => b.date - a.date);
  };

  // Get monthly statistics
  const getMonthlyStats = () => {
    const availableMonths = getAvailableMonths();
    const payrollArray = getPayrollArray();

    const stats = {};

    // Calculate stats for each month
    availableMonths.forEach((month) => {
      const monthPayrolls = payrollArray.filter((payroll) => {
        const dateStr = payroll?.createdAt || payroll?.date || payroll?.month;
        if (!dateStr) return false;

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return false;

        const monthYear = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        return monthYear === month.value;
      });

      stats[month.value] = {
        totalSalary: monthPayrolls.reduce(
          (acc, p) => acc + (p?.totalSalary || 0),
          0
        ),
        totalTax: monthPayrolls.reduce((acc, p) => acc + (p?.tax || 0), 0),
        count: monthPayrolls.length,
      };
    });

    // Add "all" stats
    stats.all = {
      totalSalary: payrollArray.reduce(
        (acc, p) => acc + (p?.totalSalary || 0),
        0
      ),
      totalTax: payrollArray.reduce((acc, p) => acc + (p?.tax || 0), 0),
      count: payrollArray.length,
    };

    return stats;
  };

  const availableMonths = getAvailableMonths();
  const monthlyStats = getMonthlyStats();

  // Get current month's data
  const currentStats = monthlyStats[selectedMonth] || {
    totalSalary: 0,
    totalTax: 0,
    count: 0,
  };

  // Create dropdown options
  const monthOptions = [
    { value: "all", label: "All Months", count: monthlyStats.all?.count || 0 },
    ...availableMonths.map((month) => ({
      value: month.value,
      label: month.label,
      count: monthlyStats[month.value]?.count || 0,
    })),
  ];

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setShowDropdown(false);
  };

  const getCurrentMonthLabel = () => {
    const option = monthOptions.find((opt) => opt.value === selectedMonth);
    return option ? option.label : "All Months";
  };

  return (
    <>
      <div className="w-full space-y-6">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="w-full min-h-[180px] h-auto rounded-lg bg-gradient-to-bl from-c-color to-black border border-gray-200 flex flex-col items-left justify-between gap-3 p-5">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-medium text-white/50">Total Payroll</p>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 border border-white/20 rounded-lg px-2 py-1 text-xs text-white/70 hover:bg-white/10 transition-colors"
                >
                  {getCurrentMonthLabel()}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px] max-h-60 overflow-y-auto">
                    {monthOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleMonthChange(option.value)}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between ${
                          selectedMonth === option.value
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="truncate">{option.label}</span>
                        <span className="text-gray-500 font-medium ml-2">
                          ({option.count})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {isLoadingPayroll ? (
              <Spinner />
            ) : (
              <p className="font-bold text-white text-[46px]">
                ${formatNumberWithCommas(currentStats?.totalSalary)}
              </p>
            )}
            <p className="text-xs text-white/80">
              Excluding tax - ${currentStats?.totalTax?.toFixed(2)}
            </p>
          </div>
          <div className="w-full min-h-[180px] h-auto rounded-lg bg-c-color-2 border border-gray-200 flex flex-col items-left gap-3 p-5">
            <p className="text-sm font-medium text-black/50">Total Employees</p>
            <div className="flex w-full items-center justify-between">
              <p className="font-bold text-[46px]">
                {singleWorkspace?.employees?.length || 0}
              </p>
              <IoPeopleOutline size={30} className="text-gray-500" />
            </div>
          </div>
          <div className="w-full min-h-[180px] h-auto rounded-lg bg-c-color-2 border border-gray-200 flex flex-col items-left gap-3 p-5">
            <p className="text-sm font-medium text-black/50">Total Payrolls</p>
            <div className="flex w-full items-center justify-between">
              {isLoadingPayroll ? (
                <Spinner />
              ) : (
                <p className="font-bold text-[46px]">{payrolls?.length || 0}</p>
              )}
              <IoWalletOutline size={30} className="text-gray-500" />
            </div>
          </div>
        </div>
        {/* <MonthlyPayrollChartApex
          payrolls={payrolls}
          isLoading={isLoadingPayroll}
        /> */}
        <MonthlyPayrollColumnChart
          payrolls={payrolls}
          isLoading={isLoadingPayroll}
        />
      </div>
    </>
  );
}

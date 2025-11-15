import React from "react";
import { useGetWorkspace } from "../../hooks/useWorkspace";
import { useGetAllPayroll } from "../../hooks/usePayroll";
import { formatNumberWithCommas } from "../../lib/utils";
import Spinner from "../../ui/Spinner";

export default function PaymentAnalytics() {
  const { isLoadingWorkspace } = useGetWorkspace();
  const { allPayrolls, isLoadingAllPayroll } = useGetAllPayroll();
  // console.log("allPayrolls", allPayrolls);

  // total monthly revenue calculation
  const totalMonthlyRevenue = allPayrolls?.reduce((acc, payroll) => {
    return acc + (payroll?.totalSalary || 0);
  }, 0);
  // total tax calculation
  const totalTax = allPayrolls?.reduce((acc, payroll) => {
    return acc + (payroll?.tax || 0);
  }, 0);

  if (isLoadingWorkspace) {
    return (
      <div className="w-full flex bg-white min-h-[180px] border border-gray-200 rounded-lg items-center justify-center p-3">
        <div className="w-8 h-8 border-4 border-c-color border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full min-h-[180px] h-auto rounded-lg bg-gradient-to-bl from-c-color to-black flex flex-col items-left justify-between gap-3 p-5">
        <div className="flex w-full items-center justify-between gap-6">
          <p className="text-sm font-medium text-white/80">All Payroll</p>
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="space-y-2">
            {isLoadingAllPayroll ? (
              <Spinner />
            ) : (
              <p className="font-bold text-[46px] text-white">
                ${formatNumberWithCommas(totalMonthlyRevenue)}
              </p>
            )}
            <span className="text-white/80 text-xs">
              Excluding tax - ${totalTax?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

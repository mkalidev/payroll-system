import React from "react";
import AllWorkspace from "../components/features/AllWorkspace";
import EmployeeAnalytics from "../components/features/Analytics/EmployeeAnalytics";
import PaymentAnalytics from "../components/features/Analytics/PaymentAnalytics";
import TotalWorkspace from "../components/features/Analytics/TotalWorkspace";
import HomeChart from "../components/features/HomeChart";
import EmployeeDonutChart from "../components/features/EmployeeDonutChart";

export default function Home() {
  return (
    <div className="w-full space-y-10">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PaymentAnalytics />
        <TotalWorkspace />
        <EmployeeAnalytics />
      </div>
      <HomeChart />
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmployeeDonutChart />
      </div>
      <AllWorkspace />
    </div>
  );
}

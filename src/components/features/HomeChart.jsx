import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useGetWorkspace } from "../hooks/useWorkspace";
import { useQueries } from "@tanstack/react-query";
import { getCookie } from "../lib/utils";

export default function HomeChart() {
  const { workspace } = useGetWorkspace();
  const apiURL = import.meta.env.VITE_API_URL;

  const payrollQueries = useQueries({
    queries:
      workspace?.map((ws) => ({
        queryKey: ["payrolls", ws._id],
        queryFn: async () => {
          const token = getCookie("token"); // or whatever your cookie name is

          const response = await fetch(`${apiURL}payroll/${ws._id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch payroll data");
          }
          return response.json();
        },
        enabled: !!ws._id && !!workspace,
        staleTime: 5 * 60 * 1000, // 5 minutes
      })) || [],
  });

  const chartData = useMemo(() => {
    if (!workspace || workspace.length === 0)
      return { categories: [], series: [] };

    const workspaceData = workspace.map((ws, idx) => {
      const query = payrollQueries[idx];
      const payrollArray = query?.data?.data || [];

      // Calculate sum of all totalSalary values in the payroll array
      const totalSalarySum = Array.isArray(payrollArray)
        ? payrollArray.reduce((sum, payrollItem) => {
            // Handle different possible data structures
            const salary = payrollItem?.totalSalary || 0;

            // Ensure it's a valid number
            const validSalary =
              typeof salary === "number" && !isNaN(salary) ? salary : 0;
            return sum + validSalary;
          }, 0)
        : 0;

      return {
        name: ws.name || "Unnamed Workspace",
        totalEmployees: ws?.employees?.length || 0,
        total: totalSalarySum,
        workspaceId: ws._id,
        payrollCount: Array.isArray(payrollArray) ? payrollArray.length : 0,
      };
    });

    const categories = workspaceData.map((item) => item.name);
    const totalSalaryData = workspaceData.map((item) => item.total);
    const totalEmployeesData = workspaceData.map((item) => item.totalEmployees);

    return {
      categories,
      series: [
        {
          name: "Total Salary",
          data: totalSalaryData,
        },
        {
          name: "Total Employees",
          data: totalEmployeesData,
        },
      ],
    };
  }, [workspace, payrollQueries]);

  const options = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    colors: ["#3b82f6", "#10b981"],
    stroke: {
      curve: "smooth",
      width: [3, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      size: 6,
      strokeWidth: 2,
      strokeColors: "#ffffff",
      fillColors: ["#3b82f6", "#10b981"],
      hover: {
        size: 8,
      },
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
      axisBorder: {
        color: "#e2e8f0",
      },
      axisTicks: {
        color: "#e2e8f0",
      },
    },
    yaxis: [
      {
        labels: {
          formatter: function (value) {
            if (value >= 1000000) {
              return `$${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `$${(value / 1000).toFixed(0)}K`;
            }
            return `$${value}`;
          },
          style: {
            colors: "#64748b",
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
        },
        title: {
          text: "Salary Amount ($)",
          style: {
            color: "#64748b",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
          },
        },
      },
      {
        opposite: true,
        labels: {
          formatter: function (value) {
            return value.toString();
          },
          style: {
            colors: "#64748b",
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
        },
        title: {
          text: "Employee Count",
          style: {
            color: "#64748b",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
          },
        },
      },
    ],
    tooltip: {
      theme: "light",
      x: {
        show: true,
      },
      y: [
        {
          formatter: function (value) {
            return `$${value.toLocaleString()}`;
          },
        },
        {
          formatter: function (value) {
            return `${value} employees`;
          },
        },
      ],
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      fontFamily: "Inter, sans-serif",
      markers: {
        radius: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
          },
        },
      },
    ],
  };

  if (chartData.categories.length === 0) {
    return (
      <div className="w-full h-[450px] bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
        <img src="/empty.svg" alt="No data" className="w-16 h-16 mb-4" />
        <p className="text-gray-500 text-lg">No workspace data available</p>
        <p className="text-gray-400 text-sm">Create workspaces to see trends</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Workspace Overview
        </h3>
        <p className="text-sm text-gray-500">
          Total salary and employee count across workspaces
        </p>
      </div>
      <div className="h-[350px]">
        <ReactApexChart
          options={options}
          series={chartData.series}
          type="area"
          height="100%"
        />
      </div>
    </div>
  );
}

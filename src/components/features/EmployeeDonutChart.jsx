import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useGetWorkspace } from "../hooks/useWorkspace";
import Spinner from "../ui/Spinner";

export default function EmployeeDonutChart() {
  const { workspace, isLoadingWorkspace } = useGetWorkspace();

  // Generate consistent colors based on workspace ID
  const getRandomColor = (id, index) => {
    const colors = [
      "#3b82f6", // Blue
      "#10b981", // Green
      "#f59e0b", // Amber
      "#ef4444", // Red
      "#8b5cf6", // Purple
      "#06b6d4", // Cyan
      "#84cc16", // Lime
      "#f97316", // Orange
      "#ec4899", // Pink
      "#6366f1", // Indigo
    ];
    // Use index to ensure unique color for each workspace, cycling if needed
    return colors[index % colors.length];
  };

  const chartData = useMemo(() => {
    if (!workspace || workspace.length === 0)
      return { series: [], labels: [], colors: [], totalEmployees: 0 };

    // Get workspace data with employee counts
    const workspaceData = workspace
      .filter((ws) => ws?.employees?.length > 0) // Only show workspaces with employees
      .map((ws, idx) => ({
        name: ws.name || "Unnamed Workspace",
        employeeCount: ws?.employees?.length || 0,
        color: getRandomColor(ws._id, idx), // Generate consistent color based on workspace ID
      }))
      .sort((a, b) => b.employeeCount - a.employeeCount); // Sort by employee count

    const series = workspaceData.map((item) => item.employeeCount);
    const labels = workspaceData.map((item) => item.name);
    const colors = workspaceData.map((item) => item.color);

    return {
      series,
      labels,
      colors,
      totalEmployees: series.reduce((sum, count) => sum + count, 0),
    };
  }, [workspace]);

  const options = {
    chart: {
      type: "donut",
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
    colors: chartData.colors,
    labels: chartData.labels,
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "22px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              color: "#1f2937",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              color: "#6b7280",
              offsetY: 16,
              formatter: function (val) {
                return val;
              },
            },
            total: {
              show: true,
              label: "Total Employees",
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              color: "#1f2937",
              formatter: function () {
                return chartData.totalEmployees;
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      fontFamily: "Inter, sans-serif",
      markers: {
        radius: 12,
        width: 12,
        height: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      onItemClick: {
        toggleDataSeries: true,
      },
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      y: {
        formatter: function (value, { series }) {
          const total = series?.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${value} employees (${percentage}%)`;
        },
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
          plotOptions: {
            pie: {
              donut: {
                size: "60%",
              },
            },
          },
        },
      },
    ],
  };

  if (isLoadingWorkspace) {
    return (
      <div className="w-full h-[450px] bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (chartData.series.length === 0) {
    return (
      <div className="w-full h-[450px] bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
        <img src="/empty.svg" alt="No data" className="w-16 h-16 mb-4" />
        <p className="text-gray-500 text-lg">No employee data available</p>
        <p className="text-gray-400 text-sm">
          Add employees to workspaces to see the distribution
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Employee Distribution
        </h3>
        <p className="text-sm text-gray-500">
          Employee count across workspaces
        </p>
      </div>
      <div className="h-[350px]">
        <ReactApexChart
          options={options}
          series={chartData.series}
          type="donut"
          height="100%"
        />
      </div>
    </div>
  );
}

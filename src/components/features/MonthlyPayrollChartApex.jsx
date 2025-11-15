import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import Spinner from "../ui/Spinner";

export default function MonthlyPayrollChartApex({
  payrolls = [],
  isLoading = false,
}) {
  const chartData = useMemo(() => {
    if (!payrolls || payrolls.length === 0)
      return { categories: [], series: [] };

    // Group payrolls by month
    const monthlyData = new Map();

    payrolls.forEach((payroll) => {
      if (payroll?.createdAt) {
        const date = new Date(payroll.createdAt);
        const monthYear = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        const monthName = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });

        if (!monthlyData.has(monthYear)) {
          monthlyData.set(monthYear, {
            month: monthName,
            totalSalary: 0,
            totalTax: 0,
            totalAmount: 0,
            payrollCount: 0,
            date: date,
          });
        }

        const monthData = monthlyData.get(monthYear);
        monthData.totalSalary += payroll?.totalSalary || 0;
        monthData.totalTax += payroll?.tax || 0;
        monthData.totalAmount +=
          (payroll?.totalSalary || 0) + (payroll?.tax || 0);
        monthData.payrollCount += 1;
      }
    });

    // Convert to array and sort by date
    const sortedData = Array.from(monthlyData.values()).sort(
      (a, b) => a.date - b.date
    );

    const categories = sortedData.map((item) => item.month);
    const totalAmountData = sortedData.map((item) => item.totalAmount);

    return {
      categories,
      series: [
        {
          name: "Total Amount",
          data: totalAmountData,
        },
      ],
    };
  }, [payrolls]);

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
    colors: ["#3b82f6"],
    stroke: {
      curve: "smooth",
      width: 3,
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
      fillColors: ["#3b82f6"],
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
    yaxis: {
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
        text: "Amount ($)",
        style: {
          color: "#64748b",
          fontSize: "14px",
          fontFamily: "Inter, sans-serif",
        },
      },
    },
    tooltip: {
      theme: "light",
      x: {
        show: true,
      },
      y: {
        formatter: function (value) {
          return `$${value.toLocaleString()}`;
        },
      },
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

  if (isLoading) {
    return (
      <div className="w-full h-[450px] bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (chartData.categories.length === 0) {
    return (
      <div className="w-full h-[450px] bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
        <img src="/empty.svg" alt="No data" className="w-16 h-16 mb-4" />
        <p className="text-gray-500 text-lg">No payroll data available</p>
        <p className="text-gray-400 text-sm">
          Create payrolls to see monthly trends
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Workspace Monthly Payroll Trends
        </h3>
        <p className="text-sm text-gray-500">
          Total amount transacted per month for this workspace
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

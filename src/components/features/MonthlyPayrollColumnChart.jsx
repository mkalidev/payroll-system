import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import Spinner from "../ui/Spinner";

export default function MonthlyPayrollColumnChart({
  payrolls = [],
  isLoading = false,
}) {
  const chartData = useMemo(() => {
    if (!payrolls || payrolls.length === 0)
      return { categories: [], series: [] };

    // Create all months array (Jan to Dec)
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Group payrolls by month
    const monthlyData = new Map();

    payrolls.forEach((payroll) => {
      if (payroll?.createdAt) {
        const date = new Date(payroll.createdAt);
        const monthIndex = date.getMonth(); // 0-11
        const monthName = allMonths[monthIndex];

        if (!monthlyData.has(monthIndex)) {
          monthlyData.set(monthIndex, {
            month: monthName,
            monthIndex: monthIndex,
            totalSalary: 0,
            totalTax: 0,
            totalAmount: 0,
            payrollCount: 0,
          });
        }

        const monthData = monthlyData.get(monthIndex);
        monthData.totalSalary += payroll?.totalSalary || 0;
        monthData.totalTax += payroll?.tax || 0;
        monthData.totalAmount +=
          (payroll?.totalSalary || 0) + (payroll?.tax || 0);
        monthData.payrollCount += 1;
      }
    });

    // Create data array for all months, with 0 for months without data
    const totalAmountData = allMonths.map((month, index) => {
      const monthData = monthlyData.get(index);
      return monthData ? monthData.totalAmount : 0;
    });

    return {
      categories: allMonths,
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
      type: "bar",
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
      spacing: 20,
    },
    colors: ["#3b82f6"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30px",
        distributed: false,
        borderRadius: 6,
        dataLabels: {
          position: "top",
        },
        rangeBarOverlap: false,
        rangeBarGroupRows: false,
      },
    },
    dataLabels: {
      enabled: false,
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
      tickPlacement: "on",
      crosshairs: {
        show: false,
      },
      tickAmount: chartData.categories.length,
      range: undefined,
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
      show: false,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          plotOptions: {
            bar: {
              columnWidth: "30px",
            },
          },
          dataLabels: {
            enabled: false,
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
          Monthly Payroll Overview
        </h3>
        <p className="text-sm text-gray-500">
          Total amount transacted per month (Column Chart)
        </p>
      </div>
      <div className="h-[350px]">
        <ReactApexChart
          options={options}
          series={chartData.series}
          type="bar"
          height="100%"
        />
      </div>
    </div>
  );
}

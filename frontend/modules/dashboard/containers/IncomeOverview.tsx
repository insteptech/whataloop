import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const IncomeOverview = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
        distributed: false,
      },
    },
    colors: ["#13C2C2"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      colors: ["#13C2C2"],
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: "12px",
          colors: "#373D3F",
        },
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 0.85,
      type: "solid",
    },
    tooltip: {
      style: {
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "12px",
      },
      y: {
        formatter: function (val) {
          return "$" + val;
        },
      },
    },
  };

  const chartSeries = [
    {
      name: "Income",
      data: [80, 95, 70, 42, 65, 55, 78],
    },
  ];

  return (
    <div className="col-md-12 col-xl-4">
      <h5 className="mb-3">Income Overview</h5>
      <div className="card">
        <div className="card-body">
          <h6 className="mb-2 f-w-400 text-muted">This Week Statistics</h6>
          <h3 className="mb-3">$7,650</h3>
          <div id="income-overview-chart" style={{ minHeight: "380px" }}>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={365}
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeOverview;

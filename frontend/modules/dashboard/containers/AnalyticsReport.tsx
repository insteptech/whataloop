import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AnalyticsReport = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#FAAD14"],
    stroke: {
      width: 1.5,
      curve: "smooth",
    },
    grid: {
      show: true,
      borderColor: "#E0E0E0",
      strokeDashArray: 4,
      position: "back",
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: {
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: "12px",
          colors: "#373D3F",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      min: 0,
      max: 300,
    },
    tooltip: {
      enabled: true,
      style: {
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "12px",
      },
      x: {
        format: "dd MMM",
      },
    },
  };

  const chartSeries = [
    {
      name: "Analytics",
      data: [146, 35, 216, 59, 129, 87, 226],
    },
  ];

  return (
    <div className="col-md-12 col-xl-4">
      <div className="analytics-report-card">
        <h5 className="mb-3">Analytics Report</h5>
        <div className="card">
          <div className="list-group list-group-flush">
            <a
              href="#"
              className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
            >
              Company Finance Growth
              <span className="h5 mb-0 text-success">+45.14%</span>
            </a>
            <a
              href="#"
              className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
            >
              Company Expenses Ratio
              <span className="h5 mb-0">0.58%</span>
            </a>
            <a
              href="#"
              className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
            >
              Business Risk Cases
              <span className="h5 mb-0 text-success">Low</span>
            </a>
          </div>
          <div className="card-body px-2">
            <div id="analytics-report-chart" style={{ minHeight: "355px" }}>
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={340}
                width="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReport;

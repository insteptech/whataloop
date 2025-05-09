import React, { useState } from "react";
import Chart from "react-apexcharts";

const UniqueVisitorChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"week" | "month">("week");

  const weeklyData = {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    series: [
      {
        name: "Page Views",
        data: [30, 40, 45, 50, 49, 60, 70],
      },
      {
        name: "Sessions",
        data: [23, 32, 27, 38, 27, 35, 40],
      },
    ],
  };

  const monthlyData = {
    categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
    series: [
      {
        name: "Page Views",
        data: [300, 400, 450, 500],
      },
      {
        name: "Sessions",
        data: [230, 320, 270, 380],
      },
    ],
  };

  const { categories, series } =
    activeTab === "week" ? weeklyData : monthlyData;

  const options = {
    chart: {
      id: "visitor-chart",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories,
    },
    yaxis: {
      labels: {
        formatter: (val: number) =>
          val !== undefined && val !== null ? val.toFixed(0) : "0",
      },
    },
    colors: ["#1890ff", "#13c2c2"],
    stroke: {
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    legend: {
      position: "bottom" as "bottom" | "top" | "right" | "left",
      horizontalAlign: "center" as "right" | "left" | "center",
    },
  };

  return (
    <div className="col-md-12 col-xl-8">
      <div className="unique-visitor-chart">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0">Unique Visitor</h5>
          <ul
            className="nav nav-pills justify-content-end mb-0"
            id="chart-tab-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "month" ? "active" : ""}`}
                id="chart-tab-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#chart-tab-home"
                type="button"
                role="tab"
                aria-controls="chart-tab-home"
                aria-selected={activeTab === "month"}
                onClick={() => setActiveTab("month")}
              >
                Month
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "week" ? "active" : ""}`}
                id="chart-tab-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#chart-tab-profile"
                type="button"
                role="tab"
                aria-controls="chart-tab-profile"
                aria-selected={activeTab === "week"}
                onClick={() => setActiveTab("week")}
              >
                Week
              </button>
            </li>
          </ul>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="tab-content" id="chart-tab-tabContent">
              <div
                className="tab-pane"
                id="chart-tab-home"
                role="tabpanel"
                aria-labelledby="chart-tab-home-tab"
                tabIndex={0}
              >
                <div id="visitor-chart-1" style={{ minHeight: "465px" }}>
                  {/* Placeholder for monthly chart */}
                  <div style={{ height: "450px" }}>
                    Monthly chart would go here
                  </div>
                </div>
              </div>
              <div
                className="tab-pane show active"
                id="chart-tab-profile"
                role="tabpanel"
                aria-labelledby="chart-tab-profile-tab"
                tabIndex={0}
              >
                <div id="visitor-chart" style={{ minHeight: "465px" }}>
                  <Chart
                    options={options}
                    series={series}
                    type="area"
                    height={450}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniqueVisitorChart;

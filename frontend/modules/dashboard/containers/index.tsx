import { DashBoardPreviewImg } from "@/components/common/Icon";
import React from "react";
import Chart from "react-apexcharts";
import { FaCircle } from "react-icons/fa";
import IncomeOverview from "./IncomeOverview";
import AnalyticsReport from "./AnalyticsReport";
import UniqueVisitorChart from "./UniqueVisitorChart";

function DashboardPage() {
  const orders = [
    {
      trackingNo: "84564564",
      product: "Camera Lens",
      total: 40,
      status: "Rejected",
      amount: "$40,570",
      statusColor: "text-danger",
    },
    {
      trackingNo: "84564564",
      product: "Laptop",
      total: 300,
      status: "Pending",
      amount: "$180,139",
      statusColor: "text-warning",
    },
    {
      trackingNo: "84564564",
      product: "Mobile",
      total: 355,
      status: "Approved",
      amount: "$180,139",
      statusColor: "text-success",
    },
    {
      trackingNo: "84564564",
      product: "Camera Lens",
      total: 40,
      status: "Rejected",
      amount: "$40,570",
      statusColor: "text-danger",
    },
    {
      trackingNo: "84564564",
      product: "Laptop",
      total: 300,
      status: "Pending",
      amount: "$180,139",
      statusColor: "text-warning",
    },
    {
      trackingNo: "84564564",
      product: "Mobile",
      total: 355,
      status: "Approved",
      amount: "$180,139",
      statusColor: "text-success",
    },
    {
      trackingNo: "84564564",
      product: "Camera Lens",
      total: 40,
      status: "Rejected",
      amount: "$40,570",
      statusColor: "text-danger",
    },
    {
      trackingNo: "84564564",
      product: "Laptop",
      total: 300,
      status: "Pending",
      amount: "$180,139",
      statusColor: "text-warning",
    },
    {
      trackingNo: "84564564",
      product: "Mobile",
      total: 355,
      status: "Approved",
      amount: "$180,139",
      statusColor: "text-success",
    },
    {
      trackingNo: "84564564",
      product: "Mobile",
      total: 355,
      status: "Approved",
      amount: "$180,139",
      statusColor: "text-success",
    },
  ];
  return (
    <div className="homepage">
      <div className="container mt-4 mb-4">
        <div className="row">
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <h6 className="mb-2 f-w-400 text-muted">Total Page Views</h6>
                <h4 className="mb-3">
                  4,42,236{" "}
                  <span className="badge bg-light-primary border border-primary">
                    <i className="ti ti-trending-up"></i> 59.3%
                  </span>
                </h4>
                <p className="mb-0 text-muted text-sm">
                  You made an extra <span className="text-primary">35,000</span>{" "}
                  this year
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <h6 className="mb-2 f-w-400 text-muted">Total Users</h6>
                <h4 className="mb-3">
                  78,250{" "}
                  <span className="badge bg-light-success border border-success">
                    <i className="ti ti-trending-up"></i> 70.5%
                  </span>
                </h4>
                <p className="mb-0 text-muted text-sm">
                  You made an extra <span className="text-success">8,900</span>{" "}
                  this year
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <h6 className="mb-2 f-w-400 text-muted">Total Order</h6>
                <h4 className="mb-3">
                  18,800{" "}
                  <span className="badge bg-light-warning border border-warning">
                    <i className="ti ti-trending-down"></i> 27.4%
                  </span>
                </h4>
                <p className="mb-0 text-muted text-sm">
                  You made an extra <span className="text-warning">1,943</span>{" "}
                  this year
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <h6 className="mb-2 f-w-400 text-muted">Total Sales</h6>
                <h4 className="mb-3">
                  $35,078{" "}
                  <span className="badge bg-light-danger border border-danger">
                    <i className="ti ti-trending-down"></i> 27.4%
                  </span>
                </h4>
                <p className="mb-0 text-muted text-sm">
                  You made an extra <span className="text-danger">$20,395</span>{" "}
                  this year
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="visitor-graph-container">
        <div className="container">
          <div className="row">
            <UniqueVisitorChart />
            <IncomeOverview />
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-xl-8">
              <h5 className="mb-3">Recent Orders</h5>
              <div className="card tbl-card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover table-borderless mb-0">
                      <thead>
                        <tr>
                          <th>TRACKING NO.</th>
                          <th>PRODUCT NAME</th>
                          <th>TOTAL ORDER</th>
                          <th>STATUS</th>
                          <th className="text-end">TOTAL AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={index}>
                            <td>
                              <a href="#" className="text-muted">
                                {order.trackingNo}
                              </a>
                            </td>
                            <td>{order.product}</td>
                            <td>{order.total}</td>
                            <td>
                              <span className="d-flex align-items-center gap-2">
                                <FaCircle
                                  className={`${order.statusColor} f-10 m-r-5`}
                                />
                                {order.status}
                              </span>
                            </td>
                            <td className="text-end">{order.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <AnalyticsReport />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-title">
            <h2>Lorem, ipsum.</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
              aperiam minima dignissimos?
            </p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3>Lead Management</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptas ex unde voluptate perspiciatis, autem deleniti enim.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3>WhatsApp Integration</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
                  exercitationem dolore tempore!
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3>Smart Reminders</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
                  quae sed alias voluptates ad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>Trusted by Businesses</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque
              sed qui exercitationem. Tenetur tempore magnam odio ipsa, enim
              eligendi!
            </p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="quote">
                  "This platform cut our follow-up time in half and increased
                  our conversion rate by 30%. Absolutely game-changing!"
                </div>
                <div className="author">
                  <img src="/images/testimonial-1.jpg" alt="" />
                  <div className="info">
                    <h4>Upkar Verma</h4>
                    <p>Sales Director, TechCorp</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="quote">
                  "The WhatsApp integration alone is worth the price. Our
                  response time went from hours to minutes."
                </div>
                <div className="author">
                  <img src="/images/testimonial-2.jpg" alt="" />
                  <div className="info">
                    <h4>Karam Sir</h4>
                    <p>Founder, GrowthAgency</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="quote">
                  "Finally a tool that understands how sales actually work. The
                  reminder system saved us countless deals."
                </div>
                <div className="author">
                  <img src="/images/testimonial-3.jpg" alt="" />
                  <div className="info">
                    <h4>Lovepreet</h4>
                    <p>CEO, RealEstatePro</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Lead Management?</h2>
          <p>
            Join thousands of businesses who are closing more deals with less
            effort.
          </p>
          <a href="/register" className="btn">
            Start Your 14-Day Free Trial
          </a>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;

import { DashBoardPreviewImg } from "@/components/common/Icon";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { FaCircle } from "react-icons/fa";
import { TbGift, TbMessageCircle, TbSettings } from "react-icons/tb";
import IncomeOverview from "./IncomeOverview";
import AnalyticsReport from "./AnalyticsReport";
import UniqueVisitorChart from "./UniqueVisitorChart";
import { useDispatch, useSelector } from "react-redux";
import { getLeads } from "@/modules/leads/redux/action/leadAction";
import { getUsers } from "@/modules/users/redux/action/usersAction";
import Loader from "@/components/common/loader";



function DashboardPage() {
  const dispatch = useDispatch();
  const role = useSelector((state: any) => state.authReducer.role);
  const isAdmin = role === 'admin';
  const [isLoading, setIsLoading] = useState(true);

  const { total: leadsTotal } = useSelector((state: any) => state.leadReducer);
  const { users } = useSelector((state: any) => state.usersReducer);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        await Promise.all([
          dispatch(
            getLeads({
              page: 1,
              limit: 1,
              search: "",
              sort: "",
              order: "",
              role: role
            }) as any
          ),
          isAdmin ? dispatch(getUsers({
            page: 1,
            pageSize: 1,
            search: "",
            sort: "createdAt",
            order: "DESC",
          }) as any) : Promise.resolve()
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (role) {
      fetchData();
    }
  }, [dispatch, role, isAdmin]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="homepage">
      <div className="dashboard-top-card">
        <div className="row">
          {/* Leads Card */}
          <div className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <h6 className="mb-2 f-w-400 text-muted">Total Leads Generated</h6>
                <h4 className="mb-3">{leadsTotal || 0}</h4>
                <p className="mb-0 text-muted text-sm">
                  You made an extra <span className="text-primary">35,000</span> this year
                </p>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="col-md-6 col-xl-3">
              <div className="card">
                <div className="card-body">
                  <h6 className="mb-2 f-w-400 text-muted">Total Users</h6>
                  <h4 className="mb-3">{users?.count || 0}</h4>
                  <p className="mb-0 text-muted text-sm">
                    You made an extra <span className="text-success">8,900</span> this year
                  </p>
                </div>
              </div>
            </div>
          )}
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
        <div className="row">
          <UniqueVisitorChart />
          <IncomeOverview />
        </div>
      </div>

      {/* <div className="table-container">
        <div className="row">
          <div className="col-md-12 col-xl-8">
            <div className="table-container-inner">
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
          </div>
          <AnalyticsReport />
        </div>
      </div> */}

      <div className="salery-report-and-transition-history">
        <div className="row">
          <div className="col-md-12 col-xl-4">
            <div className="transition-history-sec">
              <h5 className="mb-3">Transaction History</h5>
              <div className="card">
                <div className="list-group list-group-flush">
                  <a
                    href="#"
                    className="list-group-item list-group-item-action"
                  >
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div className="avtar avtar-s rounded-circle text-success bg-light-success">
                          <TbGift className="f-18" />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1">Order #002434</h6>
                        <p className="mb-0 text-muted">Today, 2:00 AM</p>
                      </div>
                      <div className="flex-shrink-0 text-end">
                        <h6 className="mb-1">+ $1,430</h6>
                        <p className="mb-0 text-muted">78%</p>
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="list-group-item list-group-item-action"
                  >
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div className="avtar avtar-s rounded-circle text-primary bg-light-primary">
                          <TbMessageCircle className="f-18" />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1">Order #984947</h6>
                        <p className="mb-0 text-muted">5 August, 1:45 PM</p>
                      </div>
                      <div className="flex-shrink-0 text-end">
                        <h6 className="mb-1">- $302</h6>
                        <p className="mb-0 text-muted">8%</p>
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="list-group-item list-group-item-action"
                  >
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div className="avtar avtar-s rounded-circle text-danger bg-light-danger">
                          <TbSettings className="f-18" />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1">Order #988784</h6>
                        <p className="mb-0 text-muted">7 hours ago</p>
                      </div>
                      <div className="flex-shrink-0 text-end">
                        <h6 className="mb-1">- $682</h6>
                        <p className="mb-0 text-muted">16%</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

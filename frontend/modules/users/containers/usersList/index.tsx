import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/action/usersAction";
import router from "next/router";
import Loader from "@/components/common/loader";

const UsersList = () => {
  const dispatch = useDispatch<any>();
  const { users, loading, error } = useSelector(
    (state: any) => state.usersReducer
  );
  const total = users.count;

  const queryPage = router.query.page as string;
  const currentPage = parseInt(queryPage || "1");
  const itemsPerPage = 3;

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      router.push({
        pathname: router.asPath.split("?")[0],
        query: { page: "1" },
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    dispatch(
      getUsers({
        page: currentPage,
        pageSize: itemsPerPage,
        search: debouncedSearch,
        sort: sortBy,
        order: sortOrder,
      }) as any
    );
  }, [dispatch, currentPage, debouncedSearch, sortBy, sortOrder]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: page.toString() },
    });
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortOrder("ASC");
    }
  };
  if (loading) {
    return <Loader />;
  }
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-12">
          <div className="users-table-container">
            <div className="row align-items-center mb-4">
              <div className="col-12 col-md-6">
                <h2 className="mb-3 mb-md-0">Users List</h2>
              </div>
              <div className="col-12 col-md-6">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="search-container"
                >
                  <input
                    type="search"
                    placeholder="Search by name, email, or phone"
                    className="form-control search-input"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </form>
              </div>
            </div>

            {error && (
              <div className="row">
                <div className="col-12">
                  <p className="error-message">Error: {error}</p>
                </div>
              </div>
            )}

            {!loading && (!users?.rows || users.rows.length === 0) && (
              <div className="no-users">
                <p>No users found.</p>
              </div>
            )}

            {users?.rows?.length > 0 && (
              <>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>S.no</th>
                        <th
                          className="sortable"
                          onClick={() => handleSort("fullName")}
                        >
                          Name
                          {sortBy === "fullName" && (
                            <span className="sort-icon">
                              {sortOrder === "ASC" ? "▲" : "▼"}
                            </span>
                          )}
                        </th>
                        <th
                          className="sortable"
                          onClick={() => handleSort("email")}
                        >
                          Email
                          {sortBy === "email" && (
                            <span className="sort-icon">
                              {sortOrder === "ASC" ? "▲" : "▼"}
                            </span>
                          )}
                        </th>
                        <th>Account Type</th>
                        <th
                          className="sortable"
                          onClick={() => handleSort("phone")}
                        >
                          Phone
                          {sortBy === "phone" && (
                            <span className="sort-icon">
                              {sortOrder === "ASC" ? "▲" : "▼"}
                            </span>
                          )}
                        </th>
                        <th
                          className="sortable"
                          onClick={() => handleSort("createdAt")}
                        >
                          Created At
                          {sortBy === "createdAt" && (
                            <span className="sort-icon">
                              {sortOrder === "ASC" ? "▲" : "▼"}
                            </span>
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.rows.map((user: any, index: number) => (
                        <tr key={user.id}>
                          <td data-label="S.no">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td data-label="Name">{user.fullName || " "}</td>
                          <td data-label="Email">{user.email || " "}</td>
                          <td data-label="Account Type">
                            {user.account_type || "User"}
                          </td>
                          <td data-label="Phone">{user.phone}</td>
                          <td data-label="Created At">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 0 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      Previous
                    </button>

                    {currentPage > 2 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className="pagination-button"
                        >
                          1
                        </button>
                        <span className="pagination-ellipsis">...</span>
                      </>
                    )}

                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="pagination-button"
                      >
                        {currentPage - 1}
                      </button>
                    )}

                    <button className="pagination-button active" disabled>
                      {currentPage}
                    </button>

                    {currentPage < totalPages && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="pagination-button"
                      >
                        {currentPage + 1}
                      </button>
                    )}

                    {currentPage < totalPages - 1 && (
                      <>
                        {currentPage < totalPages - 2 && (
                          <span className="pagination-ellipsis">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="pagination-button"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;

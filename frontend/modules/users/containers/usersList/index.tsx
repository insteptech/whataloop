import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/action/usersAction";
import router from "next/router";
import Loader from "@/components/common/loader";

const UsersList = () => {
  const dispatch = useDispatch<any>();
  const { users, loading, error } = useSelector((state: any) => state.usersReducer);
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
    if(loading){
        return (
        <Loader/>
        )
      }
      if (error) return <p style={{ color: 'red' }}>{error}</p>;
     
  return (
    <div className="container mt-4">
      <h2>Users List</h2>

      <form onSubmit={(e) => e.preventDefault()} className="mb-3">
        <input
          type="search"
          placeholder="Search by name, email, or phone"
          className="form-control w-25"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </form>

      {error && <p className="text-danger">Error: {error}</p>}
      {!loading && (!users?.rows || users.rows.length === 0) && <p>No users found.</p>}

      {users?.rows?.length > 0 && (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>S.no</th>
              <th onClick={() => handleSort("fullName")} style={{ cursor: "pointer" }}>
                Name {sortBy === "fullName" ? (sortOrder === "ASC" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                Email {sortBy === "email" ? (sortOrder === "ASC" ? "▲" : "▼") : ""}
              </th>
              <th>Account Type</th>
              <th onClick={() => handleSort("phone")} style={{ cursor: "pointer" }}>
                Phone {sortBy === "phone" ? (sortOrder === "ASC" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("createdAt")} style={{ cursor: "pointer" }}>
                Created At {sortBy === "createdAt" ? (sortOrder === "ASC" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.rows.map((user: any, index: number) => (
              <tr key={user.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{user.fullName || " "}</td>
                <td>{user.email || " "}</td>
                <td>{user.account_type || "User"}</td>
                <td>{user.phone}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
              <button onClick={() => handlePageChange(1)} className="pagination-button">1</button>
              <span className="pagination-ellipsis">...</span>
            </>
          )}

          <button className="pagination-button active" disabled>{currentPage}</button>

          {currentPage < totalPages - 1 && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="pagination-button"
            >
              {currentPage + 1}
            </button>
          )}

          {currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}

          {currentPage !== totalPages && (
            <button onClick={() => handlePageChange(totalPages)} className="pagination-button">
              {totalPages}
            </button>
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
    </div>
  );
};

export default UsersList;

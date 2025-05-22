import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser } from "../../redux/action/usersAction";
import Loader from "@/components/common/loader";
import { useRouter } from "next/router";
import UserEditModal from "@/components/UserEditModal";
import ConfirmationPopup from "@/components/common/ConfirmationPopUp";
import Notification from "@/components/common/Notification";
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const UsersList = () => {
  const dispatch = useDispatch<any>();
  const { users, loading, error } = useSelector(
    (state: any) => state.usersReducer
  );
  const total = users.count;
  const router = useRouter();
  const toast = useRef<any>(null);

  const queryPage = router.query.page as string;
  const currentPage = parseInt(queryPage || "1");
  const itemsPerPage = 10;

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({ show: false, title: "", message: "", type: "success" });

  // Confirmation popup state
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

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

  const confirmDeleteUser = (id: string) => {
    setUserToDelete(id);
    setConfirmVisible(true);
  };

  const onAcceptDelete = async () => {
    setConfirmVisible(false);
    if (!userToDelete) return;

    try {
      const result = await dispatch(deleteUser(userToDelete)).unwrap();

      // Show success notification
      setNotification({
        show: true,
        title: "User Deleted",
        message: result.message || "User deleted successfully",
        type: "success"
      });

      // Show toast notification
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: result.message || 'User deleted successfully',
        life: 3000,
      });

      // Refresh the user list
      dispatch(
        getUsers({
          page: currentPage,
          pageSize: itemsPerPage,
          search: debouncedSearch,
          sort: sortBy,
          order: sortOrder,
        })
      );
    } catch (err: any) {
      // Show error notification
      setNotification({
        show: true,
        title: "Error",
        message: err.message || "Failed to delete user",
        type: "error"
      });

      // Show error toast
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to delete user',
        life: 3000,
      });
    }
    setUserToDelete(null);
  };

  const onRejectDelete = () => {
    setConfirmVisible(false);
    setUserToDelete(null);
  };

  if (loading) {
    return <Loader />;
  }
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container-fluid">
      <Toast ref={toast} />

      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-12">
          <div className="users-table-container">
            {/* Notification component */}
            {notification.show && (
              <Notification
                title={notification.title}
                message={notification.message}
                type={notification.type}
                position="bottom-center"
                onClose={() => setNotification({ ...notification, show: false })}
              />
            )}

            <div className="row align-items-center mb-4">
              <div className="col-12 col-md-6">
                <h2 className="mb-3 mb-md-0">Users List</h2>
              </div>
              <div className="col-12 col-md-6 d-flex justify-content-between">
                <form onSubmit={(e) => e.preventDefault()} className="search-container">
                  <input
                    type="search"
                    placeholder="Search by name, email, or phone"
                    className="form-control search-input"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </form>
                <button
                  className="btn btn-primary"
                  onClick={() => router.push("/users/createUser")}
                >
                  Create User
                </button>
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
                        <th className="sortable" onClick={() => handleSort("fullName")}>
                          Name
                          {sortBy === "fullName" && (
                            <span className="sort-icon">{sortOrder === "ASC" ? "▲" : "▼"}</span>
                          )}
                        </th>
                        <th className="sortable" onClick={() => handleSort("email")}>
                          Email
                          {sortBy === "email" && (
                            <span className="sort-icon">{sortOrder === "ASC" ? "▲" : "▼"}</span>
                          )}
                        </th>
                        <th>Account Type</th>
                        <th className="sortable" onClick={() => handleSort("phone")}>
                          Phone
                          {sortBy === "phone" && (
                            <span className="sort-icon">{sortOrder === "ASC" ? "▲" : "▼"}</span>
                          )}
                        </th>
                        <th className="sortable" onClick={() => handleSort("createdAt")}>
                          Created At
                          {sortBy === "createdAt" && (
                            <span className="sort-icon">{sortOrder === "ASC" ? "▲" : "▼"}</span>
                          )}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.rows.map((user: any, index: number) => (
                        <tr key={user.id}>
                          <td data-label="S.no">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td data-label="Name">{user.fullName || " "}</td>
                          <td data-label="Email">{user.email || " "}</td>
                          <td data-label="Account Type">{user.account_type || "User"}</td>
                          <td data-label="Phone">{user.phone}</td>
                          <td data-label="Created At">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td data-label="Actions">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowEditModal(true); // This sets the state to true, opening the modal
                              }}
                              className="btn btn-primary"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => confirmDeleteUser(user.id)}
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
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
                        <button onClick={() => handlePageChange(1)} className="pagination-button">
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
                        {currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}
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

            {showEditModal && selectedUser && (
              <UserEditModal
                user={selectedUser}
                onClose={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                show={showEditModal}
                onSave={() => {
                  dispatch(
                    getUsers({
                      page: currentPage,
                      pageSize: itemsPerPage,
                      search: debouncedSearch,
                      sort: sortBy,
                      order: sortOrder,
                    })
                  );
                }}
                setNotification={setNotification}
              />
            )}

            <ConfirmationPopup
              visible={confirmVisible}
              onAccept={onAcceptDelete}
              onReject={onRejectDelete}
              message="Are you sure you want to delete this user?"
              header="Delete Confirmation"
              type="delete"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
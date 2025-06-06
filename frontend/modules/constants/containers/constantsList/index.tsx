import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConstants,
  deleteConstant,
} from "../../redux/action/constantAction";
import router from "next/router";
import Loader from "@/components/common/loader";
import Notification from "@/components/common/Notification";
import ConfirmationPopup from "@/components/common/ConfirmationPopUp";

const ConstantsList = () => {
  const dispatch = useDispatch<any>();
  const { constantsList, loading, error, totalPages } = useSelector(
    (state: any) => state.constantReducer
  );

  const [page, setPage] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const limit = 10;

  useEffect(() => {
    dispatch(fetchConstants({ page, limit }));
  }, [dispatch, page]);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await dispatch(deleteConstant(selectedId)).unwrap();
      dispatch(fetchConstants({ page, limit }));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error("Delete failed:", err);
      setErrorMessage("Cannot delete! This constant is already in use in Leads table.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSelectedId(null);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Constants List</h2>
        <button
          onClick={() => router.push("/constants/addConstants")}
          className="btn btn-primary"
        >
          ADD CONSTANT
        </button>
      </div>

      {!loading &&
        Array.isArray(constantsList) &&
        constantsList.length === 0 && <p>No constants found.</p>}

      {Array.isArray(constantsList) && constantsList.length > 0 && (
        <>
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>Type</th>
                <th>Label</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {constantsList.map((constant: any) => (
                <tr key={constant.id}>
                  <td>
                    {constant.type.charAt(0).toUpperCase() +
                      constant.type.slice(1)}
                  </td>
                  <td>{constant.label}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedId(constant.id);
                        setShowConfirm(true);
                      }}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 0 && (
            <div className="pagination mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="pagination-button"
              >
                Previous
              </button>

              {page > 2 && (
                <>
                  <button
                    onClick={() => setPage(1)}
                    className="pagination-button"
                  >
                    1
                  </button>
                  <span className="pagination-ellipsis">...</span>
                </>
              )}

              <button className="pagination-button active" disabled>
                {page}
              </button>

              {page < totalPages - 1 && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="pagination-button"
                >
                  {page + 1}
                </button>
              )}

              {page < totalPages - 2 && (
                <span className="pagination-ellipsis">...</span>
              )}

              {page !== totalPages && (
                <button
                  onClick={() => setPage(totalPages)}
                  className="pagination-button"
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showSuccess && (
        <Notification
          title="Deleted"
          message="Constant deleted successfully!"
          type="success"
          position="bottom-center"
        />
      )}

      {errorMessage && (
        <Notification
          title="Delete Failed"
          message={errorMessage}
          type="error"
          position="bottom-center"
        />
      )}

      <ConfirmationPopup
        visible={showConfirm}
        onAccept={() => {
          handleDelete();
          setShowConfirm(false);
        }}
        onReject={() => setShowConfirm(false)}
        message="Are you sure you want to delete this constant?"
        header="Delete Confirmation"
        type="delete"
      />
    </div>
  );
};

export default ConstantsList;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConstants, deleteConstant } from "../../redux/action/constantAction";
import router from "next/router";

const ConstantsList = () => {
  const dispatch = useDispatch<any>();
  const { constantsList, loading, error, totalPages } = useSelector(
    (state: any) => state.constantReducer
  );

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchConstants({ page, limit }));
  }, [dispatch, page]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this constant?")) {
      try {
        await dispatch(deleteConstant(id)).unwrap(); 
        dispatch(fetchConstants({ page, limit })); 
      } catch (err: any) {
        console.error("Delete failed:", err);
        const message =
          "Cannot delete!!. This constant is already in in use in Leads table";
        alert(message); 
      }
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
      {loading && <p>Loading...</p>}

      {!loading && Array.isArray(constantsList) && constantsList.length === 0 && (
        <p>No constants found.</p>
      )}

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
                  <td>{constant.type}</td>
                  <td>{constant.label}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(constant.id)}
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
                  <button onClick={() => setPage(1)} className="pagination-button">
                    1
                  </button>
                  <span className="pagination-ellipsis">...</span>
                </>
              )}

              <button className="pagination-button active" disabled>
                {page}
              </button>

              {page < totalPages - 1 && (
                <button onClick={() => setPage(page + 1)} className="pagination-button">
                  {page + 1}
                </button>
              )}

              {page < totalPages - 2 && <span className="pagination-ellipsis">...</span>}

              {page !== totalPages && (
                <button onClick={() => setPage(totalPages)} className="pagination-button">
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConstantsList;

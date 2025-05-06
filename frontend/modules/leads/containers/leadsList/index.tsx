import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getLeads } from "../../redux/action/leadAction";
import { Col, Row } from "react-bootstrap";

function UserDetails() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { leads, total, loading, error } = useSelector(
    (state: any) => state.leadReducer
  );

  const queryPage = router.query.page as string;
  const currentPage = parseInt(queryPage || "1");
  const itemsPerPage = 10;

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
      getLeads({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
      }) as any
    );  }, [dispatch, currentPage, debouncedSearch]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: page.toString() },
    });
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="lead-list-container">
      <div className="lead-list-header">
        <h2>Leads</h2>
        <div className="lead-count">{total} leads found</div>
      </div>

      <div className="row search-and-create-lead-button">
        <div className="col-md-4">
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="search"
              placeholder="Search by name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>
        <div className="col-md-4 text-end">
          <button onClick={() => router.push("/leads/createLead")}>
            Create a Lead
          </button>
        </div>
      </div>

      <Row className="lead-list-header-row">
        <Col md={2} className="header-cell">Name</Col>
          <Col md={2} className="header-cell">Contact</Col>
        <Col md={2} className="header-cell">Status</Col>
         <Col md={2} className="header-cell">Source</Col>
            <Col md={2} className="header-cell">Tag</Col>
        <Col md={2} className="header-cell">Last Contacted</Col>
      </Row>

      {leads?.length > 0 ? (
  leads.map((lead: any) => (
    <Row key={lead.id} className="lead-item">
      <Col md={2} className="lead-cell">
        <div className="lead-name">{lead.name}</div>
        <div className="lead-notes">{lead.notes}</div>
      </Col>
      <Col md={2} className="lead-cell">
        <div className="lead-email">Email: {lead.email}</div>
        <div className="lead-phone">Phone: {lead.phone}</div>
      </Col>
      <Col md={2} className="lead-cell">
        <div className="lead-status">{lead.status || "N/A"}</div>
      </Col>
      <Col md={2} className="lead-cell">
        <div className="lead-source">{lead.source || "N/A"}</div>
      </Col>
      <Col md={2} className="lead-cell">
        <div className="lead-tag">{lead.tag || "No Tag"}</div>
      </Col>
      <Col md={2} className="lead-cell">
        <div className="lead-date">
          {lead.last_contacted
            ? new Date(lead.last_contacted).toLocaleDateString()
            : "—"}
        </div>
      </Col>
    </Row>
  ))
) : (
  <p>No users found.</p>
)}


      {totalPages > 1 && (
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

          {currentPage < totalPages - 2 && (
            <span className="pagination-ellipsis">...</span>
          )}

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
}

export default UserDetails;

"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getLeads, deleteLead } from "../../redux/action/leadAction";
import { Col, Row } from "react-bootstrap";
import ChatModal from "@/components/common/ChatModal";

const LeadsList = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { leads, total } = useSelector((state: any) => state.leadReducer);

  const queryPage = router.query.page as string;
  const currentPage = parseInt(queryPage || "1");
  const itemsPerPage = 10;

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showChatModal, setShowChatModal] = useState(false);

  const handleSortClick = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return "↕";
    return sortOrder === "asc" ? "▲" : "▼";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      router.push({ pathname: router.asPath.split("?")[0], query: { page: "1" } });
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    dispatch(
      getLeads({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        sort: sortColumn,
        order: sortOrder,
      }) as any
    );
  }, [dispatch, currentPage, debouncedSearch, sortColumn, sortOrder]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    router.push({ pathname: router.pathname, query: { ...router.query, page: page.toString() } });
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      dispatch(deleteLead(id) as any).then((action) => {
        if (deleteLead.fulfilled.match(action)) {
          dispatch(
            getLeads({
              page: currentPage,
              limit: itemsPerPage,
              search: debouncedSearch,
              sort: sortColumn,
              order: sortOrder,
            }) as any
          );
        }
      });
    }
  };

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
              placeholder="Search by name or email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>
        <div className="col-md-4 text-end">
          <button onClick={() => router.push("/leads/createLead")}>Create a Lead</button>
        </div>
      </div>

      <Row className="lead-list-header-row">
        {["name", "email", "phone", "status", "source", "tag", "last_contacted"].map((col, idx) => (
          <Col key={idx} md={2} className="header-cell">
            <button className="sort-btn" onClick={() => handleSortClick(col)}>
              {col.replace("_", " ").toUpperCase()} {renderSortIcon(col)}
            </button>
          </Col>
        ))}
        <Col md={1} className="header-cell">Chat</Col>
        <Col md={1} className="header-cell">Action</Col>
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
            </Col>
            <Col md={2} className="lead-cell">
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
            <Col md={1} className="lead-cell">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowChatModal(true)}>
                Chat
              </button>
            </Col>
            <Col md={1} className="lead-cell text-end">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteLead(lead.id)}
              >
                Delete
              </button>
            </Col>
          </Row>
        ))
      ) : (
        <p>No users found.</p>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          {currentPage > 2 && (
            <>
              <button onClick={() => handlePageChange(1)}>1</button>
              <span>...</span>
            </>
          )}
          <button disabled>{currentPage}</button>
          {currentPage < totalPages - 1 && (
            <button onClick={() => handlePageChange(currentPage + 1)}>
              {currentPage + 1}
            </button>
          )}
          {currentPage < totalPages - 2 && <span>...</span>}
          {currentPage !== totalPages && (
            <button onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
          )}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      <ChatModal show={showChatModal} onClose={() => setShowChatModal(false)} />
    </div>
  );
};

export default LeadsList;

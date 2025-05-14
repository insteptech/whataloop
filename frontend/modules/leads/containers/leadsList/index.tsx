import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  getLeads,
  deleteLead,
  updateLead,
} from "../../redux/action/leadAction";
import { Col, Row } from "react-bootstrap";
import ChatModal from "@/components/common/ChatModal";
import Loader from "@/components/common/loader";
import EditLeadModal from "@/components/leadEditModal";
import Notification from "@/components/common/Notification";
import DeleteIcon from "../../../../public/delete.png";
import EditIcon from "../../../../public/edit.png";
import Image from "next/image";
import CustomTooltip from "@/components/common/Tooltip";

const LeadsList = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { leads, total, loading } = useSelector(
    (state: any) => state.leadReducer
  );

  const queryPage = router.query.page as string;
  const currentPage = parseInt(queryPage || "1");
  const itemsPerPage = 10;

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showChatModal, setShowChatModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [notification, setNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({ show: false, title: "", message: "", type: "success" });

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
        sort: sortColumn,
        order: sortOrder,
      }) as any
    );
  }, [dispatch, currentPage, debouncedSearch, sortColumn, sortOrder]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: page.toString() },
    });
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

          if (!notification.show) {
            setNotification({
              show: true,
              title: "Lead Deleted",
              message: "The lead has been deleted successfully.",
              type: "success",
            });
          }
        }
      });
    }
  };

  const handleUpdateLead = (updatedLead: any) => {
    dispatch(updateLead(updatedLead) as any).then((action) => {
      if (updateLead.fulfilled.match(action)) {
        dispatch(
          getLeads({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch,
            sort: sortColumn,
            order: sortOrder,
          }) as any
        );

        if (!notification.show) {
          setNotification({
            show: true,
            title: "Lead Updated",
            message: "The lead information has been updated successfully.",
            type: "success",
          });
        }
      }
    });
  };

  if (loading) {
    return <Loader />;
  }

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
              placeholder="Search by Name or E-mail"
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

      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
              {[
                "name",
                "email",
                "phone",
                "status",
                "source",
                "tag",
                "last_contacted",
                "chat",
                "action",
              ].map((col, idx) => (
                <th key={idx} className={`th-${col.replace("_", "-")}`}>
                  {col !== "chat" && col !== "action" ? (
                    <button
                      className="sort-btn"
                      onClick={() => handleSortClick(col)}
                    >
                      {col.replace("_", " ").toUpperCase()}{" "}
                      {renderSortIcon(col)}
                    </button>
                  ) : (
                    col.toUpperCase()
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads?.length > 0 ? (
              leads.map((lead: any) => (
                <tr key={lead.id} className="lead-row">
                  <td className="td-name" data-label="Name">
                    <div>
                      <CustomTooltip
                        message={lead.name}
                        className="lead-name"
                      />
                      <CustomTooltip
                        message={lead.notes}
                        className="lead-notes"
                      />
                    </div>
                  </td>
                  <td className="td-email" data-label="Email">
                    <CustomTooltip
                      message={lead.email}
                      className="lead-email"
                    />
                  </td>
                  <td className="td-phone" data-label="Phone">
                    <CustomTooltip
                      message={lead.phone}
                      className="lead-phone"
                    />
                  </td>
                  <td className="td-status" data-label="Status">
                    <CustomTooltip
                      message={lead.statusDetail?.label || "N/A"}
                      className="lead-status"
                    />
                  </td>
                  <td className="td-source" data-label="Source">
                    <CustomTooltip
                      message={lead.sourceDetail?.label || "N/A"}
                      className="lead-source"
                    />
                  </td>
                  <td className="td-tag" data-label="Tag">
                    <span className={`lead-tag ${lead.tagDetail?.label}`}>
                      {lead.tagDetail?.label || "No Tag"}
                    </span>
                  </td>
                  <td className="td-last-contacted" data-label="Last Contacted">
                    <CustomTooltip
                      message={lead.last_contacted || "Not selected"}
                      className="lead-date"
                    />
                  </td>
                  <td className="td-chat" data-label="Chat">
                    <button
                      className="btn btn-outline-secondary btn-sm chat-btn"
                      onClick={() => setShowChatModal(true)}
                    >
                      Chat
                    </button>
                  </td>
                  <td className="td-action" data-label="Action">
                    <div className="action-buttons">
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowEditModal(true);
                        }}
                      >
                        <Image
                          src={EditIcon}
                          width={24}
                          height={24}
                          alt="edit lead"
                        />
                      </button>
                      <button onClick={() => handleDeleteLead(lead.id)}>
                        <Image
                          src={DeleteIcon}
                          width={24}
                          height={24}
                          alt="delete lead"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="no-leads-message">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="pagination mt-4">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
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

          <button className="pagination-button active" disabled>
            {currentPage}
          </button>

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
            <button
              onClick={() => handlePageChange(totalPages)}
              className="pagination-button"
            >
              {totalPages}
            </button>
          )}

          <button
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}

      <ChatModal show={showChatModal} onClose={() => setShowChatModal(false)} />

      <EditLeadModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        lead={selectedLead}
        onSave={handleUpdateLead}
      />

      {notification.show && (
        <Notification
          title={notification.title}
          message={notification.message}
          type={notification.type}
          position="bottom-center"
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
    </div>
  );
};

export default LeadsList;

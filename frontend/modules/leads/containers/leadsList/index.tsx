'use client';
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

import {
  getLeads,
  updateLead,
  deleteLead,
} from "../../redux/action/leadAction";
import { fetchConstants } from "@/modules/constants/redux/action/constantAction";
import EditLeadModal from "@/components/leadEditModal";
import ConfirmationPopup from "@/components/common/ConfirmationPopUp";
import { AddLeadIcon, CallIcon, DeleteIcon, EditIcon, EmailIconV1, MessageIconV1, PencilIcon, ThreeDotIcon } from "@/components/common/Icon";
import ChatModal from "@/components/common/ChatModal";

const LeadsList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { leads, loading } = useSelector((state: any) => state.leadReducer);
  const { constantsList } = useSelector((state: any) => state.constantReducer);
  const role = useSelector((state: any) => state.authReducer.role);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedLeadForChat, setSelectedLeadForChat] = useState<any>(null);

  // Extract status columns dynamically
  const statusColumns = useMemo(() => {
    if (!constantsList || !Array.isArray(constantsList)) return [];
    return constantsList.filter((ct: any) => ct.type === "status");
  }, [constantsList]);

  // Group leads by status
  const groupLeadsByStatus = () => {
    const grouped: { [key: string]: any[] } = {};
    // Initialize all status groups
    statusColumns.forEach(col => {
      grouped[col.label] = [];
    });
    grouped["Unassigned"] = [];

    // Group leads
    if (leads && Array.isArray(leads)) {
      leads.forEach((lead: any) => {
        const statusLabel = lead.statusConstant?.label || "Unassigned";
        if (!grouped[statusLabel]) grouped[statusLabel] = [];
        grouped[statusLabel].push(lead);
      });
    }
    return grouped;
  };

  const [groupedLeads, setGroupedLeads] = useState(groupLeadsByStatus());

  useEffect(() => {
    setGroupedLeads(groupLeadsByStatus());
  }, [leads, constantsList]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch leads and constants on mount
  useEffect(() => {
    dispatch(fetchConstants({ page: 1, limit: 100 }) as any); // Load constants
    dispatch(getLeads({
      page: 1,
      limit: 100,
      search: debouncedSearch,
      sort: "",
      order: "desc",
      role: role
    }) as any);
  }, [dispatch, debouncedSearch, role]);

  // Handle drag end
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newGroupedLeads = JSON.parse(JSON.stringify(groupedLeads));
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const sourceLeads = [...newGroupedLeads[sourceStatus]];
    const destLeads = [...newGroupedLeads[destStatus]];

    const [movedLead] = sourceLeads.splice(source.index, 1);

    if (sourceStatus === destStatus) {
      sourceLeads.splice(destination.index, 0, movedLead);
      newGroupedLeads[sourceStatus] = sourceLeads;
    } else {
      destLeads.splice(destination.index, 0, movedLead);
      newGroupedLeads[sourceStatus] = sourceLeads;
      newGroupedLeads[destStatus] = destLeads;

      const newStatus = statusColumns.find((col: any) => col.label === destStatus);
      if (!newStatus) return;

      dispatch(updateLead({
        id: movedLead.id,
        data: { status: newStatus.id }
      }) as any).then(() => {
        dispatch(getLeads({
          page: 1,
          limit: 100,
          search: debouncedSearch,
          sort: "",
          order: "desc",
          role: role
        }) as any);
      });
    }

    setGroupedLeads(newGroupedLeads);
  };

  // Confirm deletion
  const handleDeleteClick = (leadId: string) => {
    setDeleteLeadId(leadId);
    setShowConfirm(true);
  };

  // Delete confirmed
  const handleDeleteConfirm = () => {
    if (deleteLeadId) {
      dispatch(deleteLead(deleteLeadId) as any).then(() => {
        dispatch(getLeads({
          page: 1,
          limit: 100,
          search: debouncedSearch,
          sort: "",
          order: "desc",
          role: role
        }) as any);
      });
    }
    setShowConfirm(false);
    setDeleteLeadId(null);
  };

  // Cancel deletion
  const handleDeleteCancel = () => {
    setShowConfirm(false);
    setDeleteLeadId(null);
  };


  const [componentKey, setComponentKey] = useState(0);

  const remountComponent = () => {
    setComponentKey(prevKey => prevKey + 1); // triggers remount
  };


  return (
    <div className="lead-list-container">
      {/* Header */}
      <div className="lead-list-header">
        <p className="lead-page-header-line">Who have shown interest in a product of service </p>
        <h2>Leads</h2>
      </div>

      {/* Search & Create */}
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
          {/* <button onClick={() => router.push("/leads/createLead")}>
            Create a Lead
          </button> */}
        </div>
      </div>

      {/* Kanban */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {statusColumns.length > 0 ? (
            statusColumns.map((column: any) => (
              <Droppable droppableId={column.label} key={column.id} direction="vertical" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                {(provided, snapshot) => (
                  <div
                    className={`kanban-column ${snapshot.isDraggingOver ? 'dragged-over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="lead-status-column">
                      <h4 className={column.label}>{column.label}</h4>

                      <div className="lead-status-column-status">
                        <button
                          className="add-lead-button"
                          onClick={() => router.push(`/leads/createLead?status=${column.id}`)}
                        >
                          <AddLeadIcon />
                        </button>

                        <button>
                          <ThreeDotIcon />
                        </button>
                      </div>
                    </div>
                    {groupedLeads[column.label]?.map((lead: any, index: number) => (
                      <Draggable draggableId={lead.id} index={index} key={lead.id}>
                        {(provided, snapshot) => (
                          <div
                            className={`kanban-card lead-list-card ${snapshot.isDragging ? 'dragged' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="lead-card-content"

                            >
                              <h3>{lead.name}</h3>
                              {/* <p>{lead.notes || "—"}</p> */}
                              <div className="phone-and-email-sec">
                                <p> <CallIcon /> {lead.phone}</p>
                                <span>|</span>
                                <p> <EmailIconV1 /> {lead.email}</p>
                              </div>
                              <div className="tag-and-source-container">
                                <div className="tag-constant-label">
                                  <span>Tag</span>
                                  <p className={lead.tagConstant?.label.toLowerCase()}>{lead.tagConstant?.label || "—"} <PencilIcon /> </p>
                                </div>
                                <span>|</span>
                                <div className="tag-constant-label">
                                  <span>Source</span>
                                  <p className={lead.sourceConstant?.label.toLowerCase()}>{lead.sourceConstant?.label || "—"} </p>
                                </div>
                              </div>
                            </div>
                            <div className="lead-card-actions">
                              <button
                                className="message"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLeadForChat(lead);
                                  setShowChatModal(true);
                                }}
                              >
                                <MessageIconV1 />
                                Message
                              </button>
                              <button onClick={() => {
                                setSelectedLead(lead);
                                setShowEditModal(true);
                              }}> <EditIcon /> Edit</button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(lead.id);
                                }}
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))
          ) : (
            <p>Loading status columns...</p>
          )}
        </div>
      </DragDropContext>

      {/* Modal */}
      <EditLeadModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onSave={(updatedLeadData) => {
          dispatch(updateLead({
            id: updatedLeadData.id,
            data: updatedLeadData
          }) as any);
          setShowEditModal(false);
          dispatch(getLeads({
            page: 1,
            limit: 100,
            search: debouncedSearch,
            sort: "",
            order: "desc",
            role: role
          }) as any);
        }}
      />

      {/* Chat Modal */}
      <ChatModal
        show={showChatModal}
        onClose={() => {
          setShowChatModal(false);
          setSelectedLeadForChat(null);
        }}
        leadId={selectedLeadForChat?.id}
        leadPhone={selectedLeadForChat?.phone}
        leadName={selectedLeadForChat?.name}
      />

      {/* Confirmation Popup */}
      <ConfirmationPopup
        visible={showConfirm}
        onAccept={handleDeleteConfirm}
        onReject={handleDeleteCancel}
        message="Are you sure you want to delete this lead?"
        header="Delete Lead"
        type="delete"
      />
    </div>
  );
};

export default LeadsList;



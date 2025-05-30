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
import { AddLeadIcon } from "@/components/common/Icon";

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

    // Unassigned fallback
    grouped["Unassigned"] = [];

    // Group leads
    if (leads && Array.isArray(leads)) {
      leads.forEach((lead: any) => {
        const statusLabel = lead.statusDetail?.label || "Unassigned";
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
    }

    setGroupedLeads(newGroupedLeads);

    if (sourceStatus !== destStatus) {
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
  };

  const handleDelete = (leadId: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      dispatch(deleteLead(leadId) as any).then(() => {
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
  };

  return (
    <div className="lead-list-container">
      {/* Header */}
      <div className="lead-list-header">
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
          <button onClick={() => router.push("/leads/createLead")}>
            Create a Lead
          </button>
        </div>
      </div>

      {/* Kanban */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {statusColumns.length > 0 ? (
            statusColumns.map((column: any) => (
              <Droppable droppableId={column.label} key={column.id} direction="vertical">
                {(provided, snapshot) => (
                  <div
                    className={`kanban-column ${snapshot.isDraggingOver ? 'dragged-over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h4>{column.label}</h4>
                      <button className="add-lead-button">
                        <AddLeadIcon />
                      </button>
                    </div>
                    {groupedLeads[column.label]?.map((lead: any, index: number) => (
                      <Draggable draggableId={lead.id} index={index} key={lead.id}>
                        {(provided, snapshot) => (
                          <div
                            className={`kanban-card ${snapshot.isDragging ? 'dragged' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div
                              onClick={() => {
                                setSelectedLead(lead);
                                setShowEditModal(true);
                              }}
                            >
                              <strong>{lead.name}</strong>
                              <p>{lead.notes || "—"}</p>
                              <p>{lead.email}</p>
                              <p>{lead.phone}</p>
                              <p>{lead.sourceDetail?.label || "—"}</p>
                              <p>{lead.tagDetail?.label || "—"}</p>
                            </div>

                            <button
                              className="btn btn-danger btn-sm mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(lead.id);
                              }}
                            >
                              Delete
                            </button>
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
    </div>
  );
};

export default LeadsList;

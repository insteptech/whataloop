import InputField from "@/components/common/InputField";
import { useRouter } from "next/router";
import React from "react";
import { Col, Row } from "react-bootstrap";

const Leads = () => {
  const router = useRouter();

  const leads = [
    {
      id: 1,
      name: "Upkar verma",
      email: "Upkar.verma@example.com",
      phone: "1234567890",
      tag: "Hot Lead",
      status: "New",
      source: "Website",
      notes: "Interested in premium package",
      last_contacted: "2025-04-15T10:30",
    },
    {
      id: 2,
      name: "lovepreet",
      email: "lovepreet@example.com",
      phone: "9876543210",
      tag: "Warm Lead",
      status: "Contacted",
      source: "Referral",
      notes: "Follow up next week",
      last_contacted: "2025-04-10T14:15",
    },
    {
      id: 3,
      name: "prince",
      email: "prince@example.com",
      phone: "5551234567",
      tag: "Cold Lead",
      status: "Qualified",
      source: "Social Media",
      notes: "Requested demo",
      last_contacted: "2025-04-12T11:45",
    },
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get badge class based on tag
  const getTagClass = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "hot lead":
        return "badge-hot";
      case "warm lead":
        return "badge-warm";
      case "cold lead":
        return "badge-cold";
      default:
        return "badge-default";
    }
  };

  return (
    <div className="lead-list-container">
      <div className="lead-list-header">
        <h2>Leads</h2>
        <div className="lead-count">{leads.length} leads found</div>
      </div>

      <div className="row search-and-create-lead-button">
        <div className="col-md-4">
          <form action="">
            <input type="search" placeholder="Search..." />
          </form>
        </div>
        <div className="col-md-4 text-end">
          <button onClick={() => router.push("/leads/createLead")}>
            create a lead
          </button>
        </div>
      </div>

      <Row className="lead-list-header-row">
        <Col md={2} className="header-cell">
          Name
        </Col>
        <Col md={2} className="header-cell">
          Contact
        </Col>
        <Col md={2} className="header-cell">
          Status
        </Col>
        <Col md={2} className="header-cell">
          Source
        </Col>
        <Col md={2} className="header-cell">
          Tag
        </Col>
        <Col md={2} className="header-cell">
          Last Contacted
        </Col>
      </Row>

      {leads.map((lead) => (
        <Row key={lead.id} className="lead-item">
          <Col md={2} className="lead-cell">
            <div className="lead-name">{lead.name}</div>
            <div className="lead-notes">{lead.notes}</div>
          </Col>
          <Col md={2} className="lead-cell">
            <div className="lead-email">{lead.email}</div>
            <div className="lead-phone">{lead.phone}</div>
          </Col>
          <Col md={2} className="lead-cell">
            <div className="lead-status">{lead.status}</div>
          </Col>
          <Col md={2} className="lead-cell">
            <div className="lead-source">{lead.source}</div>
          </Col>
          <Col md={2} className="lead-cell">
            <span className={`badge ${getTagClass(lead.tag)}`}>{lead.tag}</span>
          </Col>
          <Col md={2} className="lead-cell">
            <div className="lead-date">{formatDate(lead.last_contacted)}</div>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default Leads;

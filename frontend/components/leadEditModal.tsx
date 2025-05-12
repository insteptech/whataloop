import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { updateLead } from "@/modules/leads/redux/action/leadAction";

interface EditLeadModalProps {
  show: boolean;
  onClose: () => void;
  lead: any;
  onSave: (updatedLead: any) => void;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({ show, onClose, lead, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    source: "",
    tag: "",
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        status: lead.statusDetail?.label || "",
        source: lead.sourceDetail?.label|| "",
        tag: lead.tagDetail?.label || "",
      });
    }
  }, [lead]);

  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSave = () => {
  if (lead && lead.id) {
    dispatch(updateLead({ id: lead.id, data: formData }) as any)
      .then(() => {
        onSave({ ...lead, ...formData });
        onClose();
      });
  }
};
  const nonEditableFields = ["status", "source", "tag"];

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Lead</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {["name", "email", "phone", "status", "source", "tag"].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control
                type="text"
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                disabled={nonEditableFields.includes(field)}
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditLeadModal;

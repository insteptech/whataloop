import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import { updateLead } from "@/modules/leads/redux/action/leadAction";
import SelectField from "@/components/common/SelectField"; // Import SelectField
import { getConstantType } from "@/modules/leads/redux/action/leadAction";

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
    tag: "",
    status: "",
    source: "",
    notes: ""
  });

  const [tagOptions, setTagOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);

  const dispatch = useDispatch();
  const { constants } = useSelector((state: any) => state.leadReducer);

  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const response = await (dispatch(getConstantType() as any)).unwrap();
        const constants = response?.data?.constantType?.rows || [];
        setTagOptions(
          constants.filter((item) => item.type === "tag").map(({ label, id }) => ({ label, value: id }))
        );
        setStatusOptions(
          constants.filter((item) => item.type === "status").map(({ label, id }) => ({ label, value: id }))
        );
        setSourceOptions(
          constants.filter((item) => item.type === "source").map(({ label, id }) => ({ label, value: id }))
        );
      } catch (err) {
        console.error("Failed to load constants", err);
      }
    };
    fetchConstants();
  }, [dispatch]);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        tag: lead.tag,
        status: lead.status,
        source: lead.source,
        notes: lead.notes
      });
    }
  }, [lead]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (lead && lead.id) {
      dispatch(updateLead({ id: lead.id, data: formData }) as any).then(() => {
        onSave({ ...lead, ...formData });
        onClose();
      });
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Lead</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              placeholder="Enter notes here..."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tag</Form.Label>
            <Form.Select name="tag" value={formData.tag} onChange={handleChange}>
              <option value="">Select Tag</option>
              {tagOptions.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={formData.status} onChange={handleChange}>
              <option value="">Select Status</option>
              {statusOptions.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Source</Form.Label>
            <Form.Select name="source" value={formData.source} onChange={handleChange}>
              <option value="">Select Source</option>
              {sourceOptions.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
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
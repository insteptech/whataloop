import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

import SelectField from "@/components/common/SelectField";
import InputField from "@/components/common/InputField";
import TextAreaField from "@/components/common/TextareaField";
import InputFieldWithCountryCode from "@/components/common/InputFieldWithCountryCode";
import { getConstantType } from "@/modules/leads/redux/action/leadAction";

interface EditLeadModalProps {
  show: boolean;
  onClose: () => void;
  lead: any;
  onSave: (updatedLead: any) => void;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({ show, onClose, lead, onSave }) => {
  const [tagOptions, setTagOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const response = await dispatch(getConstantType() as any);
        const constants = response.payload?.data?.constantType?.rows || [];

        setTagOptions(
          constants
            .filter((item: any) => item.type === "tag")
            .map(({ label, id }: any) => ({ label, value: id }))
        );

        setSourceOptions(
          constants
            .filter((item: any) => item.type === "source")
            .map(({ label, id }: any) => ({ label, value: id }))
        );
      } catch (err) {
        console.error("Failed to load constants", err);
        toast.error("Failed to load dropdown options");
      }
    };

    fetchConstants();
  }, [dispatch]);

  const initialValues = {
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    tag: lead?.tag || "",
    source: lead?.source || "",
    notes: lead?.notes || "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^\+?[0-9]{10,}$/, "Phone number is not valid")
      .min(12, "Phone number too short")
      .max(15, "Phone number is too long"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
      ),
    tag: Yup.string().required("Tag is required"),
    source: Yup.string().required("Source is required"),
    notes: Yup.string(),
  });

  const handleSubmit = (values: typeof initialValues) => {
    const updatedData = {
      ...values,
      id: lead.id // Ensure ID is always included
    };
    onSave(updatedData); // This should trigger updateLead action
    handleClose();
  };

  // Reset editable state and call parent's onClose
  const handleClose = () => {
    setIsEditable(false);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Lead</Modal.Title>
      </Modal.Header>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form>
            <Modal.Body>
              <Button
                variant="link"
                onClick={() => setIsEditable((prev) => !prev)}
                style={{
                  marginLeft: "auto",
                  fontSize: "1.4rem",
                  color: "#007bff",
                  display: "flex",
                  alignItems: "center",
                  width: "end",
                }}
              >
                <FaEdit />
              </Button>
              <Row>
                <Col md={6}>
                  <InputField
                    label="Name"
                    name="name"
                    id="name"
                    placeholder="Enter Name"
                    value={values.name}
                    onChange={handleChange}
                    disabled={!isEditable}
                  />
                </Col>
                <Col md={6}>
                  <InputFieldWithCountryCode
                    label="Phone Number"
                    name="phone"
                    id="phone"
                    placeholder="Enter Phone Number"
                    value={values.phone}
                    onChange={handleChange}
                    className="country-code-select-with-number leads-country-code"
                    required
                    disabled={!isEditable}
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Email"
                    name="email"
                    id="email"
                    placeholder="Enter Email"
                    value={values.email}
                    onChange={handleChange}
                    type="email"
                    disabled={!isEditable}
                  />
                </Col>
                <Col md={6}>
                  <SelectField
                    name="tag"
                    label="Tag"
                    options={tagOptions}
                    value={values.tag}
                    onChange={(e) => setFieldValue("tag", e.target.value)}
                    required
                    disabled={!isEditable}
                  />
                </Col>
                <Col md={6}>
                  <SelectField
                    name="source"
                    label="Source"
                    options={sourceOptions}
                    value={values.source}
                    onChange={(e) => setFieldValue("source", e.target.value)}
                    required
                    disabled={!isEditable}
                  />
                </Col>

                {(isEditable || values.notes) && (
                  <Col md={12}>
                    <TextAreaField
                      label="Notes"
                      id="notes"
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                      disabled={!isEditable}
                    />
                  </Col>
                )}
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              {isEditable && (
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              )}
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditLeadModal;

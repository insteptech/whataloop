import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "@/components/common/InputField";
import SelectField from "@/components/common/SelectField";
import TextAreaField from "@/components/common/TextareaField";
import {
  tagOptions,
  sourceOptions,
  statusOptions,
} from "../../utils/leadOptions";
import { Col, Row } from "react-bootstrap";

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Only numbers allowed")
    .min(10, "Phone number too short")
    .required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  tag: Yup.string().required("Tag is required"),
  status: Yup.string().required("Status is required"),
  source: Yup.string().required("Source is required"),
  notes: Yup.string(),
  last_contacted: Yup.date().nullable(),
});

const initialValues = {
  name: "",
  phone: "",
  email: "",
  tag: "",
  status: "",
  source: "",
  notes: "",
  last_contacted: "",
};

const LeadsForm = () => {
  const handleSubmit = (values, { resetForm }) => {
    console.log("Form submitted:", values);
    resetForm();
  };

  return (
    <div className="card-bg-container">
      <div className="card-inner-content leads-form-card">
        <div className="module-card-header">
          <h2>Leads Form</h2>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <Row>
                <Col md={6}>
                  <InputField
                    label="Name"
                    name="name"
                    id="name"
                    placeholder="Enter Name"
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Phone"
                    name="phone"
                    id="phone"
                    placeholder="Enter Phone"
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Email"
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                  />
                </Col>
                <Col md={6}>
                  <SelectField
                    name="tag"
                    label="Tag"
                    required
                    options={tagOptions}
                  />
                </Col>
                <Col md={6}>
                  <SelectField
                    name="status"
                    label="Select Status"
                    required
                    options={statusOptions}
                  />
                </Col>
                <Col md={6}>
                  <SelectField
                    name="source"
                    label="Select Source"
                    required
                    options={sourceOptions}
                  />
                </Col>
                <Col md={12}>
                  <TextAreaField label="Notes" id="notes" name="notes" />
                </Col>
                <Col md={12}>
                  <InputField
                    label="Last Contacted"
                    name="last_contacted"
                    id="last_contacted"
                    type="datetime-local"
                  />
                </Col>
                <button type="submit" className="login-button mt-4">
                  Submit
                </button>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LeadsForm;

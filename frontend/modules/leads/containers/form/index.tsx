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
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Leads Form</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="grid gap-4">
            <div style={{ marginBottom: "16px" }}>
              <InputField
                label="Name"
                name="name"
                id="name"
                placeholder="Enter Name"
              />
              <InputField
                label="Phone"
                name="phone"
                id="phone"
                placeholder="Enter Phone"
              />
              <InputField
                label="Email"
                name="email"
                id="email"
                type="email"
                placeholder="Enter Email"
              />

              <SelectField
                name="tag"
                label="Tag"
                required
                options={tagOptions}
              />

              <SelectField
                name="status"
                label="Select Status"
                required
                options={statusOptions}
              />

              <SelectField
                name="source"
                label="Select Source"
                required
                options={sourceOptions}
              />

              <TextAreaField label="Notes" id="notes" name="notes" />

              <InputField
                label="Last Contacted"
                name="last_contacted"
                id="last_contacted"
                type="datetime-local"
              />

              <button type="submit" className="login-button mt-4">
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LeadsForm;
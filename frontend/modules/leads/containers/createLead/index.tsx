import React, { useState } from "react";
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
import { toast } from "react-toastify";
import { postLeads } from "../../redux/action/leadAction";
import { useDispatch } from "react-redux";
import router from "next/router";

// const initialValues = {
//   name: "",
//   phone: "",
//   email: "",
//   tag: "",
//   status: "",
//   source: "",
//   notes: "",
//   last_contacted: "",
// };

const LeadsForm = () => {
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

  // const handleSubmit = (values, { resetForm }) => {
  //   console.log("Form submitted:", values);
  //   resetForm();
  // };
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    tag: "",
    status: "",
    source: "",
    notes: "",
    last_contacted: null,
  });

  const dispatch = useDispatch<any>();

  const handleSubmit = async () => {
    const { name, phone, email, tag, status, source, notes, last_contacted } =
      formData;
    const payload = {
      name,
      phone,
      email,
      tag,
      status,
      source,
      notes,
      last_contacted: last_contacted ? last_contacted : null,
    };
    console.log("Form submitted:", payload);

    try {
      const response = await dispatch(postLeads(payload)).unwrap();
      if (response.statusCode === 200) {
        toast.success(response.message || "Lead posted successfully");
        setFormData({
          name: "",
          phone: "",
          email: "",
          tag: "",
          status: "",
          source: "",
          notes: "",
          last_contacted: null,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error?.message || "Error submitting form. Please try again.");
    }
  };

  return (
    <div className="card-bg-container leads-form-container">
     
      <div className="card-inner-content leads-form-card">
      <div className="d-flex ">
  <button
    className="see-leads-list-button"
    onClick={() => router.push("/leads/leadsList")}
  >
    Back
  </button>
</div>

        <div className="module-card-header">
          <h2>Leads Form</h2>
        </div>
        <Formik
          initialValues={formData}
          enableReinitialize
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
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    // required
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Phone"
                    name="phone"
                    id="phone"
                    placeholder="Enter Phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    // required
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Email"
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    // required
                  />
                </Col>
                <Col md={6}>
                  <SelectField
                    name="tag"
                    label="Tag"
                    required
                    options={tagOptions}
                    value={formData.tag}
                    onChange={(e) =>
                      setFormData({ ...formData, tag: e.target.value })
                    }
                  />
                </Col>
                <Col md={6}>
                  <SelectField
                    name="status"
                    label="Select Status"
                    required
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  />
                </Col>
                <Col md={6}>
                  <SelectField
                    name="source"
                    label="Select Source"
                    required
                    options={sourceOptions}
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                  />
                </Col>
                <Col md={12}>
                  <TextAreaField
                    label="Notes"
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </Col>
                <Col md={12}>
                  <InputField
                    label="Last Contacted"
                    name="last_contacted"
                    id="last_contacted"
                    type="datetime-local"
                    value={formData.last_contacted}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        last_contacted: e.target.value,
                      })
                    }
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
